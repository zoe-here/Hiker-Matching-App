import React, { useRef } from "react";
import { Card, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

function ProfilePictureCard({ profile, onEdit, onDelete, loading, onEditName }) {
  const fileInputRef = useRef();

  const handleEditClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onEdit) {
      onEdit(file);
      e.target.value = null;
    }
  };

  return (
    <Card title="Profile Picture & Name">
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <Tooltip title="Edit picture">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={handleEditClick}
              loading={loading}
            >
              Edit Picture
            </Button>
          </Tooltip>
          {profile?.profilePictureUrl && (
            <Tooltip title="Delete picture">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={onDelete}
                loading={loading}
              >
                Delete
              </Button>
            </Tooltip>
          )}
        </div>
        
        <div style={{ display: "inline-block", position: "relative" }}>
          {profile?.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt="Profile"
              style={{ 
                width: 120, 
                height: 120, 
                borderRadius: "50%", 
                marginBottom: 16,
                objectFit: "cover",
                border: "3px solid #f0f0f0"
              }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
              
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                color: "white",
                margin: "0 auto 16px auto",
                border: "3px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <span role="img" aria-label="avatar">👤</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
          <h3 style={{ margin: 0 }}>
            {profile ? `${profile.firstName} ${profile.lastName}` : "-"}
          </h3>
          <Tooltip title="Edit name">
            <Button
              icon={<EditOutlined />}
              size="small"
              style={{ marginLeft: 8 }}
              type="text"
              onClick={onEditName}
            />
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}

export default ProfilePictureCard;
