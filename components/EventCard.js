'use client';

import React from 'react';

const EventCard = ({ event, onViewDetails, showDistance = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getSourceBadge = (source) => {
    return source === 'ticketmaster' ? 'TM' : 'EB';
  };

  return (
    <div style={styles.card}>
      {event.images?.[0] && (
        <div
          style={{
            ...styles.imageContainer,
            backgroundImage: `url(${event.images[0]})`
          }}
        >
          <span style={styles.sourceBadge}>{getSourceBadge(event.source)}</span>
          {event.isFree && <span style={styles.freeBadge}>FREE</span>}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.date}>
          {formatDate(event.startDate)}
        </div>

        <h3 style={styles.title}>{event.name}</h3>

        <div style={styles.venue}>
          <span style={styles.venueIcon}>📍</span>
          <span style={styles.venueName}>{event.venue?.name || 'Venue TBA'}</span>
        </div>

        {event.priceRange && (
          <div style={styles.price}>
            ${event.priceRange.min} - ${event.priceRange.max}
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={styles.detailsButton}
            onClick={() => onViewDetails?.(event)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            View Details
          </button>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ticketsButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(45,20,20,0.6)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  imageContainer: {
    height: '160px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '12px',
  },
  sourceBadge: {
    background: 'rgba(0,0,0,0.7)',
    color: '#D4AF37',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1px',
  },
  freeBadge: {
    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1px',
  },
  content: {
    padding: '16px',
  },
  date: {
    fontSize: '12px',
    color: '#D4AF37',
    marginBottom: '8px',
    fontFamily: "'Georgia', serif",
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#F5E6D3',
    margin: '0 0 12px',
    lineHeight: 1.3,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  venue: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  venueIcon: {
    fontSize: '14px',
  },
  venueName: {
    fontSize: '13px',
    color: 'rgba(245,230,211,0.6)',
    fontFamily: "'Georgia', serif",
  },
  price: {
    fontSize: '14px',
    color: 'rgba(212,175,55,0.8)',
    marginBottom: '16px',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  detailsButton: {
    flex: 1,
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid rgba(212,175,55,0.3)',
    borderRadius: '8px',
    color: '#D4AF37',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Georgia', serif",
  },
  ticketsButton: {
    flex: 1,
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    border: 'none',
    borderRadius: '8px',
    color: '#1a0a0a',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s',
    fontFamily: "'Georgia', serif",
  },
};

export default EventCard;
