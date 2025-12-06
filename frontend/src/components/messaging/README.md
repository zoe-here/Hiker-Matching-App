# Messaging Components Documentation

## Overview
This messaging system provides a Facebook Messenger-like experience with floating chat windows that can be minimized and stacked.

## Components

### 1. MessageButton
A simple button that opens a chat window when clicked.

```jsx
import MessageButton from "./components/messaging/MessageButton";

<MessageButton 
  userId={userId}
  userName="John Doe"
  onOpenChat={onOpenChat} // Provided by MessagingProvider
  size="default" // "small", "default", "large"
  type="primary" // "default", "primary", "dashed", etc.
/>
```

### 2. ChatWindow
The floating chat window that displays messages and handles user input.

Features:
- Minimize/maximize functionality
- Real-time message display (mock data for now)
- Auto-scroll to latest message
- Enter key to send messages
- Time stamps
- Responsive design

### 3. MessagingProvider
Wraps your app and manages multiple chat windows.

```jsx
import MessagingProvider from "./components/messaging/MessagingProvider";

<MessagingProvider>
  <YourApp />
</MessagingProvider>
```

## Usage Examples

### In UserPage
```jsx
function UserPage({ onOpenChat }) {
  return (
    <div>
      {/* User profile content */}
      <MessageButton 
        userId={userId}
        userName={`${profile.firstName} ${profile.lastName}`}
        onOpenChat={onOpenChat}
        type="primary"
      />
    </div>
  );
}
```

### In RecommendationPage
```jsx
function RecommendationPage({ onOpenChat }) {
  return (
    <div>
      {recommendations.map(user => (
        <Card key={user.id}>
          <h3>{user.firstName} {user.lastName}</h3>
          <MessageButton 
            userId={user.id}
            userName={`${user.firstName} ${user.lastName}`}
            onOpenChat={onOpenChat}
            size="small"
          />
        </Card>
      ))}
    </div>
  );
}
```

## Features for Future Implementation

### Backend Integration
1. **Message Entity**: Already created - matches the Message.java structure
2. **Chat Service**: Will need to create endpoints for:
   - GET /api/chats/{chatId}/messages - Get chat history
   - POST /api/chats/{chatId}/messages - Send message
   - GET /api/chats - Get user's chat list
   - POST /api/chats - Create new chat

3. **WebSocket Integration**: For real-time messaging
   - Socket.io or native WebSocket
   - Real-time message delivery
   - Online status indicators

### Frontend Enhancements
1. **Message Status**: Sent, delivered, read indicators
2. **Typing Indicators**: Show when someone is typing
3. **Message Persistence**: Store messages locally
4. **Emoji Support**: Add emoji picker
5. **File Sharing**: Image/file upload capability
6. **Chat List**: Show all active chats
7. **Notifications**: Browser notifications for new messages

## Current Mock Data
The ChatWindow currently shows mock messages for demonstration. Replace the mock data in ChatWindow.js with real API calls when backend is ready.

## Styling Notes
- Uses Ant Design components for consistency
- Responsive design works on mobile
- Fixed positioning with z-index 1000
- Smooth animations for minimize/maximize
- Chat windows stack horizontally when multiple are open