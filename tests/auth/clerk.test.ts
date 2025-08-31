import { clerkClient } from "@clerk/nextjs"
import jest from "jest" // Declare the jest variable

// Mock Clerk for testing
jest.mock("@clerk/nextjs", () => ({
  clerkClient: {
    users: {
      getUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
    },
  },
  auth: jest.fn(() => ({
    userId: "test-user-id",
    sessionId: "test-session-id",
  })),
}))

describe("Clerk Authentication Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("User Management", () => {
    test("should get user by ID", async () => {
      const mockUser = {
        id: "test-user-id",
        emailAddresses: [{ emailAddress: "test@example.com" }],
        firstName: "Test",
        lastName: "User",
        publicMetadata: {
          deafauth_profile_id: "profile-123",
          municipal_memberships: ["municipality-456"],
        },
      }
      ;(clerkClient.users.getUser as jest.Mock).mockResolvedValue(mockUser)

      const user = await clerkClient.users.getUser("test-user-id")

      expect(user).toEqual(mockUser)
      expect(user.publicMetadata.deafauth_profile_id).toBe("profile-123")
      expect(clerkClient.users.getUser).toHaveBeenCalledWith("test-user-id")
    })

    test("should create user with municipal metadata", async () => {
      const newUser = {
        emailAddress: "newuser@example.com",
        firstName: "New",
        lastName: "User",
        publicMetadata: {
          deafauth_verified: false,
          preferred_language: "ASL",
          accessibility_preferences: {
            high_contrast: true,
            large_text: true,
            captions: true,
          },
        },
      }

      const mockCreatedUser = {
        id: "new-user-id",
        ...newUser,
      }
      ;(clerkClient.users.createUser as jest.Mock).mockResolvedValue(mockCreatedUser)

      const createdUser = await clerkClient.users.createUser(newUser)

      expect(createdUser).toEqual(mockCreatedUser)
      expect(createdUser.publicMetadata.preferred_language).toBe("ASL")
      expect(clerkClient.users.createUser).toHaveBeenCalledWith(newUser)
    })

    test("should update user municipal memberships", async () => {
      const userId = "test-user-id"
      const updateData = {
        publicMetadata: {
          municipal_memberships: ["municipality-456", "municipality-789"],
          civic_engagement_score: 150,
        },
      }

      const mockUpdatedUser = {
        id: userId,
        publicMetadata: updateData.publicMetadata,
      }
      ;(clerkClient.users.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser)

      const updatedUser = await clerkClient.users.updateUser(userId, updateData)

      expect(updatedUser.publicMetadata.municipal_memberships).toHaveLength(2)
      expect(updatedUser.publicMetadata.civic_engagement_score).toBe(150)
      expect(clerkClient.users.updateUser).toHaveBeenCalledWith(userId, updateData)
    })
  })

  describe("DeafAUTH Integration", () => {
    test("should handle deaf community verification metadata", async () => {
      const verificationData = {
        publicMetadata: {
          deafauth_verified: true,
          verification_method: "community_vouching",
          verification_date: new Date().toISOString(),
          deaf_community_connections: 5,
          sign_language_proficiency: "native",
          accessibility_advocate: true,
        },
      }
      ;(clerkClient.users.updateUser as jest.Mock).mockResolvedValue({
        id: "verified-user-id",
        ...verificationData,
      })

      const result = await clerkClient.users.updateUser("verified-user-id", verificationData)

      expect(result.publicMetadata.deafauth_verified).toBe(true)
      expect(result.publicMetadata.sign_language_proficiency).toBe("native")
      expect(result.publicMetadata.accessibility_advocate).toBe(true)
    })

    test("should handle municipal role assignments", async () => {
      const roleData = {
        publicMetadata: {
          municipal_roles: {
            "municipality-456": "council_member",
            "municipality-789": "citizen",
          },
          voting_power: {
            "municipality-456": 5,
            "municipality-789": 1,
          },
          civic_contributions: ["accessibility_proposal_author", "community_event_organizer"],
        },
      }
      ;(clerkClient.users.updateUser as jest.Mock).mockResolvedValue({
        id: "civic-leader-id",
        ...roleData,
      })

      const result = await clerkClient.users.updateUser("civic-leader-id", roleData)

      expect(result.publicMetadata.municipal_roles["municipality-456"]).toBe("council_member")
      expect(result.publicMetadata.voting_power["municipality-456"]).toBe(5)
      expect(result.publicMetadata.civic_contributions).toContain("accessibility_proposal_author")
    })
  })
})
