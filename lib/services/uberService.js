// Uber API Service
const UBER_CLIENT_ID = process.env.NEXT_PUBLIC_UBER_CLIENT_ID || 'jPhPauUiEz8pbYqdHp6NNksbNvEqPrC3';
const UBER_API_BASE = 'https://api.uber.com/v1.2';

export const uberService = {
  // Get ride estimates for a destination
  async getRideEstimates(startLat, startLng, endLat, endLng) {
    try {
      const response = await fetch(
        `${UBER_API_BASE}/estimates/price?start_latitude=${startLat}&start_longitude=${startLng}&end_latitude=${endLat}&end_longitude=${endLng}`,
        {
          headers: {
            'Authorization': `Token ${UBER_CLIENT_ID}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      return data.prices || [];
    } catch (error) {
      console.error('Uber API error:', error);
      return [];
    }
  },

  // Get time estimates
  async getTimeEstimates(startLat, startLng) {
    try {
      const response = await fetch(
        `${UBER_API_BASE}/estimates/time?start_latitude=${startLat}&start_longitude=${startLng}`,
        {
          headers: {
            'Authorization': `Token ${UBER_CLIENT_ID}`,
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      return data.times || [];
    } catch (error) {
      console.error('Uber time estimates error:', error);
      return [];
    }
  },

  // Generate deep link to Uber app
  generateDeepLink(pickupLat, pickupLng, dropoffLat, dropoffLng, dropoffName) {
    const params = new URLSearchParams({
      client_id: UBER_CLIENT_ID,
      action: 'setPickup',
      pickup_latitude: pickupLat,
      pickup_longitude: pickupLng,
      dropoff_latitude: dropoffLat,
      dropoff_longitude: dropoffLng,
      dropoff_nickname: dropoffName
    });

    return `uber://?${params.toString()}`;
  },

  // Generate web fallback link
  generateWebLink(pickupLat, pickupLng, dropoffLat, dropoffLng) {
    const params = new URLSearchParams({
      client_id: UBER_CLIENT_ID,
      action: 'setPickup',
      pickup_latitude: pickupLat,
      pickup_longitude: pickupLng,
      dropoff_latitude: dropoffLat,
      dropoff_longitude: dropoffLng
    });

    return `https://m.uber.com/ul/?${params.toString()}`;
  }
};

export default uberService;
