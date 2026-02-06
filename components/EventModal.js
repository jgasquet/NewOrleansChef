'use client';

import React, { useState, useEffect } from 'react';

const EventModal = ({ event, onClose }) => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    loadNearbyRestaurants();
  }, [event]);

  const loadNearbyRestaurants = async () => {
    if (!event.venue?.location) {
      setLoadingRestaurants(false);
      return;
    }

    try {
      // Mock nearby restaurants - replace with real service
      const mockRestaurants = [
        { id: 1, name: "Commander's Palace", cuisine: "Creole", distance: 0.3, image: "🏛️" },
        { id: 2, name: "Cochon", cuisine: "Cajun", distance: 0.5, image: "🐷" },
        { id: 3, name: "Brennan's", cuisine: "French Creole", distance: 0.7, image: "🔥" },
      ];
      setNearbyRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error loading nearby restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const formatEventTime = () => {
    const start = new Date(event.startDate);

    const dateStr = start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const timeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `${dateStr} at ${timeStr}`;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>×</button>

        {event.images?.[0] && (
          <div
            style={{
              ...styles.image,
              backgroundImage: `url(${event.images[0]})`
            }}
          />
        )}

        <div style={styles.content}>
          <h2 style={styles.eventTitle}>{event.name}</h2>

          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📅</span>
              <span>{formatEventTime()}</span>
            </div>

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📍</span>
              <div>
                <div style={styles.venueName}>{event.venue?.name}</div>
                <div style={styles.venueAddress}>{event.venue?.address}</div>
              </div>
            </div>

            {event.priceRange && (
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>💰</span>
                <span>${event.priceRange.min} - ${event.priceRange.max}</span>
              </div>
            )}

            {event.isFree && (
              <div style={styles.freeBadge}>FREE EVENT</div>
            )}
          </div>

          {event.description && (
            <div style={styles.description}>
              <h3 style={styles.sectionTitle}>About This Event</h3>
              <p style={styles.descriptionText}>{event.description}</p>
            </div>
          )}

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ticketsButton}
          >
            Get Tickets on {event.source === 'ticketmaster' ? 'Ticketmaster' : 'Eventbrite'}
          </a>

          {/* Restaurant Pairing Section */}
          <div style={styles.nearbyDining}>
            <h3 style={styles.sectionTitle}>Dine Nearby Before or After</h3>

            {loadingRestaurants ? (
              <div style={styles.loadingRestaurants}>
                <div style={styles.spinnerSmall}></div>
              </div>
            ) : nearbyRestaurants.length > 0 ? (
              <div style={styles.restaurantList}>
                {nearbyRestaurants.map(restaurant => (
                  <div key={restaurant.id} style={styles.restaurantCard}>
                    <span style={styles.restaurantEmoji}>{restaurant.image}</span>
                    <div style={styles.restaurantInfo}>
                      <h4 style={styles.restaurantName}>{restaurant.name}</h4>
                      <p style={styles.restaurantCuisine}>{restaurant.cuisine}</p>
                      <p style={styles.restaurantDistance}>
                        {restaurant.distance?.toFixed(1)} miles away
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noRestaurants}>No nearby restaurants found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'linear-gradient(170deg, #2D0A0A 0%, #1a0a0a 100%)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid rgba(212,175,55,0.3)',
    color: '#D4AF37',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: '250px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  content: {
    padding: '32px',
  },
  eventTitle: {
    margin: '0 0 24px 0',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    color: '#F5E6D3',
    fontFamily: "'Playfair Display', Georgia, serif",
    lineHeight: 1.3,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    color: 'rgba(245,230,211,0.7)',
    fontFamily: "'Georgia', serif",
  },
  metaIcon: {
    fontSize: '18px',
    flexShrink: 0,
    marginTop: '2px',
  },
  venueName: {
    color: '#F5E6D3',
    fontWeight: 600,
  },
  venueAddress: {
    fontSize: '14px',
    color: 'rgba(245,230,211,0.5)',
    marginTop: '2px',
  },
  freeBadge: {
    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    display: 'inline-block',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '1px',
  },
  description: {
    marginBottom: '24px',
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    color: '#D4AF37',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  descriptionText: {
    color: 'rgba(245,230,211,0.65)',
    lineHeight: 1.7,
    fontFamily: "'Georgia', serif",
    margin: 0,
  },
  ticketsButton: {
    display: 'block',
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    color: '#1a0a0a',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    textDecoration: 'none',
    marginBottom: '32px',
    fontFamily: "'Playfair Display', Georgia, serif",
    transition: 'all 0.2s',
  },
  nearbyDining: {
    paddingTop: '24px',
    borderTop: '1px solid rgba(212,175,55,0.1)',
  },
  loadingRestaurants: {
    textAlign: 'center',
    padding: '20px',
  },
  spinnerSmall: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(212,175,55,0.2)',
    borderTop: '2px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  restaurantList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  restaurantCard: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  restaurantEmoji: {
    fontSize: '32px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(212,175,55,0.1)',
    borderRadius: '8px',
    flexShrink: 0,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    color: '#F5E6D3',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  restaurantCuisine: {
    color: 'rgba(212,175,55,0.7)',
    fontSize: '13px',
    margin: '0 0 4px 0',
    fontFamily: "'Georgia', serif",
  },
  restaurantDistance: {
    color: 'rgba(245,230,211,0.4)',
    fontSize: '12px',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  noRestaurants: {
    color: 'rgba(245,230,211,0.5)',
    fontFamily: "'Georgia', serif",
    textAlign: 'center',
    padding: '20px',
  },
};

export default EventModal;
