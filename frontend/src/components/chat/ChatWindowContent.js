import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Typography, Space, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useChat } from "../../hooks/useChat";
import UserAvatar from "../UserAvatar";
import TypingIndicator from "../messaging/TypingIndicator";

const { Text } = Typography;

function ChatWindowContent({ selectedChat, onMessagesLoaded }) {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState(`User ${selectedChat.otherUserId}`);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Use connectionId from selectedChat (now included in ChatListDTO)
  const { messages, loading, sendMessage, isOtherUserTyping, sendTypingStarted, sendTypingStopped, prependMessages } = useChat(selectedChat.connectionId, userName);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef();
  const messagesAreaRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const success = await sendMessage(message.trim());
      if (success) {
        setMessage("");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    sendTypingStarted();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      sendTypingStopped();
    }, 1500);
  };

  const handleInputBlur = () => {
    sendTypingStopped();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    // When selectedChat changes and messages are loaded, notify parent
    if (!loading && messages && onMessagesLoaded) {
      onMessagesLoaded();
    }
    // Only run when selectedChat, loading, or messages change
  }, [selectedChat, loading, messages, onMessagesLoaded]);

  // Infinite scroll: load older messages when scrolled to top
  useEffect(() => {
    const handleScroll = async () => {
      if (!messagesAreaRef.current || loadingOlder || !hasMore || messages.length === 0) return;
      if (messagesAreaRef.current.scrollTop === 0) {
        setLoadingOlder(true);
        const oldestMsgId = messages[0].id || messages[0].messageId;
        try {
          const token = localStorage.getItem("token");
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const resp = await fetch(`/v1/api/chats/${selectedChat.chatId || selectedChat.connectionId}/messages?beforeId=${oldestMsgId}`, { headers });
          if (resp.ok) {
            const older = await resp.json();
            if (older.length === 0) setHasMore(false);
            else {
              setHasMore(true);
              // Maintain scroll position after prepending
              const prevHeight = messagesAreaRef.current.scrollHeight;
              prependMessages(older);
              setTimeout(() => {
                if (messagesAreaRef.current)
                  messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight - prevHeight;
              }, 0);
            }
          } else {
            setHasMore(false);
          }
        } finally {
          setLoadingOlder(false);
        }
      }
    };
    const area = messagesAreaRef.current;
    if (area) area.addEventListener('scroll', handleScroll);
    return () => area && area.removeEventListener('scroll', handleScroll);
  }, [messages, loadingOlder, hasMore, selectedChat, prependMessages]);

  return (
    <div style={{ 
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>
      {/* Chat Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #e8e8e8",
        background: "#667eea",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <UserAvatar 
          userId={selectedChat.otherUserId} 
          size={32} 
          hideName={true} 
          onUserDataLoaded={(userData) => setUserName(userData.name)}
        />
        <Text strong style={{ color: "white", fontSize: "16px" }}>
          {userName}
        </Text>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesAreaRef}
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          background: "#fff"
        }}
      >
        {loadingOlder && (
          <div style={{ textAlign: "center", padding: "8px" }}>
            <Spin size="small" />
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", color: "#8c8c8c" }}>
              Loading messages...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px", color: "#999" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, index) => (
              <div
                key={msg.id || msg.messageId || index}
                style={{
                  alignSelf: msg.senderId === selectedChat.otherUserId ? "flex-start" : "flex-end",
                  maxWidth: "70%"
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: msg.senderId === selectedChat.otherUserId ? "#f0f0f0" : "#667eea",
                    color: msg.senderId === selectedChat.otherUserId ? "#333" : "white",
                    wordWrap: "break-word"
                  }}
                >
                  <div>{msg.content}</div>
                  <div style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    marginTop: "4px",
                    textAlign: "right"
                  }}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Typing Indicator moved above input */}
      <TypingIndicator isTyping={isOtherUserTyping} userName={userName} />
      {/* Message Input */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid #e8e8e8",
        background: "#f8f9ff"
      }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onPressEnter={handleKeyPress}
            placeholder="Type a message..."
            style={{ 
              borderRadius: "20px 0 0 20px",
              borderColor: "#d9d9ff"
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!message.trim()}
            style={{
              borderRadius: "0 20px 20px 0",
              background: "#667eea",
              borderColor: "#667eea"
            }}
          />
        </Space.Compact>
      </div>
    </div>
  );
}

export default ChatWindowContent;
