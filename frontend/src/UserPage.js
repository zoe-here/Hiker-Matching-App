import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, message, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "./components/Avatar";
import AboutMeCard from "./components/Profile/AboutMeCard";
import BioDataCard from "./components/Profile/BioDataCard";
import MessageButton from "./components/messaging/MessageButton";
import { useEnums } from "./EnumsContext";
import { useConnections } from "./hooks/useConnections";

function UserPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [about, setAbout] = useState(null);
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enums } = useEnums();
  const { getConnectionId, isConnectedTo } = useConnections();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [profileRes, aboutRes, bioRes] = await Promise.all([
          fetch(`/v1/api/users/${id}`, { headers }).then(async (r) => {
            const data = await r.json();
            if (!r.ok) {
              throw new Error(data.message || 'Failed to fetch user data');
            }
            return data;
          }),
          fetch(`/v1/api/users/${id}/profile`, { headers }).then(async (r) => {
            const data = await r.json();
            if (!r.ok) {
              throw new Error(data.message || 'Failed to fetch profile data');
            }
            return data;
          }),
          fetch(`/v1/api/users/${id}/bio`, { headers }).then(async (r) => {
            const data = await r.json();
            if (!r.ok) {
              throw new Error(data.message || 'Failed to fetch bio data');
            }
            return data;
          }),
        ]);
        setProfile(profileRes);
        setAbout(aboutRes);
        setBio(bioRes);
        setError(null);
      } catch (e) {
        if (e.message.includes('Access denied')) {
          setError('Access Denied: You do not have permission to view this profile');
        } else if (e.message.includes('JWT')) {
          // If it's a JWT/token error, redirect to login
          message.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError('An error occurred while loading the profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, navigate]);

  if (loading) return <Spin style={{ display: "block", margin: "100px auto" }} />;

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: "100px auto", padding: 24 }}>
        <Card>
          <div style={{
            textAlign: "center",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              color: "#ff4d4f",
              fontSize: "24px",
              fontWeight: "bold"
            }}>
              Access Denied
            </div>
            <div style={{
              color: "#666",
              fontSize: "16px"
            }}>
              You do not have permission to view this profile
            </div>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                background: "#1890ff",
                color: "white",
                cursor: "pointer"
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Avatar
                firstName={profile?.firstName}
                lastName={profile?.lastName}
                profilePictureUrl={profile?.profilePictureUrl}
              />
              <div style={{ marginTop: 16 }}>
                <Space>
                  {isConnectedTo(parseInt(id)) && (
                    <MessageButton 
                      connectionId={getConnectionId(parseInt(id))}
                      userName={`${profile?.firstName} ${profile?.lastName}`}
                      type="primary"
                    />
                  )}
                </Space>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <AboutMeCard about={{ ...about, email: undefined }} enums={enums} hideEmail hideEdit />
          <BioDataCard bio={bio} enums={enums} hideEdit />
        </Col>
      </Row>
    </div>
  );
}

export default UserPage;

