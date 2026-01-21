import axios from 'axios';

const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

class TicketmasterClient {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.TICKETMASTER_API_KEY;
    this.client = axios.create({
      baseURL: TICKETMASTER_BASE_URL,
      params: {
        apikey: this.apiKey,
      },
    });
  }

  /**
   * Search for events in New Orleans
   * @param {Object} params - Search parameters
   * @param {string} params.keyword - Search keyword
   * @param {string} params.startDateTime - Start date (ISO format)
   * @param {string} params.endDateTime - End date (ISO format)
   * @param {string} params.classificationName - Event type (Music, Sports, Arts & Theatre, etc.)
   * @param {string} params.city - City name (default: New Orleans)
   * @param {number} params.size - Number of results (default: 20)
   */
  async searchEvents(params = {}) {
    try {
      const response = await this.client.get('/events.json', {
        params: {
          city: params.city || 'New Orleans',
          stateCode: 'LA',
          keyword: params.keyword,
          startDateTime: params.startDateTime,
          endDateTime: params.endDateTime,
          classificationName: params.classificationName,
          size: params.size || 20,
          sort: params.sort || 'date,asc',
        },
      });

      return {
        events: response.data._embedded?.events || [],
        page: response.data.page,
        total: response.data.page?.totalElements || 0,
      };
    } catch (error) {
      console.error('Ticketmaster API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch events from Ticketmaster');
    }
  }

  /**
   * Get event details by ID
   */
  async getEventById(eventId) {
    try {
      const response = await this.client.get(`/events/${eventId}.json`);
      return response.data;
    } catch (error) {
      console.error('Ticketmaster API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch event details');
    }
  }

  /**
   * Search venues in New Orleans
   */
  async searchVenues(params = {}) {
    try {
      const response = await this.client.get('/venues.json', {
        params: {
          city: params.city || 'New Orleans',
          stateCode: 'LA',
          keyword: params.keyword,
          size: params.size || 20,
        },
      });

      return {
        venues: response.data._embedded?.venues || [],
        total: response.data.page?.totalElements || 0,
      };
    } catch (error) {
      console.error('Ticketmaster API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch venues');
    }
  }

  /**
   * Get events by classification (Music, Sports, etc.)
   */
  async getEventsByCategory(category, params = {}) {
    return this.searchEvents({
      ...params,
      classificationName: category,
    });
  }

  /**
   * Get events happening today in New Orleans
   */
  async getTodaysEvents() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.searchEvents({
      startDateTime: today.toISOString(),
      endDateTime: tomorrow.toISOString(),
      size: 50,
    });
  }

  /**
   * Get upcoming events this week
   */
  async getThisWeeksEvents() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return this.searchEvents({
      startDateTime: today.toISOString(),
      endDateTime: nextWeek.toISOString(),
      size: 100,
    });
  }
}

export default TicketmasterClient;

// Singleton instance
export const ticketmaster = new TicketmasterClient();
