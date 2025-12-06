import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";
import webSocketService from "../services/WebSocketService";

export const useChat = (connectionId, userName) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  
  // Keep track of subscriptions to clean them up
  const subscriptionsRef = useRef([]);

  // Set up WebSocket subscriptions for real-time messaging
  const setupWebSocketSubscriptions = useCallback(async (currentChatId) => {
    if (!currentChatId) return;

    try {
      // Connect to WebSocket if not already connected
      if (!webSocketService.isConnected()) {
        await webSocketService.connect();
      }

      // Clean up existing subscriptions
      subscriptionsRef.current.forEach(subId => {
        webSocketService.unsubscribe(subId);
      });
      subscriptionsRef.current = [];

      // Subscribe to chat topic for real-time messages
      const chatSubId = webSocketService.subscribe(
        `/topic/chat/${currentChatId}`,
        (messageDto) => {
          console.log('Received real-time message:', messageDto);
          // Only add message if it's not already in our messages array
          setMessages(prev => {
            // Check using messageId (from backend) instead of id
            const exists = prev.some(msg => (msg.id || msg.messageId) === (messageDto.id || messageDto.messageId));
            if (exists) return prev;
            return [...prev, messageDto];
          });
        }
      );
      if (chatSubId) {
        subscriptionsRef.current.push(chatSubId);
      }

      // Subscribe to typing notifications
      const typingSubId = webSocketService.subscribe(
        `/topic/chat/${currentChatId}/typing`,
        (typingDto) => {
          // TypingNotifyDTO: { senderId, type }
          if (typingDto.senderId === otherUserId) {
            if (typingDto.type === "TYPING_STARTED") {
              setIsOtherUserTyping(true);
            } else if (typingDto.type === "TYPING_STOPPED") {
              setIsOtherUserTyping(false);
            }
          }
        }
      );
      if (typingSubId) {
        subscriptionsRef.current.push(typingSubId);
      }

      // Subscribe to user notifications queue
      const notificationSubId = webSocketService.subscribe(
        `/user/queue/messages`,
        (messageDto) => {
          console.log('Received notification:', messageDto);
          try {
            const success = webSocketService.sendMessage(
              `/app/chat/${chatId}/markAsRead`,
              {}
            );

            if (success) {
              console.log('Message sent via WebSocket');
              return true;
            }
          } catch (error) {
            console.error('WebSocket send failed, falling back to HTTP:', error);
          }
        }
      );
      if (notificationSubId) {
        subscriptionsRef.current.push(notificationSubId);
      }

      console.log('WebSocket subscriptions set up for chat:', currentChatId);
    } catch (error) {
      console.error('Failed to set up WebSocket subscriptions:', error);
      
    }
  }, [otherUserId]);

 
  const initializeChat = useCallback(async () => {
    if (!connectionId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch(`/v1/api/chats/${connectionId}`, { headers });
      if (response.ok) {
        const chatData = await response.json(); 
        console.log('Loaded chat data:', chatData);
        console.log('Messages from backend:', chatData.messages);
        setChatId(chatData.chatId);
        setOtherUserId(chatData.otherUserId);
        setMessages(chatData.messages || []);
        
        // Set up WebSocket subscriptions after chat is loaded
        setupWebSocketSubscriptions(chatData.chatId);
      } else {
        message.error("Failed to load chat");
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      message.error("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [connectionId, setupWebSocketSubscriptions]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !chatId) return false;

    // Try WebSocket first if connected
    if (webSocketService.isConnected()) {
      try {
        const success = webSocketService.sendMessage(
          `/app/chat/${chatId}/send`,
          { content: content.trim() }
        );
        
        if (success) {
          console.log('Message sent via WebSocket');
          return true;
        }
      } catch (error) {
        console.error('WebSocket send failed, falling back to HTTP:', error);
      }
    }



    // Fallback to HTTP if WebSocket fails or is not connected
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/v1/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content: content.trim() })
      });
      
      if (response.ok) {
        const newMessage = await response.json(); 
        if (!webSocketService.isConnected()) {
          setMessages(prev => [...prev, newMessage]);
        }
        console.log('Message sent via HTTP');
        return true;
      } else {
        message.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message");
    }
    return false;
  }, [chatId]);

  // Send typing events to backend
  const sendTypingStarted = useCallback(() => {
    if (chatId && webSocketService.isConnected()) {
      webSocketService.sendMessage(
        `/app/chat/${chatId}/typing`,
        { type: "TYPING_STARTED" }
      );
    }
  }, [chatId]);

  const sendTypingStopped = useCallback(() => {
    if (chatId && webSocketService.isConnected()) {
      webSocketService.sendMessage(
        `/app/chat/${chatId}/typing`,
        { type: "TYPING_STOPPED" }
      );
    }
  }, [chatId]);

  // Refresh chat by re-fetching messages
  const refreshChat = useCallback(() => {
    initializeChat();
  }, [initializeChat]);

  // Clean up WebSocket subscriptions
  const cleanupSubscriptions = useCallback(() => {
    subscriptionsRef.current.forEach(subId => {
      webSocketService.unsubscribe(subId);
    });
    subscriptionsRef.current = [];
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    const removeConnectionListener = webSocketService.onConnectionChange((connected) => {
      if (connected && chatId) {
        // Re-setup subscriptions when reconnected
        setupWebSocketSubscriptions(chatId);
      }
    });

    // Initial connection attempt
    webSocketService.connect().catch(error => {
      console.log('Initial WebSocket connection failed, will use HTTP fallback:', error);
    });

    return () => {
      removeConnectionListener();
      cleanupSubscriptions();
    };
  }, [chatId, setupWebSocketSubscriptions, cleanupSubscriptions]);

  // Initialize chat when connectionId changes
  useEffect(() => {
    if (connectionId) {
      initializeChat();
    } else {
      // Clean up when no connection
      cleanupSubscriptions();
    }
  }, [initializeChat, connectionId, cleanupSubscriptions]);

  const prependMessages = useCallback((older) => {
    setMessages(prev => [...older, ...prev]);
  }, []);

  return {
    messages,
    loading,
    isConnected: !!connectionId, 
    sendMessage,
    refreshChat,
    chatId,
    otherUserId,
    sendTypingStarted,
    sendTypingStopped,
    isOtherUserTyping,
    prependMessages
  };
};
