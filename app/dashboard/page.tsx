"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Vote, Wallet, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RealTimeNotifications } from "@/components/RealTimeNotifications"
import { useWebSocket } from "@/lib/websocket"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  walletAddress?: string
  joinedOrgs: string[]
  profile?: {
    bio: string
    skills: string[]
    interests: string[]
  }
}

interface Notification {
  id: string
  type: "proposal" | "vote" | "membership" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "proposal",
    title: "New Proposal: Marketing Budget",
    message: "A new proposal has been submitted for Q2 marketing budget allocation",
    timestamp: "2024-01-20T10:30:00Z",
    read: false,
    actionUrl: "/proposals/1",
  },
  {
    id: "2",
    type: "vote",
    title: "Voting Reminder",
    message: "Partnership proposal voting ends in 2 days",
    timestamp: "2024-01-20T09:15:00Z",
    read: false,
    actionUrl: "/proposals/2",
  },
  {
    id: "3",
    type: "membership",
    title: "Welcome to DeveloperDAO",
    message: "Your membership has been approved. Welcome to the community!",
    timestamp: "2024-01-19T16:45:00Z",
    read: true,
  },
]

const mockDAOStats = {
  "developer-dao": {
    name: "DeveloperDAO",
    totalMembers: 1247,
    activeProposals: 3,
    treasuryValue: 2450000,
    yourVotingPower: 2.3,
    yourReputation: 850,
    recentActivity: [
      { type: "vote", description: "Voted on Marketing Budget proposal", timestamp: "2 hours ago" },
      { type: "proposal", description: "Created Security Audit proposal", timestamp: "1 day ago" },
      { type: "comment", description: "Commented on Partnership discussion", timestamp: "2 days ago" },
    ],
  },
  "defi-collective": {
    name: "DeFi Collective",
    totalMembers: 892,
    activeProposals: 2,
    treasuryValue: 1800000,
    yourVotingPower: 1.8,
    yourReputation: 420,
    recentActivity: [
      { type: "vote", description: "Voted on Yield Strategy proposal", timestamp: "3 hours ago" },
      { type: "delegate", description: "Delegated voting power to alice.eth", timestamp: "1 week ago" },
    ],
  },
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const router = useRouter()
  const { isConnected } = useWebSocket(null) // Initialize with null

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const unreadNotifications = notifications.filter((n) => !n.read).length

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold">DAO Platform</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-blue-600">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Proposals
              </Link>
              <Link href="/organizations" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Organizations
              </Link>
              <Link href="/treasury" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Treasury
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
              <RealTimeNotifications userId={user.id} />
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here's what's happening in your DAOs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* DAO Overview Cards */}
            {user.joinedOrgs.map((orgId) => {
              const stats = mockDAOStats[orgId as keyof typeof mockDAOStats]
              if (!stats) return null

              return (
                <Card key={orgId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{stats.name}</CardTitle>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/organizations/${orgId}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.totalMembers}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.activeProposals}</div>
                        <div className="text-xs text-muted-foreground">Active Proposals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.yourVotingPower}%</div>
                        <div className="text-xs text-muted-foreground">Your Voting Power</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.yourReputation}</div>
                        <div className="text-xs text-muted-foreground">Reputation</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        {stats.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.type === "vote"
                                  ? "bg-green-500"
                                  : activity.type === "proposal"
                                    ? "bg-blue-500"
                                    : activity.type === "comment"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                              }`}
                            ></div>
                            <span className="flex-1">{activity.description}</span>
                            <span className="text-muted-foreground">{activity.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/proposals/new">
                      <Vote className="h-6 w-6" />
                      <span>Create Proposal</span>
                    </Link>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/organizations/discover">
                      <Users className="h-6 w-6" />
                      <span>Join DAO</span>
                    </Link>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline" asChild>
                    <Link href="/profile">
                      <Settings className="h-6 w-6" />
                      <span>Edit Profile</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary">{unreadNotifications}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${!notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                      {notification.actionUrl && (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={notification.actionUrl}>View</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.walletAddress && (
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{user.walletAddress}</span>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Memberships</h4>
                  <div className="space-y-1">
                    {user.joinedOrgs.map((orgId) => {
                      const stats = mockDAOStats[orgId as keyof typeof mockDAOStats]
                      return stats ? (
                        <div key={orgId} className="flex items-center justify-between text-sm">
                          <span>{stats.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Member
                          </Badge>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
