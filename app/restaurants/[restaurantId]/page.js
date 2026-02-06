'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UberRideWidget from '@/components/UberRideWidget';
import EventsList from '@/components/EventsList';

// Demo restaurant data - in production this would come from an API
const DEMO_RESTAURANTS = {
  'commanders-palace': {
    id: 'commanders-palace',
    name: "Commander's Palace",
    cuisine: "Creole",
    priceRange: "$$$$",
    rating: 4.8,
    address: "1403 Washington Ave, New Orleans, LA 70130",
    latitude: 29.9291,
    longitude: -90.0871,
    phone: "(504) 899-8221",
    hours: "Mon-Fri 11:30am-1pm, 6:30pm-10pm; Sat-Sun Brunch 10am-1pm",
    description: "Legendary Garden District restaurant serving refined Creole cuisine since 1893. Famous for jazz brunch, turtle soup, and bread pudding soufflé.",
    image: "🏛️",
    features: ["Jazz Brunch", "Fine Dining", "Private Events", "Jacket Required"],
    signatureDishes: ["Turtle Soup", "Bread Pudding Soufflé", "Pecan-Crusted Gulf Fish"]
  },
  'dooky-chases': {
    id: 'dooky-chases',
    name: "Dooky Chase's",
    cuisine: "Creole Soul Food",
    priceRange: "$$$",
    rating: 4.7,
    address: "2301 Orleans Ave, New Orleans, LA 70119",
    latitude: 29.9683,
    longitude: -90.0713,
    phone: "(504) 821-0600",
    hours: "Tue-Fri 11am-3pm; Fri-Sat 5pm-9pm",
    description: "Legendary Tremé restaurant founded by Leah Chase, the 'Queen of Creole Cuisine'. A civil rights landmark serving soulful Creole dishes.",
    image: "👑",
    features: ["Historic Landmark", "Art Collection", "Lunch Buffet", "Soul Food"],
    signatureDishes: ["Gumbo z'Herbes", "Fried Chicken", "Shrimp Clemenceau"]
  },
  'cochon': {
    id: 'cochon',
    name: "Cochon",
    cuisine: "Cajun",
    priceRange: "$$$",
    rating: 4.6,
    address: "930 Tchoupitoulas St, New Orleans, LA 70130",
    latitude: 29.9414,
    longitude: -90.0697,
    phone: "(504) 588-2123",
    hours: "Mon-Thu 5:30pm-10pm; Fri-Sat 5:30pm-11pm; Sun 10:30am-2pm",
    description: "Donald Link's temple of Southern cooking celebrating Louisiana's Cajun heritage with nose-to-tail cuisine and wood-fired dishes.",
    image: "🐷",
    features: ["Wood-Fired", "Nose-to-Tail", "Craft Cocktails", "Local Ingredients"],
    signatureDishes: ["Cochon with Turnips", "Fried Alligator", "Oysters with Chili Garlic Butter"]
  }
};

