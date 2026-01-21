import { NextResponse } from 'next/server';
import restaurants, { dishIndex, cuisineCategories, neighborhoods } from '@/lib/data/restaurants';

// GET /api/restaurants - Get all restaurants with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const cuisine = searchParams.get('cuisine');
    const neighborhood = searchParams.get('neighborhood');
    const dish = searchParams.get('dish');
    const priceRange = searchParams.get('priceRange');
    const search = searchParams.get('search');
    
    let filtered = [...restaurants];
    
    // Filter by cuisine
    if (cuisine) {
      filtered = filtered.filter(r => 
        r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    }
    
    // Filter by neighborhood
    if (neighborhood) {
      filtered = filtered.filter(r => 
        r.neighborhood.toLowerCase() === neighborhood.toLowerCase()
      );
    }
    
    // Filter by signature dish
    if (dish) {
      const restaurantIds = dishIndex[dish.toLowerCase()] || [];
      filtered = filtered.filter(r => restaurantIds.includes(r.id));
    }
    
    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(r => r.priceRange === priceRange);
    }
    
    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.signatureDishes.some(dish => dish.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by rating (default)
    filtered.sort((a, b) => b.rating - a.rating);
    
    return NextResponse.json({
      restaurants: filtered,
      total: filtered.length,
      cuisines: cuisineCategories,
      neighborhoods: neighborhoods
    });
    
  } catch (error) {
    console.error('Restaurant API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
