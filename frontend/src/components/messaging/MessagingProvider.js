import React, { useState, createContext, useContext } from "react";
import ChatWindow from "./ChatWindow";

// Create Context for messaging
const MessagingContext = createContext();

// Custom hook to use messaging context
export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

function MessagingProvider({ children }) {
  const [openChats, setOpenChats] = useState([]);

  const openChat = (connectionId, userName, profilePictureUrl) => {
    // Check if chat is already open
    const existingChat = openChats.find(chat => chat.connectionId === connectionId);
    if (existingChat) {
      // If minimized, maximize it
      if (existingChat.isMinimized) {
        setOpenChats(prev => 
          prev.map(chat => 
            chat.connectionId === connectionId 
              ? { ...chat, isMinimized: false }
              : chat
          )
        );
      }
      return;
    }

    // Calculate position for new chat window (stack them)
    const position = {
      bottom: 20,
      right: 20 + (openChats.length * 360) // Stack horizontally
    };

    const newChat = {
      connectionId,
      userName,
      profilePictureUrl,
      isOpen: true,
      isMinimized: false,
      position
    };

    setOpenChats(prev => [...prev, newChat]);
  };

  const closeChat = (connectionId) => {
    setOpenChats(prev => prev.filter(chat => chat.connectionId !== connectionId));
  };

  const minimizeChat = (connectionId) => {
    setOpenChats(prev => 
      prev.map(chat => 
        chat.connectionId === connectionId 
          ? { ...chat, isMinimized: true }
          : chat
      )
    );
  };

  const maximizeChat = (connectionId) => {
    setOpenChats(prev => 
      prev.map(chat => 
        chat.connectionId === connectionId 
          ? { ...chat, isMinimized: false }
          : chat
      )
    );
  };

  const closeAllChats = () => {
    setOpenChats([]);
  };

  const contextValue = {
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    closeAllChats,
    openChats
  };

  return (
    <MessagingContext.Provider value={contextValue}>
      {children}
      
      {/* Render all open chat windows */}
      {openChats.map((chat) => (
        <ChatWindow
          key={chat.connectionId}
          connectionId={chat.connectionId}
          userName={chat.userName}
          profilePictureUrl={chat.profilePictureUrl}
          isOpen={chat.isOpen}
          isMinimized={chat.isMinimized}
          position={chat.position}
          onClose={() => closeChat(chat.connectionId)}
          onMinimize={() => minimizeChat(chat.connectionId)}
          onMaximize={() => maximizeChat(chat.connectionId)}
        />
      ))}
    </MessagingContext.Provider>
  );
}

export default MessagingProvider;
