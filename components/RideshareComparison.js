'use client';

import React, { useState, useEffect } from 'react';

const RideshareComparison = ({
  pickupLocation = null,
  dropoffLocation = null,
  eventDetails = null,
  groupSize = 1
}) => {
  const [pickup, setPickup] = useState(pickupLocation);
  const [dropoff, setDropoff] = useState(dropoffLocation);
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    wheelchair: false,
    carSeat: false,
    luxury: false,
    shared: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Auto-fetch rides when locations are set
  useEffect(() => {
    if (pickup && dropoff) {
      fetchRideOptions();
    }
  }, [pickup, dropoff, filters]);

  // Demo data for development
  const fetchRideOptions = async () => {
    setLoading(true);
    try {
      // Demo ride options - replace with real API call
      const demoRides = [
        {
          provider: 'uber',
          name: 'Uber',
          type: 'UberX',
          price: 18.50,
          eta: 4,
          capacity: 4,
          productId: 'uberx',
          features: [],
          savingsPercent: 0,
          surgeMultiplier: 1,
          webBookingUrl: 'https://m.uber.com'
        },
        {
          provider: 'uber',
          name: 'Uber',
          type: 'Uber Comfort',
          price: 24.00,
          eta: 6,
          capacity: 4,
          productId: 'comfort',
          features: ['luxury'],
          savingsPercent: 0,
          surgeMultiplier: 1,
          webBookingUrl: 'https://m.uber.com'
        },
        {
          provider: 'uber',
          name: 'Uber',
          type: 'UberXL',
          price: 32.00,
          eta: 8,
          capacity: 6,
          productId: 'uberxl',
          features: [],
          savingsPercent: 0,
          surgeMultiplier: 1,
          webBookingUrl: 'https://m.uber.com'
        },
        {
          provider: 'lyft',
          name: 'Lyft',
          type: 'Lyft',
          price: 17.25,
          eta: 3,
          capacity: 4,
          rideTypeId: 'lyft',
          features: [],
          savingsPercent: 7,
          surgeMultiplier: 1,
          webBookingUrl: 'https://www.lyft.com'
        },
        {
          provider: 'lyft',
          name: 'Lyft',
          type: 'Lyft XL',
          price: 29.50,
          eta: 7,
          capacity: 6,
          rideTypeId: 'lyft_xl',
          features: [],
          savingsPercent: 8,
          surgeMultiplier: 1,
          webBookingUrl: 'https://www.lyft.com'
        },
        {
          provider: 'lyft',
          name: 'Lyft',
          type: 'Lyft Lux',
          price: 45.00,
          eta: 12,
          capacity: 4,
          rideTypeId: 'lyft_lux',
          features: ['luxury'],
          savingsPercent: 0,
          surgeMultiplier: 1.2,
          webBookingUrl: 'https://www.lyft.com'
        },
        {
          provider: 'via',
          name: 'Via',
          type: 'Shared Ride',
          price: 8.50,
          eta: 10,
          capacity: 2,
          features: ['shared'],
          savingsPercent: 54,
          surgeMultiplier: 1,
          webBookingUrl: 'https://ridewithvia.com'
        },
        {
          provider: 'curb',
          name: 'Curb',
          type: 'Taxi',
          price: 22.00,
          eta: 5,
          capacity: 4,
          features: ['wheelchair'],
          savingsPercent: 0,
          surgeMultiplier: 1,
          webBookingUrl: 'https://gocurb.com'
        }
      ];

      // Apply filters
      let filteredRides = demoRides;
      if (filters.wheelchair) {
        filteredRides = filteredRides.filter(r => r.features?.includes('wheelchair'));
      }
      if (filters.luxury) {
        filteredRides = filteredRides.filter(r => r.features?.includes('luxury'));
      }
      if (filters.shared) {
        filteredRides = filteredRides.filter(r => r.features?.includes('shared'));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setRideOptions(filteredRides);
    } catch (error) {
      console.error('Rideshare fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (ride) => {
    // Generate deep link based on provider
    let bookingUrl = ride.webBookingUrl;

    if (pickup && dropoff) {
      switch(ride.provider.toLowerCase()) {
        case 'uber':
          bookingUrl = generateUberWebLink(ride);
          break;
        case 'lyft':
          bookingUrl = generateLyftWebLink(ride);
          break;
        default:
          bookingUrl = ride.webBookingUrl;
      }
    }

    window.open(bookingUrl, '_blank');
  };

  const generateUberWebLink = (ride) => {
    const params = new URLSearchParams({
      action: 'setPickup',
      pickup_latitude: pickup.coordinates?.latitude || 29.9511,
      pickup_longitude: pickup.coordinates?.longitude || -90.0715,
      dropoff_latitude: dropoff.coordinates?.latitude || 29.9291,
      dropoff_longitude: dropoff.coordinates?.longitude || -90.0871,
    });
    return `https://m.uber.com/ul/?${params.toString()}`;
  };

  const generateLyftWebLink = (ride) => {
    const params = new URLSearchParams({
      pickup_latitude: pickup.coordinates?.latitude || 29.9511,
      pickup_longitude: pickup.coordinates?.longitude || -90.0715,
      destination_latitude: dropoff.coordinates?.latitude || 29.9291,
      destination_longitude: dropoff.coordinates?.longitude || -90.0871,
    });
    return `https://www.lyft.com/ride?${params.toString()}`;
  };

  const getSortedRides = () => {
    const sorted = [...rideOptions];
    if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else {
      sorted.sort((a, b) => a.eta - b.eta);
    }
    return sorted;
  };

  const getProviderIcon = (provider) => {
    const icons = {
      'uber': '🚗',
      'lyft': '🚙',
      'via': '🚐',
      'waymo': '🤖',
      'curb': '🚕'
    };
    return icons[provider.toLowerCase()] || '🚗';
  };

  const toggleFilter = (filterKey) => {
    setFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Compare Rides</h2>
        {eventDetails && (
          <span style={styles.eventLabel}>
            For: {eventDetails.name}
          </span>
        )}
      </div>

      {/* Location Inputs */}
      <div style={styles.locationContainer}>
        <div style={styles.inputWrapper}>
          <span style={styles.locationIcon}>📍</span>
          <input
            style={styles.input}
            placeholder="Pickup location"
            value={pickup?.address || ''}
            onChange={(e) => setPickup({ address: e.target.value, coordinates: pickup?.coordinates })}
            readOnly={!!pickupLocation}
          />
        </div>

        <div style={styles.inputWrapper}>
          <span style={styles.locationIconRed}>📍</span>
          <input
            style={styles.input}
            placeholder="Drop-off location"
            value={dropoff?.address || ''}
            onChange={(e) => setDropoff({ address: e.target.value, coordinates: dropoff?.coordinates })}
            readOnly={!!dropoffLocation}
          />
        </div>

        {groupSize > 1 && (
          <div style={styles.groupSizeInfo}>
            <span>👥</span>
            <span style={styles.groupSizeText}>
              Group of {groupSize}
            </span>
          </div>
        )}
      </div>

      {/* Sort and Filter Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.sortButtons}>
          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'price' ? styles.sortButtonActive : {})
            }}
            onClick={() => setSortBy('price')}
          >
            <span>💰</span>
            <span style={{
              ...styles.sortButtonText,
              ...(sortBy === 'price' ? styles.sortButtonTextActive : {})
            }}>
              Price
            </span>
          </button>

          <button
            style={{
              ...styles.sortButton,
              ...(sortBy === 'time' ? styles.sortButtonActive : {})
            }}
            onClick={() => setSortBy('time')}
          >
            <span>⏱️</span>
            <span style={{
              ...styles.sortButtonText,
              ...(sortBy === 'time' ? styles.sortButtonTextActive : {})
            }}>
              Time
            </span>
          </button>
        </div>

        <button
          style={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>⚙️</span>
          {Object.values(filters).some(f => f) && (
            <span style={styles.filterBadge}></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <button
            style={{
              ...styles.filterChip,
              ...(filters.wheelchair ? styles.filterChipActive : {})
            }}
            onClick={() => toggleFilter('wheelchair')}
          >
            <span>♿</span>
            <span style={{
              ...styles.filterChipText,
              ...(filters.wheelchair ? styles.filterChipTextActive : {})
            }}>
              Wheelchair
            </span>
          </button>

          <button
            style={{
              ...styles.filterChip,
              ...(filters.carSeat ? styles.filterChipActive : {})
            }}
            onClick={() => toggleFilter('carSeat')}
          >
            <span>🚗</span>
            <span style={{
              ...styles.filterChipText,
              ...(filters.carSeat ? styles.filterChipTextActive : {})
            }}>
              Car Seat
            </span>
          </button>

          <button
            style={{
              ...styles.filterChip,
              ...(filters.luxury ? styles.filterChipActive : {})
            }}
            onClick={() => toggleFilter('luxury')}
          >
            <span>⭐</span>
            <span style={{
              ...styles.filterChipText,
              ...(filters.luxury ? styles.filterChipTextActive : {})
            }}>
              Luxury
            </span>
          </button>

          <button
            style={{
              ...styles.filterChip,
              ...(filters.shared ? styles.filterChipActive : {})
            }}
            onClick={() => toggleFilter('shared')}
          >
            <span>👥</span>
            <span style={{
              ...styles.filterChipText,
              ...(filters.shared ? styles.filterChipTextActive : {})
            }}>
              Shared
            </span>
          </button>
        </div>
      )}

      {/* Ride Options List */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <span style={styles.loadingText}>Finding best rides...</span>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : rideOptions.length > 0 ? (
        <>
          <div style={styles.savingsHeader}>
            <span style={styles.savingsHeaderText}>
              💰 Comparing {rideOptions.length} ride options
            </span>
          </div>
          <div style={styles.listContainer}>
            {getSortedRides().map((item, index) => (
              <button
                key={`${item.provider}-${item.type}-${index}`}
                style={styles.rideCard}
                onClick={() => handleBookRide(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.rideHeader}>
                  <div style={styles.providerInfo}>
                    <div style={styles.providerLogo}>
                      <span style={styles.providerIcon}>{getProviderIcon(item.provider)}</span>
                    </div>
                    <div>
                      <div style={styles.rideName}>{item.name}</div>
                      <div style={styles.rideType}>{item.type}</div>
                    </div>
                  </div>
                  <div style={styles.priceInfo}>
                    <div style={styles.price}>${item.price.toFixed(2)}</div>
                    <div style={styles.eta}>{item.eta} min</div>
                  </div>
                </div>

                <div style={styles.rideDetails}>
                  <div style={styles.detailItem}>
                    <span>👥</span>
                    <span style={styles.detailText}>{item.capacity} seats</span>
                  </div>

                  {item.features?.includes('wheelchair') && (
                    <div style={styles.detailItem}>
                      <span>♿</span>
                      <span style={styles.detailText}>Accessible</span>
                    </div>
                  )}

                  {item.features?.includes('luxury') && (
                    <div style={styles.detailItem}>
                      <span>⭐</span>
                      <span style={styles.detailText}>Luxury</span>
                    </div>
                  )}

                  {item.savingsPercent > 0 && (
                    <div style={styles.savingsBadge}>
                      <span style={styles.savingsText}>Save {item.savingsPercent}%</span>
                    </div>
                  )}
                </div>

                {item.surgeMultiplier > 1 && (
                  <div style={styles.surgeNotice}>
                    <span>📈</span>
                    <span style={styles.surgeText}>
                      {item.surgeMultiplier}x surge pricing
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.emptyContainer}>
          <span style={{ fontSize: '48px', opacity: 0.5 }}>🚗</span>
          <span style={styles.emptyText}>
            Enter pickup and drop-off locations to compare rides
          </span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(45,20,20,0.5)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#D4AF37',
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  eventLabel: {
    fontSize: '13px',
    color: 'rgba(212,175,55,0.7)',
    marginTop: '4px',
    display: 'block',
    fontFamily: "'Georgia', serif",
  },
  locationContainer: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    gap: '8px',
  },
  locationIcon: {
    fontSize: '16px',
  },
  locationIconRed: {
    fontSize: '16px',
    filter: 'hue-rotate(180deg)',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#F5E6D3',
    fontFamily: "'Georgia', serif",
  },
  groupSizeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  groupSizeText: {
    fontSize: '13px',
    color: 'rgba(245,230,211,0.6)',
    fontFamily: "'Georgia', serif",
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  sortButtons: {
    display: 'flex',
    gap: '8px',
  },
  sortButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sortButtonActive: {
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    border: '1px solid #D4AF37',
  },
  sortButtonText: {
    fontSize: '13px',
    color: 'rgba(245,230,211,0.6)',
    fontFamily: "'Georgia', serif",
  },
  sortButtonTextActive: {
    color: '#1a0a0a',
    fontWeight: 600,
  },
  filterButton: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    fontSize: '18px',
  },
  filterBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#C41E3A',
  },
  filtersPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '16px',
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterChipActive: {
    background: 'rgba(212,175,55,0.15)',
    borderColor: '#D4AF37',
  },
  filterChipText: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.5)',
    fontFamily: "'Georgia', serif",
  },
  filterChipTextActive: {
    color: '#D4AF37',
    fontWeight: 600,
  },
  savingsHeader: {
    padding: '10px 20px',
    background: 'rgba(212,175,55,0.08)',
  },
  savingsHeaderText: {
    fontSize: '13px',
    color: '#D4AF37',
    fontWeight: 500,
    fontFamily: "'Georgia', serif",
  },
  listContainer: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rideCard: {
    background: 'rgba(30,15,15,0.8)',
    border: '1px solid rgba(212,175,55,0.1)',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'left',
    width: '100%',
  },
  rideHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  providerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  providerLogo: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    background: 'rgba(212,175,55,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerIcon: {
    fontSize: '24px',
  },
  rideName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#F5E6D3',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  rideType: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.5)',
    marginTop: '2px',
    fontFamily: "'Georgia', serif",
  },
  priceInfo: {
    textAlign: 'right',
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  eta: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.5)',
    marginTop: '2px',
    fontFamily: "'Georgia', serif",
  },
  rideDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  detailText: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.5)',
    fontFamily: "'Georgia', serif",
  },
  savingsBadge: {
    background: 'rgba(34,197,94,0.15)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  savingsText: {
    fontSize: '11px',
    color: '#22C55E',
    fontWeight: 600,
  },
  surgeNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
    padding: '8px',
    background: 'rgba(255,107,53,0.1)',
    borderRadius: '4px',
  },
  surgeText: {
    fontSize: '11px',
    color: '#FF6B35',
    fontWeight: 500,
    fontFamily: "'Georgia', serif",
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(212,175,55,0.2)',
    borderTop: '3px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '14px',
    color: 'rgba(245,230,211,0.5)',
    fontFamily: "'Georgia', serif",
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    gap: '12px',
  },
  emptyText: {
    fontSize: '14px',
    color: 'rgba(245,230,211,0.4)',
    textAlign: 'center',
    fontFamily: "'Georgia', serif",
  },
};

export default RideshareComparison;
