import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Button, Space, Typography, Divider, Spin } from "antd";
import { 
  SendOutlined, 
  ArrowsAltOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { useChat } from "../../hooks/useChat";
import Avatar from "../Avatar";
import TypingIndicator from "./TypingIndicator";

const { Text } = Typography;

function ChatWindow({ 
  connectionId, 
  userName, 
  profilePictureUrl,
  isOpen, 
  isMinimized, 
  onClose, 
  onMinimize, 
  onMaximize,
  position = { bottom: 20, right: 20 }
}) {
  const [message, setMessage] = useState("");
  const { messages, loading, isConnected, sendMessage, otherUserId, isOtherUserTyping, sendTypingStarted, sendTypingStopped } = useChat(connectionId, userName);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized && isOpen) {
      inputRef.current?.focus();
    }
  }, [isMinimized, isOpen]);

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
    }, 1500); // 1.5 seconds after last keypress
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

  if (!isOpen) return null;

  // Show message if not connected
  if (!isConnected) {
    return (
      <div style={{
        position: "fixed",
        top: "50%",
      left: "50%",
        width: 300,
        padding: "16px",
        background: "red",
        zIndex: 1000
      }}>
        <Text>You can only message users you're connected with.</Text>
        <p></p>
        <Button onClick={onClose} size="small" style={{ marginLeft: 8 }}>Close</Button>
      </div>
    );
  }

  const chatStyle = {
    position: "fixed",
    bottom: position.bottom,
    right: position.right,
    width: isMinimized ? 300 : 350,
    height: isMinimized ? 50 : 400,
    zIndex: 1000,
    overflow: "hidden",
  
  };

  return (
    <div style={chatStyle}>
      <Card 
        styles={{ body: { padding: 0, height: "100%" } }}
        style={{ height: "100%", border: "1px solid #d9d9d9" }}
      >
        {/* Header */}
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          background: "#667eea",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ transform: "scale(0.7)" }}>
              <Avatar 
                firstName={userName.split(' ')[0]}
                lastName={userName.split(' ').slice(1).join(' ')}
                profilePictureUrl={profilePictureUrl}
                hideName={true}
              />
            </div>
            <Text strong style={{ fontSize: "14px", color: "white" }}>{userName}</Text>
          </div>
          <Space>
            <Button 
              type="text" 
              size="small" 
              icon={<ArrowsAltOutlined />}
              onClick={isMinimized ? onMaximize : onMinimize}
              style={{ color: "white" }}
            />
            <Button 
              type="text" 
              size="small" 
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: "white" }}
            />
          </Space>
        </div>

        {/* Messages Area - only show when not minimized */}
        {!isMinimized && (
          <>
            <div style={{
              height: "280px",
              overflowY: "auto",
              padding: "16px",
              background: "#fff"
            }}>
              {loading ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  <Spin />
                  <div style={{ marginTop: 16 }}>
                    <Text>Loading chat history...</Text>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px", color: "#999" }}>
                  <Text>No messages yet. Start the conversation!</Text>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.messageId} style={{ marginBottom: "12px" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: msg.senderId === otherUserId ? "flex-start" : "flex-end"
                    }}>
                      <div style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        background: msg.senderId === otherUserId ? "#f0f0f0" : "#667eea",
                        color: msg.senderId === otherUserId ? "black" : "white"
                      }}>
                        <Text style={{ 
                          color: msg.senderId === otherUserId ? "inherit" : "white",
                          fontSize: "14px"
                        }}>
                          {msg.content}
                        </Text>
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
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Typing indicator below messages */}
            <TypingIndicator isTyping={isOtherUserTyping} userName={userName} />
            <Divider style={{ margin: 0 }} />

            {/* Input Area */}
            <div style={{
              padding: "12px",
              background: "#f8f9ff"
            }}>
              <Input.Group compact>
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={message}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyPress={handleKeyPress}
                  style={{ 
                    width: "calc(100% - 40px)",
                    borderColor: "#d9d9ff"
                  }}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{
                    background: "#667eea",
                    borderColor: "#667eea"
                  }}
                />
              </Input.Group>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default ChatWindow;
