"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, BellRing, Check, X, Vote, MessageCircle, Users, AlertTriangle, Zap, Wifi, WifiOff } from "lucide-react"
import { useRealTimeNotifications, type Notification } from "@/hooks/useRealTimeNotifications"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface RealTimeNotificationsProps {
  userId: string
}

export function RealTimeNotifications({ userId }: RealTimeNotificationsProps) {
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, clearNotification } =
    useRealTimeNotifications(userId)

  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "vote":
        return <Vote className="w-4 h-4 text-blue-500" />
      case "comment":
        return <MessageCircle className="w-4 h-4 text-green-500" />
      case "membership":
        return <Users className="w-4 h-4 text-purple-500" />
      case "quorum":
        return <Zap className="w-4 h-4 text-yellow-500" />
      case "system":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
        {unreadCount > 0 ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}

        {/* Connection Status Indicator */}
        <div
          className={`absolute -top-1 -left-1 w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        />

        {/* Unread Count Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 z-50"
          >
            <Card className="shadow-lg border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                    {!isConnected && <WifiOff className="w-4 h-4 ml-2 text-red-500" />}
                    {isConnected && <Wifi className="w-4 h-4 ml-2 text-green-500" />}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                        Mark all read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{notifications.length} total</span>
                  <span>•</span>
                  <span>{unreadCount} unread</span>
                  <span>•</span>
                  <span className={`flex items-center ${isConnected ? "text-green-600" : "text-red-600"}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <AnimatePresence>
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${
                              !notification.read ? getPriorityColor(notification.priority) : "border-l-gray-200"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4
                                      className={`text-sm font-medium ${
                                        !notification.read ? "text-gray-900" : "text-gray-600"
                                      }`}
                                    >
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(notification.timestamp)}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {notification.type}
                                      </Badge>
                                      {notification.priority === "high" && (
                                        <Badge variant="destructive" className="text-xs">
                                          High Priority
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1 ml-2">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => clearNotification(notification.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                {notification.actionUrl && (
                                  <Link
                                    href={notification.actionUrl}
                                    onClick={() => {
                                      markAsRead(notification.id)
                                      setIsOpen(false)
                                    }}
                                  >
                                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                      View Details
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
