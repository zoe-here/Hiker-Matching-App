import React from "react";
import { useNavigate } from "react-router-dom";

function Avatar({ firstName, lastName, profilePictureUrl, hideName, userId, linkToProfile = false }) {
  const navigate = useNavigate();
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";
  
  const handleNameClick = (e) => {
    if (linkToProfile && userId) {
      e.preventDefault();
      navigate(`/user/${userId}`);
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {profilePictureUrl ? (
        <img
          src={profilePictureUrl}
          alt="Profile"
          style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#bbb",
          }}
        >
          <span role="img" aria-label="avatar">👤</span>
        </div>
      )}
      {!hideName && (
        linkToProfile && userId ? (
          <a
            href={`/user/${userId}`}
            onClick={handleNameClick}
            style={{ 
              fontWeight: 500,
              color: "#1890ff",
              textDecoration: "none",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = "none";
            }}
          >
            {displayName}
          </a>
        ) : (
          <span style={{ fontWeight: 500 }}>
            {displayName}
          </span>
        )
      )}
    </div>
  );
}

export default Avatar;
