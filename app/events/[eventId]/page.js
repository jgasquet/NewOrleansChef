'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatService from '@/lib/services/ChatService';

// Demo event data - in production this would come from an API
const DEMO_EVENTS = {
  'evt-1': {
    id: 'evt-1',
    title: 'Jazz Brunch at Commander\'s Palace',
    description: 'Join us for a legendary New Orleans jazz brunch experience at the iconic Commander\'s Palace. Enjoy live jazz, turtle soup, and the famous bread pudding soufflé.',
    date: 'Sunday, March 15, 2025',
    time: '11:00 AM - 2:00 PM',
    location: 'Commander\'s Palace, Garden District',
    image: '🎷',
    price: '$75 per person',
    attendees: 24,
    maxAttendees: 30,
  },
  'evt-2': {
    id: 'evt-2',
    title: 'French Quarter Food Tour',
    description: 'Explore the culinary treasures of the French Quarter. We\'ll visit 5 iconic spots including Cafe Du Monde, Central Grocery, and hidden local gems.',
    date: 'Saturday, March 21, 2025',
    time: '10:00 AM - 1:00 PM',
    location: 'Meeting at Jackson Square',
    image: '🥐',
    price: '$55 per person',
    attendees: 12,
    maxAttendees: 15,
  },
  'evt-3': {
    id: 'evt-3',
    title: 'Crawfish Boil in City Park',
    description: 'Annual spring crawfish boil! We\'re bringing 200 pounds of fresh Louisiana crawfish, corn, potatoes, and all the fixings. BYOB welcome.',
    date: 'Saturday, April 4, 2025',
    time: '2:00 PM - 6:00 PM',
    location: 'City Park Pavilion',
    image: '🦞',
    price: '$35 per person',
    attendees: 45,
    maxAttendees: 60,
  }
};

