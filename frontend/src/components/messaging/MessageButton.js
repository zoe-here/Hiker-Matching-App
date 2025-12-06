import React from "react";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useMessaging } from "./MessagingProvider";

function MessageButton({ connectionId, userName, profilePictureUrl, size = "default", type = "default" }) {
  const { openChat } = useMessaging();

  const handleClick = () => {
    openChat(connectionId, userName, profilePictureUrl);
  };

  return (
    <Button 
      type={type}
      size={size}
      icon={<MessageOutlined />}
      onClick={handleClick}
      style={{
        backgroundColor: "#667eea",
        borderColor: "#667eea",
        color: "white"
      }}
    >
      Message
    </Button>
  );
}

export default MessageButton;
