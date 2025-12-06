import { useState, useEffect } from 'react';
import { message } from 'antd';

export function useConnections() {
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [connectionsRes, incomingRes, outgoingRes] = await Promise.all([
        fetch("/v1/api/connections/accepted-with-details", { headers }), 
        fetch("/v1/api/connections/requests", { headers }),
        fetch("/v1/api/connections/sent", { headers })
      ]);

      
      if (connectionsRes.ok) {
        const connectionsWithDetails = await connectionsRes.json();
        setConnections(connectionsWithDetails);
      }
      
      if (incomingRes.ok) setIncomingRequests(await incomingRes.json());
      if (outgoingRes.ok) setOutgoingRequests(await outgoingRes.json());
    } catch (error) {
      message.error("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/v1/api/connections/${id}/accept`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        message.success("Connection request accepted");
        await fetchConnections();
        return true;
      } else {
        const errorText = await response.text();
        console.error('Accept request failed:', response.status, errorText);
        message.error(`Failed to accept request: ${response.status}`);
      }
    } catch (error) {
      console.error('Accept request error:', error);
      message.error("Failed to accept request");
    }
    return false;
  };

  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/v1/api/connections/${id}/reject`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        message.success("Connection request rejected");
        await fetchConnections();
        return true;
      } else {
        const errorText = await response.text();
        console.error('Reject request failed:', response.status, errorText);
        message.error(`Failed to reject request: ${response.status}`);
      }
    } catch (error) {
      console.error('Reject request error:', error);
      message.error("Failed to reject request");
    }
    return false;
  };

  const disconnect = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/v1/api/connections/${targetUserId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        message.success("Connection removed");
        await fetchConnections();
        return true;
      }
    } catch (error) {
      message.error("Failed to remove connection");
    }
    return false;
  };

  // Helper functions for chat integration
  const getConnectionId = (userId) => {
    const connection = connections.find(conn => conn.userId === parseInt(userId));
    return connection?.connectionId || null;
  };

  const isConnectedTo = (userId) => {
    return connections.some(conn => conn.userId === parseInt(userId));
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    loading,
    connections,
    incomingRequests,
    outgoingRequests,
    fetchConnections,
    acceptRequest,
    rejectRequest,
    disconnect,
    getConnectionId,
    isConnectedTo
  };
}
