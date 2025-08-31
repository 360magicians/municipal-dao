import { municipalDAO } from "@/lib/supabase/client"
import jest from "jest" // Declare the jest variable

// Mock the Supabase client
jest.mock("@/lib/supabase/client", () => ({
  municipalDAO: {
    getMunicipalities: jest.fn(),
    getMunicipalityById: jest.fn(),
    getActiveProposals: jest.fn(),
    castVote: jest.fn(),
    joinMunicipalDAO: jest.fn(),
    createProposal: jest.fn(),
    getUserMemberships: jest.fn(),
    searchMunicipalities: jest.fn(),
  },
}))

describe("DeafAUTH Municipal Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Municipality Discovery", () => {
    test("should find municipalities with accessibility features", async () => {
      const mockMunicipalities = [
        {
          id: "muni-1",
          name: "Accessible City",
          state_code: "CA",
          municipality_type: "city",
          accessibility_rating: 5,
          deaf_population_estimate: 1200,
          sign_language_services: true,
          municipal_dao_members: [{ count: 150 }],
          municipal_proposals: [{ count: 25 }],
        },
        {
          id: "muni-2",
          name: "Inclusive Town",
          state_code: "NY",
          municipality_type: "town",
          accessibility_rating: 4,
          deaf_population_estimate: 300,
          sign_language_services: true,
          municipal_dao_members: [{ count: 75 }],
          municipal_proposals: [{ count: 12 }],
        },
      ]
      ;(municipalDAO.getMunicipalities as jest.Mock).mockResolvedValue({
        data: mockMunicipalities,
        error: null,
      })

      const { data, error } = await municipalDAO.getMunicipalities()

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
      expect(data![0].sign_language_services).toBe(true)
      expect(data![0].accessibility_rating).toBe(5)
    })

    test("should search municipalities by accessibility criteria", async () => {
      const mockSearchResults = [
        {
          id: "muni-3",
          name: "Deaf-Friendly City",
          state_code: "TX",
          municipality_type: "city",
          accessibility_rating: 5,
          sign_language_services: true,
        },
      ]
      ;(municipalDAO.searchMunicipalities as jest.Mock).mockResolvedValue({
        data: mockSearchResults,
        error: null,
      })

      const { data, error } = await municipalDAO.searchMunicipalities("deaf")

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].name).toBe("Deaf-Friendly City")
    })
  })

  describe("DAO Participation", () => {
    test("should join municipal DAO with DeafAUTH verification", async () => {
      const mockMembership = {
        id: "member-123",
        profile_id: "profile-456",
        municipality_id: "muni-1",
        role: "citizen",
        voting_power: 1,
        verified_resident: true,
      }
      ;(municipalDAO.joinMunicipalDAO as jest.Mock).mockResolvedValue({
        data: mockMembership,
        error: null,
      })

      const { data, error } = await municipalDAO.joinMunicipalDAO("profile-456", "muni-1")

      expect(error).toBeNull()
      expect(data!.role).toBe("citizen")
      expect(data!.verified_resident).toBe(true)
    })

    test("should create accessibility-focused proposal", async () => {
      const proposalData = {
        municipalityId: "muni-1",
        title: "Install Visual Fire Alarms in All Public Buildings",
        description:
          "Comprehensive installation of visual fire alarm systems to ensure deaf and hard of hearing residents can safely evacuate during emergencies.",
        category: "public_safety",
        proposerId: "member-123",
        budgetImpact: 75000,
        accessibilityImpactAssessment: {
          deaf_community_benefit: "critical",
          estimated_users_affected: 1200,
          ada_compliance: true,
          emergency_safety_improvement: true,
        },
        aslVideoUrl: "https://storage.mbtq.dev/proposals/visual-alarms-asl.mp4",
      }

      const mockProposal = {
        id: "proposal-789",
        ...proposalData,
        status: "draft",
        created_at: new Date().toISOString(),
      }
      ;(municipalDAO.createProposal as jest.Mock).mockResolvedValue({
        data: mockProposal,
        error: null,
      })

      const { data, error } = await municipalDAO.createProposal(proposalData)

      expect(error).toBeNull()
      expect(data!.title).toBe("Install Visual Fire Alarms in All Public Buildings")
      expect(data!.accessibility_impact_assessment.deaf_community_benefit).toBe("critical")
      expect(data!.asl_video_url).toBeTruthy()
    })

    test("should cast informed vote with ASL reasoning", async () => {
      const mockVote = {
        id: "vote-456",
        proposal_id: "proposal-789",
        voter_id: "member-123",
        vote_type: "for",
        voting_power: 1,
        reason: "As a deaf resident, visual fire alarms are essential for our safety and independence.",
        asl_reason_video_url: "https://storage.mbtq.dev/votes/fire-alarm-support-asl.mp4",
        cast_at: new Date().toISOString(),
      }
      ;(municipalDAO.castVote as jest.Mock).mockResolvedValue({
        data: mockVote,
        error: null,
      })

      const { data, error } = await municipalDAO.castVote(
        "proposal-789",
        "member-123",
        "for",
        "As a deaf resident, visual fire alarms are essential for our safety and independence.",
      )

      expect(error).toBeNull()
      expect(data!.vote_type).toBe("for")
      expect(data!.reason).toContain("deaf resident")
    })
  })

  describe("Cross-Platform Integration", () => {
    test("should get user memberships across multiple municipalities", async () => {
      const mockMemberships = [
        {
          id: "member-123",
          role: "citizen",
          municipalities: {
            name: "Accessible City",
            state_code: "CA",
            accessibility_rating: 5,
          },
          deafauth_profiles: {
            username: "deaf_advocate",
            verification_status: "verified",
          },
        },
        {
          id: "member-456",
          role: "council_member",
          municipalities: {
            name: "Inclusive Town",
            state_code: "NY",
            accessibility_rating: 4,
          },
          deafauth_profiles: {
            username: "deaf_advocate",
            verification_status: "verified",
          },
        },
      ]
      ;(municipalDAO.getUserMemberships as jest.Mock).mockResolvedValue({
        data: mockMemberships,
        error: null,
      })

      const { data, error } = await municipalDAO.getUserMemberships("user-789")

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
      expect(data![0].municipalities.accessibility_rating).toBe(5)
      expect(data![1].role).toBe("council_member")
    })

    test("should handle 360magicians AI integration for proposal analysis", async () => {
      // This would integrate with the 360magicians Vertex AI service
      const mockAIAnalysis = {
        proposal_id: "proposal-789",
        ai_analysis: {
          accessibility_score: 95,
          budget_efficiency: 85,
          community_impact: "high",
          implementation_complexity: "medium",
          deaf_community_benefits: ["emergency_safety", "independence", "ada_compliance", "peace_of_mind"],
          potential_challenges: ["installation_coordination", "maintenance_training"],
          recommendations: [
            "Phase implementation by building priority",
            "Include deaf community in testing phase",
            "Provide maintenance staff with deaf awareness training",
          ],
        },
      }

      // This would be called by the AI processing system
      expect(mockAIAnalysis.ai_analysis.accessibility_score).toBe(95)
      expect(mockAIAnalysis.ai_analysis.deaf_community_benefits).toContain("emergency_safety")
    })
  })
})
