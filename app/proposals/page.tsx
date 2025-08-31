import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Plus, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

const proposals = [
  {
    id: 1,
    title: "Increase Marketing Budget for Q2",
    description:
      "Proposal to allocate additional $50,000 for marketing initiatives including social media campaigns, conference sponsorships, and content creation.",
    author: "alice.eth",
    status: "active",
    votes: { for: 156, against: 23, abstain: 21, total: 200 },
    timeLeft: "2 days",
    quorum: 78,
    created: "2024-01-15",
    category: "Treasury",
  },
  {
    id: 2,
    title: "Partnership with DeFi Protocol XYZ",
    description:
      "Strategic partnership proposal to integrate with XYZ Protocol for enhanced yield farming opportunities for DAO treasury.",
    author: "bob.eth",
    status: "passed",
    votes: { for: 234, against: 45, abstain: 21, total: 300 },
    timeLeft: "Ended",
    quorum: 93,
    created: "2024-01-10",
    category: "Partnership",
  },
  {
    id: 3,
    title: "New Community Moderator Selection",
    description: "Proposal to elect 3 new community moderators to help manage Discord and forum discussions.",
    author: "charlie.eth",
    status: "active",
    votes: { for: 89, against: 12, abstain: 49, total: 150 },
    timeLeft: "5 days",
    quorum: 67,
    created: "2024-01-12",
    category: "Governance",
  },
  {
    id: 4,
    title: "Implement Staking Rewards Program",
    description: "Create a staking mechanism for DAO tokens with 8% APY rewards funded from treasury yield.",
    author: "diana.eth",
    status: "draft",
    votes: { for: 0, against: 0, abstain: 0, total: 0 },
    timeLeft: "Not started",
    quorum: 0,
    created: "2024-01-18",
    category: "Treasury",
  },
  {
    id: 5,
    title: "Code Audit for Smart Contracts",
    description:
      "Allocate $25,000 for comprehensive security audit of all DAO smart contracts by reputable auditing firm.",
    author: "eve.eth",
    status: "rejected",
    votes: { for: 67, against: 133, abstain: 50, total: 250 },
    timeLeft: "Ended",
    quorum: 83,
    created: "2024-01-05",
    category: "Security",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Clock className="w-4 h-4" />
    case "passed":
      return <CheckCircle className="w-4 h-4" />
    case "rejected":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "default"
    case "passed":
      return "secondary"
    case "rejected":
      return "destructive"
    case "draft":
      return "outline"
    default:
      return "default"
  }
}

export default function ProposalsPage() {
  const activeProposals = proposals.filter((p) => p.status === "active")
  const completedProposals = proposals.filter((p) => ["passed", "rejected"].includes(p.status))
  const draftProposals = proposals.filter((p) => p.status === "draft")

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
              <Link href="/proposals" className="text-sm font-medium text-blue-600">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Proposals</h1>
            <p className="text-muted-foreground mt-2">Participate in DAO governance by voting on proposals</p>
          </div>
          <Button asChild>
            <Link href="/proposals/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active ({activeProposals.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedProposals.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftProposals.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeProposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>by {proposal.author}</span>
                        <span>•</span>
                        <span>{proposal.created}</span>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(proposal.status) as any}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1 capitalize">{proposal.status}</span>
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-green-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{proposal.votes.for}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">For</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-red-600">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{proposal.votes.against}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Against</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-gray-600">
                        <span className="font-semibold">{proposal.votes.abstain}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Abstain</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quorum Progress</span>
                      <span>
                        {proposal.quorum}% ({proposal.votes.total} votes)
                      </span>
                    </div>
                    <Progress value={proposal.quorum} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Time remaining: {proposal.timeLeft}</span>
                      <span>Minimum: 51%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Vote For
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Vote Against
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      Abstain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedProposals.map((proposal) => (
              <Card key={proposal.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>by {proposal.author}</span>
                        <span>•</span>
                        <span>{proposal.created}</span>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(proposal.status) as any}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1 capitalize">{proposal.status}</span>
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-green-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{proposal.votes.for}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">For</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-red-600">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{proposal.votes.against}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Against</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center text-gray-600">
                        <span className="font-semibold">{proposal.votes.abstain}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Abstain</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={proposal.quorum} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Final result: {proposal.status}</span>
                      <span>{proposal.quorum}% participation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftProposals.map((proposal) => (
              <Card key={proposal.id} className="border-dashed">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>by {proposal.author}</span>
                        <span>•</span>
                        <span>{proposal.created}</span>
                        <Badge variant="outline">{proposal.category}</Badge>
                      </div>
                    </div>
                    <Badge variant="outline">Draft</Badge>
                  </div>
                  <CardDescription className="text-base">{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button size="sm">Submit for Voting</Button>
                    <Button size="sm" variant="outline">
                      Edit Draft
                    </Button>
                    <Button size="sm" variant="ghost">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
