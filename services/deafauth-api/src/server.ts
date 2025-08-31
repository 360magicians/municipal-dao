import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { Firestore } from "@google-cloud/firestore"
import { PubSub } from "@google-cloud/pubsub"
import { Storage } from "@google-cloud/storage"
import Redis from "ioredis"

// Initialize GCP services
const firestore = new Firestore({
  projectId: "mbtq.dev",
  databaseId: "deafauth-profiles",
})

const pubsub = new PubSub({
  projectId: "mbtq.dev",
})

const storage = new Storage({
  projectId: "mbtq.dev",
})

const redis = new Redis(process.env.REDIS_URL)

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all registered domains
      const allowedDomains = process.env.SUPPORTED_DOMAINS?.split(",") || []
      if (
        !origin ||
        allowedDomains.some((domain) =>
          domain.startsWith("*") ? origin.endsWith(domain.slice(1)) : origin.includes(domain),
        )
      ) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

app.use(express.json())

// DeafAUTH Profile Schema
interface DeafAUTHProfile {
  id: string
  email: string
  deafIdentity: "deaf" | "hard-of-hearing" | "hearing" | "coda" | "deafblind"
  signLanguages: string[]
  communityRoles: string[]
  verificationLevel: "self-reported" | "community-verified" | "organization-verified" | "certified"
  visualPreferences: {
    signAvatar: string
    colorScheme: string
    communicationStyle: string
    fontSize: string
  }
  contributions: {
    accessibility: number
    community: number
    development: number
    advocacy: number
    education: number
    mentorship: number
  }
  reputation: {
    total: number
    breakdown: Record<string, number>
    verifiedBy: string[]
  }
  domains: Record<
    string,
    {
      joinDate: string
      localRoles: string[]
      localContributions: Record<string, number>
      localReputation: number
    }
  >
  privacy: {
    showIdentity: boolean
    showLanguages: boolean
    showContributions: boolean
    allowCrossDomainSharing: boolean
  }
  createdAt: string
  updatedAt: string
}

