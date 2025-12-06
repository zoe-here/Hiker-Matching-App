import React from "react";
import { Spin } from "antd";
import { useEnums } from "./EnumsContext";
import ConnectionsSection from "./components/connections/ConnectionsSection";

function MyConnections() {
  const { loading: enumsLoading } = useEnums();

  if (enumsLoading) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 24, textAlign: "center" }}>My Connections</h1>
      <ConnectionsSection />
    </div>
  );
}

export default MyConnections;
