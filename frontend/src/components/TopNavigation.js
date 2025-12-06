import React, { useState, useEffect } from "react";
import { Menu, Avatar as AntAvatar, Tooltip } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  UserOutlined, 
  TeamOutlined, 
  CompassOutlined, 
  MessageOutlined,
  HomeOutlined
} from "@ant-design/icons";
import Avatar from "./Avatar";
import LogoutButton from "./LogoutButton";

function TopNavigation({ profile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Monitor screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Mobile breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Define navigation items
  const navItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      path: "/me"
    },
    {
      key: "connections",
      icon: <TeamOutlined />,
      label: "Connections",
      path: "/connections"
    },
    {
      key: "recommendations",
      icon: <CompassOutlined />,
      label: "Find Hiking Partners",
      path: "/recommendations"
    },
    {
      key: "messages",
      icon: <MessageOutlined />,
      label: "Messages",
      path: "/chats",
     
    }
  ];

  // Get current active key based on pathname
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/me") return "profile";
    if (path === "/connections") return "connections";
    if (path === "/recommendations") return "recommendations";
    if (path === "/chats") return "messages";
    if (path.startsWith("/user/")) return ""; 
    return "";
  };

  const handleMenuClick = ({ key }) => {
    const item = navItems.find(item => item.key === key);
    if (item && item.path && !item.disabled) {
      navigate(item.path);
    }
  };

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: isSmallScreen ? "0 12px" : "0"  // Reduced padding on mobile
    }}>
      <div style={{
        maxWidth: "100%",  
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: isSmallScreen ? "0" : "0 16px"  // Add padding on larger screens
      }}>
        {/* Left side - Brand */}
        {!isSmallScreen && (
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "white"
            }}
            onClick={() => navigate("/dashboard")}
          >
            <h2 style={{
              margin: 0,
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
            }}>
              Winder
            </h2>
          </div>
        )}

        {/* Center - Navigation Menu */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: isSmallScreen ? "flex-start" : "center" 
        }}>
          {isSmallScreen ? (
            // Icon-only navigation for small screens
            <div style={{
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}>
              {navItems.map(item => (
                <Tooltip 
                  key={item.key}
                  title={item.disabled ? `${item.label} (Coming Soon)` : item.label}
                  placement="bottom"
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: item.disabled ? "not-allowed" : "pointer",
                      background: getCurrentKey() === item.key ? "rgba(255,255,255,0.2)" : "transparent",
                      opacity: item.disabled ? 0.5 : 1,
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "40px",
                      height: "40px"
                    }}
                    onClick={() => {
                      if (!item.disabled && item.path) {
                        navigate(item.path);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!item.disabled) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = getCurrentKey() === item.key ? "rgba(255,255,255,0.2)" : "transparent";
                    }}
                  >
                    <span style={{ 
                      fontSize: "18px", 
                      color: "white"
                    }}>
                      {item.icon}
                    </span>
                  </div>
                </Tooltip>
              ))}
            </div>
          ) : (
            // Full menu for larger screens
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[getCurrentKey()]}
              onClick={handleMenuClick}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "14px",
                width: "100%",  // Use full width
                display: "flex",
                justifyContent: "space-evenly"  // Evenly space menu items
              }}
              items={navItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
                disabled: item.disabled
              }))}
            />
          )}
        </div>

        {/* Right side - User info and logout */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: isSmallScreen ? 8 : 16
        }}>
          {/* User Avatar */}
          {profile && (
            <Tooltip title="My Profile" placement="bottom">
              <div 
                style={{
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "50%",
                  transition: "background 0.2s"
                }}
                onClick={() => navigate("/me")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {profile.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
                    alt="Profile"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <AntAvatar 
                    icon={<UserOutlined />} 
                    size={32}
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  />
                )}
              </div>
            </Tooltip>
          )}
          
          {/* Show Logout button with text on larger screens, icon only on small screens */}
          <LogoutButton isSmallScreen={isSmallScreen} />
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;
