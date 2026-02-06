import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  arrayUnion,
  getDoc
} from 'firebase/firestore';
// Note: You'll need to create firebaseConfig.js with your Firebase credentials
// import { db, auth } from './firebaseConfig';

// Placeholder db - replace with real Firebase instance
let db = null;

// Initialize with Firebase db instance
export const initializeChatService = (firebaseDb) => {
  db = firebaseDb;
};

class ChatService {
  // Create a chat room for an event
  async createEventChatRoom(eventId, eventTitle, creatorId, creatorName) {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return eventId;
    }

    try {
      const chatRoomRef = doc(db, 'chatRooms', eventId);
      await setDoc(chatRoomRef, {
        eventId,
        eventTitle,
        creatorId,
        creatorName,
        participants: [creatorId],
        participantNames: [creatorName],
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: {}
      });
      return chatRoomRef.id;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  // Add participant to chat room
  async addParticipantToChatRoom(eventId, userId, userName) {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return;
    }

    try {
      const chatRoomRef = doc(db, 'chatRooms', eventId);
      await updateDoc(chatRoomRef, {
        participants: arrayUnion(userId),
        participantNames: arrayUnion(userName)
      });
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  }

  // Send a message to event chat
  async sendMessage(eventId, userId, userName, message, messageType = 'text') {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return 'mock-message-id';
    }

    try {
      const messagesRef = collection(db, 'chatRooms', eventId, 'messages');
      const messageDoc = await addDoc(messagesRef, {
        userId,
        userName,
        message,
        messageType, // text, image, location, restaurant
        timestamp: serverTimestamp(),
        reactions: {},
        edited: false
      });

      // Update chat room's last message
      const chatRoomRef = doc(db, 'chatRooms', eventId);
      await updateDoc(chatRoomRef, {
        lastMessage: message.substring(0, 100),
        lastMessageTime: serverTimestamp()
      });

      return messageDoc.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Share a restaurant in chat
  async shareRestaurant(eventId, userId, userName, restaurant) {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return;
    }

    try {
      const messagesRef = collection(db, 'chatRooms', eventId, 'messages');
      await addDoc(messagesRef, {
        userId,
        userName,
        messageType: 'restaurant',
        restaurant: {
          name: restaurant.name,
          address: restaurant.address,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating,
          image: restaurant.image
        },
        timestamp: serverTimestamp(),
        reactions: {}
      });

      const chatRoomRef = doc(db, 'chatRooms', eventId);
      await updateDoc(chatRoomRef, {
        lastMessage: `${userName} shared ${restaurant.name}`,
        lastMessageTime: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sharing restaurant:', error);
      throw error;
    }
  }

  // Listen to messages in real-time
  subscribeToMessages(eventId, callback) {
    if (!db) {
      // Mock mode - return demo messages
      const mockMessages = [
        {
          id: '1',
          userId: 'user-1',
          userName: 'Marie Laveau',
          message: 'So excited for this event! Anyone tried the gumbo here before?',
          messageType: 'text',
          timestamp: new Date(Date.now() - 3600000),
          reactions: { '👍': ['user-2'], '❤️': ['user-3'] }
        },
        {
          id: '2',
          userId: 'user-2',
          userName: 'Louis Armstrong',
          message: 'Yes! The seafood gumbo is incredible. Make sure to save room for dessert too.',
          messageType: 'text',
          timestamp: new Date(Date.now() - 1800000),
          reactions: {}
        },
        {
          id: '3',
          userId: 'user-3',
          userName: 'Emeril Lagasse',
          message: 'BAM! I recommend the bananas foster for dessert!',
          messageType: 'text',
          timestamp: new Date(Date.now() - 600000),
          reactions: { '🍽️': ['user-1', 'user-2'] }
        }
      ];
      setTimeout(() => callback(mockMessages), 300);
      return () => {};
    }

    const messagesRef = collection(db, 'chatRooms', eventId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(messages);
    });
  }

  // Get chat room details
  async getChatRoom(eventId) {
    if (!db) {
      // Mock mode
      return {
        id: eventId,
        eventId,
        eventTitle: 'Demo Event',
        participants: ['demo-user'],
        participantNames: ['Demo User']
      };
    }

    try {
      const chatRoomRef = doc(db, 'chatRooms', eventId);
      const chatRoomDoc = await getDoc(chatRoomRef);

      if (chatRoomDoc.exists()) {
        return {
          id: chatRoomDoc.id,
          ...chatRoomDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting chat room:', error);
      throw error;
    }
  }

  // Get user's active chat rooms
  subscribeToUserChatRooms(userId, callback) {
    if (!db) {
      // Mock mode - return demo chat rooms
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
        }
      ];
      setTimeout(() => callback(mockRooms), 500);
      return () => {};
    }

    const chatRoomsRef = collection(db, 'chatRooms');
    const q = query(
      chatRoomsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chatRooms = [];
      snapshot.forEach((doc) => {
        chatRooms.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(chatRooms);
    });
  }

  // Add reaction to message
  async addReaction(eventId, messageId, userId, emoji) {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return;
    }

    try {
      const messageRef = doc(db, 'chatRooms', eventId, 'messages', messageId);
      const messageDoc = await getDoc(messageRef);

      if (messageDoc.exists()) {
        const reactions = messageDoc.data().reactions || {};
        if (!reactions[emoji]) {
          reactions[emoji] = [];
        }
        if (!reactions[emoji].includes(userId)) {
          reactions[emoji].push(userId);
        }

        await updateDoc(messageRef, { reactions });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markAsRead(eventId, userId) {
    if (!db) {
      console.warn('Firebase not initialized. Using mock mode.');
      return;
    }

    try {
      const chatRoomRef = doc(db, 'chatRooms', eventId);
      const unreadUpdate = {};
      unreadUpdate[`unreadCount.${userId}`] = 0;
      await updateDoc(chatRoomRef, unreadUpdate);
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }
}

export default new ChatService();
