import React from "react";
import { Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  UserOutlined, 
  TeamOutlined, 
  CompassOutlined, 
  MessageOutlined,
  RightOutlined 
} from "@ant-design/icons";

function Dashboard() {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      title: "My Profile",
      description: "View and edit your personal information",
      path: "/me",
      color: "#1890ff"
    },
    {
      key: "connections",
      icon: <TeamOutlined />,
      title: "My Connections", 
      description: "Manage your connections and requests",
      path: "/connections",
      color: "#52c41a"
    },
    {
      key: "recommendations",
      icon: <CompassOutlined/>,
      title: "Find Hiking Partners",
      description: "Discover new hiking partners",
      path: "/recommendations",
      color: "#fa8c16"
    },
    {
      key: "messages",
      icon: <MessageOutlined />,
      title: "Messages",
      description: "Chat with your connections",
      path: "/chats",
      color: "#722ed1",
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        padding: "40px",
        marginBottom: "32px",
        color: "white",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          margin: "0 0 16px 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          Welcome to Winder
        </h1>
        <p style={{
          fontSize: "1.2rem",
          margin: 0,
          opacity: 0.9
        }}>
          For winding your walking paths together- Ready for your next adventure?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 style={{ marginBottom: "24px", color: "#262626" }}>
          Quick Actions
        </h2>
        <Row gutter={[24, 24]}>
          {quickActionItems.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.key}>
              <Card
                hoverable={!item.disabled}
                style={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  background: item.disabled 
                    ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.6 : 1,
                  height: "200px",
                  transition: "all 0.3s ease"
                }}
                bodyStyle={{
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  height: "100%"
                }}
                onClick={() => {
                  if (!item.disabled && item.path) {
                    navigate(item.path);
                  }
                }}
              >
                <div style={{ 
                  fontSize: "3rem", 
                  color: item.disabled ? "#bfbfbf" : item.color,
                  marginBottom: "16px"
                }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  fontSize: "1.1rem", 
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: item.disabled ? "#bfbfbf" : "#262626"
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontSize: "0.85rem", 
                  color: item.disabled ? "#bfbfbf" : "#8c8c8c",
                  margin: "0 0 16px 0",
                  lineHeight: "1.4"
                }}>
                  {item.description}
                </p>
                {!item.disabled && (
                  <RightOutlined style={{ 
                    fontSize: "0.8rem", 
                    color: item.color,
                    opacity: 0.7
                  }} />
                )}
                {item.disabled && (
                  <span style={{
                    fontSize: "0.7rem",
                    color: "#bfbfbf",
                    fontStyle: "italic"
                  }}>
                    Coming Soon
                  </span>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
