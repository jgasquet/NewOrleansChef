/**
 * NewOrleansChef Frontend
 * Cookbook-powered restaurant discovery
 */

// API base URL (change for production)
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedContent();
  loadCuisineCounts();
  setupEventListeners();
  setupNavbarScroll();
  setupSmoothScroll();
  setupAnimations();
});

// Load featured recipes and restaurants
async function loadFeaturedContent() {
  try {
    const response = await fetch(`${API_BASE}/featured`);
    const { data } = await response.json();
    
    renderRecipes(data.recipes);
    renderRestaurants(data.restaurants);
  } catch (error) {
    console.error('Error loading featured content:', error);
  }
}

// Render recipe cards
function renderRecipes(recipes) {
  const grid = document.getElementById('recipeGrid');
  if (!grid || !recipes) return;
  
  grid.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" onclick="openRecipeModal('${recipe.id}')">
      <div class="recipe-category">${recipe.category}</div>
      <div class="recipe-icon">${getCategoryIcon(recipe.category)}</div>
      <h3 class="recipe-name">${recipe.name}</h3>
      <p class="recipe-desc">${recipe.description}</p>
      <div class="recipe-meta">
        <span class="recipe-difficulty">${recipe.difficulty}</span>
        <span class="recipe-time">${recipe.prepTime + recipe.cookTime} min</span>
      </div>
      <div class="recipe-cta">View Recipe →</div>
    </div>
  `).join('');
}

// Get icon for category
function getCategoryIcon(category) {
  const icons = {
    'Creole': '🍲',
    'Cajun': '🦐',
    'Soul Food': '🍗'
  };
  return icons[category] || '🍽️';
}

// Render restaurant list
function renderRestaurants(restaurants) {
  const list = document.getElementById('restaurantList');
  if (!list || !restaurants) return;
  
  list.innerHTML = restaurants.slice(0, 8).map((restaurant, index) => `
    <div class="restaurant-item" onclick="window.location.href='mailto:john@nthtrip.com?subject=Reservation Request - ${encodeURIComponent(restaurant.name)}'">
      <span class="restaurant-number">${String(index + 1).padStart(2, '0')}</span>
      <div class="restaurant-info">
        <h3 class="restaurant-name">${restaurant.name}</h3>
        <span class="restaurant-cuisine">${restaurant.category}</span>
      </div>
      <span class="restaurant-neighborhood">${restaurant.neighborhood}</span>
      <div class="restaurant-rating">
        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        ${restaurant.rating}
      </div>
    </div>
  `).join('');
}

// Load cuisine counts
async function loadCuisineCounts() {
  const cuisines = ['creole', 'cajun', 'soul', 'seafood', 'poboys', 'fine'];
  
  for (const cuisine of cuisines) {
    try {
      const response = await fetch(`${API_BASE}/cuisine/${cuisine}`);
      const { data } = await response.json();
      const countEl = document.getElementById(`${cuisine}-count`);
      if (countEl) {
        countEl.textContent = `${data.count} SPOTS`;
      }
    } catch (error) {
      console.error(`Error loading ${cuisine} count:`, error);
    }
  }
}

// Open cuisine modal with restaurants
async function openCuisineModal(cuisineType) {
  try {
    const response = await fetch(`${API_BASE}/cuisine/${cuisineType}`);
    const { data } = await response.json();
    
    const modal = document.getElementById('cuisineModal');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const grid = document.getElementById('modalGrid');
    const badge = document.getElementById('cookbookBadge');
    
    const cuisineNames = {
      'creole': 'Creole',
      'cajun': 'Cajun',
      'soul': 'Soul Food',
      'seafood': 'Gulf Seafood',
      'poboys': 'Po-Boys',
      'fine': 'Fine Dining'
    };
    
    title.innerHTML = `${cuisineNames[cuisineType]} <em>Restaurants</em>`;
    subtitle.textContent = `${data.count} spots serving authentic ${cuisineNames[cuisineType].toLowerCase()}`;
    
    // Show cookbook connections badge
    const cookbookConnected = data.restaurants.filter(r => r.cookbookMatches && r.cookbookMatches.length > 0).length;
    if (cookbookConnected > 0) {
      badge.textContent = `✨ ${cookbookConnected} restaurants with Chef Mark's cookbook connections`;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
    
    grid.innerHTML = data.restaurants.map(r => `
      <div class="rec-card">
        <div class="rec-card-img" style="background: linear-gradient(135deg, var(--burgundy), var(--burgundy-deep));">
          ${getCuisineIcon(cuisineType)}
        </div>
        <div class="rec-card-info">
          <h3 class="rec-card-name">${r.name}</h3>
          <p class="rec-card-desc">${r.description}</p>
          ${r.cookbookMatches && r.cookbookMatches.length > 0 ? `
            <div class="cookbook-connection">
              📖 Cookbook match: ${r.cookbookMatches[0].recipeName}
            </div>
          ` : ''}
        </div>
        <div class="rec-card-meta">
          <span class="rec-card-neighborhood">${r.neighborhood}</span>
          <span class="rec-card-price">${r.priceRange}</span>
          <div class="rec-card-rating">
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${r.rating}
          </div>
          <a href="mailto:john@nthtrip.com?subject=Reservation Request - ${encodeURIComponent(r.name)}" class="rec-card-book" onclick="event.stopPropagation()">Book Table</a>
        </div>
      </div>
    `).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error loading cuisine restaurants:', error);
  }
}

