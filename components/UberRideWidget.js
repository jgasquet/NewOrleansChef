'use client';

import React, { useState, useEffect } from 'react';
import { uberService } from '@/lib/services/uberService';

const UberRideWidget = ({
  destinationLat,
  destinationLng,
  destinationName,
  userLat,
  userLng
}) => {
  const [estimates, setEstimates] = useState([]);
  const [timeEstimates, setTimeEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEstimates();
  }, [userLat, userLng, destinationLat, destinationLng]);

  const loadEstimates = async () => {
    if (!userLat || !userLng) {
      setError('Enable location to see ride estimates');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [prices, times] = await Promise.all([
        uberService.getRideEstimates(userLat, userLng, destinationLat, destinationLng),
        uberService.getTimeEstimates(userLat, userLng)
      ]);

      setEstimates(prices);
      setTimeEstimates(times);
      setError(null);
    } catch (err) {
      setError('Unable to load ride estimates');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = () => {
    const deepLink = uberService.generateDeepLink(
      userLat, userLng,
      destinationLat, destinationLng,
      destinationName
    );

    const webLink = uberService.generateWebLink(
      userLat, userLng,
      destinationLat, destinationLng
    );

    // Try deep link first, fallback to web
    window.location.href = deepLink;
    setTimeout(() => {
      window.location.href = webLink;
    }, 500);
  };

  if (loading) {
    return (
      <div style={styles.widget}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading ride estimates...</p>
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

  if (error) {
    return (
      <div style={styles.widget}>
        <div style={styles.errorContent}>
          <span style={styles.errorIcon}>📍</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.widget}>
      <div style={styles.header}>
        <span style={styles.uberLogo}>🚗</span>
        <h3 style={styles.headerTitle}>Get a Ride to {destinationName}</h3>
      </div>

      <div style={styles.estimatesContainer}>
        {estimates.slice(0, 3).map((estimate, index) => {
          const timeEst = timeEstimates.find(t => t.product_id === estimate.product_id);

          return (
            <div key={estimate.product_id || index} style={styles.estimateCard}>
              <div style={styles.estimateType}>
                <span style={styles.productName}>{estimate.display_name}</span>
                {timeEst && (
                  <span style={styles.eta}>{Math.ceil(timeEst.estimate / 60)} min away</span>
                )}
              </div>
              <div style={styles.estimateDetails}>
                <span style={styles.duration}>{Math.round(estimate.duration / 60)} min ride</span>
                <span style={styles.price}>{estimate.estimate}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        style={styles.requestButton}
        onClick={handleRequestRide}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#000';
        }}
      >
        Request Uber
      </button>

      <p style={styles.disclaimer}>
        Opens Uber app or mobile site
      </p>
    </div>
  );
};

const styles = {
  widget: {
    background: 'rgba(45,20,20,0.6)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  uberLogo: {
    fontSize: '32px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#F5E6D3',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  estimatesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  estimateCard: {
    padding: '12px',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '8px',
    background: 'rgba(212,175,55,0.05)',
  },
  estimateType: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  productName: {
    fontWeight: 600,
    color: '#F5E6D3',
    fontSize: '14px',
  },
  eta: {
    fontSize: '13px',
    color: 'rgba(212,175,55,0.7)',
    fontFamily: "'Georgia', serif",
  },
  estimateDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'rgba(245,230,211,0.6)',
    fontFamily: "'Georgia', serif",
  },
  duration: {},
  price: {
    fontWeight: 600,
    color: '#D4AF37',
  },
  requestButton: {
    width: '100%',
    padding: '14px',
    background: '#000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(245,230,211,0.4)',
    margin: '8px 0 0 0',
    fontFamily: "'Georgia', serif",
  },
  loadingContent: {
    textAlign: 'center',
    padding: '20px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(212,175,55,0.2)',
    borderTop: '3px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 12px',
  },
  loadingText: {
    color: 'rgba(245,230,211,0.6)',
    fontSize: '14px',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  errorContent: {
    textAlign: 'center',
    padding: '20px',
  },
  errorIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  errorText: {
    color: 'rgba(245,230,211,0.6)',
    fontSize: '14px',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
};

export default UberRideWidget;
