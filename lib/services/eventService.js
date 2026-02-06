// Event Service - Ticketmaster & Eventbrite API Integration
const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY || 'OKZTAyge4Kujbs6Amfd4dr9TnlSAbAA8';
const EVENTBRITE_TOKEN = process.env.NEXT_PUBLIC_EVENTBRITE_TOKEN || 'E2FI5PZONFMI4BQSWY3C';

export const eventService = {
  // Ticketmaster API
  async getTicketmasterEvents(params = {}) {
    const {
      keyword = '',
      city = 'New Orleans',
      stateCode = 'LA',
      radius = 25,
      size = 20,
      startDateTime,
      endDateTime,
      classificationName // 'Music', 'Arts & Theatre', 'Miscellaneous' for food events
    } = params;

    const queryParams = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY,
      city,
      stateCode,
      radius,
      size,
      ...(keyword && { keyword }),
      ...(startDateTime && { startDateTime }),
      ...(endDateTime && { endDateTime }),
      ...(classificationName && { classificationName })
    });

    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?${queryParams}`
      );
      const data = await response.json();

      return (data._embedded?.events || []).map(event => ({
        id: event.id,
        source: 'ticketmaster',
        name: event.name,
        description: event.info || event.pleaseNote || '',
        startDate: event.dates.start.dateTime || event.dates.start.localDate,
        endDate: event.dates.end?.dateTime,
        venue: {
          name: event._embedded?.venues?.[0]?.name,
          address: event._embedded?.venues?.[0]?.address?.line1,
          city: event._embedded?.venues?.[0]?.city?.name,
          location: event._embedded?.venues?.[0]?.location
        },
        images: event.images?.map(img => img.url) || [],
        url: event.url,
        priceRange: event.priceRanges?.[0],
        categories: event.classifications?.map(c => c.segment?.name) || []
      }));
    } catch (error) {
      console.error('Ticketmaster API error:', error);
      return [];
    }
  },

  // Eventbrite API
  async getEventbriteEvents(params = {}) {
    const {
      keyword = '',
      locationAddress = 'New Orleans, LA',
      locationWithin = '25mi',
      startDate,
      endDate,
      categories // '110' for Food & Drink
    } = params;

    const queryParams = new URLSearchParams({
      'location.address': locationAddress,
      'location.within': locationWithin,
      expand: 'venue,ticket_availability',
      ...(keyword && { q: keyword }),
      ...(startDate && { 'start_date.range_start': startDate }),
      ...(endDate && { 'start_date.range_end': endDate }),
      ...(categories && { categories })
    });

    try {
      const response = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${EVENTBRITE_TOKEN}`
          }
        }
      );
      const data = await response.json();

      return (data.events || []).map(event => ({
        id: event.id,
        source: 'eventbrite',
        name: event.name.text,
        description: event.description?.text || '',
        startDate: event.start.utc,
        endDate: event.end.utc,
        venue: {
          name: event.venue?.name,
          address: event.venue?.address?.localized_address_display,
          location: {
            latitude: event.venue?.latitude,
            longitude: event.venue?.longitude
          }
        },
        images: [event.logo?.url].filter(Boolean),
        url: event.url,
        isFree: event.is_free,
        categories: event.category ? [event.category.name] : []
      }));
    } catch (error) {
      console.error('Eventbrite API error:', error);
      return [];
    }
  },

  // Combined search with culinary filtering
  async getCulinaryEvents(params = {}) {
    const {
      startDate,
      endDate,
      maxResults = 20
    } = params;

    // Culinary-related keywords
    const culinaryKeywords = [
      'food', 'wine', 'cooking', 'chef', 'cuisine', 'tasting',
      'dinner', 'brunch', 'festival', 'culinary', 'restaurant',
      'jazz fest', 'creole', 'cajun', 'oyster', 'crawfish'
    ];

    const searchPromises = [];

    // Ticketmaster searches
    culinaryKeywords.slice(0, 5).forEach(keyword => {
      searchPromises.push(
        this.getTicketmasterEvents({
          keyword,
          startDateTime: startDate,
          endDateTime: endDate,
          size: 10
        })
      );
    });

    // Eventbrite food & drink category
    searchPromises.push(
      this.getEventbriteEvents({
        categories: '110', // Food & Drink category
        startDate,
        endDate
      })
    );

    // Eventbrite keyword searches
    ['food festival', 'wine tasting', 'cooking class'].forEach(keyword => {
      searchPromises.push(
        this.getEventbriteEvents({
          keyword,
          startDate,
          endDate
        })
      );
    });

    try {
      const results = await Promise.all(searchPromises);
      const allEvents = results.flat();

      // Deduplicate by name and date
      const uniqueEvents = this.deduplicateEvents(allEvents);

      // Filter for culinary relevance
      const culinaryEvents = uniqueEvents.filter(event =>
        this.isCulinaryEvent(event)
      );

      // Sort by date
      culinaryEvents.sort((a, b) =>
        new Date(a.startDate) - new Date(b.startDate)
      );

      return culinaryEvents.slice(0, maxResults);
    } catch (error) {
      console.error('Error fetching culinary events:', error);
      return [];
    }
  },

  // Helper: Check if event is culinary-related
  isCulinaryEvent(event) {
    const culinaryTerms = [
      'food', 'wine', 'cook', 'chef', 'cuisine', 'tasting',
      'dinner', 'lunch', 'brunch', 'breakfast', 'restaurant',
      'culinary', 'gastro', 'feast', 'festival', 'market',
      'oyster', 'crawfish', 'gumbo', 'jambalaya', 'creole',
      'cajun', 'beignet', 'po boy', 'muffuletta'
    ];

    const searchText = `${event.name} ${event.description}`.toLowerCase();

    return culinaryTerms.some(term => searchText.includes(term));
  },

  // Helper: Deduplicate events
  deduplicateEvents(events) {
    const seen = new Map();

    return events.filter(event => {
      const key = `${event.name.toLowerCase()}-${new Date(event.startDate).toDateString()}`;

      if (seen.has(key)) {
        return false;
      }

      seen.set(key, true);
      return true;
    });
  },

  // Get events near a restaurant
  async getEventsNearVenue(venueLat, venueLng, date = null) {
    const events = await this.getCulinaryEvents({
      startDate: date || new Date().toISOString(),
      maxResults: 50
    });

    // Filter events within 2 miles of venue
    return events.filter(event => {
      if (!event.venue?.location?.latitude) return false;

      const distance = this.calculateDistance(
        venueLat, venueLng,
        parseFloat(event.venue.location.latitude),
        parseFloat(event.venue.location.longitude)
      );

      return distance <= 2; // 2 miles
    }).slice(0, 10);
  },

  // Helper: Calculate distance between coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
};

export default eventService;
