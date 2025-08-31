import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Crown, Shield, Star, Users } from "lucide-react"
import Link from "next/link"

const members = [
  {
    id: 1,
    name: "Alice Johnson",
    username: "alice.eth",
    role: "Founder",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-01-15",
    votingPower: 15.2,
    proposalsCreated: 8,
    votesParticipated: 45,
    reputation: 2850,
    badges: ["Founder", "Top Contributor", "Early Adopter"],
  },
  {
    id: 2,
    name: "Bob Smith",
    username: "bob.eth",
    role: "Core Contributor",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-02-20",
    votingPower: 8.7,
    proposalsCreated: 12,
    votesParticipated: 38,
    reputation: 1920,
    badges: ["Core Contributor", "Proposal Master"],
  },
  {
    id: 3,
    name: "Charlie Davis",
    username: "charlie.eth",
    role: "Community Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-03-10",
    votingPower: 6.3,
    proposalsCreated: 5,
    votesParticipated: 42,
    reputation: 1650,
    badges: ["Community Manager", "Active Voter"],
  },
  {
    id: 4,
    name: "Diana Wilson",
    username: "diana.eth",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-04-05",
    votingPower: 4.1,
    proposalsCreated: 3,
    votesParticipated: 28,
    reputation: 980,
    badges: ["Developer", "Code Contributor"],
  },
  {
    id: 5,
    name: "Eve Martinez",
    username: "eve.eth",
    role: "Security Auditor",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-05-12",
    votingPower: 3.8,
    proposalsCreated: 6,
    votesParticipated: 31,
    reputation: 1240,
    badges: ["Security Expert", "Auditor"],
  },
  {
    id: 6,
    name: "Frank Thompson",
    username: "frank.eth",
    role: "Member",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2023-06-18",
    votingPower: 2.1,
    proposalsCreated: 1,
    votesParticipated: 15,
    reputation: 420,
    badges: ["New Member"],
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Founder":
      return <Crown className="w-4 h-4 text-yellow-500" />
    case "Core Contributor":
      return <Shield className="w-4 h-4 text-blue-500" />
    case "Community Manager":
      return <Users className="w-4 h-4 text-green-500" />
    default:
      return <Star className="w-4 h-4 text-gray-500" />
  }
}

const getBadgeColor = (badge: string) => {
  const colors: { [key: string]: string } = {
    Founder: "bg-yellow-100 text-yellow-800",
    "Core Contributor": "bg-blue-100 text-blue-800",
    "Community Manager": "bg-green-100 text-green-800",
    "Top Contributor": "bg-purple-100 text-purple-800",
    "Early Adopter": "bg-orange-100 text-orange-800",
    Developer: "bg-indigo-100 text-indigo-800",
    "Security Expert": "bg-red-100 text-red-800",
    "Active Voter": "bg-teal-100 text-teal-800",
    "New Member": "bg-gray-100 text-gray-800",
  }
  return colors[badge] || "bg-gray-100 text-gray-800"
}

export default function MembersPage() {
  const coreMembers = members.filter((m) => ["Founder", "Core Contributor"].includes(m.role))
  const allMembers = members

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold">DeveloperDAO</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Proposals
              </Link>
              <Link href="/members" className="text-sm font-medium text-blue-600">
                Members
              </Link>
              <Link href="/treasury" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Treasury
              </Link>
            </nav>
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Members</h1>
            <p className="text-muted-foreground mt-2">Connect with DAO members and contributors</p>
          </div>
          <Button asChild>
            <Link href="/members/invite">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Members
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search members..." className="pl-10" />
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Members ({allMembers.length})</TabsTrigger>
            <TabsTrigger value="core">Core Team ({coreMembers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-muted-foreground">@{member.username}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{member.votingPower}%</div>
                        <div className="text-muted-foreground">Voting Power</div>
                      </div>
                      <div>
                        <div className="font-medium">{member.reputation}</div>
                        <div className="text-muted-foreground">Reputation</div>
                      </div>
                      <div>
                        <div className="font-medium">{member.proposalsCreated}</div>
                        <div className="text-muted-foreground">Proposals</div>
                      </div>
                      <div>
                        <div className="font-medium">{member.votesParticipated}</div>
                        <div className="text-muted-foreground">Votes Cast</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Badges</div>
                      <div className="flex flex-wrap gap-1">
                        {member.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl">{member.name}</CardTitle>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-muted-foreground">@{member.username}</p>
                        <Badge variant="outline" className="mt-2">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{member.votingPower}%</div>
                        <div className="text-xs text-muted-foreground">Voting Power</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{member.proposalsCreated}</div>
                        <div className="text-xs text-muted-foreground">Proposals</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{member.reputation}</div>
                        <div className="text-xs text-muted-foreground">Reputation</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Achievements</div>
                      <div className="flex flex-wrap gap-1">
                        {member.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
