# Real-Time WebSocket Integration

This DAO platform now includes comprehensive WebSocket functionality for real-time voting updates and notifications.

## Features Added

### 🔄 Real-Time Voting
- **Live vote counting** with animated updates
- **Quorum progress tracking** with visual indicators
- **Recent votes display** showing who voted and when
- **Live viewer count** for active proposal watchers
- **Instant vote casting** with real-time feedback

### 🔔 Real-Time Notifications
- **Instant notifications** for votes, comments, and system updates
- **Priority-based alerts** (low, medium, high)
- **Browser notifications** for high-priority items
- **Connection status indicators** showing WebSocket health
- **Notification management** (mark as read, clear, etc.)

### 🌐 WebSocket Infrastructure
- **Robust connection management** with auto-reconnection
- **Room-based messaging** for proposal-specific updates
- **Message type routing** for different notification types
- **Authentication integration** with user sessions
- **Error handling and recovery** for network issues

## Technical Implementation

### Client-Side Components

1. **WebSocket Manager** (`lib/websocket.ts`)
   - Singleton WebSocket connection manager
   - Automatic reconnection with exponential backoff
   - Subscription-based message routing
   - Connection health monitoring

2. **Real-Time Voting Hook** (`hooks/useRealTimeVoting.ts`)
   - Live vote count updates
   - Quorum progress tracking
   - Recent votes management
   - Vote casting functionality

3. **Real-Time Notifications Hook** (`hooks/useRealTimeNotifications.ts`)
   - Notification state management
   - Browser notification integration
   - Priority-based filtering
   - Read/unread status tracking

4. **UI Components**
   - `RealTimeVotingCard`: Animated voting interface
   - `RealTimeNotifications`: Notification dropdown with live updates
   - Smooth animations using Framer Motion

### Server-Side WebSocket Server

- **Node.js WebSocket server** (`server/websocket-server.js`)
- **Room management** for proposal-specific messaging
- **Message broadcasting** to relevant users
- **Authentication verification**
- **Graceful shutdown handling**

## Usage

### Starting the WebSocket Server

\`\`\`bash
# Install dependencies
npm install

# Start the WebSocket server (development)
npm run ws-server

# Start the Next.js application
npm run dev
\`\`\`

### Production Deployment

For production, you'll need to:

1. **Deploy WebSocket server** to a cloud provider
2. **Update WebSocket URL** in `lib/websocket.ts`
3. **Configure load balancing** for multiple server instances
4. **Set up SSL/TLS** for secure WebSocket connections (wss://)

### Environment Variables

\`\`\`env
# WebSocket server configuration
WS_PORT=8080
WS_HOST=localhost

# Production WebSocket URL
NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws
\`\`\`

## Message Types

### Vote Messages
\`\`\`json
{
  "type": "vote",
  "data": {
    "proposalId": "1",
    "userId": "alice.eth",
    "choice": "for",
    "votingPower": 12.5,
    "reason": "Strong proposal with clear benefits"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
\`\`\`

### Notification Messages
\`\`\`json
{
  "type": "notification",
  "data": {
    "id": "notification-123",
    "type": "vote",
    "title": "New Vote Cast",
    "message": "alice.eth voted FOR on Marketing Budget proposal",
    "priority": "medium",
    "actionUrl": "/proposals/1"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
\`\`\`

### System Messages
\`\`\`json
{
  "type": "quorum_reached",
  "data": {
    "proposalId": "1",
    "quorum": 51.2,
    "proposalTitle": "Marketing Budget Allocation"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
\`\`\`

## Security Considerations

1. **Authentication**: All WebSocket connections require valid user authentication
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **Input Validation**: All incoming messages are validated
4. **CORS Configuration**: Proper CORS setup for cross-origin requests
5. **SSL/TLS**: Use secure WebSocket connections (wss://) in production

## Performance Optimizations

1. **Connection Pooling**: Efficient client connection management
2. **Message Batching**: Group related messages to reduce network overhead
3. **Selective Broadcasting**: Only send messages to relevant users
4. **Memory Management**: Automatic cleanup of disconnected clients
5. **Compression**: WebSocket message compression for large payloads

## Monitoring and Analytics

- **Connection metrics**: Track active connections and reconnection rates
- **Message throughput**: Monitor message volume and processing times
- **Error tracking**: Log and alert on WebSocket errors
- **User engagement**: Track real-time participation metrics

## Future Enhancements

1. **Horizontal Scaling**: Redis-based message broadcasting for multiple servers
2. **Message Persistence**: Store messages for offline users
3. **Advanced Filtering**: User-customizable notification preferences
4. **Mobile Push Notifications**: Integration with mobile push services
5. **Analytics Dashboard**: Real-time engagement and participation metrics
