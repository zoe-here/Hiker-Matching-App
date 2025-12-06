import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message, List, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Avatar from "./components/Avatar";
import UserPreview from "./components/UserPreview";
import PreferencesCard from "./components/PreferencesCard";

function RecommendationPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [dismissing, setDismissing] = useState({});
  const [connecting, setConnecting] = useState({});
  const [requestSent, setRequestSent] = useState({});
  const [previewUser, setPreviewUser] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [preferences, setPreferences] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Fetch recommendations 
  const fetchRecommendations = async (prefs) => {
    setSearchLoading(true);
    setHasSearched(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // Send preferences as query params if any are set
      let query = "";
      if (prefs && Object.keys(prefs).length > 0) {
        const params = new URLSearchParams();
        if (prefs.experienceLevel) params.append("experienceLevel", prefs.experienceLevel);
        if (prefs.pace) params.append("pace", prefs.pace);
        if (prefs.region) params.append("region", prefs.region);
        if (prefs.languages && prefs.languages.length) params.append("languages", prefs.languages.join(","));
        if (prefs.hikeTypes && prefs.hikeTypes.length) params.append("hikeTypes", prefs.hikeTypes.join(","));
        query = `?${params.toString()}`;
      }
      const res = await fetch(`/v1/api/recommendations${query}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      const ids = await res.json();
      const users = await Promise.all(
        ids.map(async id => {
          const userRes = await fetch(`/v1/api/users/${id}`, { headers });
          if (!userRes.ok) return { id, firstName: "Unknown", lastName: "", profilePictureUrl: null };
          const data = await userRes.json();
          return { id, ...data };
        })
      );
      setRecommendations(users);
    } catch (e) {
      message.error("Failed to load recommendations. Please log in again.");
      navigate("/login");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    setDismissing((prev) => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/v1/api/recommendations/${id}/dismiss`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error("Failed to dismiss recommendation");
      setRecommendations((prev) => prev.filter((user) => user.id !== id));
      message.success("Recommendation dismissed");
    } catch (e) {
      message.error("Failed to dismiss recommendation");
    } finally {
      setDismissing((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleConnect = async (id) => {
    setConnecting((prev) => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch("/v1/api/connections", {
        method: "POST",
        headers,
        body: JSON.stringify({ recipientId: id }),
      });
      if (!res.ok) throw new Error("Failed to send connection request");
      message.success("Connection request sent");
      setRequestSent((prev) => ({ ...prev, [id]: true }));
    } catch (e) {
      message.error("Failed to send connection request");
    } finally {
      setConnecting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePreview = async (id) => {
    setPreviewLoading(true);
    setPreviewVisible(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [profileRes, aboutRes, bioRes] = await Promise.all([
        fetch(`/v1/api/users/${id}`, { headers }).then((r) => r.json()),
        fetch(`/v1/api/users/${id}/profile`, { headers }).then((r) => r.json()),
        fetch(`/v1/api/users/${id}/bio`, { headers }).then((r) => r.json()),
      ]);
      setPreviewUser({ profile: profileRes, about: aboutRes, bio: bioRes });
    } catch (e) {
      message.error("Failed to load user preview.");
      setPreviewVisible(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Fetch preferences from MeController on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("/v1/api/me/preferences", { headers });
        if (res.ok) {
          const data = await res.json();
          setPreferences({
            experienceLevel: data.experienceLevel || undefined,
            pace: data.pace || undefined,
            region: data.region || undefined,
            languages: data.languages || [],
            hikeTypes: data.hikeTypes || [],
          });
        }
      } catch (e) {
        // ignore, just use empty defaults
      }
    };
    fetchPreferences();
  }, []);

  // Save preferences and then fetch recommendations
  const handleSaveAndSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch("/v1/api/me/preferences", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          preferredExperienceLevel: preferences.experienceLevel,
          preferredPace: preferences.pace,
          preferredRegion: preferences.region,
          preferredLanguages: preferences.languages,
          preferredHikeTypes: preferences.hikeTypes,
        }),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      message.success("Preferences saved!");
      await fetchRecommendations(preferences);
    } catch (e) {
      message.error("Failed to update preferences");
    }
  };

  if (searchLoading) return <Spin style={{ display: "block", margin: "100px auto" }} />;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <PreferencesCard
        preferences={preferences}
        onChange={setPreferences}
        onSearch={handleSaveAndSearch}
        loading={searchLoading}
        style={{ maxWidth: 350, margin: '0 auto 24px auto', boxShadow: '0 2px 8px #f0f1f2', borderRadius: 8 }}
      />
      {recommendations.length > 0 ? (
        <Card title="Recommendations">
          <List
            dataSource={recommendations}
            renderItem={user => (
              <List.Item
                actions={
                  requestSent[user.id]
                    ? [<span style={{ color: '#52c41a', fontWeight: 500 }}>Request Sent</span>]
                    : [
                        <Button
                          type="primary"
                          loading={!!connecting[user.id]}
                          onClick={() => handleConnect(user.id)}
                          disabled={!!connecting[user.id] || !!dismissing[user.id]}
                        >
                          Connect
                        </Button>,
                        <Button
                          danger
                          loading={!!dismissing[user.id]}
                          onClick={() => handleDismiss(user.id)}
                          disabled={!!connecting[user.id] || !!dismissing[user.id]}
                        >
                          Dismiss
                        </Button>,
                        <Button
                          onClick={() => handlePreview(user.id)}
                          disabled={!!connecting[user.id] || !!dismissing[user.id]}
                        >
                          Preview
                        </Button>
                      ]
                }
              >
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  profilePictureUrl={user.profilePictureUrl}
                  userId={user.id}
                  linkToProfile={true}
                />
              </List.Item>
            )}
          />
        </Card>
      ) : (
        hasSearched && (
          <div style={{ marginTop: 32, textAlign: 'center', color: '#888', fontSize: 16 }}>
            <p>No recommendations found with your search criteria.<br />
            You can change your preferences and try again.<br />
            <span style={{ fontStyle: 'italic', color: '#52c41a' }}>Flexibility is the key to success in life!</span></p>
          </div>
        )
      )}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        title="User Preview"
        width={600}
      >
        <UserPreview user={previewUser} loading={previewLoading} />
      </Modal>
    </div>
  );
}

export default RecommendationPage;
