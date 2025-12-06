import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatList from "./components/chat/ChatList";
import ChatWindowContent from "./components/chat/ChatWindowContent";
import webSocketService from "./services/WebSocketService";

const { Title } = Typography;

function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadChats, setUnreadChats] = useState(new Set()); // Track chatIds with unread
  const chatListRef = useRef();

  // Get current user id or username from localStorage (adjust as needed)
  const currentUserId = localStorage.getItem("userId");

  // Handle chat selection from ChatList
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Mark this chat as read in local state
    setUnreadChats((prev) => {
      const next = new Set(prev);
      next.delete(chat.chatId);
      return next;
    });
  };

  // Called after messages are loaded in ChatWindowContent so the read status can be updated
  const handleMessagesLoaded = () => {
    // No longer needed for unread dot, but keep if you want to refresh chat list for other reasons
    if (chatListRef.current && chatListRef.current.fetchChats) {
      chatListRef.current.fetchChats();
    }
  };

  // Real-time notification for new messages (unread indicator)
  useEffect(() => {
    let subId;
    let wsConnected = false;
    async function setupWs() {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }
        wsConnected = true;
        subId = webSocketService.subscribe(
          "/user/queue/messages",
          (messageDto) => {
            // Always log for debug
            console.log('WebSocket message received:', messageDto, 'currentUserId:', currentUserId, 'selectedChat:', selectedChat);
            // Only mark as unread if not sent by current user and not currently open

            const senderIsNotCurrentUser = messageDto.senderId != currentUserId;
            const chatIsNotSelected = messageDto.chatId != selectedChat?.chatId;

            if (
              senderIsNotCurrentUser && chatIsNotSelected
            ) {
              console.log('Marking chat as unread:', messageDto.chatId);
              setUnreadChats((prev) => new Set(prev).add(messageDto.chatId));
            } else {
              console.log('Message from current user or selected chat, not marking as unread: ' + messageDto.chatId);
            }
          }
        );
      } catch (e) {
        // Ignore connection errors, fallback is HTTP
      }
    }
    setupWs();
    return () => {
      if (subId && wsConnected) webSocketService.unsubscribe(subId);
    };
  }, [currentUserId, selectedChat]); 

  // Initialize unreadChats from backend on first load
  useEffect(() => {
    async function fetchInitialUnread() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch("/v1/api/chats", { headers });
        if (response.ok) {
          const chatList = await response.json();
          const unreadSet = new Set(chatList.filter(c => c.hasUnread).map(c => c.chatId));
          setUnreadChats(unreadSet);
        }
      } catch (e) {
        // Ignore errors for now
      }
    }
    fetchInitialUnread();
  }, []);

  return (
    <div style={{ 
      height: "calc(100vh - 64px)", 
      background: "#f5f5f5"
    }}>
      <Row style={{ height: "100%" }}>
        {/* Left Column - Chat List */}
        <Col xs={24} md={8} style={{
          borderRight: "1px solid #e8e8e8",
          background: "#fff",
          height: "100%",
          overflow: "auto"
        }}>
          <div style={{
            padding: "16px",
            borderBottom: "1px solid #e8e8e8",
            background: "#667eea",
            color: "white"
          }}>
            <Title level={4} style={{ 
              margin: 0, 
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <MessageOutlined />
              Messages
            </Title>
          </div>
          
          <ChatList ref={chatListRef} onChatSelect={handleChatSelect} unreadChats={unreadChats} />
        </Col>

        {/* Right Column - Chat Window */}
        <Col xs={24} md={16} style={{
          background: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
          {selectedChat ? (
            <ChatWindowContent selectedChat={selectedChat} onMessagesLoaded={handleMessagesLoaded} />
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#8c8c8c"
            }}>
              <MessageOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
              <Title level={4} style={{ color: "#8c8c8c" }}>
                Select a chat to start messaging
              </Title>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ChatsPage;
