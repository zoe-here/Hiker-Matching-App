import React from 'react';
import { List, Card } from 'antd';
import Avatar from '../Avatar';

function OutgoingRequests({ requests, loading }) {
  return (
    <Card title={`Sent Requests (${requests.length})`}>
      <List
        loading={loading}
        dataSource={requests}
        renderItem={(request) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  firstName={request.recipientFirstName}
                  lastName={request.recipientLastName}
                  profilePictureUrl={request.recipientProfilePictureUrl}
                  userId={request.recipientId}
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

export default OutgoingRequests;
