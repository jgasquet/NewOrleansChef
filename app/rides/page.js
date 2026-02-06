'use client';

import React, { useState, useEffect } from 'react';
import RideshareComparison from '@/components/RideshareComparison';

const RidesPage = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            address: 'Current Location'
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Default to French Quarter
          setUserLocation({
            coordinates: {
              latitude: 29.9584,
              longitude: -90.0644
            },
            address: 'French Quarter, New Orleans'
          });
        }
      );
    }
  }, []);

  // Demo destination - Commander's Palace
  const defaultDestination = {
    coordinates: {
      latitude: 29.9291,
      longitude: -90.0871
    },
    address: "Commander's Palace, Garden District"
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Compare Rides</h1>
        <p style={styles.headerSubtitle}>Find the best ride to your destination</p>
      </header>

      <div style={styles.container}>
        <RideshareComparison
          pickupLocation={userLocation}
          dropoffLocation={defaultDestination}
          groupSize={1}
        />

        {/* Popular Destinations */}
        <div style={styles.popularSection}>
          <h3 style={styles.sectionTitle}>Popular Destinations</h3>
          <div style={styles.destinationGrid}>
            {[
              { name: "Commander's Palace", neighborhood: "Garden District", emoji: "🏛️" },
              { name: "Cafe Du Monde", neighborhood: "French Quarter", emoji: "☕" },
              { name: "Superdome", neighborhood: "CBD", emoji: "🏟️" },
              { name: "City Park", neighborhood: "Mid-City", emoji: "🌳" },
            ].map((dest, idx) => (
              <button key={idx} style={styles.destinationCard}>
                <span style={styles.destinationEmoji}>{dest.emoji}</span>
                <div>
                  <div style={styles.destinationName}>{dest.name}</div>
                  <div style={styles.destinationNeighborhood}>{dest.neighborhood}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div style={styles.tipsSection}>
          <h3 style={styles.sectionTitle}>Rideshare Tips</h3>
          <div style={styles.tipsList}>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>💡</span>
              <div>
                <div style={styles.tipTitle}>Compare before booking</div>
                <div style={styles.tipText}>Prices can vary 20-40% between providers</div>
              </div>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>⏰</span>
              <div>
                <div style={styles.tipTitle}>Avoid surge pricing</div>
                <div style={styles.tipText}>Wait 10-15 min or walk a block to escape surge zones</div>
              </div>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>👥</span>
              <div>
                <div style={styles.tipTitle}>Split with friends</div>
                <div style={styles.tipText}>Share rides to events and split the cost</div>
              </div>
            </div>
          </div>
        </div>
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
    textAlign: 'center',
    padding: '32px 20px 24px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  headerTitle: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 400,
    margin: '0 0 8px',
    background: 'linear-gradient(180deg, #FFE8A0 0%, #D4AF37 40%, #B8941F 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerSubtitle: {
    fontSize: '0.9rem',
    color: 'rgba(245,230,211,0.5)',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px 20px',
  },
  popularSection: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#D4AF37',
    margin: '0 0 16px',
    fontFamily: "'Georgia', serif",
  },
  destinationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  destinationCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(45,20,20,0.5)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  destinationEmoji: {
    fontSize: '28px',
  },
  destinationName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#F5E6D3',
  },
  destinationNeighborhood: {
    fontSize: '12px',
    color: 'rgba(212,175,55,0.6)',
    fontFamily: "'Georgia', serif",
  },
  tipsSection: {
    marginTop: '32px',
    padding: '24px',
    background: 'rgba(45,20,20,0.5)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tipItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#F5E6D3',
    marginBottom: '4px',
  },
  tipText: {
    fontSize: '13px',
    color: 'rgba(245,230,211,0.5)',
    fontFamily: "'Georgia', serif",
    lineHeight: 1.4,
  },
};

export default RidesPage;
