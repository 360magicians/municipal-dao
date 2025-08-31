"use client"

import { useState, useEffect, useCallback } from "react"
import { wsManager } from "@/lib/websocket"

interface VoteData {
  proposalId: string
  userId: string
  choice: "for" | "against" | "abstain"
  votingPower: number
  reason?: string
  timestamp: string
}

interface ProposalVotes {
  for: number
  against: number
  abstain: number
  total: number
  quorum: number
}

interface VoteUpdate {
  proposalId: string
  votes: ProposalVotes
  latestVote?: VoteData
  quorumReached?: boolean
}

export function useRealTimeVoting(proposalId: string, initialVotes: ProposalVotes) {
  const [votes, setVotes] = useState<ProposalVotes>(initialVotes)
  const [recentVotes, setRecentVotes] = useState<VoteData[]>([])
  const [isQuorumReached, setIsQuorumReached] = useState(initialVotes.quorum >= 51)
  const [liveVoters, setLiveVoters] = useState<string[]>([])

  const handleVoteUpdate = useCallback(
    (message: any) => {
      if (message.type === "vote" && message.data.proposalId === proposalId) {
        const voteData: VoteData = message.data

        // Update vote counts
        setVotes((prev) => {
          const newVotes = { ...prev }
          newVotes[voteData.choice] += 1
          newVotes.total += 1
          newVotes.quorum = (newVotes.total / 1000) * 100 // Assuming 1000 total possible voters
          return newVotes
        })

        // Add to recent votes
        setRecentVotes((prev) => [voteData, ...prev.slice(0, 9)]) // Keep last 10 votes

        // Check quorum
        const newQuorum = ((votes.total + 1) / 1000) * 100
        if (newQuorum >= 51 && !isQuorumReached) {
          setIsQuorumReached(true)
          // Send quorum reached notification
          wsManager.send({
            type: "quorum_reached",
            data: { proposalId, quorum: newQuorum },
          })
        }
      }

      if (message.type === "user_joined" && message.data.proposalId === proposalId) {
        setLiveVoters((prev) => {
          if (!prev.includes(message.data.userId)) {
            return [...prev, message.data.userId]
          }
          return prev
        })
      }
    },
    [proposalId, votes.total, isQuorumReached],
  )

  useEffect(() => {
    const subscriptionId = wsManager.subscribe(`proposal:${proposalId}`, handleVoteUpdate)
    const globalSubscriptionId = wsManager.subscribe("vote", handleVoteUpdate)

    // Join proposal room
    wsManager.send({
      type: "join_proposal",
      data: { proposalId },
    })

    return () => {
      wsManager.unsubscribe(`proposal:${proposalId}`, subscriptionId)
      wsManager.unsubscribe("vote", globalSubscriptionId)

      // Leave proposal room
      wsManager.send({
        type: "leave_proposal",
        data: { proposalId },
      })
    }
  }, [proposalId, handleVoteUpdate])

  const castVote = useCallback(
    (choice: "for" | "against" | "abstain", reason?: string) => {
      const voteData: Omit<VoteData, "timestamp"> = {
        proposalId,
        userId: "current-user", // This would come from auth context
        choice,
        votingPower: 2.3, // This would come from user's actual voting power
        reason,
      }

      wsManager.send({
        type: "vote",
        data: voteData,
      })
    },
    [proposalId],
  )

  return {
    votes,
    recentVotes,
    isQuorumReached,
    liveVoters,
    castVote,
  }
}
