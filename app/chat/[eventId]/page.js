'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatService from '@/lib/services/ChatService';

const EventChatScreen = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  // Demo user - replace with real auth
  const userId = 'demo-user';
  const userName = 'Demo User';
  const eventTitle = 'Event Chat'; // Would come from chat room data

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load chat room details
    const loadChatRoom = async () => {
      const room = await ChatService.getChatRoom(eventId);
      setChatRoom(room);
    };
    loadChatRoom();

    // Subscribe to messages
    const unsubscribe = ChatService.subscribeToMessages(eventId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    // Mark as read when entering chat
    ChatService.markAsRead(eventId, userId);

    return () => unsubscribe();
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() === '' || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      await ChatService.sendMessage(eventId, userId, userName, messageText);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await ChatService.addReaction(eventId, messageId, userId, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const RestaurantCard = ({ restaurant, isOwnMessage }) => (
    <div style={{
      ...styles.restaurantCard,
      ...(isOwnMessage ? styles.ownBubble : styles.otherBubble)
    }}>
      {restaurant.image && (
        <img src={restaurant.image} alt={restaurant.name} style={styles.restaurantImage} />
      )}
      <div style={styles.restaurantInfo}>
        <div style={styles.restaurantName}>{restaurant.name}</div>
        <div style={styles.restaurantCuisine}>{restaurant.cuisine}</div>
        <div style={styles.restaurantAddress}>{restaurant.address}</div>
        {restaurant.rating && (
          <div style={styles.ratingContainer}>
            <span>⭐</span>
            <span style={styles.rating}>{restaurant.rating}</span>
          </div>
        )}
      </div>
    </div>
  );

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

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => router.push('/chat')} style={styles.backButton}>
          ← Back
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.headerTitle}>{chatRoom?.eventTitle || eventTitle}</h1>
          <span style={styles.participantCount}>
            {chatRoom?.participants?.length || 0} participants
          </span>
        </div>
        <div style={{ width: '60px' }} />
      </header>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        <div style={styles.messagesList}>
          {messages.map((item) => {
            const isOwnMessage = item.userId === userId;

            return (
              <div
                key={item.id}
                style={{
                  ...styles.messageContainer,
                  ...(isOwnMessage ? styles.ownMessage : styles.otherMessage)
                }}
              >
                {!isOwnMessage && (
                  <span style={styles.senderName}>{item.userName}</span>
                )}

                {item.messageType === 'text' ? (
                  <div style={{
                    ...styles.messageBubble,
                    ...(isOwnMessage ? styles.ownBubble : styles.otherBubble)
                  }}>
                    <span style={{
                      ...styles.messageText,
                      ...(isOwnMessage ? styles.ownText : styles.otherText)
                    }}>
                      {item.message}
                    </span>
                  </div>
                ) : item.messageType === 'restaurant' ? (
                  <RestaurantCard restaurant={item.restaurant} isOwnMessage={isOwnMessage} />
                ) : null}

                {/* Reactions */}
                {item.reactions && Object.keys(item.reactions).length > 0 && (
                  <div style={styles.reactionsContainer}>
                    {Object.entries(item.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        style={styles.reactionBubble}
                        onClick={() => handleReaction(item.id, emoji)}
                      >
                        <span style={styles.reactionEmoji}>{emoji}</span>
                        <span style={styles.reactionCount}>{users.length}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span style={styles.timestamp}>
                  {formatTimestamp(item.timestamp)}
                </span>

                {/* Quick reactions */}
                <div style={styles.quickReactions}>
                  {['👍', '❤️', '😂', '🍽️'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(item.id, emoji)}
                      style={styles.quickReactionButton}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <textarea
          style={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          maxLength={500}
        />
        <button
          style={{
            ...styles.sendButton,
            ...(sending || newMessage.trim() === '' ? styles.sendButtonDisabled : {})
          }}
          onClick={handleSend}
          disabled={sending || newMessage.trim() === ''}
        >
          {sending ? '...' : '➤'}
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
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
    background: 'rgba(20,8,8,0.95)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
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
  headerCenter: {
    textAlign: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0,
    color: '#F5E6D3',
  },
  participantCount: {
    fontSize: '0.7rem',
    color: 'rgba(212,175,55,0.6)',
    fontFamily: "'Georgia', serif",
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
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  messageContainer: {
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: '12px',
    color: 'rgba(212,175,55,0.7)',
    marginBottom: '4px',
    marginLeft: '8px',
    fontFamily: "'Georgia', serif",
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '100%',
  },
  ownBubble: {
    background: 'linear-gradient(135deg, #C41E3A, #8B1428)',
    borderBottomRightRadius: '4px',
  },
  otherBubble: {
    background: 'rgba(45,20,20,0.8)',
    border: '1px solid rgba(212,175,55,0.15)',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: '15px',
    lineHeight: 1.5,
  },
  ownText: {
    color: '#fff',
  },
  otherText: {
    color: '#F5E6D3',
  },
  timestamp: {
    fontSize: '11px',
    color: 'rgba(245,230,211,0.4)',
    marginTop: '4px',
    marginLeft: '8px',
    marginRight: '8px',
    fontFamily: "'Georgia', serif",
  },
  reactionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginLeft: '8px',
    gap: '4px',
  },
  reactionBubble: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: 'rgba(212,175,55,0.1)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '12px',
    padding: '4px 8px',
    cursor: 'pointer',
  },
  reactionEmoji: {
    fontSize: '14px',
    marginRight: '4px',
  },
  reactionCount: {
    fontSize: '12px',
    color: 'rgba(212,175,55,0.8)',
  },
  quickReactions: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginLeft: '8px',
    opacity: 0.5,
    gap: '4px',
  },
  quickReactionButton: {
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  restaurantCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    minWidth: '250px',
    maxWidth: '300px',
  },
  restaurantImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  restaurantInfo: {
    padding: '12px',
  },
  restaurantName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#F5E6D3',
  },
  restaurantCuisine: {
    fontSize: '14px',
    color: 'rgba(212,175,55,0.7)',
    marginBottom: '4px',
  },
  restaurantAddress: {
    fontSize: '12px',
    color: 'rgba(245,230,211,0.5)',
    marginBottom: '8px',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  rating: {
    fontSize: '14px',
    color: 'rgba(212,175,55,0.8)',
  },
  inputContainer: {
    display: 'flex',
    padding: '12px 16px',
    background: 'rgba(20,8,8,0.98)',
    borderTop: '1px solid rgba(212,175,55,0.1)',
    gap: '8px',
    position: 'sticky',
    bottom: 0,
  },
  input: {
    flex: 1,
    background: 'rgba(45,20,20,0.6)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '20px',
    padding: '12px 16px',
    fontSize: '15px',
    color: '#F5E6D3',
    resize: 'none',
    fontFamily: "'Georgia', serif",
    outline: 'none',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default EventChatScreen;
