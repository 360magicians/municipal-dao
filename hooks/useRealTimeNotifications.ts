"use client"

import { useState, useEffect, useCallback } from "react"
import { wsManager } from "@/lib/websocket"

export interface Notification {
  id: string
  type: "proposal" | "vote" | "comment" | "membership" | "system" | "quorum"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
  data?: any
}

export function useRealTimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      // Avoid duplicates
      if (prev.some((n) => n.id === notification.id)) {
        return prev
      }
      return [notification, ...prev].slice(0, 50) // Keep last 50 notifications
    })

    if (!notification.read) {
      setUnreadCount((prev) => prev + 1)
    }

    // Show browser notification for high priority items
    if (notification.priority === "high" && "Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        tag: notification.id,
      })
    }
  }, [])

  const handleWebSocketMessage = useCallback(
    (message: any) => {
      let notification: Notification | null = null

      switch (message.type) {
        case "vote":
          if (message.data.userId !== userId) {
            // Don't notify about own votes
            notification = {
              id: `vote-${message.data.proposalId}-${message.data.userId}-${Date.now()}`,
              type: "vote",
              title: "New Vote Cast",
              message: `${message.data.userId} voted ${message.data.choice.toUpperCase()} on "${message.data.proposalTitle}"`,
              timestamp: message.timestamp,
              read: false,
              actionUrl: `/proposals/${message.data.proposalId}`,
              priority: "medium",
              data: message.data,
            }
          }
          break

        case "proposal_update":
          notification = {
            id: `proposal-${message.data.proposalId}-${Date.now()}`,
            type: "proposal",
            title: "Proposal Updated",
            message: message.data.message,
            timestamp: message.timestamp,
            read: false,
            actionUrl: `/proposals/${message.data.proposalId}`,
            priority: "medium",
            data: message.data,
          }
          break

        case "comment":
          if (message.data.userId !== userId) {
            notification = {
              id: `comment-${message.data.proposalId}-${message.data.commentId}`,
              type: "comment",
              title: "New Comment",
              message: `${message.data.userId} commented on "${message.data.proposalTitle}"`,
              timestamp: message.timestamp,
              read: false,
              actionUrl: `/proposals/${message.data.proposalId}#comment-${message.data.commentId}`,
              priority: "low",
              data: message.data,
            }
          }
          break

        case "quorum_reached":
          notification = {
            id: `quorum-${message.data.proposalId}`,
            type: "quorum",
            title: "Quorum Reached!",
            message: `Proposal "${message.data.proposalTitle}" has reached the required quorum (${message.data.quorum}%)`,
            timestamp: message.timestamp,
            read: false,
            actionUrl: `/proposals/${message.data.proposalId}`,
            priority: "high",
            data: message.data,
          }
          break

        case "notification":
          notification = {
            id: message.data.id || `notification-${Date.now()}`,
            type: message.data.type || "system",
            title: message.data.title,
            message: message.data.message,
            timestamp: message.timestamp,
            read: false,
            actionUrl: message.data.actionUrl,
            priority: message.data.priority || "medium",
            data: message.data,
          }
          break
      }

      if (notification) {
        addNotification(notification)
      }
    },
    [userId, addNotification],
  )

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Connect to WebSocket
    wsManager.connect(userId)

    // Subscribe to notifications
    const subscriptionId = wsManager.subscribe("global", handleWebSocketMessage)

    // Check connection status
    const interval = setInterval(() => {
      setIsConnected(wsManager.isConnected())
    }, 1000)

    return () => {
      wsManager.unsubscribe("global", subscriptionId)
      clearInterval(interval)
    }
  }, [userId, handleWebSocketMessage])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))

    // Send read status to server
    wsManager.send({
      type: "mark_read",
      data: { notificationId },
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)

    wsManager.send({
      type: "mark_all_read",
      data: { userId },
    })
  }, [userId])

  const clearNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setUnreadCount((prev) => {
        const notification = notifications.find((n) => n.id === notificationId)
        return notification && !notification.read ? Math.max(0, prev - 1) : prev
      })
    },
    [notifications],
  )

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    addNotification,
  }
}
