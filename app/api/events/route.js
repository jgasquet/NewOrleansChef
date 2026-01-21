import { NextResponse } from 'next/server';
import { ticketmaster } from '@/lib/api/ticketmaster';
import { eventbrite } from '@/lib/api/eventbrite';

// GET /api/events - Get events from both Ticketmaster and Eventbrite
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category'); // music, sports, food, arts
    const keyword = searchParams.get('keyword');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const source = searchParams.get('source'); // 'ticketmaster', 'eventbrite', or 'all' (default)
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    let allEvents = [];
    
    // Fetch from Ticketmaster
    if (!source || source === 'all' || source === 'ticketmaster') {
      try {
        const tmResults = await ticketmaster.searchEvents({
          keyword: keyword,
          classificationName: category,
          startDateTime: startDate,
          endDateTime: endDate,
          size: limit,
        });
        
        // Transform Ticketmaster events to common format
        const tmEvents = tmResults.events.map(event => ({
          id: `tm-${event.id}`,
          source: 'ticketmaster',
          name: event.name,
          description: event.info || event.pleaseNote || '',
          date: event.dates?.start?.dateTime || event.dates?.start?.localDate,
          time: event.dates?.start?.localTime,
          venue: {
            name: event._embedded?.venues?.[0]?.name,
            address: event._embedded?.venues?.[0]?.address?.line1,
            city: event._embedded?.venues?.[0]?.city?.name,
            coordinates: {
              lat: parseFloat(event._embedded?.venues?.[0]?.location?.latitude),
              lng: parseFloat(event._embedded?.venues?.[0]?.location?.longitude),
            }
          },
          category: event.classifications?.[0]?.segment?.name,
          subcategory: event.classifications?.[0]?.genre?.name,
          image: event.images?.[0]?.url,
          url: event.url,
          priceRange: event.priceRanges?.[0] ? {
            min: event.priceRanges[0].min,
            max: event.priceRanges[0].max,
            currency: event.priceRanges[0].currency
          } : null,
        }));
        
        allEvents = [...allEvents, ...tmEvents];
      } catch (error) {
        console.error('Ticketmaster fetch error:', error);
      }
    }
    
    // Fetch from Eventbrite
    if (!source || source === 'all' || source === 'eventbrite') {
      try {
        const ebResults = await eventbrite.searchEvents({
          q: keyword,
          start_date: startDate,
          end_date: endDate,
          page_size: limit,
        });
        
        // Transform Eventbrite events to common format
        const ebEvents = ebResults.events.map(event => ({
          id: `eb-${event.id}`,
          source: 'eventbrite',
          name: event.name?.text,
          description: event.description?.text || event.summary,
          date: event.start?.local,
          time: event.start?.local?.split('T')[1],
          venue: {
            name: event.venue?.name,
            address: event.venue?.address?.localized_address_display,
            city: event.venue?.address?.city,
            coordinates: {
              lat: parseFloat(event.venue?.latitude),
              lng: parseFloat(event.venue?.longitude),
            }
          },
          category: event.category?.name,
          subcategory: event.subcategory?.name,
          image: event.logo?.url,
          url: event.url,
          priceRange: event.ticket_availability?.minimum_ticket_price ? {
            min: event.ticket_availability.minimum_ticket_price.major_value,
            max: event.ticket_availability.maximum_ticket_price?.major_value,
            currency: event.ticket_availability.minimum_ticket_price.currency
          } : null,
        }));
        
        allEvents = [...allEvents, ...ebEvents];
      } catch (error) {
        console.error('Eventbrite fetch error:', error);
      }
    }
    
    // Sort by date
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Limit results
    allEvents = allEvents.slice(0, limit);
    
    return NextResponse.json({
      events: allEvents,
      total: allEvents.length,
      sources: {
        ticketmaster: allEvents.filter(e => e.source === 'ticketmaster').length,
        eventbrite: allEvents.filter(e => e.source === 'eventbrite').length,
      }
    });
    
  } catch (error) {
    console.error('Events API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/events/[id] - Get specific event details
export async function GET_BY_ID(request, { params }) {
  try {
    const { id } = params;
    const [source, eventId] = id.split('-');
    
    let eventDetails;
    
    if (source === 'tm') {
      eventDetails = await ticketmaster.getEventById(eventId);
    } else if (source === 'eb') {
      eventDetails = await eventbrite.getEventById(eventId);
    } else {
      return NextResponse.json(
        { error: 'Invalid event ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ event: eventDetails });
    
  } catch (error) {
    console.error('Event details API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}
