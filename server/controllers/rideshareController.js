// Backend API - rideshareController.js
const axios = require('axios');

class RideshareController {
  constructor() {
    // API credentials (store in environment variables)
    this.uberServerToken = process.env.UBER_SERVER_TOKEN;
    this.lyftServerToken = process.env.LYFT_SERVER_TOKEN;
    this.viaApiKey = process.env.VIA_API_KEY;
  }

  /**
   * Compare ride options from multiple providers
   */
  async compareRides(req, res) {
    try {
      const { pickup, dropoff, passengers = 1, filters = {}, eventId } = req.body;

      // Validate input
      if (!pickup?.latitude || !pickup?.longitude ||
          !dropoff?.latitude || !dropoff?.longitude) {
        return res.status(400).json({
          success: false,
          message: 'Pickup and dropoff coordinates required'
        });
      }

      // Fetch rides from all providers in parallel
      const [uberRides, lyftRides, viaRides] = await Promise.allSettled([
        this.getUberRides(pickup, dropoff, passengers),
        this.getLyftRides(pickup, dropoff, passengers),
        this.getViaRides(pickup, dropoff, passengers)
      ]);

      // Combine all successful results
      let allRides = [];

      if (uberRides.status === 'fulfilled') {
        allRides = allRides.concat(uberRides.value);
      }
      if (lyftRides.status === 'fulfilled') {
        allRides = allRides.concat(lyftRides.value);
      }
      if (viaRides.status === 'fulfilled') {
        allRides = allRides.concat(viaRides.value);
      }

      // Apply filters
      const filteredRides = this.applyFilters(allRides, filters);

      // Calculate savings percentages
      const ridesWithSavings = this.calculateSavings(filteredRides);

      // Track the comparison for analytics
      await this.trackComparison({
        pickup,
        dropoff,
        eventId,
        providersChecked: allRides.length,
        cheapestPrice: ridesWithSavings[0]?.price
      });

      return res.json({
        success: true,
        rides: ridesWithSavings,
        totalOptions: ridesWithSavings.length
      });

    } catch (error) {
      console.error('Rideshare comparison error:', error);
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch ride options',
        error: error.message
      });
    }
  }

  /**
   * Get Uber ride estimates
   */
  async getUberRides(pickup, dropoff, passengers) {
    try {
      // Get available products at pickup location
      const productsResponse = await axios.get(
        'https://api.uber.com/v1.2/products',
        {
          params: {
            latitude: pickup.latitude,
            longitude: pickup.longitude
          },
          headers: {
            'Authorization': `Token ${this.uberServerToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      // Get price estimates for the trip
      const pricesResponse = await axios.get(
        'https://api.uber.com/v1.2/estimates/price',
        {
          params: {
            start_latitude: pickup.latitude,
            start_longitude: pickup.longitude,
            end_latitude: dropoff.latitude,
            end_longitude: dropoff.longitude
          },
          headers: {
            'Authorization': `Token ${this.uberServerToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      // Get time estimates
      const timeResponse = await axios.get(
        'https://api.uber.com/v1.2/estimates/time',
        {
          params: {
            start_latitude: pickup.latitude,
            start_longitude: pickup.longitude
          },
          headers: {
            'Authorization': `Token ${this.uberServerToken}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      // Combine and format results
      const rides = pricesResponse.data.prices.map(price => {
        const product = productsResponse.data.products.find(p => p.product_id === price.product_id);
        const timeEstimate = timeResponse.data.times.find(t => t.product_id === price.product_id);

        return {
          provider: 'Uber',
          name: price.display_name,
          type: price.display_name,
          productId: price.product_id,
          price: (price.low_estimate + price.high_estimate) / 2,
          priceRange: {
            low: price.low_estimate,
            high: price.high_estimate
          },
          eta: Math.round((timeEstimate?.estimate || 0) / 60), // Convert seconds to minutes
          capacity: product?.capacity || 4,
          surgeMultiplier: price.surge_multiplier || 1,
          currency: price.currency_code,
          features: this.getUberFeatures(price.display_name),
          bookingUrl: this.generateUberBookingUrl(pickup, dropoff, price.product_id),
          webBookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.latitude}&pickup[longitude]=${pickup.longitude}&dropoff[latitude]=${dropoff.latitude}&dropoff[longitude]=${dropoff.longitude}`
        };
      });

      return rides.filter(ride => ride.capacity >= passengers);

    } catch (error) {
      console.error('Uber API error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get Lyft ride estimates
   */
  async getLyftRides(pickup, dropoff, passengers) {
    try {
      // Get ride types (products)
      const rideTypesResponse = await axios.get(
        'https://api.lyft.com/v1/ridetypes',
        {
          params: {
            lat: pickup.latitude,
            lng: pickup.longitude
          },
          headers: {
            'Authorization': `Bearer ${this.lyftServerToken}`
          }
        }
      );

      // Get cost estimates
      const costResponse = await axios.get(
        'https://api.lyft.com/v1/cost',
        {
          params: {
            start_lat: pickup.latitude,
            start_lng: pickup.longitude,
            end_lat: dropoff.latitude,
            end_lng: dropoff.longitude
          },
          headers: {
            'Authorization': `Bearer ${this.lyftServerToken}`
          }
        }
      );

      // Get ETA estimates
      const etaResponse = await axios.get(
        'https://api.lyft.com/v1/eta',
        {
          params: {
            lat: pickup.latitude,
            lng: pickup.longitude
          },
          headers: {
            'Authorization': `Bearer ${this.lyftServerToken}`
          }
        }
      );

      // Combine and format results
      const rides = costResponse.data.cost_estimates.map(cost => {
        const rideType = rideTypesResponse.data.ride_types.find(rt => rt.ride_type === cost.ride_type);
        const eta = etaResponse.data.eta_estimates.find(e => e.ride_type === cost.ride_type);

        return {
          provider: 'Lyft',
          name: cost.display_name,
          type: cost.ride_type,
          rideTypeId: cost.ride_type,
          price: cost.estimated_cost_cents_max / 100, // Convert cents to dollars
          priceRange: {
            low: cost.estimated_cost_cents_min / 100,
            high: cost.estimated_cost_cents_max / 100
          },
          eta: Math.round((eta?.eta_seconds || 0) / 60),
          capacity: rideType?.seats || 4,
          surgeMultiplier: cost.primetime_percentage ? (1 + cost.primetime_percentage / 100) : 1,
          currency: cost.currency || 'USD',
          features: this.getLyftFeatures(cost.ride_type),
          bookingUrl: this.generateLyftBookingUrl(pickup, dropoff, cost.ride_type),
          webBookingUrl: `https://www.lyft.com/ride?origin=${pickup.latitude},${pickup.longitude}&destination=${dropoff.latitude},${dropoff.longitude}`
        };
      });

      return rides.filter(ride => ride.capacity >= passengers);

    } catch (error) {
      console.error('Lyft API error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get Via ride estimates
   */
  async getViaRides(pickup, dropoff, passengers) {
    try {
      const response = await axios.post(
        'https://api.ridewithvia.com/v1/rides/estimate',
        {
          pickup_location: {
            lat: pickup.latitude,
            lng: pickup.longitude
          },
          dropoff_location: {
            lat: dropoff.latitude,
            lng: dropoff.longitude
          },
          passengers: passengers
        },
        {
          headers: {
            'Authorization': `Bearer ${this.viaApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.estimate) {
        return [{
          provider: 'Via',
          name: 'Via Shared',
          type: 'shared',
          price: response.data.estimate.price,
          eta: response.data.estimate.eta_minutes,
          capacity: response.data.estimate.max_passengers || 6,
          surgeMultiplier: 1,
          currency: 'USD',
          features: ['shared', 'eco-friendly'],
          bookingUrl: `https://ridewithvia.com/link?pickup=${pickup.latitude},${pickup.longitude}&dropoff=${dropoff.latitude},${dropoff.longitude}`,
          webBookingUrl: `https://ridewithvia.com/link?pickup=${pickup.latitude},${pickup.longitude}&dropoff=${dropoff.latitude},${dropoff.longitude}`
        }];
      }

      return [];

    } catch (error) {
      console.error('Via API error:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Apply filters to ride options
   */
  applyFilters(rides, filters) {
    let filtered = [...rides];

    if (filters.wheelchair) {
      filtered = filtered.filter(ride =>
        ride.features?.includes('wheelchair') ||
        ride.features?.includes('accessible')
      );
    }

    if (filters.carSeat) {
      filtered = filtered.filter(ride =>
        ride.features?.includes('car_seat')
      );
    }

    if (filters.luxury) {
      filtered = filtered.filter(ride =>
        ride.features?.includes('luxury') ||
        ride.name.toLowerCase().includes('lux') ||
        ride.name.toLowerCase().includes('black') ||
        ride.name.toLowerCase().includes('premier')
      );
    }

    if (filters.shared) {
      filtered = filtered.filter(ride =>
        ride.features?.includes('shared') ||
        ride.name.toLowerCase().includes('pool') ||
        ride.name.toLowerCase().includes('shared') ||
        ride.name.toLowerCase().includes('line')
      );
    }

    return filtered;
  }

  /**
   * Calculate savings percentages
   */
  calculateSavings(rides) {
    if (rides.length === 0) return [];

    // Find the highest price
    const maxPrice = Math.max(...rides.map(r => r.price));

    return rides.map(ride => ({
      ...ride,
      savingsPercent: maxPrice > 0 ? Math.round(((maxPrice - ride.price) / maxPrice) * 100) : 0
    }));
  }

  /**
   * Get Uber ride features based on product name
   */
  getUberFeatures(productName) {
    const features = [];
    const nameLower = productName.toLowerCase();

    if (nameLower.includes('pool') || nameLower.includes('express')) {
      features.push('shared');
    }
    if (nameLower.includes('xl') || nameLower.includes('suv')) {
      features.push('large');
    }
    if (nameLower.includes('lux') || nameLower.includes('black')) {
      features.push('luxury');
    }
    if (nameLower.includes('access') || nameLower.includes('wav')) {
      features.push('wheelchair');
    }
    if (nameLower.includes('comfort')) {
      features.push('comfort');
    }

    return features;
  }

  /**
   * Get Lyft ride features based on ride type
   */
  getLyftFeatures(rideType) {
    const features = [];
    const typeLower = rideType.toLowerCase();

    if (typeLower.includes('shared') || typeLower.includes('line')) {
      features.push('shared');
    }
    if (typeLower.includes('xl') || typeLower.includes('suv')) {
      features.push('large');
    }
    if (typeLower.includes('lux')) {
      features.push('luxury');
    }
    if (typeLower.includes('access')) {
      features.push('wheelchair');
    }
    if (typeLower.includes('premier')) {
      features.push('comfort');
    }

    return features;
  }

  /**
   * Generate Uber deep link URL
   */
  generateUberBookingUrl(pickup, dropoff, productId) {
    const params = new URLSearchParams({
      action: 'setPickup',
      'pickup[latitude]': pickup.latitude,
      'pickup[longitude]': pickup.longitude,
      'dropoff[latitude]': dropoff.latitude,
      'dropoff[longitude]': dropoff.longitude,
      product_id: productId
    });

    return `uber://?${params.toString()}`;
  }

  /**
   * Generate Lyft deep link URL
   */
  generateLyftBookingUrl(pickup, dropoff, rideType) {
    const params = new URLSearchParams({
      'pickup[latitude]': pickup.latitude,
      'pickup[longitude]': pickup.longitude,
      'destination[latitude]': dropoff.latitude,
      'destination[longitude]': dropoff.longitude,
      ride_type: rideType
    });

    return `lyft://ridetype?${params.toString()}`;
  }

  /**
   * Track booking attempt for analytics
   */
  async trackBooking(req, res) {
    try {
      const { provider, rideType, price, eventId } = req.body;

      // Store in analytics database
      console.log('Booking tracked:', {
        provider,
        rideType,
        price,
        eventId,
        timestamp: new Date()
      });

      return res.json({ success: true });

    } catch (error) {
      console.error('Tracking error:', error);
      return res.status(500).json({ success: false });
    }
  }

  /**
   * Track comparison for analytics
   */
  async trackComparison(data) {
    console.log('Comparison tracked:', {
      ...data,
      timestamp: new Date()
    });
  }
}

module.exports = new RideshareController();
