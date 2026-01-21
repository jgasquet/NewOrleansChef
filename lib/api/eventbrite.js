import axios from 'axios';

const EVENTBRITE_BASE_URL = 'https://www.eventbriteapi.com/v3';

class EventbriteClient {
  constructor(token) {
    this.token = token || process.env.EVENTBRITE_PRIVATE_TOKEN;
    this.client = axios.create({
      baseURL: EVENTBRITE_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Search for events
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query
   * @param {string} params.location - Location (address, city, etc.)
   * @param {string} params.start_date - Start date range (ISO format)
   * @param {string} params.end_date - End date range (ISO format)
   * @param {Array<string>} params.categories - Category IDs
   * @param {boolean} params.online_events_only - Filter for online events only
   */
  async searchEvents(params = {}) {
    try {
      const searchParams = {
        'location.address': params.location || 'New Orleans, LA',
        'location.within': '25mi',
        q: params.q,
        'start_date.keyword': params.start_date,
        'end_date.keyword': params.end_date,
        categories: params.categories?.join(','),
        'online_events_only': params.online_events_only || false,
        expand: 'venue,organizer,ticket_availability',
        page_size: params.page_size || 50,
      };

      // Remove undefined params
      Object.keys(searchParams).forEach(key => 
        searchParams[key] === undefined && delete searchParams[key]
      );

      const response = await this.client.get('/events/search/', {
        params: searchParams,
      });

      return {
        events: response.data.events || [],
        pagination: response.data.pagination,
        total: response.data.pagination?.object_count || 0,
      };
    } catch (error) {
      console.error('Eventbrite API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch events from Eventbrite');
    }
  }

  /**
   * Get event details by ID
   */
  async getEventById(eventId) {
    try {
      const response = await this.client.get(`/events/${eventId}/`, {
        params: {
          expand: 'venue,organizer,ticket_availability,category',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Eventbrite API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch event details');
    }
  }

  /**
   * Get venue details by ID
   */
  async getVenueById(venueId) {
    try {
      const response = await this.client.get(`/venues/${venueId}/`);
      return response.data;
    } catch (error) {
      console.error('Eventbrite API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch venue details');
    }
  }

  /**
   * Get available event categories
   */
  async getCategories() {
    try {
      const response = await this.client.get('/categories/');
      return response.data.categories || [];
    } catch (error) {
      console.error('Eventbrite API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Search for food & drink events in New Orleans
   */
  async getFoodEvents(params = {}) {
    return this.searchEvents({
      ...params,
      categories: ['110'], // Food & Drink category ID
      location: 'New Orleans, LA',
    });
  }

  /**
   * Get events happening this weekend
   */
  async getWeekendEvents() {
    const friday = this.getNextFriday();
    const sunday = new Date(friday);
    sunday.setDate(sunday.getDate() + 2);

    return this.searchEvents({
      start_date: friday.toISOString(),
      end_date: sunday.toISOString(),
    });
  }

  /**
   * Get events happening today
   */
  async getTodaysEvents() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.searchEvents({
      start_date: today.toISOString(),
      end_date: tomorrow.toISOString(),
    });
  }

  /**
   * Helper: Get next Friday
   */
  getNextFriday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysUntilFriday);
    friday.setHours(0, 0, 0, 0);
    return friday;
  }
}

export default EventbriteClient;

// Singleton instance
export const eventbrite = new EventbriteClient();
