import React from 'react';
import { List, Button, Card } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Avatar from '../Avatar';

function IncomingRequests({ requests, onAccept, onReject, loading }) {
  return (
    <Card title={`Received Requests (${requests.length})`}>
      <List
        loading={loading}
        dataSource={requests}
        style={{ width: '100%' }}
        itemLayout="horizontal"
        renderItem={(request) => (
          <List.Item
            style={{
              flexWrap: 'wrap',
              padding: '12px'
            }}
            actions={[
              <div key="accept" style={{ marginRight: 8 }}>
                <Button 
                  type="primary" 
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => onAccept(request.connectionId)}
                >
                  Accept
                </Button>
              </div>,
              <div key="reject">
                <Button 
                  danger 
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onReject(request.connectionId)}
                >
                  Reject
                </Button>
              </div>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  firstName={request.requesterFirstName}
                  lastName={request.requesterLastName}
                  profilePictureUrl={request.requesterProfilePictureUrl}
                  userId={request.requesterId}
                  linkToProfile={true}
                />
              }
            
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

export default IncomingRequests;
