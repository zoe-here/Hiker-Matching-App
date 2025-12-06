import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Spin, Typography, Empty } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatCard from "./ChatCard";

const { Text } = Typography;

const ChatList = forwardRef(({ onChatSelect, unreadChats }, ref) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all chats from backend
  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await fetch("/v1/api/chats", { headers });
      
      if (response.ok) {
        const chatList = await response.json();
        console.log("Fetched chats:", chatList);
        
        // Sort by most recent first (as requested)
        const sortedChats = chatList.sort((a, b) => {
          if (!a.lastMessageAt && !b.lastMessageAt) return 0;
          if (!a.lastMessageAt) return 1;
          if (!b.lastMessageAt) return -1;
          return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
        });
        
        setChats(sortedChats);
      } else {
        setError("Failed to load chats");
        console.error("Failed to fetch chats:", response.status);
      }
    } catch (err) {
      setError("Failed to load chats");
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchChats
  }));

  // Fetch chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Handle chat card click
  const handleChatClick = (chat) => {
    console.log("Selected chat:", chat);
    onChatSelect(chat);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        color: "#8c8c8c"
      }}>
        <Spin size="large" />
        <Text style={{ marginLeft: "12px", color: "#8c8c8c" }}>
          Loading chats...
        </Text>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#ff4d4f"
      }}>
        <Text type="danger">{error}</Text>
        <br />
        <Text 
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={fetchChats}
        >
          Try again
        </Text>
      </div>
    );
  }

  // Empty state
  if (chats.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <Empty
          image={<MessageOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />}
          description={
            <Text style={{ color: "#8c8c8c" }}>
              No chats yet. Start a conversation with your connections!
            </Text>
          }
        />
      </div>
    );
  }

  // Render chat list
  return (
    <div style={{ padding: "12px" }}>
      {chats.map((chat) => (
        <ChatCard
          key={chat.chatId}
          chat={{ ...chat, hasUnread: unreadChats && unreadChats.has(chat.chatId) }}
          onClick={handleChatClick}
        />
      ))}
    </div>
  );
});

export default ChatList;
