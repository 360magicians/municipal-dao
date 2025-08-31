import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Vote, Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

// Sample data
const daoStats = {
  totalMembers: 1247,
  activeProposals: 3,
  treasuryValue: 2450000,
  votingPower: 85.2,
}

const recentProposals = [
  {
    id: 1,
    title: "Increase Marketing Budget for Q2",
    status: "active",
    votes: { for: 156, against: 23, total: 200 },
    timeLeft: "2 days",
    quorum: 78,
  },
  {
    id: 2,
    title: "Partnership with DeFi Protocol XYZ",
    status: "passed",
    votes: { for: 234, against: 45, total: 300 },
    timeLeft: "Ended",
    quorum: 93,
  },
  {
    id: 3,
    title: "New Community Moderator Selection",
    status: "active",
    votes: { for: 89, against: 12, total: 150 },
    timeLeft: "5 days",
    quorum: 67,
  },
]

const treasuryAssets = [
  { name: "ETH", amount: "1,250", value: "$2,100,000", change: "+5.2%" },
  { name: "USDC", amount: "250,000", value: "$250,000", change: "0%" },
  { name: "DAO Token", amount: "500,000", value: "$100,000", change: "+12.8%" },
]

export default function Dashboard() {
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
              <Link href="/" className="text-sm font-medium text-blue-600">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Proposals
              </Link>
              <Link href="/members" className="text-sm font-medium text-gray-600 hover:text-gray-900">
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daoStats.totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daoStats.activeProposals}</div>
              <p className="text-xs text-muted-foreground">2 ending soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treasury Value</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(daoStats.treasuryValue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">+8.3% this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daoStats.votingPower}%</div>
              <p className="text-xs text-muted-foreground">Your delegation power</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Proposals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Proposals</CardTitle>
              <CardDescription>Latest governance proposals and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm">{proposal.title}</h3>
                    <Badge variant={proposal.status === "active" ? "default" : "secondary"}>
                      {proposal.status === "active" ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" /> Active
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Passed
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        For: {proposal.votes.for} | Against: {proposal.votes.against}
                      </span>
                      <span>{proposal.timeLeft}</span>
                    </div>
                    <Progress value={proposal.quorum} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Quorum: {proposal.quorum}% ({proposal.votes.total} votes)
                    </div>
                  </div>
                </div>
              ))}

              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/proposals">View All Proposals</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Treasury Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Treasury Overview</CardTitle>
              <CardDescription>Current asset allocation and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {treasuryAssets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {asset.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{asset.name}</div>
                      <div className="text-xs text-muted-foreground">{asset.amount}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{asset.value}</div>
                    <div
                      className={`text-xs ${asset.change.startsWith("+") ? "text-green-600" : asset.change.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}
                    >
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}

              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="/treasury">View Full Treasury</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
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
                <Link href="/members/invite">
                  <Users className="h-6 w-6" />
                  <span>Invite Members</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline" asChild>
                <Link href="/bounties">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Bounties</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
