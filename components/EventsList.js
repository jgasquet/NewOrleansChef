'use client';

import React, { useState, useEffect } from 'react';
import { eventService } from '@/lib/services/eventService';
import EventCard from './EventCard';
import EventModal from './EventModal';

const EventsList = ({
  maxEvents = 10,
  nearVenue = null, // { lat, lng } for venue-specific events
  title = "Upcoming Food & Wine Events"
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateFilter, setDateFilter] = useState('week');

  useEffect(() => {
    loadEvents();
  }, [dateFilter, nearVenue]);

  const loadEvents = async () => {
    setLoading(true);

    try {
      let eventData;

      if (nearVenue) {
        eventData = await eventService.getEventsNearVenue(
          nearVenue.lat,
          nearVenue.lng,
          getStartDate()
        );
      } else {
        eventData = await eventService.getCulinaryEvents({
          startDate: getStartDate(),
          endDate: getEndDate(),
          maxResults: maxEvents
        });
      }

      setEvents(eventData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    return new Date().toISOString();
  };

  const getEndDate = () => {
    const date = new Date();
    switch(dateFilter) {
      case 'today':
        date.setHours(23, 59, 59);
        break;
      case 'week':
        date.setDate(date.getDate() + 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 3);
    }
    return date.toISOString();
  };

  const filterButtons = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Upcoming' }
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Finding culinary events...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{title}</h2>

        <div style={styles.filters}>
          {filterButtons.map(btn => (
            <button
              key={btn.key}
              style={{
                ...styles.filterButton,
                ...(dateFilter === btn.key ? styles.filterButtonActive : {})
              }}
              onClick={() => setDateFilter(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div style={styles.noEvents}>
          <span style={styles.noEventsIcon}>🎭</span>
          <p style={styles.noEventsText}>No culinary events found for this time period.</p>
          <p style={styles.noEventsSubtext}>Check back soon or adjust your date range.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {events.map(event => (
            <EventCard
              key={`${event.source}-${event.id}`}
              event={event}
              onViewDetails={setSelectedEvent}
            />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    background: 'linear-gradient(180deg, #FFE8A0 0%, #D4AF37 40%, #B8941F 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '8px 16px',
    border: '1px solid rgba(212,175,55,0.3)',
    background: 'transparent',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '13px',
    color: 'rgba(245,230,211,0.7)',
    fontFamily: "'Georgia', serif",
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    color: '#1a0a0a',
    borderColor: '#D4AF37',
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(212,175,55,0.2)',
    borderTop: '3px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  loadingText: {
    color: 'rgba(245,230,211,0.6)',
    fontSize: '14px',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  noEvents: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noEventsIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
    opacity: 0.5,
  },
  noEventsText: {
    color: 'rgba(245,230,211,0.6)',
    fontSize: '16px',
    margin: '0 0 8px',
    fontFamily: "'Georgia', serif",
  },
  noEventsSubtext: {
    color: 'rgba(245,230,211,0.4)',
    fontSize: '14px',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
};

export default EventsList;
