"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Hand, Eye, Zap, Users } from "lucide-react"
import { DeafAUTHIdentityCard } from "./DeafAUTHIdentityCard"
import { motion, AnimatePresence } from "framer-motion"

interface DeafAUTHVote {
  userId: string
  choice: "for" | "against" | "abstain"
  votingPower: number
  reason?: string
  timestamp: string
  deafAuthProfile: any
  visualSignature?: string // ASL sign or emoji representing their vote
}

interface DeafAUTHVotingInterfaceProps {
  proposalId: string
  proposalTitle: string
  votes: {
    for: number
    against: number
    abstain: number
    total: number
    quorum: number
  }
  recentVotes: DeafAUTHVote[]
  userProfile: any
  onVote: (choice: "for" | "against" | "abstain", reason?: string, visualSignature?: string) => void
}

export function DeafAUTHVotingInterface({
  proposalId,
  proposalTitle,
  votes,
  recentVotes,
  userProfile,
  onVote,
}: DeafAUTHVotingInterfaceProps) {
  const [selectedChoice, setSelectedChoice] = useState<"for" | "against" | "abstain" | null>(null)
  const [voteReason, setVoteReason] = useState("")
  const [visualSignature, setVisualSignature] = useState("")
  const [isVoting, setIsVoting] = useState(false)

  // Visual signatures for different vote types
  const voteSignatures = {
    for: ["👍", "✅", "🤟", "👌", "💪"],
    against: ["👎", "❌", "✋", "🚫", "⛔"],
    abstain: ["🤷", "🤔", "⚖️", "🤐", "😐"],
  }

  const handleVote = async () => {
    if (!selectedChoice) return

    setIsVoting(true)
    try {
      await onVote(selectedChoice, voteReason || undefined, visualSignature || undefined)
    } finally {
      setIsVoting(false)
      setSelectedChoice(null)
      setVoteReason("")
      setVisualSignature("")
    }
  }

  const getVotePercentage = (voteCount: number) => {
    return votes.total > 0 ? (voteCount / votes.total) * 100 : 0
  }

  // Calculate community representation
  const deafVotes = recentVotes.filter((v) => v.deafAuthProfile?.deafIdentity === "deaf").length
  const hohVotes = recentVotes.filter((v) => v.deafAuthProfile?.deafIdentity === "hard-of-hearing").length
  const hearingVotes = recentVotes.filter((v) => v.deafAuthProfile?.deafIdentity === "hearing").length
  const codaVotes = recentVotes.filter((v) => v.deafAuthProfile?.deafIdentity === "coda").length

  return (
    <Card className="relative overflow-hidden">
      {/* DeafAUTH Branding */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <Hand className="w-3 h-3 mr-1" />
          DeafAUTH Verified
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center space-x-2 pr-32">
          <Eye className="w-5 h-5" />
          <span>Visual Community Voting</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Community Representation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Community Representation
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-blue-600">{deafVotes}</div>
              <div className="text-xs">Deaf</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-purple-600">{hohVotes}</div>
              <div className="text-xs">HoH</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-600">{hearingVotes}</div>
              <div className="text-xs">Hearing</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-orange-600">{codaVotes}</div>
              <div className="text-xs">CODA</div>
            </div>
          </div>
        </div>

        {/* Vote Counts with Visual Elements */}
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
            <Progress value={getVotePercentage(votes.for)} className="h-2" />
            {/* Visual signatures for FOR votes */}
            <div className="flex justify-center space-x-1">
              {recentVotes
                .filter((v) => v.choice === "for" && v.visualSignature)
                .slice(0, 5)
                .map((vote, i) => (
                  <span key={i} className="text-lg" title={`${vote.userId} voted FOR`}>
                    {vote.visualSignature}
                  </span>
                ))}
            </div>
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
            <Progress value={getVotePercentage(votes.against)} className="h-2" />
            {/* Visual signatures for AGAINST votes */}
            <div className="flex justify-center space-x-1">
              {recentVotes
                .filter((v) => v.choice === "against" && v.visualSignature)
                .slice(0, 5)
                .map((vote, i) => (
                  <span key={i} className="text-lg" title={`${vote.userId} voted AGAINST`}>
                    {vote.visualSignature}
                  </span>
                ))}
            </div>
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
            <Progress value={getVotePercentage(votes.abstain)} className="h-2" />
            {/* Visual signatures for ABSTAIN votes */}
            <div className="flex justify-center space-x-1">
              {recentVotes
                .filter((v) => v.choice === "abstain" && v.visualSignature)
                .slice(0, 5)
                .map((vote, i) => (
                  <span key={i} className="text-lg" title={`${vote.userId} abstained`}>
                    {vote.visualSignature}
                  </span>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Voting Interface */}
        <div className="space-y-4">
          <h4 className="font-semibold">Cast Your Vote</h4>

          {/* Vote Choice Selection */}
          <div className="grid grid-cols-3 gap-2">
            {(["for", "against", "abstain"] as const).map((choice) => (
              <Button
                key={choice}
                variant={selectedChoice === choice ? "default" : "outline"}
                onClick={() => setSelectedChoice(choice)}
                className="h-12"
              >
                {choice === "for" && <ThumbsUp className="w-4 h-4 mr-2" />}
                {choice === "against" && <ThumbsDown className="w-4 h-4 mr-2" />}
                {choice.charAt(0).toUpperCase() + choice.slice(1)}
              </Button>
            ))}
          </div>

          {/* Visual Signature Selection */}
          <AnimatePresence>
            {selectedChoice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div>
                  <label className="text-sm font-medium">Choose your visual signature (optional):</label>
                  <div className="flex space-x-2 mt-2">
                    {voteSignatures[selectedChoice].map((signature) => (
                      <Button
                        key={signature}
                        variant={visualSignature === signature ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVisualSignature(signature)}
                        className="text-lg p-2"
                      >
                        {signature}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Reason for your vote (optional):</label>
                  <Textarea
                    placeholder="Share your perspective..."
                    value={voteReason}
                    onChange={(e) => setVoteReason(e.target.value)}
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleVote} disabled={isVoting} className="w-full">
                  {isVoting ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Casting Vote...
                    </>
                  ) : (
                    <>
                      <Hand className="w-4 h-4 mr-2" />
                      Cast Vote {visualSignature && `${visualSignature}`}
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Votes with DeafAUTH Profiles */}
        {recentVotes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Recent Community Votes
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {recentVotes.slice(0, 10).map((vote, index) => (
                  <motion.div
                    key={`${vote.userId}-${vote.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DeafAUTHIdentityCard userId={vote.userId} profile={vote.deafAuthProfile} showDetailed={false} />
                      <div className="flex items-center space-x-2">
                        {vote.visualSignature && (
                          <span className="text-lg" title="Visual signature">
                            {vote.visualSignature}
                          </span>
                        )}
                        <Badge
                          variant={
                            vote.choice === "for" ? "default" : vote.choice === "against" ? "destructive" : "secondary"
                          }
                          className="text-xs"
                        >
                          {vote.choice}
                        </Badge>
                      </div>
                    </div>
                    {vote.reason && <p className="text-sm text-muted-foreground italic">"{vote.reason}"</p>}
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
