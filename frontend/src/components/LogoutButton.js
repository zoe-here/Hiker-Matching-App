import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "../hooks/useLogout";

function LogoutButton({ 
  children = "Log Out", 
  style = {},
  icon = false,
  floating = false,
  isSmallScreen = false,
  ...buttonProps 
}) {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout(); // Always redirect to "/login", no custom message
  };

  // Default floating style for bottom-right positioning
  const floatingStyle = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 1000,
    borderRadius: "50px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "none",
    padding: "8px 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  // Merge styles: floating style as base, then user style overrides
  const finalStyle = floating ? { ...floatingStyle, ...style } : style;

  const buttonElement = (
    <Button
      type="primary"
      danger={true}
      size={floating ? "large" : "default"}
      style={{
        ...finalStyle,
        minWidth: isSmallScreen ? '40px' : 'auto',
        padding: isSmallScreen ? '4px 8px' : undefined
      }}
      icon={isSmallScreen || icon ? <LogoutOutlined /> : undefined}
      onClick={handleLogout}
      {...buttonProps}
    >
      {!isSmallScreen && children}
    </Button>
  );

  // If floating, wrap in a container div, otherwise return button directly
  return floating ? <div>{buttonElement}</div> : buttonElement;
}

export default LogoutButton;
