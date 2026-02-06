'use client';

import React, { useState, useEffect } from 'react';

// Mock ChatService for demo - replace with real implementation
const ChatService = {
  subscribeToUserChatRooms: (userId, callback) => {
    // Demo data
    const mockRooms = [
      {
        id: '1',
        eventId: 'evt-1',
        eventTitle: 'Jazz Brunch at Commander\'s Palace',
        lastMessage: 'Can\'t wait for the turtle soup!',
        lastMessageTime: new Date(Date.now() - 5 * 60000),
        participants: ['user1', 'user2', 'user3', 'user4'],
        unreadCount: { [userId]: 3 }
      },
      {
        id: '2',
        eventId: 'evt-2',
        eventTitle: 'French Quarter Food Tour',
        lastMessage: 'Meeting at Cafe Du Monde at 10am',
        lastMessageTime: new Date(Date.now() - 2 * 3600000),
        participants: ['user1', 'user2'],
        unreadCount: { [userId]: 0 }
      },
      {
        id: '3',
        eventId: 'evt-3',
        eventTitle: 'Crawfish Boil in City Park',
        lastMessage: 'I\'m bringing extra hot sauce!',
        lastMessageTime: new Date(Date.now() - 24 * 3600000),
        participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
        unreadCount: { [userId]: 1 }
      },
      {
        id: '4',
        eventId: 'evt-4',
        eventTitle: 'Cooking Class: Gumbo 101',
        lastMessage: null,
        lastMessageTime: null,
        participants: ['user1', 'user2', 'user3'],
        unreadCount: { [userId]: 0 }
      },
    ];

    setTimeout(() => callback(mockRooms), 500);
    return () => {}; // unsubscribe function
  }
};

const ChatListScreen = ({ userId = 'demo-user', userName = 'Demo User' }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = ChatService.subscribeToUserChatRooms(userId, (rooms) => {
      setChatRooms(rooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const openChat = (chatRoom) => {
    // Navigate to chat - for now just log
    console.log('Opening chat:', chatRoom.eventTitle);
    // In a real app: router.push(`/chat/${chatRoom.eventId}`)
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
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

  if (chatRooms.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>💬</div>
          <h2 style={styles.emptyTitle}>No Event Chats</h2>
          <p style={styles.emptyText}>
            Join an event to start chatting with other participants
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Event Chats</h1>
        <p style={styles.headerSubtitle}>Connect with fellow food lovers</p>
      </header>

      <div style={styles.container}>
        <div style={styles.listContainer}>
          {chatRooms.map((item) => {
            const unreadCount = item.unreadCount?.[userId] || 0;

            return (
              <button
                key={item.id}
                style={styles.chatRoomItem}
                onClick={() => openChat(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.chatIcon}>
                  <span style={{ fontSize: '24px' }}>👥</span>
                </div>

                <div style={styles.chatInfo}>
                  <div style={styles.chatHeader}>
                    <span style={styles.eventTitle}>
                      {item.eventTitle}
                    </span>
                    <span style={styles.timestamp}>
                      {formatTimestamp(item.lastMessageTime)}
                    </span>
                  </div>

                  <div style={styles.chatPreview}>
                    <span style={styles.lastMessage}>
                      {item.lastMessage || 'No messages yet'}
                    </span>
                    {unreadCount > 0 && (
                      <span style={styles.unreadBadge}>
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  <div style={styles.participantsInfo}>
                    <span style={{ fontSize: '12px' }}>👤</span>
                    <span style={styles.participantCount}>
                      {item.participants?.length || 0} participants
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px 16px',
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
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '32px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: '16px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'rgba(245,230,211,0.5)',
    textAlign: 'center',
    fontFamily: "'Georgia', serif",
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chatRoomItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    background: 'rgba(45,20,20,0.6)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'left',
    width: '100%',
  },
  chatIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    background: 'rgba(212,175,55,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px',
    flexShrink: 0,
  },
  chatInfo: {
    flex: 1,
    minWidth: 0,
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
    gap: '8px',
  },
  eventTitle: {
    flex: 1,
    fontSize: '16px',
    fontWeight: '600',
    color: '#F5E6D3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  timestamp: {
    fontSize: '12px',
    color: 'rgba(212,175,55,0.6)',
    flexShrink: 0,
    fontFamily: "'Georgia', serif",
  },
  chatPreview: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '8px',
  },
  lastMessage: {
    flex: 1,
    fontSize: '14px',
    color: 'rgba(245,230,211,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: "'Georgia', serif",
  },
  unreadBadge: {
    background: '#C41E3A',
    borderRadius: '10px',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 6px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  participantsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  participantCount: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.4)',
    fontFamily: "'Georgia', serif",
  },
};

export default ChatListScreen;
