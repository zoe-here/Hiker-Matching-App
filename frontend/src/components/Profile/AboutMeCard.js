import React from "react";
import { Card, Button } from "antd";

function getDisplayName(name, enumOptions) {
  return enumOptions.find((opt) => opt.name === name)?.displayName || name || "-";
}

function AboutMeCard({ about, enums, onEdit, hideEdit, hideEmail }) {
  return (
    <Card
      title="About Me & Contact"
      style={{ marginBottom: 24 }}
      extra={!hideEdit && <Button onClick={onEdit}>Edit</Button>}
    >
      <p>
        <b>About Me:</b> {about?.aboutMe}
      </p>
      <p>
        <b>Birth Date:</b> {about?.birthDate}
      </p>
      <p>
        <b>Gender:</b> {getDisplayName(about?.gender, enums.genderOptions)}
      </p>
      {!hideEmail && (
        <p>
          <b>Email:</b> {about?.email}
        </p>
      )}
    </Card>
  );
}

export default AboutMeCard;
