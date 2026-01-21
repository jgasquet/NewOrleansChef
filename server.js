/**
 * NewOrleansChef Server
 * Express API for cookbook-powered restaurant discovery
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const recommendationEngine = require('./utils/recommendations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

/**
 * GET /api/recipes
 * Get all recipes or filter by category
 */
app.get('/api/recipes', (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const recipes = recommendationEngine.getRecipesByCategory(category);
      return res.json({ success: true, data: recipes });
    }
    
    res.json({ success: true, data: recommendationEngine.recipes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/recipes/:id
 * Get single recipe with restaurant recommendations
 */
app.get('/api/recipes/:id', (req, res) => {
  try {
    const result = recommendationEngine.getRecipeWithRecommendations(req.params.id);
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/restaurants
 * Get all restaurants or filter by cuisine
 */
app.get('/api/restaurants', (req, res) => {
  try {
    const { cuisine, cookbook } = req.query;
    
    if (cuisine) {
      const restaurants = recommendationEngine.getRestaurantsByCuisine(cuisine);
      return res.json({ success: true, data: restaurants });
    }
    
    if (cookbook === 'true') {
      const restaurants = recommendationEngine.getCookbookConnectedRestaurants();
      return res.json({ success: true, data: restaurants });
    }
    
    res.json({ success: true, data: recommendationEngine.restaurants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/restaurants/:id
 * Get single restaurant with cookbook recipe matches
 */
app.get('/api/restaurants/:id', (req, res) => {
  try {
    const restaurant = recommendationEngine.restaurants.find(r => r.id === req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    
    const recipes = recommendationEngine.findRecipesByRestaurant(req.params.id);
    
    res.json({ 
      success: true, 
      data: {
        restaurant,
        cookbookMatches: recipes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/search
 * Search recipes and restaurants
 */
app.get('/api/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query required' });
    }
    
    const results = recommendationEngine.search(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/recommendations
 * Get personalized recommendations
 */
app.post('/api/recommendations', (req, res) => {
  try {
    const preferences = req.body;
    const recommendations = recommendationEngine.getPersonalizedRecommendations(preferences);
    
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/featured
 * Get featured content for homepage
 */
app.get('/api/featured', (req, res) => {
  try {
    const featured = recommendationEngine.getFeaturedContent();
    res.json({ success: true, data: featured });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/stats
 * Get platform statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = recommendationEngine.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cuisine/:type
 * Get restaurants by cuisine type with cookbook connections
 */
app.get('/api/cuisine/:type', (req, res) => {
  try {
    const restaurants = recommendationEngine.getRestaurantsByCuisine(req.params.type);
    
    res.json({ 
      success: true, 
      data: {
        cuisine: req.params.type,
        count: restaurants.length,
        restaurants
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email subscription endpoint (placeholder - integrate with your email service)
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }
  
  // TODO: Integrate with email service (Mailchimp, SendGrid, etc.)
  console.log('New subscription:', email);
  
  res.json({ 
    success: true, 
    message: 'Successfully subscribed to New Orleans Chef updates!' 
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🍲 NEW ORLEANS CHEF SERVER 🍲              ║
║                                                   ║
║  Server running on http://localhost:${PORT}       ║
║                                                   ║
║  Cookbook-powered restaurant discovery            ║
║  Chef Mark Gasquet's legacy lives on             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
  
  const stats = recommendationEngine.getStats();
  console.log(`📚 ${stats.totalRecipes} recipes loaded`);
  console.log(`🍽️  ${stats.totalRestaurants} restaurants indexed`);
  console.log(`🔗 ${stats.cookbookConnections} cookbook connections`);
  console.log('');
});

module.exports = app;
