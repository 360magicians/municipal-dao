"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Clock, MessageCircle, Share, Flag, CheckCircle } from "lucide-react"
import Link from "next/link"
import { RealTimeVotingCard } from "@/components/RealTimeVotingCard"

interface ProposalEvent {
  id: string
  type: "created" | "vote" | "comment" | "status_change" | "quorum_reached"
  user: string
  action: string
  timestamp: string
  details?: any
}

interface Vote {
  user: string
  choice: "for" | "against" | "abstain"
  votingPower: number
  timestamp: string
  reason?: string
}

interface Comment {
  id: string
  user: string
  avatar: string
  content: string
  timestamp: string
  replies?: Comment[]
}

const mockProposal = {
  id: "1",
  title: "Increase Marketing Budget for Q2",
  description: `## Overview

This proposal requests an additional $50,000 allocation for Q2 marketing initiatives to accelerate our growth and community engagement.

## Rationale

Our current marketing budget has been fully utilized, and we're seeing strong ROI on our current campaigns. Additional funding will allow us to:

- Expand our social media presence across Twitter, Discord, and LinkedIn
- Sponsor key industry conferences and events
- Launch targeted advertising campaigns for developer recruitment
- Create high-quality educational content and tutorials
- Partner with influential developers and thought leaders

## Budget Breakdown

- Social Media & Content Creation: $20,000
- Conference Sponsorships: $15,000
- Paid Advertising: $10,000
- Influencer Partnerships: $5,000

## Expected Outcomes

- 25% increase in community members
- 40% boost in developer engagement
- Enhanced brand recognition in the web3 space
- Stronger pipeline for future proposals and initiatives

## Timeline

Implementation will begin immediately upon approval, with campaigns launching within 2 weeks.`,
  author: "alice.eth",
  authorAvatar: "/placeholder.svg?height=40&width=40",
  organization: "DeveloperDAO",
  type: "Treasury",
  status: "active",
  created: "2024-01-15T10:00:00Z",
  votingEnds: "2024-01-22T10:00:00Z",
  requestedAmount: 50000,
  beneficiary: "0x1234...5678",
  votes: {
    for: 156,
    against: 23,
    abstain: 21,
    total: 200,
    quorum: 78,
  },
  tags: ["marketing", "growth", "community", "q2-2024"],
}

const mockEvents: ProposalEvent[] = [
  {
    id: "1",
    type: "created",
    user: "alice.eth",
    action: "created this proposal",
    timestamp: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "vote",
    user: "bob.eth",
    action: "voted FOR with 12.5% voting power",
    timestamp: "2024-01-15T14:30:00Z",
    details: { choice: "for", votingPower: 12.5 },
  },
  {
    id: "3",
    type: "comment",
    user: "charlie.eth",
    action: "added a comment",
    timestamp: "2024-01-16T09:15:00Z",
  },
  {
    id: "4",
    type: "vote",
    user: "diana.eth",
    action: "voted FOR with 8.3% voting power",
    timestamp: "2024-01-16T16:45:00Z",
    details: { choice: "for", votingPower: 8.3 },
  },
  {
    id: "5",
    type: "quorum_reached",
    user: "system",
    action: "Quorum threshold reached (51%)",
    timestamp: "2024-01-17T11:20:00Z",
  },
]

const mockVotes: Vote[] = [
  {
    user: "bob.eth",
    choice: "for",
    votingPower: 12.5,
    timestamp: "2024-01-15T14:30:00Z",
    reason: "Strong ROI projections and clear budget breakdown. This will help us grow the community significantly.",
  },
  {
    user: "diana.eth",
    choice: "for",
    votingPower: 8.3,
    timestamp: "2024-01-16T16:45:00Z",
  },
  {
    user: "eve.eth",
    choice: "against",
    votingPower: 5.2,
    timestamp: "2024-01-17T08:15:00Z",
    reason: "I think we should focus on product development first before expanding marketing efforts.",
  },
  {
    user: "frank.eth",
    choice: "for",
    votingPower: 15.8,
    timestamp: "2024-01-17T12:30:00Z",
  },
]

