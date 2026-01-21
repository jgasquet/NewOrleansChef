/**
 * Cookbook-Powered Restaurant Recommendation Engine
 * Matches Chef Mark Gasquet's recipes to New Orleans restaurants
 */

const fs = require('fs');
const path = require('path');

// Load data
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cookbook/recipes.json'), 'utf8'));
const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/restaurants/restaurants.json'), 'utf8'));

class RecommendationEngine {
  constructor() {
    this.recipes = recipes;
    this.restaurants = restaurants;
  }

  /**
   * Find restaurants that match a specific recipe
   * @param {string} recipeId - Recipe ID to match
   * @returns {Array} Matched restaurants with scores
   */
  findRestaurantsByRecipe(recipeId) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return [];

    // Find restaurants with this recipe in their cookbook matches
    const matches = [];
    
    this.restaurants.forEach(restaurant => {
      const match = restaurant.cookbookMatches?.find(m => m.recipeId === recipeId);
      if (match) {
        matches.push({
          ...restaurant,
          matchDetails: match,
          matchScore: this.calculateMatchScore(match.matchStrength)
        });
      }
    });

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Find recipes similar to a restaurant's offerings
   * @param {string} restaurantId - Restaurant ID
   * @returns {Array} Matching recipes
   */
  findRecipesByRestaurant(restaurantId) {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    if (!restaurant || !restaurant.cookbookMatches) return [];

    return restaurant.cookbookMatches.map(match => {
      const recipe = this.recipes.find(r => r.id === match.recipeId);
      return {
        ...recipe,
        matchDetails: match,
        matchScore: this.calculateMatchScore(match.matchStrength)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Get all restaurants by cuisine type
   * @param {string} cuisineType - Cuisine category
   * @returns {Array} Restaurants
   */
  getRestaurantsByCuisine(cuisineType) {
    const cuisineMap = {
      'creole': ['Creole', 'Soul Food'],
      'cajun': ['Cajun', 'Contemporary Cajun'],
      'soul': ['Soul Food'],
      'seafood': ['Oyster Bar', 'Seafood'],
      'poboys': ['Po-Boys'],
      'fine': ['Fine Dining', 'Haute Creole']
    };

    const relevantTags = cuisineMap[cuisineType.toLowerCase()] || [];
    
    return this.restaurants.filter(restaurant => {
      return restaurant.cuisineTags.some(tag => 
        relevantTags.some(relevantTag => tag.includes(relevantTag))
      );
    }).sort((a, b) => b.rating - a.rating);
  }

  /**
   * Get all recipes by category
   * @param {string} category - Recipe category
   * @returns {Array} Recipes
   */
  getRecipesByCategory(category) {
    return this.recipes.filter(recipe => 
      recipe.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Smart search across recipes and restaurants
   * @param {string} query - Search term
   * @returns {Object} Results with recipes and restaurants
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    
    // Search recipes
    const recipeMatches = this.recipes.filter(recipe => {
      return (
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
      );
    });

    // Search restaurants
    const restaurantMatches = this.restaurants.filter(restaurant => {
      return (
        restaurant.name.toLowerCase().includes(lowerQuery) ||
        restaurant.description.toLowerCase().includes(lowerQuery) ||
        restaurant.specialties.some(s => s.toLowerCase().includes(lowerQuery)) ||
        restaurant.cuisineTags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });

    return {
      recipes: recipeMatches,
      restaurants: restaurantMatches
    };
  }

  /**
   * Get personalized recommendations based on preferences
   * @param {Object} preferences - User preferences
   * @returns {Object} Recommended recipes and restaurants
   */
  getPersonalizedRecommendations(preferences = {}) {
    const {
      spiceLevel = 'any',
      priceRange = ['$', '$$', '$$$', '$$$$'],
      cuisineTypes = [],
      dietaryRestrictions = []
    } = preferences;

    // Filter recipes by preferences
    let filteredRecipes = this.recipes;
    
    if (spiceLevel !== 'any') {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.flavorProfile.spiceLevel === spiceLevel
      );
    }

    if (cuisineTypes.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        cuisineTypes.some(type => 
          recipe.category.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Filter restaurants by preferences
    let filteredRestaurants = this.restaurants;

    if (priceRange.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        priceRange.includes(restaurant.priceRange)
      );
    }

    if (cuisineTypes.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.cuisineTags.some(tag =>
          cuisineTypes.some(type => 
            tag.toLowerCase().includes(type.toLowerCase())
          )
        )
      );
    }

    // Sort by rating
    filteredRestaurants.sort((a, b) => b.rating - a.rating);

    return {
      recipes: filteredRecipes.slice(0, 6),
      restaurants: filteredRestaurants.slice(0, 10)
    };
  }

  /**
   * Get cookbook-connected restaurants (restaurants with cookbook matches)
   * @returns {Array} Restaurants with cookbook connections
   */
  getCookbookConnectedRestaurants() {
    return this.restaurants
      .filter(r => r.cookbookMatches && r.cookbookMatches.length > 0)
      .sort((a, b) => b.rating - a.rating);
  }

  /**
   * Calculate match score from match strength string
   * @param {string} matchStrength - 'very high', 'high', 'medium', 'low'
   * @returns {number} Numeric score
   */
  calculateMatchScore(matchStrength) {
    const scoreMap = {
      'very high': 100,
      'high': 80,
      'medium': 60,
      'low': 40
    };
    return scoreMap[matchStrength] || 50;
  }

  /**
   * Get featured content for homepage
   * @returns {Object} Featured recipes and restaurants
   */
  getFeaturedContent() {
    // Get signature recipes
    const featuredRecipes = this.recipes
      .filter(r => r.tags.includes('signature'))
      .slice(0, 4);

    // Get top-rated restaurants
    const featuredRestaurants = this.restaurants
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);

    // Get restaurants with strong cookbook connections
    const cookbookHighlights = this.restaurants
      .filter(r => r.cookbookMatches?.some(m => m.matchStrength === 'very high' || m.matchStrength === 'high'))
      .slice(0, 6);

    return {
      recipes: featuredRecipes,
      restaurants: featuredRestaurants,
      cookbookHighlights
    };
  }

  /**
   * Get recipe details with restaurant recommendations
   * @param {string} recipeId - Recipe ID
   * @returns {Object} Recipe with restaurant recommendations
   */
  getRecipeWithRecommendations(recipeId) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return null;

    const restaurantMatches = this.findRestaurantsByRecipe(recipeId);

    return {
      recipe,
      recommendations: restaurantMatches
    };
  }

  /**
   * Get stats for the platform
   * @returns {Object} Platform statistics
   */
  getStats() {
    return {
      totalRecipes: this.recipes.length,
      totalRestaurants: this.restaurants.length,
      cookbookConnections: this.restaurants.reduce((sum, r) => 
        sum + (r.cookbookMatches?.length || 0), 0
      ),
      categories: [...new Set(this.recipes.map(r => r.category))],
      neighborhoods: [...new Set(this.restaurants.map(r => r.neighborhood))]
    };
  }
}

// Export singleton instance
module.exports = new RecommendationEngine();
