const WebSocket = require("ws")
const http = require("http")
const url = require("url")

// Create HTTP server
const server = http.createServer()

// Create WebSocket server
const wss = new WebSocket.Server({
  server,
  verifyClient: (info) => {
    // Add authentication logic here
    const query = url.parse(info.req.url, true).query
    return query.userId // Simple check for userId
  },
})

// Store connected clients
const clients = new Map()
const proposalRooms = new Map()

// Broadcast to all clients in a room
function broadcastToRoom(roomId, message, excludeUserId = null) {
  const room = proposalRooms.get(roomId)
  if (room) {
    room.forEach((userId) => {
      if (userId !== excludeUserId) {
        const client = clients.get(userId)
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      }
    })
  }
}

// Broadcast to all connected clients
function broadcastToAll(message, excludeUserId = null) {
  clients.forEach((client, userId) => {
    if (userId !== excludeUserId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

wss.on("connection", (ws, req) => {
  const query = url.parse(req.url, true).query
  const userId = query.userId

  console.log(`User ${userId} connected`)

  // Store client connection
  clients.set(userId, ws)

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "system",
      data: { message: "Connected to DAO Platform WebSocket" },
      timestamp: new Date().toISOString(),
    }),
  )

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data)
      console.log(`Received from ${userId}:`, message)

      switch (message.type) {
        case "auth":
          // Handle authentication
          ws.send(
            JSON.stringify({
              type: "auth_success",
              data: { userId },
              timestamp: new Date().toISOString(),
            }),
          )
          break

        case "join_proposal":
          // Join proposal room
          const proposalId = message.data.proposalId
          if (!proposalRooms.has(proposalId)) {
            proposalRooms.set(proposalId, new Set())
          }
          proposalRooms.get(proposalId).add(userId)

          // Notify others in the room
          broadcastToRoom(
            proposalId,
            {
              type: "user_joined",
              data: { userId, proposalId },
              timestamp: new Date().toISOString(),
            },
            userId,
          )
          break

        case "leave_proposal":
          // Leave proposal room
          const leaveProposalId = message.data.proposalId
          if (proposalRooms.has(leaveProposalId)) {
            proposalRooms.get(leaveProposalId).delete(userId)
          }
          break

        case "vote":
          // Handle vote casting
          const voteData = {
            ...message.data,
            userId,
            timestamp: new Date().toISOString(),
          }

          // Broadcast vote to proposal room
          broadcastToRoom(message.data.proposalId, {
            type: "vote",
            data: voteData,
            timestamp: new Date().toISOString(),
          })

          // Send notification to all users
          broadcastToAll(
            {
              type: "notification",
              data: {
                id: `vote-${message.data.proposalId}-${userId}-${Date.now()}`,
                type: "vote",
                title: "New Vote Cast",
                message: `${userId} voted ${message.data.choice.toUpperCase()}`,
                proposalId: message.data.proposalId,
                priority: "medium",
              },
              timestamp: new Date().toISOString(),
            },
            userId,
          )
          break

        case "comment":
          // Handle new comment
          const commentData = {
            ...message.data,
            userId,
            timestamp: new Date().toISOString(),
          }

          broadcastToRoom(message.data.proposalId, {
            type: "comment",
            data: commentData,
            timestamp: new Date().toISOString(),
          })
          break

        case "quorum_reached":
          // Handle quorum reached
          broadcastToAll({
            type: "notification",
            data: {
              id: `quorum-${message.data.proposalId}`,
              type: "quorum",
              title: "Quorum Reached!",
              message: `Proposal has reached the required quorum`,
              proposalId: message.data.proposalId,
              priority: "high",
            },
            timestamp: new Date().toISOString(),
          })
          break

        case "mark_read":
          // Handle marking notification as read
          console.log(`User ${userId} marked notification ${message.data.notificationId} as read`)
          break

        case "mark_all_read":
          // Handle marking all notifications as read
          console.log(`User ${userId} marked all notifications as read`)
          break

        default:
          console.log("Unknown message type:", message.type)
      }
    } catch (error) {
      console.error("Error processing message:", error)
    }
  })

  ws.on("close", () => {
    console.log(`User ${userId} disconnected`)

    // Remove from all proposal rooms
    proposalRooms.forEach((room, proposalId) => {
      if (room.has(userId)) {
        room.delete(userId)
        // Notify others that user left
        broadcastToRoom(proposalId, {
          type: "user_left",
          data: { userId, proposalId },
          timestamp: new Date().toISOString(),
        })
      }
    })

    // Remove client connection
    clients.delete(userId)
  })

  ws.on("error", (error) => {
    console.error(`WebSocket error for user ${userId}:`, error)
  })
})

// Simulate periodic updates (for demo purposes)
setInterval(() => {
  // Simulate random proposal updates
  const proposalIds = ["1", "2", "3"]
  const randomProposalId = proposalIds[Math.floor(Math.random() * proposalIds.length)]

  if (Math.random() < 0.1) {
    // 10% chance every 5 seconds
    broadcastToAll({
      type: "notification",
      data: {
        id: `system-${Date.now()}`,
        type: "system",
        title: "System Update",
        message: "New features have been deployed to the platform",
        priority: "low",
      },
      timestamp: new Date().toISOString(),
    })
  }
}, 5000)

// Start server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down WebSocket server...")
  wss.close(() => {
    server.close(() => {
      console.log("WebSocket server closed")
      process.exit(0)
    })
  })
})