const mockComments: Comment[] = [
  {
    id: "1",
    user: "charlie.eth",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Great proposal! The budget breakdown is very detailed. Have you considered allocating more to content creation? Our educational content performs really well.",
    timestamp: "2024-01-16T09:15:00Z",
    replies: [
      {
        id: "1-1",
        user: "alice.eth",
        avatar: "/placeholder.svg?height=32&width=32",
        content:
          "Thanks for the feedback! We can definitely adjust the allocation based on performance metrics from our current content.",
        timestamp: "2024-01-16T10:30:00Z",
      },
    ],
  },
  {
    id: "2",
    user: "george.eth",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "What metrics will we use to measure success? It would be good to have clear KPIs defined.",
    timestamp: "2024-01-17T15:45:00Z",
  },
]

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const [userVote, setUserVote] = useState<"for" | "against" | "abstain" | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showVoteReason, setShowVoteReason] = useState(false)
  const [voteReason, setVoteReason] = useState("")

  const timeRemaining = new Date(mockProposal.votingEnds).getTime() - new Date().getTime()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const handleVote = async (choice: "for" | "against" | "abstain") => {
    setIsVoting(true)
    setUserVote(choice)

    // Simulate voting
    setTimeout(() => {
      setIsVoting(false)
      setShowVoteReason(false)
      setVoteReason("")
      // Add vote event
      const newEvent: ProposalEvent = {
        id: Date.now().toString(),
        type: "vote",
        user: "you",
        action: `voted ${choice.toUpperCase()} with 2.3% voting power`,
        timestamp: new Date().toISOString(),
        details: { choice, votingPower: 2.3 },
      }
      mockEvents.unshift(newEvent)
    }, 1500)
  }

  const handleComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: "you",
      avatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      timestamp: new Date().toISOString(),
    }

    mockComments.unshift(comment)
    setNewComment("")
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
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-blue-600">
                Proposals
              </Link>
              <Link href="/organizations" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Organizations
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proposal Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{mockProposal.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={mockProposal.authorAvatar || "/placeholder.svg"}
                              alt={mockProposal.author}
                            />
                            <AvatarFallback>{mockProposal.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>by {mockProposal.author}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(mockProposal.created).toLocaleDateString()}</span>
                        <Badge variant="outline">{mockProposal.type}</Badge>
                        <Badge variant="outline">{mockProposal.organization}</Badge>
                      </div>
                    </div>
                    <Badge variant={mockProposal.status === "active" ? "default" : "secondary"}>
                      {mockProposal.status === "active" ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Passed
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{mockProposal.description}</div>
                  </div>

                  {mockProposal.requestedAmount && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Treasury Request</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-medium">${mockProposal.requestedAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Beneficiary:</span>
                          <span className="ml-2 font-mono text-xs">{mockProposal.beneficiary}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {mockProposal.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Section */}
              <RealTimeVotingCard
                proposalId={params.id}
                proposalTitle={mockProposal.title}
                initialVotes={mockProposal.votes}
                votingEnds={mockProposal.votingEnds}
                userVote={userVote}
              />

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Discussion ({mockComments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts on this proposal..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleComment} disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-6">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                            <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-11 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.user} />
                                  <AvatarFallback>{reply.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">{reply.user}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(reply.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Voting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Voting Power Required</span>
                      <span>51%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current Participation</span>
                      <span>{mockProposal.votes.quorum}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Votes Cast</span>
                      <span>{mockProposal.votes.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Remaining</span>
                      <span>{daysRemaining > 0 ? `${daysRemaining} days` : "Ended"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Votes */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Votes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockVotes.slice(0, 5).map((vote, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{vote.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{vote.user}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              vote.choice === "for"
                                ? "default"
                                : vote.choice === "against"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {vote.choice}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{vote.votingPower}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.slice(0, 8).map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            event.type === "created"
                              ? "bg-blue-500"
                              : event.type === "vote"
                                ? "bg-green-500"
                                : event.type === "comment"
                                  ? "bg-yellow-500"
                                  : event.type === "quorum_reached"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{event.user}</span> {event.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
