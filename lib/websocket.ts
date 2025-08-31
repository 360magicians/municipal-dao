"use client"

import React from "react"

// Add DeafAUTH types
interface DeafAUTHProfile {
  deafIdentity: "deaf" | "hard-of-hearing" | "hearing" | "coda"
  signLanguages: string[]
  communityRole: "advocate" | "educator" | "developer" | "artist" | "leader"
  verificationLevel: "community" | "organization" | "certified"
  visualPreferences: {
    signAvatar: string
    colorScheme: "high-contrast" | "standard" | "custom"
    communicationStyle: "visual" | "tactile" | "mixed"
  }
  contributions: {
    accessibility: number
    community: number
    development: number
    advocacy: number
  }
}

// Update WebSocketMessage interface
interface WebSocketMessage {
  type: "vote" | "proposal_update" | "notification" | "user_joined" | "comment" | "quorum_reached"
  data: any
  timestamp: string
  userId?: string
  proposalId?: string
  deafAuth?: DeafAUTHProfile // Add DeafAUTH data
}

interface WebSocketSubscription {
  id: string
  callback: (message: WebSocketMessage) => void
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private subscriptions: Map<string, WebSocketSubscription[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private userId: string | null = null

  connect(userId: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true
    this.userId = userId

    // In production, this would be your WebSocket server URL
    const wsUrl = process.env.NODE_ENV === "production" ? "wss://your-dao-platform.com/ws" : "ws://localhost:8080/ws"

    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}`)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.isConnecting = false
        this.reconnectAttempts = 0

        // Send authentication message
        this.send({
          type: "auth",
          data: { userId },
          timestamp: new Date().toISOString(),
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.isConnecting = false
        this.ws = null
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.isConnecting = false
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.isConnecting = false
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.userId) {
      console.log("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId)
      }
    }, delay)
  }

  private handleMessage(message: WebSocketMessage) {
    // Handle global subscriptions
    const globalSubs = this.subscriptions.get("global") || []
    globalSubs.forEach((sub) => sub.callback(message))

    // Handle type-specific subscriptions
    const typeSubs = this.subscriptions.get(message.type) || []
    typeSubs.forEach((sub) => sub.callback(message))

    // Handle proposal-specific subscriptions
    if (message.proposalId) {
      const proposalSubs = this.subscriptions.get(`proposal:${message.proposalId}`) || []
      proposalSubs.forEach((sub) => sub.callback(message))
    }
  }

  subscribe(channel: string, callback: (message: WebSocketMessage) => void): string {
    const subscriptionId = Math.random().toString(36).substr(2, 9)
    const subscription: WebSocketSubscription = { id: subscriptionId, callback }

    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, [])
    }
    this.subscriptions.get(channel)!.push(subscription)

    return subscriptionId
  }

  unsubscribe(channel: string, subscriptionId: string) {
    const subs = this.subscriptions.get(channel)
    if (subs) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId)
      if (index !== -1) {
        subs.splice(index, 1)
      }
    }
  }

  send(message: Omit<WebSocketMessage, "timestamp">) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          ...message,
          timestamp: new Date().toISOString(),
        }),
      )
    } else {
      console.warn("WebSocket not connected, message not sent:", message)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.subscriptions.clear()
    this.userId = null
    this.reconnectAttempts = 0
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const wsManager = new WebSocketManager()

// React hook for WebSocket
export function useWebSocket(userId?: string) {
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    if (userId) {
      wsManager.connect(userId)

      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(wsManager.isConnected())
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [userId])

  return {
    isConnected,
    subscribe: wsManager.subscribe.bind(wsManager),
    unsubscribe: wsManager.unsubscribe.bind(wsManager),
    send: wsManager.send.bind(wsManager),
  }
}
