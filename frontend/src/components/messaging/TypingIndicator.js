import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

function TypingIndicator({ isTyping, userName }) {
  if (!isTyping) return null;
  return (
    <div style={{ padding: "4px 16px", color: "#888", fontStyle: "italic", fontSize: 13 }}>
      <Text type="secondary">{userName ? `${userName} is typing...` : "Typing..."}</Text>
    </div>
  );
}

export default TypingIndicator;
