import { NextResponse } from 'next/server';

// Demo ride data for development
const getDemoRides = (passengers = 1, filters = {}) => {
  let rides = [
    {
      provider: 'uber',
      name: 'Uber',
      type: 'UberX',
      price: 18.50,
      eta: 4,
      capacity: 4,
      productId: 'uberx',
      features: [],
      savingsPercent: 0,
      surgeMultiplier: 1,
      webBookingUrl: 'https://m.uber.com'
    },
    {
      provider: 'uber',
      name: 'Uber',
      type: 'Uber Comfort',
      price: 24.00,
      eta: 6,
      capacity: 4,
      productId: 'comfort',
      features: ['luxury'],
      savingsPercent: 0,
      surgeMultiplier: 1,
      webBookingUrl: 'https://m.uber.com'
    },
    {
      provider: 'uber',
      name: 'Uber',
      type: 'UberXL',
      price: 32.00,
      eta: 8,
      capacity: 6,
      productId: 'uberxl',
      features: ['large'],
      savingsPercent: 0,
      surgeMultiplier: 1,
      webBookingUrl: 'https://m.uber.com'
    },
    {
      provider: 'lyft',
      name: 'Lyft',
      type: 'Lyft',
      price: 17.25,
      eta: 3,
      capacity: 4,
      rideTypeId: 'lyft',
      features: [],
      savingsPercent: 7,
      surgeMultiplier: 1,
      webBookingUrl: 'https://www.lyft.com'
    },
    {
      provider: 'lyft',
      name: 'Lyft',
      type: 'Lyft XL',
      price: 29.50,
      eta: 7,
      capacity: 6,
      rideTypeId: 'lyft_xl',
      features: ['large'],
      savingsPercent: 8,
      surgeMultiplier: 1,
      webBookingUrl: 'https://www.lyft.com'
    },
    {
      provider: 'lyft',
      name: 'Lyft',
      type: 'Lyft Lux',
      price: 45.00,
      eta: 12,
      capacity: 4,
      rideTypeId: 'lyft_lux',
      features: ['luxury'],
      savingsPercent: 0,
      surgeMultiplier: 1.2,
      webBookingUrl: 'https://www.lyft.com'
    },
    {
      provider: 'via',
      name: 'Via',
      type: 'Shared Ride',
      price: 8.50,
      eta: 10,
      capacity: 2,
      features: ['shared'],
      savingsPercent: 54,
      surgeMultiplier: 1,
      webBookingUrl: 'https://ridewithvia.com'
    },
    {
      provider: 'curb',
      name: 'Curb',
      type: 'Taxi',
      price: 22.00,
      eta: 5,
      capacity: 4,
      features: ['wheelchair'],
      savingsPercent: 0,
      surgeMultiplier: 1,
      webBookingUrl: 'https://gocurb.com'
    }
  ];

  // Filter by capacity
  rides = rides.filter(r => r.capacity >= passengers);

  // Apply filters
  if (filters.wheelchair) {
    rides = rides.filter(r => r.features?.includes('wheelchair'));
  }
  if (filters.luxury) {
    rides = rides.filter(r => r.features?.includes('luxury'));
  }
  if (filters.shared) {
    rides = rides.filter(r => r.features?.includes('shared'));
  }
  if (filters.large) {
    rides = rides.filter(r => r.features?.includes('large') || r.capacity >= 5);
  }

  // Calculate savings
  if (rides.length > 0) {
    const maxPrice = Math.max(...rides.map(r => r.price));
    rides = rides.map(ride => ({
      ...ride,
      savingsPercent: maxPrice > 0 ? Math.round(((maxPrice - ride.price) / maxPrice) * 100) : 0
    }));
  }

  return rides;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { pickup, dropoff, passengers = 1, filters = {}, eventId } = body;

    // Validate input
    if (!pickup?.latitude || !pickup?.longitude ||
        !dropoff?.latitude || !dropoff?.longitude) {
      return NextResponse.json({
        success: false,
        message: 'Pickup and dropoff coordinates required'
      }, { status: 400 });
    }

    // Get ride options (demo data for now)
    const rides = getDemoRides(passengers, filters);

    // Log for analytics
    console.log('Rideshare comparison:', {
      pickup,
      dropoff,
      passengers,
      filters,
      eventId,
      ridesFound: rides.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      rides,
      totalOptions: rides.length
    });

  } catch (error) {
    console.error('Rideshare comparison error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unable to fetch ride options',
      error: error.message
    }, { status: 500 });
  }
}
