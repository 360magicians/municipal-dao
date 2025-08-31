import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Server-side municipal DAO functions
export const serverMunicipalDAO = {
  // Get municipality statistics
  async getMunicipalityStats(municipalityId: string) {
    const supabase = createServerClient()

    const [{ count: memberCount }, { count: proposalCount }, { count: activeProposalCount }, { data: treasuryData }] =
      await Promise.all([
        supabase
          .from("municipal_dao_members")
          .select("*", { count: "exact", head: true })
          .eq("municipality_id", municipalityId),

        supabase
          .from("municipal_proposals")
          .select("*", { count: "exact", head: true })
          .eq("municipality_id", municipalityId),

        supabase
          .from("municipal_proposals")
          .select("*", { count: "exact", head: true })
          .eq("municipality_id", municipalityId)
          .eq("status", "active"),

        supabase
          .from("municipal_treasury_transactions")
          .select("amount, token_symbol, transaction_type")
          .eq("municipality_id", municipalityId)
          .eq("status", "completed"),
      ])

    // Calculate treasury balance
    const treasuryBalance =
      treasuryData?.reduce((acc, tx) => {
        if (tx.transaction_type === "stake" || tx.transaction_type === "deposit") {
          acc += Number(tx.amount)
        } else if (tx.transaction_type === "withdraw" || tx.transaction_type === "reward") {
          acc -= Number(tx.amount)
        }
        return acc
      }, 0) || 0

    return {
      memberCount: memberCount || 0,
      proposalCount: proposalCount || 0,
      activeProposalCount: activeProposalCount || 0,
      treasuryBalance,
    }
  },

  // Get accessibility metrics for a municipality
  async getAccessibilityMetrics(municipalityId: string) {
    const supabase = createServerClient()

    const { data: services, error } = await supabase
      .from("municipal_services")
      .select("accessibility_rating, deaf_accessible, asl_interpreter_available")
      .eq("municipality_id", municipalityId)

    if (error) return { error }

    const totalServices = services.length
    const accessibleServices = services.filter((s) => s.deaf_accessible).length
    const aslServices = services.filter((s) => s.asl_interpreter_available).length
    const avgAccessibilityRating = services.reduce((acc, s) => acc + s.accessibility_rating, 0) / totalServices

    return {
      data: {
        totalServices,
        accessibleServices,
        aslServices,
        accessibilityPercentage: (accessibleServices / totalServices) * 100,
        aslPercentage: (aslServices / totalServices) * 100,
        avgAccessibilityRating,
      },
    }
  },
}
