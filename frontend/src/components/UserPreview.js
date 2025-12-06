import React from "react";
import { Spin } from "antd";
import Avatar from "./Avatar";
import AboutMeCard from "./Profile/AboutMeCard";
import BioDataCard from "./Profile/BioDataCard";
import { useEnums } from "../EnumsContext";

function UserPreview({ user, loading }) {
  const { enums } = useEnums();
  if (loading || !user) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }
  return (
    <div>
      <Avatar
        firstName={user.profile?.firstName}
        lastName={user.profile?.lastName}
        profilePictureUrl={user.profile?.profilePictureUrl}
      />
      <AboutMeCard about={{ ...user.about, email: undefined }} enums={enums} hideEmail hideEdit />
      <BioDataCard bio={user.bio} enums={enums} hideEdit />
    </div>
  );
}

export default UserPreview;
