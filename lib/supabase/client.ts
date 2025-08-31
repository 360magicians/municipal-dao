import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export const createClient = () => createClientComponentClient<Database>()

export const supabase = createClient()

// Municipal DAO specific client functions
export const municipalDAO = {
  // Get all municipalities
  async getMunicipalities() {
    const { data, error } = await supabase
      .from("municipalities")
      .select(`
        *,
        municipal_dao_members(count),
        municipal_proposals(count)
      `)
      .order("name")

    return { data, error }
  },

  // Get municipality by ID with full details
  async getMunicipalityById(id: string) {
    const { data, error } = await supabase
      .from("municipalities")
      .select(`
        *,
        municipal_dao_members(
          *,
          deafauth_profiles(*)
        ),
        municipal_proposals(
          *,
          municipal_votes(*)
        ),
        municipal_services(*),
        civic_engagement_events(*)
      `)
      .eq("id", id)
      .single()

    return { data, error }
  },

  // Get active proposals for a municipality
  async getActiveProposals(municipalityId: string) {
    const { data, error } = await supabase
      .from("municipal_proposals")
      .select(`
        *,
        municipal_dao_members!proposer_id(
          deafauth_profiles(*)
        ),
        municipal_votes(
          *,
          municipal_dao_members(
            deafauth_profiles(*)
          )
        )
      `)
      .eq("municipality_id", municipalityId)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    return { data, error }
  },

  // Cast a vote on a proposal
  async castVote(proposalId: string, voterId: string, voteType: "for" | "against" | "abstain", reason?: string) {
    // First get the voter's voting power
    const { data: member, error: memberError } = await supabase
      .from("municipal_dao_members")
      .select("voting_power")
      .eq("id", voterId)
      .single()

    if (memberError) return { data: null, error: memberError }

    const { data, error } = await supabase
      .from("municipal_votes")
      .insert({
        proposal_id: proposalId,
        voter_id: voterId,
        vote_type: voteType,
        voting_power: member.voting_power,
        reason,
      })
      .select()
      .single()

    return { data, error }
  },

  // Join a municipal DAO
  async joinMunicipalDAO(profileId: string, municipalityId: string) {
    const { data, error } = await supabase
      .from("municipal_dao_members")
      .insert({
        profile_id: profileId,
        municipality_id: municipalityId,
        role: "citizen",
        voting_power: 1,
      })
      .select()
      .single()

    return { data, error }
  },

  // Create a new proposal
  async createProposal(proposal: {
    municipalityId: string
    title: string
    description: string
    category: string
    proposerId: string
    budgetImpact?: number
    accessibilityImpactAssessment?: any
    aslVideoUrl?: string
  }) {
    const { data, error } = await supabase
      .from("municipal_proposals")
      .insert({
        municipality_id: proposal.municipalityId,
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        proposer_id: proposal.proposerId,
        budget_impact: proposal.budgetImpact || 0,
        accessibility_impact_assessment: proposal.accessibilityImpactAssessment,
        asl_video_url: proposal.aslVideoUrl,
        status: "draft",
      })
      .select()
      .single()

    return { data, error }
  },

  // Get user's municipal memberships
  async getUserMemberships(userId: string) {
    const { data, error } = await supabase
      .from("municipal_dao_members")
      .select(`
        *,
        municipalities(*),
        deafauth_profiles(*)
      `)
      .eq("deafauth_profiles.user_id", userId)

    return { data, error }
  },

  // Search municipalities by name or state
  async searchMunicipalities(query: string) {
    const { data, error } = await supabase
      .from("municipalities")
      .select("*")
      .or(`name.ilike.%${query}%,state_code.ilike.%${query}%`)
      .order("name")
      .limit(20)

    return { data, error }
  },
}