const RestaurantDetail = () => {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId;

  const [restaurant, setRestaurant] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load restaurant data
    const restaurantData = DEMO_RESTAURANTS[restaurantId] || {
      id: restaurantId,
      name: 'Restaurant',
      cuisine: 'New Orleans',
      priceRange: '$$',
      rating: 4.5,
      address: 'New Orleans, LA',
      latitude: 29.9511,
      longitude: -90.0715,
      description: 'A great New Orleans restaurant.',
      image: '🍽️',
      features: [],
      signatureDishes: []
    };
    setRestaurant(restaurantData);
    setLoading(false);

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }, [restaurantId]);

  if (loading || !restaurant) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => router.back()} style={styles.backButton}>
          ← Back
        </button>
        <span style={styles.headerTitle}>Restaurant</span>
        <div style={{ width: '60px' }} />
      </header>

      <div style={styles.container}>
        {/* Restaurant Hero */}
        <div style={styles.heroSection}>
          <span style={styles.heroEmoji}>{restaurant.image}</span>
          <h1 style={styles.restaurantName}>{restaurant.name}</h1>
          <div style={styles.restaurantMeta}>
            <span style={styles.cuisine}>{restaurant.cuisine}</span>
            <span style={styles.separator}>•</span>
            <span style={styles.priceRange}>{restaurant.priceRange}</span>
            <span style={styles.separator}>•</span>
            <span style={styles.rating}>⭐ {restaurant.rating}</span>
          </div>
        </div>

        {/* Info Section */}
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>📍</span>
            <span style={styles.infoText}>{restaurant.address}</span>
          </div>
          {restaurant.phone && (
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📞</span>
              <a href={`tel:${restaurant.phone}`} style={styles.infoLink}>{restaurant.phone}</a>
            </div>
          )}
          {restaurant.hours && (
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>🕐</span>
              <span style={styles.infoText}>{restaurant.hours}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={styles.descriptionSection}>
          <p style={styles.description}>{restaurant.description}</p>
        </div>

        {/* Features */}
        {restaurant.features?.length > 0 && (
          <div style={styles.featuresSection}>
            <h3 style={styles.sectionTitle}>Features</h3>
            <div style={styles.features}>
              {restaurant.features.map((feature, idx) => (
                <span key={idx} style={styles.featureTag}>{feature}</span>
              ))}
            </div>
          </div>
        )}

        {/* Signature Dishes */}
        {restaurant.signatureDishes?.length > 0 && (
          <div style={styles.dishesSection}>
            <h3 style={styles.sectionTitle}>Signature Dishes</h3>
            <div style={styles.dishes}>
              {restaurant.signatureDishes.map((dish, idx) => (
                <div key={idx} style={styles.dishItem}>
                  <span style={styles.dishIcon}>🍽️</span>
                  <span style={styles.dishName}>{dish}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button style={styles.reserveButton}>
            Make a Reservation
          </button>
          <a href={`tel:${restaurant.phone}`} style={styles.callButton}>
            📞 Call Restaurant
          </a>
        </div>

        {/* Uber Widget */}
        <UberRideWidget
          destinationLat={restaurant.latitude}
          destinationLng={restaurant.longitude}
          destinationName={restaurant.name}
          userLat={userLocation?.lat}
          userLng={userLocation?.lng}
        />

        {/* Events Nearby */}
        <EventsList
          nearVenue={{
            lat: restaurant.latitude,
            lng: restaurant.longitude
          }}
          maxEvents={6}
          title="Events Happening Nearby"
        />
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(170deg, #1a0a0a 0%, #2D0A0A 25%, #1a0a0a 50%, #0a0a1a 100%)',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'Georgia', serif",
    padding: '8px',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#F5E6D3',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(212,175,55,0.2)',
    borderTop: '3px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px 20px',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  heroEmoji: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px',
  },
  restaurantName: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 400,
    margin: '0 0 12px',
    background: 'linear-gradient(180deg, #FFE8A0 0%, #D4AF37 40%, #B8941F 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  restaurantMeta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  cuisine: {
    color: 'rgba(245,230,211,0.7)',
    fontSize: '15px',
    fontFamily: "'Georgia', serif",
  },
  separator: {
    color: 'rgba(212,175,55,0.4)',
  },
  priceRange: {
    color: '#D4AF37',
    fontSize: '15px',
    fontWeight: 600,
  },
  rating: {
    color: 'rgba(245,230,211,0.8)',
    fontSize: '15px',
  },
  infoSection: {
    background: 'rgba(45,20,20,0.5)',
    border: '1px solid rgba(212,175,55,0.1)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  infoIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  infoText: {
    color: 'rgba(245,230,211,0.7)',
    fontSize: '14px',
    fontFamily: "'Georgia', serif",
    lineHeight: 1.5,
  },
  infoLink: {
    color: '#D4AF37',
    fontSize: '14px',
    fontFamily: "'Georgia', serif",
    textDecoration: 'none',
  },
  descriptionSection: {
    marginBottom: '24px',
  },
  description: {
    color: 'rgba(245,230,211,0.65)',
    fontSize: '15px',
    lineHeight: 1.7,
    fontFamily: "'Georgia', serif",
    margin: 0,
  },
  featuresSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#D4AF37',
    margin: '0 0 12px',
    fontFamily: "'Georgia', serif",
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  featureTag: {
    padding: '6px 14px',
    background: 'rgba(212,175,55,0.08)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '20px',
    fontSize: '12px',
    color: 'rgba(212,175,55,0.8)',
    fontFamily: "'Georgia', serif",
  },
  dishesSection: {
    marginBottom: '32px',
  },
  dishes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dishItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.1)',
    borderRadius: '8px',
  },
  dishIcon: {
    fontSize: '18px',
  },
  dishName: {
    color: '#F5E6D3',
    fontSize: '14px',
    fontFamily: "'Georgia', serif",
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  reserveButton: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    border: 'none',
    borderRadius: '8px',
    color: '#1a0a0a',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  callButton: {
    flex: 1,
    padding: '16px',
    background: 'transparent',
    border: '2px solid rgba(212,175,55,0.3)',
    borderRadius: '8px',
    color: '#D4AF37',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    fontFamily: "'Georgia', serif",
  },
};

export default RestaurantDetail;
