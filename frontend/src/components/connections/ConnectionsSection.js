import React from 'react';
import { Row, Col } from 'antd';
import { useConnections } from '../../hooks/useConnections';
import ConnectionsList from './ConnectionsList';
import IncomingRequests from './IncomingRequests';
import OutgoingRequests from './OutgoingRequests';

function ConnectionsSection() {
  const {
    loading,
    connections,
    incomingRequests,
    outgoingRequests,
    acceptRequest,
    rejectRequest,
    disconnect
  } = useConnections();

  return (
    <div style={{ marginTop: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <ConnectionsList 
            connections={connections}
            onDisconnect={disconnect}
            loading={loading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <IncomingRequests 
            requests={incomingRequests}
            onAccept={acceptRequest}
            onReject={rejectRequest}
            loading={loading}
          />
        </Col>
        <Col xs={24} lg={8}>
          <OutgoingRequests 
            requests={outgoingRequests}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}

export default ConnectionsSection;
