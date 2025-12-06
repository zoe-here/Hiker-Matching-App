import React from "react";
import { Card, Button } from "antd";

function getDisplayName(name, enumOptions) {
  return enumOptions.find((opt) => opt.name === name)?.displayName || name || "-";
}

function BioDataCard({ bio, enums, onEdit, hideEdit }) {
  return (
    <Card title="Bio Data" extra={!hideEdit && <Button onClick={onEdit}>Edit</Button>}>
      <p>
        <b>Experience Level:</b> {getDisplayName(bio?.ownExperienceLevel, enums.experienceLevels)}
      </p>
      <p>
        <b>Pace:</b> {getDisplayName(bio?.ownPace, enums.paceOptions)}
      </p>
      <p>
        <b>Region:</b> {getDisplayName(bio?.ownRegion, enums.regionOptions)}
      </p>
      <p>
        <b>Languages:</b> {Array.isArray(bio?.ownLanguages) ? bio.ownLanguages.map(lang => getDisplayName(lang, enums.languageOptions)).join(", ") : ""}
      </p>
      <p>
        <b>Hike Types:</b> {Array.isArray(bio?.ownHikeTypes) ? bio.ownHikeTypes.map(type => getDisplayName(type, enums.hikeTypeOptions)).join(", ") : ""}
      </p>
    </Card>
  );
}

export default BioDataCard;
