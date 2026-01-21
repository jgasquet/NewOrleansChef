// NewOrleansChef Client-Side JavaScript
const API_BASE = window.location.origin + '/api';

// Check for successful subscription
if (window.location.search.includes('subscribed=true')) {
    showNotification('Thanks for subscribing to New Orleans Chef! You\'ll hear from us soon.');
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE}/users/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Successfully subscribed! Check your email for confirmation.');
                newsletterForm.reset();
            } else {
                showNotification(data.error || 'Subscription failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            showNotification('Network error. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Modal Functions
function openCuisineModal(cuisineId) {
    loadRestaurantsByCuisine(cuisineId);
}

function closeModal() {
    const modal = document.getElementById('cuisineModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on overlay click
const modalOverlay = document.getElementById('cuisineModal');
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'cuisineModal') {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Load restaurants by cuisine from API
async function loadRestaurantsByCuisine(cuisineId) {
    const modal = document.getElementById('cuisineModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalGrid = document.getElementById('modalGrid');
    
    try {
        // Show loading state
        modalGrid.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--cream);">Loading restaurants...</div>';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Fetch data from API
        const response = await fetch(`${API_BASE}/restaurants/cuisine/${cuisineId}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load restaurants');
        }
        
        // Update modal title
        modalTitle.innerHTML = `${data.cuisine.name} <em>Restaurants</em>`;
        modalSubtitle.textContent = `${data.count} spots serving ${data.cuisine.name.toLowerCase()} cuisine`;
        
        // Render restaurants
        modalGrid.innerHTML = data.restaurants.map(r => `
            <div class="rec-card" data-restaurant-id="${r.id}">
                <div class="rec-card-img" style="background: linear-gradient(135deg, var(--burgundy), var(--burgundy-deep));">
                    ${data.cuisine.icon}
                </div>
                <div class="rec-card-info">
                    <h3 class="rec-card-name">${r.name}</h3>
                    <p class="rec-card-desc">${r.description}</p>
                </div>
                <div class="rec-card-meta">
                    <span class="rec-card-neighborhood">${r.neighborhood}</span>
                    <span class="rec-card-price">${r.priceLevel}</span>
                    <div class="rec-card-rating">
                        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ${r.rating}
                    </div>
                    <button class="rec-card-book" onclick="openReservationForm('${r.id}', '${r.name}')">Book Table</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading restaurants:', error);
        modalGrid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--cream);">
                <p>Failed to load restaurants. Please try again.</p>
                <button onclick="closeModal()" class="btn btn-primary" style="margin-top: 1rem;">Close</button>
            </div>
        `;
    }
}

// Open reservation form
function openReservationForm(restaurantId, restaurantName) {
    // Create reservation modal
    const modal = document.createElement('div');
    modal.className = 'cuisine-modal-overlay active';
    modal.innerHTML = `
        <div class="cuisine-modal" style="max-width: 600px;">
            <div class="cuisine-modal-header">
                <div>
                    <h2 class="cuisine-modal-title">Book a Table</h2>
                    <p class="cuisine-modal-subtitle">${restaurantName}</p>
                </div>
                <button class="cuisine-modal-close" onclick="this.closest('.cuisine-modal-overlay').remove()">✕</button>
            </div>
            <form id="reservationForm" style="padding: 0 0 2rem 0;">
                <input type="hidden" name="restaurantId" value="${restaurantId}">
                <input type="hidden" name="restaurantName" value="${restaurantName}">
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="text" name="name" placeholder="Your Name" required 
                           style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                    
                    <input type="email" name="email" placeholder="Email Address" required 
                           style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                    
                    <input type="tel" name="phone" placeholder="Phone Number" required 
                           style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <input type="date" name="date" required 
                               style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                        
                        <input type="time" name="time" required 
                               style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                    </div>
                    
                    <select name="partySize" required 
                            style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;">
                        <option value="">Party Size</option>
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}">${n} ${n === 1 ? 'guest' : 'guests'}</option>`).join('')}
                    </select>
                    
                    <textarea name="specialRequests" placeholder="Special Requests (optional)" rows="3"
                              style="padding: 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--gold); color: var(--cream); font-family: 'Crimson Pro', serif;"></textarea>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                        Request Reservation
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Handle form submission
    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', handleReservationSubmit);
}

// Handle reservation form submission
async function handleReservationSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Close reservation modal
            form.closest('.cuisine-modal-overlay').remove();
            document.body.style.overflow = '';
            
            // Show success message
            showNotification(
                `Reservation request sent! Check your email for confirmation. Reservation ID: ${result.reservation.id}`,
                'success'
            );
        } else {
            showNotification(result.error || 'Failed to create reservation', 'error');
        }
    } catch (error) {
        console.error('Reservation error:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--forest)' : 'var(--burgundy)'};
        color: var(--cream);
        padding: 1.5rem 2rem;
        border-radius: 4px;
        border: 1px solid ${type === 'success' ? 'var(--gold)' : 'var(--burgundy-deep)'};
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-family: 'Crimson Pro', serif;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Animate elements on scroll
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

document.querySelectorAll('.cuisine-card, .restaurant-item, .experience-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Load featured restaurants on page load
window.addEventListener('DOMContentLoaded', () => {
    loadFeaturedRestaurants();
});

async function loadFeaturedRestaurants() {
    try {
        const response = await fetch(`${API_BASE}/restaurants?featured=true&limit=8`);
        const data = await response.json();
        
        // You can dynamically update the restaurant list here if needed
        console.log('Featured restaurants loaded:', data.count);
    } catch (error) {
        console.error('Error loading featured restaurants:', error);
    }
}

console.log('🍴 NewOrleansChef initialized');
