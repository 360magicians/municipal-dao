import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Test configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

describe("Supabase Database Tests", () => {
  let testUserId: string
  let testProfileId: string
  let testMunicipalityId: string
  let testMemberId: string

  beforeAll(async () => {
    // Create test user profile
    const { data: profile, error } = await supabase
      .from("deafauth_profiles")
      .insert({
        user_id: "550e8400-e29b-41d4-a716-446655440999",
        username: "test_user_municipal",
        display_name: "Test Municipal User",
        bio: "Test user for municipal DAO testing",
        preferred_language: "ASL",
        verification_status: "verified",
      })
      .select()
      .single()

    expect(error).toBeNull()
    expect(profile).toBeTruthy()
    testProfileId = profile!.id
    testUserId = profile!.user_id
  })

  afterAll(async () => {
    // Clean up test data
    if (testMemberId) {
      await supabase.from("municipal_dao_members").delete().eq("id", testMemberId)
    }
    if (testMunicipalityId) {
      await supabase.from("municipalities").delete().eq("id", testMunicipalityId)
    }
    if (testProfileId) {
      await supabase.from("deafauth_profiles").delete().eq("id", testProfileId)
    }
  })

  describe("Municipality Operations", () => {
    test("should create a new municipality", async () => {
      const { data, error } = await supabase
        .from("municipalities")
        .insert({
          name: "Test City",
          state_code: "CA",
          municipality_type: "city",
          population: 50000,
          area_sq_miles: 25.5,
          website_url: "https://testcity.gov",
          contact_email: "info@testcity.gov",
          accessibility_rating: 3,
          deaf_population_estimate: 500,
          sign_language_services: true,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.name).toBe("Test City")
      expect(data!.sign_language_services).toBe(true)
      testMunicipalityId = data!.id
    })

    test("should retrieve municipality with stats", async () => {
      const { data, error } = await supabase
        .from("municipalities")
        .select(`
          *,
          municipal_dao_members(count),
          municipal_proposals(count)
        `)
        .eq("id", testMunicipalityId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.name).toBe("Test City")
    })
  })

  describe("Municipal DAO Member Operations", () => {
    test("should join municipal DAO", async () => {
      const { data, error } = await supabase
        .from("municipal_dao_members")
        .insert({
          profile_id: testProfileId,
          municipality_id: testMunicipalityId,
          role: "citizen",
          voting_power: 1,
          verified_resident: true,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.role).toBe("citizen")
      expect(data!.voting_power).toBe(1)
      testMemberId = data!.id
    })

    test("should retrieve member with profile info", async () => {
      const { data, error } = await supabase
        .from("municipal_dao_members")
        .select(`
          *,
          deafauth_profiles(*),
          municipalities(*)
        `)
        .eq("id", testMemberId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.deafauth_profiles.username).toBe("test_user_municipal")
      expect(data!.municipalities.name).toBe("Test City")
    })
  })

  describe("Municipal Proposal Operations", () => {
    let testProposalId: string

    test("should create a municipal proposal", async () => {
      const { data, error } = await supabase
        .from("municipal_proposals")
        .insert({
          municipality_id: testMunicipalityId,
          title: "Improve City Hall Accessibility",
          description: "Install visual fire alarms and improve ASL interpreter services",
          category: "accessibility",
          proposer_id: testMemberId,
          status: "active",
          voting_starts_at: new Date().toISOString(),
          voting_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          budget_impact: 25000,
          accessibility_impact_assessment: {
            deaf_community_benefit: "high",
            estimated_users_affected: 500,
            compliance_improvement: true,
          },
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.title).toBe("Improve City Hall Accessibility")
      expect(data!.category).toBe("accessibility")
      testProposalId = data!.id
    })

    test("should cast a vote on proposal", async () => {
      const { data, error } = await supabase
        .from("municipal_votes")
        .insert({
          proposal_id: testProposalId,
          voter_id: testMemberId,
          vote_type: "for",
          voting_power: 1,
          reason: "Essential for deaf community access to city services",
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.vote_type).toBe("for")
      expect(data!.voting_power).toBe(1)
    })

    test("should retrieve proposal with votes", async () => {
      const { data, error } = await supabase
        .from("municipal_proposals")
        .select(`
          *,
          municipal_votes(*),
          municipal_dao_members!proposer_id(
            deafauth_profiles(*)
          )
        `)
        .eq("id", testProposalId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.municipal_votes).toHaveLength(1)
      expect(data!.municipal_votes[0].vote_type).toBe("for")
    })

    // Clean up proposal and vote
    afterAll(async () => {
      await supabase.from("municipal_votes").delete().eq("proposal_id", testProposalId)
      await supabase.from("municipal_proposals").delete().eq("id", testProposalId)
    })
  })

  describe("Accessibility Integration Tests", () => {
    test("should create accessibility transformation", async () => {
      const { data, error } = await supabase
        .from("accessibility_transformations")
        .insert({
          user_id: testUserId,
          municipality_id: testMunicipalityId,
          source_content: "City Council Meeting Tonight at 7 PM",
          transformed_content: {
            asl_video: "council_meeting_asl.mp4",
            captions: "City Council Meeting Tonight at 7 PM",
            visual_alerts: true,
            simplified_text: "Council meets tonight 7pm",
          },
          transformation_type: "civic_announcement",
          source_domain: "testcity.gov",
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.transformation_type).toBe("civic_announcement")
    })

    test("should create AI processing job", async () => {
      const { data, error } = await supabase
        .from("ai_processing_jobs")
        .insert({
          user_id: testUserId,
          municipality_id: testMunicipalityId,
          job_type: "document_simplification",
          input_data: {
            document_url: "https://testcity.gov/budget-2024.pdf",
            target_reading_level: "grade_8",
          },
          status: "completed",
          model_used: "vertex-ai-text-simplifier",
          processing_time_ms: 3500,
          cost_credits: 15,
          output_data: {
            simplified_document_url: "https://testcity.gov/budget-2024-simple.pdf",
            asl_summary_video: "budget_summary_asl.mp4",
          },
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.job_type).toBe("document_simplification")
      expect(data!.status).toBe("completed")
    })
  })

  describe("Municipal Services Tests", () => {
    test("should create municipal service", async () => {
      const { data, error } = await supabase
        .from("municipal_services")
        .insert({
          municipality_id: testMunicipalityId,
          service_name: "Building Permits",
          description: "Apply for residential and commercial building permits",
          department: "Planning & Development",
          accessibility_rating: 4,
          deaf_accessible: true,
          asl_interpreter_available: true,
          online_portal_url: "https://testcity.gov/permits",
          contact_info: {
            phone: "555-0123",
            email: "permits@testcity.gov",
            tty: "555-0124",
          },
          hours_of_operation: {
            monday: "8:00 AM - 5:00 PM",
            tuesday: "8:00 AM - 5:00 PM",
            wednesday: "8:00 AM - 5:00 PM",
            thursday: "8:00 AM - 5:00 PM",
            friday: "8:00 AM - 4:00 PM",
          },
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.service_name).toBe("Building Permits")
      expect(data!.deaf_accessible).toBe(true)
      expect(data!.asl_interpreter_available).toBe(true)
    })
  })
})
