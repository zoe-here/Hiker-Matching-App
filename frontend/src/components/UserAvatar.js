import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";

function UserAvatar({ userId, size = 48, hideName = false, linkToProfile = false, onUserDataLoaded }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await fetch(`/v1/api/users/${userId}`, { headers });
        
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          
          // Notify parent component with user data
          if (onUserDataLoaded) {
            const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
            onUserDataLoaded({
              name: fullName || `User ${userId}`,
              profile: profile
            });
          }
        } else {
          console.error("Failed to fetch user profile:", response.status);
          if (onUserDataLoaded) {
            onUserDataLoaded({
              name: `User ${userId}`,
              profile: null
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (onUserDataLoaded) {
          onUserDataLoaded({
            name: `User ${userId}`,
            profile: null
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, onUserDataLoaded]);

  if (loading || !userProfile) {
    return null;
  }

  return (
    <Avatar
      firstName={userProfile.firstName}
      lastName={userProfile.lastName}
      profilePictureUrl={userProfile.profilePictureUrl}
      hideName={hideName}
      userId={userId}
      linkToProfile={linkToProfile}
    />
  );
}

export default UserAvatar;

//TODO: Check and clean up all Avatar usages