// Authentication Routes
app.post("/auth/register", async (req, res) => {
  try {
    const { email, deafIdentity, signLanguages, domain } = req.body

    // Create new profile
    const profileId = `deafauth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const profile: DeafAUTHProfile = {
      id: profileId,
      email,
      deafIdentity,
      signLanguages: signLanguages || [],
      communityRoles: [],
      verificationLevel: "self-reported",
      visualPreferences: {
        signAvatar: "🤟",
        colorScheme: "standard",
        communicationStyle: "visual",
        fontSize: "medium",
      },
      contributions: {
        accessibility: 0,
        community: 0,
        development: 0,
        advocacy: 0,
        education: 0,
        mentorship: 0,
      },
      reputation: {
        total: 0,
        breakdown: {},
        verifiedBy: [],
      },
      domains: {
        [domain]: {
          joinDate: new Date().toISOString(),
          localRoles: [],
          localContributions: {},
          localReputation: 0,
        },
      },
      privacy: {
        showIdentity: true,
        showLanguages: true,
        showContributions: true,
        allowCrossDomainSharing: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in Firestore
    await firestore.collection("profiles").doc(profileId).set(profile)

    // Cache in Redis
    await redis.setex(`profile:${profileId}`, 3600, JSON.stringify(profile))

    // Publish event
    await pubsub.topic("deafauth-events").publish(
      Buffer.from(
        JSON.stringify({
          type: "profile_created",
          profileId,
          domain,
          timestamp: new Date().toISOString(),
        }),
      ),
    )

    res.json({
      success: true,
      profileId,
      profile: {
        ...profile,
        email: undefined, // Don't return email in response
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    const { email, domain } = req.body

    // Find profile by email
    const profileQuery = await firestore.collection("profiles").where("email", "==", email).limit(1).get()

    if (profileQuery.empty) {
      return res.status(404).json({ error: "Profile not found" })
    }

    const profileDoc = profileQuery.docs[0]
    const profile = profileDoc.data() as DeafAUTHProfile

    // Add domain if not exists
    if (!profile.domains[domain]) {
      profile.domains[domain] = {
        joinDate: new Date().toISOString(),
        localRoles: [],
        localContributions: {},
        localReputation: 0,
      }

      await firestore.collection("profiles").doc(profile.id).update({
        domains: profile.domains,
        updatedAt: new Date().toISOString(),
      })
    }

    // Generate JWT token (implement proper JWT signing)
    const token = {
      accessToken: `deafauth_${profile.id}_${Date.now()}`,
      refreshToken: `refresh_${profile.id}_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      profile: {
        ...profile,
        email: undefined, // Don't include email in token
      },
    }

    // Cache token
    await redis.setex(`token:${token.accessToken}`, 86400, JSON.stringify(token))

    res.json({ success: true, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Profile Management Routes
app.get("/api/profile/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params

    // Try Redis cache first
    const cached = await redis.get(`profile:${profileId}`)
    if (cached) {
      const profile = JSON.parse(cached)
      return res.json({ profile: { ...profile, email: undefined } })
    }

    // Fallback to Firestore
    const doc = await firestore.collection("profiles").doc(profileId).get()
    if (!doc.exists) {
      return res.status(404).json({ error: "Profile not found" })
    }

    const profile = doc.data() as DeafAUTHProfile

    // Cache for future requests
    await redis.setex(`profile:${profileId}`, 3600, JSON.stringify(profile))

    res.json({ profile: { ...profile, email: undefined } })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// Community Verification Routes
app.post("/api/verification", async (req, res) => {
  try {
    const { targetUserId, verifierUserId, verificationType, evidence, domain } = req.body

    const verification = {
      id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      targetUserId,
      verifierUserId,
      verificationType,
      evidence,
      domain,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    await firestore.collection("verifications").doc(verification.id).set(verification)

    // Publish verification event
    await pubsub.topic("deafauth-verifications").publish(
      Buffer.from(
        JSON.stringify({
          type: "verification_requested",
          verification,
          timestamp: new Date().toISOString(),
        }),
      ),
    )

    res.json({ success: true, verificationId: verification.id })
  } catch (error) {
    console.error("Verification error:", error)
    res.status(500).json({ error: "Verification failed" })
  }
})

// Domain Statistics
app.get("/api/domains/:domain/stats", async (req, res) => {
  try {
    const { domain } = req.params

    // Try cache first
    const cacheKey = `domain_stats:${domain}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return res.json(JSON.parse(cached))
    }

    // Query Firestore for domain statistics
    const profilesQuery = await firestore.collection("profiles").where(`domains.${domain}`, "!=", null).get()

    const profiles = profilesQuery.docs.map((doc) => doc.data() as DeafAUTHProfile)

    const stats = {
      totalUsers: profiles.length,
      identityBreakdown: profiles.reduce(
        (acc, profile) => {
          acc[profile.deafIdentity] = (acc[profile.deafIdentity] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      languageBreakdown: profiles.reduce(
        (acc, profile) => {
          profile.signLanguages.forEach((lang) => {
            acc[lang] = (acc[lang] || 0) + 1
          })
          return acc
        },
        {} as Record<string, number>,
      ),
      verificationLevels: profiles.reduce(
        (acc, profile) => {
          acc[profile.verificationLevel] = (acc[profile.verificationLevel] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      contributionStats: profiles.reduce(
        (acc, profile) => {
          Object.entries(profile.contributions).forEach(([key, value]) => {
            acc[key] = (acc[key] || 0) + value
          })
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(stats))

    res.json(stats)
  } catch (error) {
    console.error("Stats error:", error)
    res.status(500).json({ error: "Failed to fetch stats" })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`DeafAUTH API server running on port ${PORT}`)
})