// Get icon for cuisine type
function getCuisineIcon(type) {
  const icons = {
    'creole': '🍲',
    'cajun': '🦐',
    'soul': '🍗',
    'seafood': '🦪',
    'poboys': '🥖',
    'fine': '✨'
  };
  return icons[type] || '🍽️';
}

// Open recipe modal with restaurant recommendations
async function openRecipeModal(recipeId) {
  try {
    const response = await fetch(`${API_BASE}/recipes/${recipeId}`);
    const { data } = await response.json();
    
    const modal = document.getElementById('recipeModal');
    const title = document.getElementById('recipeModalTitle');
    const subtitle = document.getElementById('recipeModalSubtitle');
    const content = document.getElementById('recipeModalContent');
    
    title.innerHTML = `${data.recipe.name}`;
    subtitle.textContent = `${data.recipe.category} • ${data.recipe.difficulty} • ${data.recipe.prepTime + data.recipe.cookTime} minutes`;
    
    content.innerHTML = `
      <div class="recipe-detail">
        <div class="recipe-section">
          <h3>About This Dish</h3>
          <p>${data.recipe.description}</p>
          <p class="chef-notes"><em>"${data.recipe.chefNotes}"</em> — Chef Mark Gasquet</p>
        </div>
        
        <div class="recipe-section">
          <h3>Cultural Significance</h3>
          <p>${data.recipe.culturalSignificance}</p>
        </div>
        
        <div class="recipe-section">
          <h3>Flavor Profile</h3>
          <div class="flavor-tags">
            <span class="flavor-tag">🌶️ ${data.recipe.flavorProfile.spiceLevel}</span>
            <span class="flavor-tag">🍽️ ${data.recipe.flavorProfile.richness} richness</span>
            ${data.recipe.flavorProfile.predominantFlavors.map(f => 
              `<span class="flavor-tag">${f}</span>`
            ).join('')}
          </div>
        </div>
        
        ${data.recommendations && data.recommendations.length > 0 ? `
          <div class="recipe-section">
            <h3>Where to Experience This Dish</h3>
            <p class="section-intro">These New Orleans restaurants honor Chef Mark's tradition with their own versions of this classic:</p>
            <div class="restaurant-recommendations">
              ${data.recommendations.map(rest => `
                <div class="rec-card">
                  <div class="rec-card-info">
                    <h4 class="rec-card-name">${rest.name}</h4>
                    <p class="rec-card-neighborhood">${rest.neighborhood} • ${rest.priceRange}</p>
                    <p class="match-notes">${rest.matchDetails.notes}</p>
                    <div class="match-strength">
                      Match: <strong>${rest.matchDetails.matchStrength}</strong> 
                      • Try: ${rest.matchDetails.dishName}
                    </div>
                  </div>
                  <a href="mailto:john@nthtrip.com?subject=Reservation Request - ${encodeURIComponent(rest.name)} - ${encodeURIComponent(data.recipe.name)}" class="rec-card-book">Book Table</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="recipe-section">
            <p class="no-matches">Want to find a restaurant that makes this dish? <a href="mailto:john@nthtrip.com?subject=Recipe Request - ${encodeURIComponent(data.recipe.name)}">Let us know!</a></p>
          </div>
        `}
        
        <div class="recipe-section">
          <p class="full-recipe-note">📖 Full recipe with ingredients and instructions available in "Healthy New Orleans Cuisine" by Chef Mark C. Gasquet</p>
        </div>
      </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error loading recipe:', error);
  }
}

// Close modals
function closeModal() {
  document.getElementById('cuisineModal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeRecipeModal() {
  document.getElementById('recipeModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Event listeners
function setupEventListeners() {
  // Newsletter form
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[name="email"]').value;
      
      try {
        await fetch(`${API_BASE}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        alert('Thanks for subscribing! You\'ll hear from us soon.');
        form.reset();
      } catch (error) {
        console.error('Subscription error:', error);
        alert('Oops! Please try again or email us directly at john@nthtrip.com');
      }
    });
  }
  
  // Close modals on overlay click
  document.getElementById('cuisineModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cuisineModal') closeModal();
  });
  
  document.getElementById('recipeModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'recipeModal') closeRecipeModal();
  });
  
  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeRecipeModal();
    }
  });
}

// Navbar scroll effect
function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}

// Smooth scroll
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Scroll animations
function setupAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.cuisine-card, .recipe-card, .restaurant-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Make functions global for onclick handlers
window.openCuisineModal = openCuisineModal;
window.openRecipeModal = openRecipeModal;
window.closeModal = closeModal;
window.closeRecipeModal = closeRecipeModal;
