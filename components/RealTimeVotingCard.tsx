"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Users, Zap, CheckCircle } from "lucide-react"
import { useRealTimeVoting } from "@/hooks/useRealTimeVoting"
import { motion, AnimatePresence } from "framer-motion"

interface RealTimeVotingCardProps {
  proposalId: string
  proposalTitle: string
  initialVotes: {
    for: number
    against: number
    abstain: number
    total: number
    quorum: number
  }
  votingEnds: string
  userVote?: "for" | "against" | "abstain" | null
}

export function RealTimeVotingCard({
  proposalId,
  proposalTitle,
  initialVotes,
  votingEnds,
  userVote: initialUserVote,
}: RealTimeVotingCardProps) {
  const { votes, recentVotes, isQuorumReached, liveVoters, castVote } = useRealTimeVoting(proposalId, initialVotes)
  const [userVote, setUserVote] = useState<"for" | "against" | "abstain" | null>(initialUserVote || null)
  const [isVoting, setIsVoting] = useState(false)
  const [showVoteReason, setShowVoteReason] = useState(false)
  const [voteReason, setVoteReason] = useState("")

  const timeRemaining = new Date(votingEnds).getTime() - new Date().getTime()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const handleVote = async (choice: "for" | "against" | "abstain") => {
    setIsVoting(true)

    try {
      await castVote(choice, voteReason || undefined)
      setUserVote(choice)
      setShowVoteReason(false)
      setVoteReason("")
    } catch (error) {
      console.error("Failed to cast vote:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const getVotePercentage = (voteCount: number) => {
    return votes.total > 0 ? (voteCount / votes.total) * 100 : 0
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">LIVE</span>
        </div>
        {liveVoters.length > 0 && (
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {liveVoters.length} viewing
          </Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between pr-20">
          Cast Your Vote
          {isQuorumReached && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-green-600"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Quorum Reached</span>
            </motion.div>
          )}
        </CardTitle>
        <CardDescription>
          {daysRemaining > 0 ? `Voting ends in ${daysRemaining} days` : "Voting has ended"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vote Counts with Animation */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <div className="flex items-center justify-center text-green-600">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <motion.span
                className="font-semibold text-lg"
                key={votes.for}
                initial={{ scale: 1.2, color: "#16a34a" }}
                animate={{ scale: 1, color: "#16a34a" }}
                transition={{ duration: 0.3 }}
              >
                {votes.for}
              </motion.span>
            </div>
            <div className="text-xs text-muted-foreground">For ({getVotePercentage(votes.for).toFixed(1)}%)</div>
            <Progress value={getVotePercentage(votes.for)} className="h-1" />
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <div className="flex items-center justify-center text-red-600">
              <ThumbsDown className="w-4 h-4 mr-1" />
              <motion.span
                className="font-semibold text-lg"
                key={votes.against}
                initial={{ scale: 1.2, color: "#dc2626" }}
                animate={{ scale: 1, color: "#dc2626" }}
                transition={{ duration: 0.3 }}
              >
                {votes.against}
              </motion.span>
            </div>
            <div className="text-xs text-muted-foreground">
              Against ({getVotePercentage(votes.against).toFixed(1)}%)
            </div>
            <Progress value={getVotePercentage(votes.against)} className="h-1" />
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <div className="flex items-center justify-center text-gray-600">
              <motion.span
                className="font-semibold text-lg"
                key={votes.abstain}
                initial={{ scale: 1.2, color: "#6b7280" }}
                animate={{ scale: 1, color: "#6b7280" }}
                transition={{ duration: 0.3 }}
              >
                {votes.abstain}
              </motion.span>
            </div>
            <div className="text-xs text-muted-foreground">
              Abstain ({getVotePercentage(votes.abstain).toFixed(1)}%)
            </div>
            <Progress value={getVotePercentage(votes.abstain)} className="h-1" />
          </motion.div>
        </div>

        {/* Quorum Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quorum Progress</span>
            <span>
              <motion.span
                key={votes.quorum}
                initial={{ scale: 1.1, color: isQuorumReached ? "#16a34a" : "#6b7280" }}
                animate={{ scale: 1, color: isQuorumReached ? "#16a34a" : "#6b7280" }}
                transition={{ duration: 0.3 }}
              >
                {votes.quorum.toFixed(1)}%
              </motion.span>{" "}
              ({votes.total} votes)
            </span>
          </div>
          <Progress value={votes.quorum} className={`h-2 transition-colors ${isQuorumReached ? "bg-green-100" : ""}`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimum: 51%</span>
            <span>
              {isQuorumReached ? (
                <span className="text-green-600 font-medium">✓ Quorum Met</span>
              ) : (
                <span>{(51 - votes.quorum).toFixed(1)}% needed</span>
              )}
            </span>
          </div>
        </div>

        {/* Voting Buttons */}
        {!userVote && daysRemaining > 0 && (
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex space-x-2">
              <Button onClick={() => handleVote("for")} disabled={isVoting} className="flex-1">
                {isVoting ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Voting...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Vote For
                  </>
                )}
              </Button>
              <Button onClick={() => handleVote("against")} disabled={isVoting} variant="outline" className="flex-1">
                {isVoting ? "Voting..." : "Vote Against"}
              </Button>
              <Button onClick={() => handleVote("abstain")} disabled={isVoting} variant="ghost" className="flex-1">
                {isVoting ? "Voting..." : "Abstain"}
              </Button>
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={() => setShowVoteReason(!showVoteReason)}>
                Add voting reason (optional)
              </Button>

              <AnimatePresence>
                {showVoteReason && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Textarea
                      placeholder="Explain your voting decision..."
                      value={voteReason}
                      onChange={(e) => setVoteReason(e.target.value)}
                      rows={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* User Vote Status */}
        {userVote && (
          <motion.div
            className="bg-green-50 p-4 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">You voted {userVote.toUpperCase()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Your vote has been recorded with 2.3% voting power</p>
          </motion.div>
        )}

        {/* Recent Votes */}
        {recentVotes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Recent Votes
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {recentVotes.slice(0, 5).map((vote, index) => (
                  <motion.div
                    key={`${vote.userId}-${vote.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{vote.userId.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{vote.userId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          vote.choice === "for" ? "default" : vote.choice === "against" ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {vote.choice}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{vote.votingPower}%</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
