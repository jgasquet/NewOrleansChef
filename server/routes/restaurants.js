const express = require('express');
const router = express.Router();
const restaurantData = require('../../src/data/restaurants.json');

// GET all restaurants
router.get('/', (req, res) => {
    const { cuisine, neighborhood, priceLevel, featured, limit } = req.query;
    
    let filtered = [...restaurantData.restaurants];
    
    // Filter by cuisine
    if (cuisine) {
        filtered = filtered.filter(r => r.cuisines.includes(cuisine));
    }
    
    // Filter by neighborhood
    if (neighborhood) {
        filtered = filtered.filter(r => 
            r.neighborhood.toLowerCase() === neighborhood.toLowerCase()
        );
    }
    
    // Filter by price level
    if (priceLevel) {
        filtered = filtered.filter(r => r.priceLevel === priceLevel);
    }
    
    // Filter featured only
    if (featured === 'true') {
        filtered = filtered.filter(r => r.featured);
    }
    
    // Limit results
    if (limit) {
        filtered = filtered.slice(0, parseInt(limit));
    }
    
    res.json({
        count: filtered.length,
        restaurants: filtered
    });
});

// GET single restaurant by ID
router.get('/:id', (req, res) => {
    const restaurant = restaurantData.restaurants.find(r => r.id === req.params.id);
    
    if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(restaurant);
});

// GET restaurants by cuisine
router.get('/cuisine/:cuisineId', (req, res) => {
    const { cuisineId } = req.params;
    const cuisine = restaurantData.cuisines.find(c => c.id === cuisineId);
    
    if (!cuisine) {
        return res.status(404).json({ error: 'Cuisine type not found' });
    }
    
    const restaurants = restaurantData.restaurants.filter(r => 
        r.cuisines.includes(cuisineId)
    );
    
    res.json({
        cuisine,
        count: restaurants.length,
        restaurants
    });
});

// GET all cuisine types
router.get('/cuisines/list', (req, res) => {
    res.json(restaurantData.cuisines);
});

// GET restaurants by neighborhood
router.get('/neighborhood/:name', (req, res) => {
    const { name } = req.params;
    const restaurants = restaurantData.restaurants.filter(r => 
        r.neighborhood.toLowerCase() === name.toLowerCase()
    );
    
    if (restaurants.length === 0) {
        return res.status(404).json({ error: 'No restaurants found in this neighborhood' });
    }
    
    res.json({
        neighborhood: name,
        count: restaurants.length,
        restaurants
    });
});

// GET featured restaurants
router.get('/featured/list', (req, res) => {
    const featured = restaurantData.restaurants.filter(r => r.featured);
    
    res.json({
        count: featured.length,
        restaurants: featured
    });
});

// Search restaurants
router.get('/search/query', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search query required' });
    }
    
    const query = q.toLowerCase();
    const results = restaurantData.restaurants.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.neighborhood.toLowerCase().includes(query) ||
        r.specialties.some(s => s.toLowerCase().includes(query))
    );
    
    res.json({
        query: q,
        count: results.length,
        restaurants: results
    });
});

module.exports = router;