const EventDetailScreen = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  // Demo user - replace with real auth
  const userId = 'demo-user';
  const userName = 'Demo User';

  const [event, setEvent] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load event data
    const eventData = DEMO_EVENTS[eventId] || {
      id: eventId,
      title: 'Event Details',
      description: 'Event information loading...',
      date: 'TBD',
      time: 'TBD',
      location: 'TBD',
      image: '🍽️',
      price: 'Free',
      attendees: 0,
      maxAttendees: 50,
    };
    setEvent(eventData);
    loadChatRoom();
  }, [eventId]);

  const loadChatRoom = async () => {
    try {
      const room = await ChatService.getChatRoom(eventId);
      setChatRoom(room);

      if (room && room.participants?.includes(userId)) {
        setHasJoined(true);
      }
    } catch (error) {
      console.error('Error loading chat room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChat = async () => {
    try {
      if (!chatRoom) {
        // Create chat room if it doesn't exist
        await ChatService.createEventChatRoom(
          eventId,
          event.title,
          userId,
          userName
        );
      } else if (!hasJoined) {
        // Add user to existing chat room
        await ChatService.addParticipantToChatRoom(
          eventId,
          userId,
          userName
        );
      }

      // Navigate to chat
      router.push(`/chat/${eventId}`);
    } catch (error) {
      console.error('Error joining chat:', error);
    }
  };

  const handleShareRestaurant = async (restaurant) => {
    try {
      // Ensure user is in chat room
      if (!hasJoined) {
        await handleJoinChat();
        return;
      }

      // Share restaurant in chat
      await ChatService.shareRestaurant(
        eventId,
        userId,
        userName,
        restaurant
      );

      // Navigate to chat to see the shared restaurant
      router.push(`/chat/${eventId}`);
    } catch (error) {
      console.error('Error sharing restaurant:', error);
    }
  };

  if (loading || !event) {
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
        <span style={styles.headerTitle}>Event Details</span>
        <div style={{ width: '60px' }} />
      </header>

      <div style={styles.container}>
        {/* Event Image/Icon */}
        <div style={styles.eventImageContainer}>
          <span style={styles.eventEmoji}>{event.image}</span>
        </div>

        {/* Event Info */}
        <div style={styles.eventInfo}>
          <h1 style={styles.eventTitle}>{event.title}</h1>

          <div style={styles.eventMeta}>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📅</span>
              <span style={styles.metaText}>{event.date}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>🕐</span>
              <span style={styles.metaText}>{event.time}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📍</span>
              <span style={styles.metaText}>{event.location}</span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>💰</span>
              <span style={styles.metaText}>{event.price}</span>
            </div>
          </div>

          <div style={styles.attendeeInfo}>
            <span style={styles.attendeeText}>
              👥 {event.attendees} / {event.maxAttendees} attending
            </span>
            <div style={styles.attendeeBar}>
              <div
                style={{
                  ...styles.attendeeProgress,
                  width: `${(event.attendees / event.maxAttendees) * 100}%`
                }}
              />
            </div>
          </div>

          <p style={styles.eventDescription}>{event.description}</p>
        </div>

        {/* Chat Button */}
        <button
          style={styles.chatButton}
          onClick={handleJoinChat}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(196,30,58,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(196,30,58,0.3)';
          }}
        >
          <span style={styles.chatButtonIcon}>💬</span>
          <span style={styles.chatButtonText}>
            {hasJoined ? 'Open Group Chat' : 'Join Event Chat'}
          </span>
          {chatRoom && (
            <span style={styles.participantBadge}>
              {chatRoom.participants?.length || 0}
            </span>
          )}
        </button>

        {/* Share Restaurant Button */}
        <button
          style={styles.shareButton}
          onClick={() => handleShareRestaurant({
            name: "Antoine's Restaurant",
            address: "713 St Louis St, New Orleans, LA",
            cuisine: "Creole",
            rating: 4.5,
            image: "https://example.com/image.jpg"
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <span style={styles.shareButtonIcon}>🍽️</span>
          <span style={styles.shareButtonText}>Share a Restaurant</span>
        </button>

        {/* RSVP Button */}
        <button
          style={styles.rsvpButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,175,55,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,175,55,0.3)';
          }}
        >
          RSVP Now
        </button>
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px 20px',
  },
  eventImageContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    background: 'rgba(212,175,55,0.1)',
    border: '2px solid rgba(212,175,55,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  eventEmoji: {
    fontSize: '48px',
  },
  eventInfo: {
    marginBottom: '32px',
  },
  eventTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 400,
    margin: '0 0 20px',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #FFE8A0 0%, #D4AF37 40%, #B8941F 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  eventMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    padding: '20px',
    background: 'rgba(45,20,20,0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(212,175,55,0.1)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  metaIcon: {
    fontSize: '18px',
  },
  metaText: {
    fontSize: '0.95rem',
    color: '#F5E6D3',
    fontFamily: "'Georgia', serif",
  },
  attendeeInfo: {
    marginBottom: '20px',
    padding: '16px 20px',
    background: 'rgba(34,197,94,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(34,197,94,0.15)',
  },
  attendeeText: {
    fontSize: '0.9rem',
    color: 'rgba(245,230,211,0.7)',
    fontFamily: "'Georgia', serif",
    marginBottom: '8px',
    display: 'block',
  },
  attendeeBar: {
    height: '6px',
    background: 'rgba(34,197,94,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  attendeeProgress: {
    height: '100%',
    background: 'linear-gradient(90deg, #22C55E, #16A34A)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  eventDescription: {
    fontSize: '1rem',
    color: 'rgba(245,230,211,0.65)',
    lineHeight: 1.7,
    fontFamily: "'Georgia', serif",
    margin: 0,
  },
  chatButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #C41E3A, #8B1428)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(196,30,58,0.3)',
  },
  chatButtonIcon: {
    fontSize: '20px',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  participantBadge: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '4px 10px',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  shareButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px 24px',
    background: 'transparent',
    border: '2px solid rgba(212,175,55,0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'all 0.2s ease',
  },
  shareButtonIcon: {
    fontSize: '18px',
  },
  shareButtonText: {
    color: '#D4AF37',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  rsvpButton: {
    width: '100%',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #FFE8A0, #D4AF37, #B8941F)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#1a0a0a',
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
    letterSpacing: '2px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
  },
};

export default EventDetailScreen;
