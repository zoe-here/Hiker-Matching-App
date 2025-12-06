import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import TopNavigation from "./TopNavigation";

function Layout({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile for the navigation
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please log in to access this page.");
        navigate("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch("/v1/api/me/", { headers });
        
        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
        } else {
          message.error("Failed to load profile data. Please log in again.");
          navigate("/login");
        }
      } catch (e) {
        message.error("Failed to load profile data. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <TopNavigation profile={profile} />
      <div style={{ 
        minHeight: "calc(100vh - 64px)", // 64px is nav height
        padding: "24px"
      }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
