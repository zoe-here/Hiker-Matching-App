import React from 'react';
import { List, Button, Card } from 'antd';
import { DisconnectOutlined } from '@ant-design/icons';
import Avatar from '../Avatar';
import MessageButton from '../messaging/MessageButton';

function ConnectionsList({ connections, onDisconnect, loading }) {
  return (
    <Card 
      title={`My Connections (${connections.length})`}
      bodyStyle={{ padding: '0' }}
    >
      <List
        loading={loading}
        dataSource={connections}
        style={{ width: '100%' }}
        itemLayout="horizontal"
        renderItem={(connection) => (
          <List.Item
            style={{
              flexWrap: 'wrap',
              padding: '12px 8px',
              width: '100%',
              borderBottom: '1px solid #f0f0f0'
            }}
            actions={[
              <div key="message" style={{ marginRight: 4 }}>
                <MessageButton 
                  connectionId={connection.connectionId}
                  userName={`${connection.firstName} ${connection.lastName}`}
                  profilePictureUrl={connection.profilePictureUrl}
                  size="small"
                />
              </div>,
              <div key="remove" style={{ marginLeft: 4 }}>
                <Button 
                  danger 
                  size="small"
                  icon={<DisconnectOutlined />}
                  onClick={() => onDisconnect(connection.userId)}
                >
                  Remove
                </Button>
              </div>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  firstName={connection.firstName}
                  lastName={connection.lastName}
                  profilePictureUrl={connection.profilePictureUrl}
                  userId={connection.userId}
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

export default ConnectionsList;
