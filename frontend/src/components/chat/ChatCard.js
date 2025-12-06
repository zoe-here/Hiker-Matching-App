import React, { useState } from "react";
import { Card, Typography } from "antd";
import UserAvatar from "../UserAvatar";

const { Text } = Typography;

function ChatCard({ chat, onClick }) {
  const [userName, setUserName] = useState(`User ${chat.otherUserId}`);
  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return messageTime.toLocaleDateString();
  };

  return (
    <Card
      hoverable
      size="small"
      style={{
        marginBottom: "8px",
        border: "1px solid #e8e8e8",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
      bodyStyle={{ padding: "12px" }}
      onClick={() => onClick(chat)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <UserAvatar 
            userId={chat.otherUserId} 
            size={40} 
            hideName={true} 
            onUserDataLoaded={(userData) => setUserName(userData.name)}
          />
        </div>

        {/* Chat Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text strong style={{ 
                fontSize: "14px",
                color: "#262626"
              }}>
                {userName}
              </Text>
              {chat.hasUnread && (
                <span style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff3b30",
                  marginLeft: 2
                }} />
              )}
            </div>
            <Text style={{ 
              fontSize: "12px", 
              color: "#8c8c8c",
              flexShrink: 0,
              marginLeft: "8px"
            }}>
              {formatTime(chat.lastMessageAt)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ChatCard;
