import { NextResponse } from 'next/server';
import { uber } from '@/lib/api/uber';

// POST /api/uber/estimates - Get price and time estimates
export async function POST(request) {
  try {
    const body = await request.json();
    const { startLat, startLng, endLat, endLng, destination } = body;
    
    if (!startLat || !startLng || !endLat || !endLng) {
      return NextResponse.json(
        { error: 'Missing required coordinates' },
        { status: 400 }
      );
    }
    
    // Get price and time estimates in parallel
    const [prices, times] = await Promise.all([
      uber.getPriceEstimates({
        start_latitude: startLat,
        start_longitude: startLng,
        end_latitude: endLat,
        end_longitude: endLng,
      }),
      uber.getTimeEstimates({
        start_latitude: startLat,
        start_longitude: startLng,
      }),
    ]);
    
    // Generate deep link
    const deepLink = uber.generateDeepLink({
      pickup_latitude: startLat,
      pickup_longitude: startLng,
      dropoff_latitude: endLat,
      dropoff_longitude: endLng,
      dropoff_nickname: destination,
      action: 'setPickup',
    });
    
    // Calculate best estimates
    const lowestPrice = prices.length > 0 
      ? Math.min(...prices.map(p => p.low_estimate)) 
      : null;
    const fastestTime = times.length > 0 
      ? Math.min(...times.map(t => t.estimate)) 
      : null;
    
    return NextResponse.json({
      prices,
      times,
      deepLink,
      summary: {
        lowestPrice,
        fastestTime,
        currency: prices[0]?.currency_code || 'USD',
      },
    });
    
  } catch (error) {
    console.error('Uber API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get Uber estimates', message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/uber/link - Generate Uber deep link
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const startLat = searchParams.get('startLat');
    const startLng = searchParams.get('startLng');
    const endLat = searchParams.get('endLat');
    const endLng = searchParams.get('endLng');
    const destination = searchParams.get('destination');
    const pickupLocation = searchParams.get('pickup');
    
    if (!endLat || !endLng) {
      return NextResponse.json(
        { error: 'Missing destination coordinates' },
        { status: 400 }
      );
    }
    
    const deepLink = uber.generateDeepLink({
      pickup_latitude: startLat ? parseFloat(startLat) : undefined,
      pickup_longitude: startLng ? parseFloat(startLng) : undefined,
      pickup_nickname: pickupLocation,
      dropoff_latitude: parseFloat(endLat),
      dropoff_longitude: parseFloat(endLng),
      dropoff_nickname: destination,
      action: startLat && startLng ? 'setPickup' : undefined,
    });
    
    return NextResponse.json({ deepLink });
    
  } catch (error) {
    console.error('Uber Link API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Uber link' },
      { status: 500 }
    );
  }
}
