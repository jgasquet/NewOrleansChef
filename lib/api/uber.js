import axios from 'axios';

const UBER_BASE_URL = 'https://api.uber.com/v1.2';

class UberClient {
  constructor(serverToken) {
    this.serverToken = serverToken || process.env.UBER_SERVER_TOKEN;
    this.client = axios.create({
      baseURL: UBER_BASE_URL,
      headers: {
        'Authorization': `Token ${this.serverToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get price estimates for a trip
   * @param {Object} params
   * @param {number} params.start_latitude - Starting latitude
   * @param {number} params.start_longitude - Starting longitude
   * @param {number} params.end_latitude - Destination latitude
   * @param {number} params.end_longitude - Destination longitude
   */
  async getPriceEstimates(params) {
    try {
      const response = await this.client.get('/estimates/price', {
        params: {
          start_latitude: params.start_latitude,
          start_longitude: params.start_longitude,
          end_latitude: params.end_latitude,
          end_longitude: params.end_longitude,
        },
      });

      return response.data.prices || [];
    } catch (error) {
      console.error('Uber API Error:', error.response?.data || error.message);
      throw new Error('Failed to get Uber price estimates');
    }
  }

  /**
   * Get time estimates for pickup
   * @param {Object} params
   * @param {number} params.start_latitude - Starting latitude
   * @param {number} params.start_longitude - Starting longitude
   * @param {string} params.product_id - Optional: Specific Uber product ID
   */
  async getTimeEstimates(params) {
    try {
      const response = await this.client.get('/estimates/time', {
        params: {
          start_latitude: params.start_latitude,
          start_longitude: params.start_longitude,
          product_id: params.product_id,
        },
      });

      return response.data.times || [];
    } catch (error) {
      console.error('Uber API Error:', error.response?.data || error.message);
      throw new Error('Failed to get Uber time estimates');
    }
  }

  /**
   * Get available Uber products at a location
   * @param {Object} params
   * @param {number} params.latitude - Location latitude
   * @param {number} params.longitude - Location longitude
   */
  async getProducts(params) {
    try {
      const response = await this.client.get('/products', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
        },
      });

      return response.data.products || [];
    } catch (error) {
      console.error('Uber API Error:', error.response?.data || error.message);
      throw new Error('Failed to get Uber products');
    }
  }

  /**
   * Generate deep link for Uber app
   * Opens Uber app with destination pre-filled
   * @param {Object} params
   * @param {string} params.client_id - Your Uber Client ID
   * @param {string} params.action - 'setPickup' or just destination
   * @param {number} params.pickup_latitude - Optional pickup latitude
   * @param {number} params.pickup_longitude - Optional pickup longitude
   * @param {string} params.pickup_nickname - Optional pickup location name
   * @param {number} params.dropoff_latitude - Destination latitude
   * @param {number} params.dropoff_longitude - Destination longitude
   * @param {string} params.dropoff_nickname - Destination name
   * @param {string} params.product_id - Optional: specific product (UberX, UberXL, etc.)
   */
  generateDeepLink(params) {
    const clientId = params.client_id || process.env.NEXT_PUBLIC_UBER_CLIENT_ID;
    
    let url = `https://m.uber.com/ul/?client_id=${clientId}`;
    
    if (params.action) url += `&action=${params.action}`;
    
    // Pickup location
    if (params.pickup_latitude && params.pickup_longitude) {
      url += `&pickup[latitude]=${params.pickup_latitude}`;
      url += `&pickup[longitude]=${params.pickup_longitude}`;
      if (params.pickup_nickname) {
        url += `&pickup[nickname]=${encodeURIComponent(params.pickup_nickname)}`;
      }
    }
    
    // Dropoff location
    if (params.dropoff_latitude && params.dropoff_longitude) {
      url += `&dropoff[latitude]=${params.dropoff_latitude}`;
      url += `&dropoff[longitude]=${params.dropoff_longitude}`;
      if (params.dropoff_nickname) {
        url += `&dropoff[nickname]=${encodeURIComponent(params.dropoff_nickname)}`;
      }
    }
    
    if (params.product_id) url += `&product_id=${params.product_id}`;
    
    return url;
  }

  /**
   * Generate Uber button HTML
   * For embedding on restaurant/event pages
   */
  generateUberButton(params) {
    const deepLink = this.generateDeepLink(params);
    return {
      link: deepLink,
      html: `<a href="${deepLink}" class="uber-ride-button" target="_blank" rel="noopener noreferrer">
        <img src="https://d1a3f4spazzrp4.cloudfront.net/ridewithube/images/badge-example.png" alt="Get a ride with Uber" />
      </a>`,
    };
  }

  /**
   * Get ride to restaurant
   * Convenience method for restaurant pages
   */
  async getRideToRestaurant(restaurantLat, restaurantLng, restaurantName, userLat, userLng) {
    try {
      // Get price and time estimates
      const [prices, times] = await Promise.all([
        this.getPriceEstimates({
          start_latitude: userLat,
          start_longitude: userLng,
          end_latitude: restaurantLat,
          end_longitude: restaurantLng,
        }),
        this.getTimeEstimates({
          start_latitude: userLat,
          start_longitude: userLng,
        }),
      ]);

      // Generate deep link
      const deepLink = this.generateDeepLink({
        pickup_latitude: userLat,
        pickup_longitude: userLng,
        dropoff_latitude: restaurantLat,
        dropoff_longitude: restaurantLng,
        dropoff_nickname: restaurantName,
        action: 'setPickup',
      });

      return {
        prices,
        times,
        deepLink,
        lowestPrice: prices.length > 0 ? Math.min(...prices.map(p => p.low_estimate)) : null,
        fastestTime: times.length > 0 ? Math.min(...times.map(t => t.estimate)) : null,
      };
    } catch (error) {
      console.error('Failed to get ride information:', error);
      throw error;
    }
  }

  /**
   * Get ride to event
   * Convenience method for event pages
   */
  async getRideToEvent(eventLat, eventLng, eventName, userLat, userLng) {
    return this.getRideToRestaurant(eventLat, eventLng, eventName, userLat, userLng);
  }

  /**
   * New Orleans restaurant district coordinates
   * Useful defaults for users without location permission
   */
  static locations = {
    frenchQuarter: { lat: 29.9584, lng: -90.0644 },
    gardenDistrict: { lat: 29.9273, lng: -90.0875 },
    cbd: { lat: 29.9465, lng: -90.0770 },
    warehouse: { lat: 29.9409, lng: -90.0716 },
    uptown: { lat: 29.9327, lng: -90.1158 },
    midCity: { lat: 29.9772, lng: -90.0945 },
  };
}

export default UberClient;

// Singleton instance
export const uber = new UberClient();
