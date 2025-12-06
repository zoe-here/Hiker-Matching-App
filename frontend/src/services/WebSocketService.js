import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageCallbacks = new Map();
    this.connectionCallbacks = [];
    this.intentionallyDisconnected = false; // Track if disconnect was intentional
  }

  connect() {
    if (this.client && this.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      console.log('Attempting WebSocket connection with token:', token ? 'present' : 'missing');

      // Don't connect if no token available (user not logged in)
      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      // Reset intentional disconnect flag when connecting
      this.intentionallyDisconnected = false;

      // Create STOMP client with SockJS - connect directly to backend
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Connection success callback
      this.client.onConnect = (frame) => {
        console.log('WebSocket connected:', frame);
        this.connected = true;
        this.connectionCallbacks.forEach(callback => callback(true));
        resolve();
      };

      // Connection error callback
      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        this.connected = false;
        this.connectionCallbacks.forEach(callback => callback(false));
        reject(new Error('STOMP connection failed'));
      };

      // WebSocket error callback
      this.client.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
        this.connectionCallbacks.forEach(callback => callback(false));
        reject(error);
      };

      // Connection closed callback
      this.client.onWebSocketClose = (event) => {
        console.log('WebSocket closed:', event);
        this.connected = false;
        this.connectionCallbacks.forEach(callback => callback(false));
        
        // Don't attempt to reconnect if disconnection was intentional (logout)
        if (this.intentionallyDisconnected) {
          console.log('WebSocket disconnected intentionally, preventing reconnection');
          if (this.client) {
            this.client.reconnectDelay = 0; // Disable reconnection
          }
        }
      };

      // Start the connection
      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      // Mark as intentionally disconnected to prevent auto-reconnect
      this.intentionallyDisconnected = true;
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      console.log('WebSocket intentionally disconnected');
    }
  }

  // Subscribe to a topic or queue
  subscribe(destination, callback, subscriptionId = null) {
    if (!this.connected || !this.client) {
      console.warn('WebSocket not connected, cannot subscribe to', destination);
      return null;
    }

    const id = subscriptionId || `sub_${Date.now()}_${Math.random()}`;
    
    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const parsedBody = JSON.parse(message.body);
          callback(parsedBody, message);
        } catch (error) {
          console.error('Error parsing message:', error);
          callback(message.body, message);
        }
      }, { id });

      this.subscriptions.set(id, subscription);
      return id;
    } catch (error) {
      console.error('Error subscribing to', destination, error);
      return null;
    }
  }

  // Unsubscribe from a topic or queue
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  // Send message to a destination
  sendMessage(destination, body, headers = {}) {
    if (!this.connected || !this.client) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    // Double-check that user is still authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token, cannot send message');
      this.disconnect(); // Disconnect if no token
      return false;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          ...headers
        }
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }

  // Add connection status listener
  onConnectionChange(callback) {
    this.connectionCallbacks.push(callback);
    // Return function to remove listener
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
