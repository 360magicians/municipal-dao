"use client"

import React from "react"

// DeafAUTH Universal SDK
export interface DeafAUTHConfig {
  apiEndpoint: string // deafauth.mbtq.dev
  clientId: string
  domain: string // The host domain (dao.mbtquniverse.com, company.com, etc.)
  theme?: "light" | "dark" | "high-contrast" | "custom"
  language?: string
  customization?: {
    colors?: Record<string, string>
    fonts?: Record<string, string>
    signLanguagePreference?: string[]
  }
}

export interface DeafAUTHProfile {
  id: string
  deafIdentity: "deaf" | "hard-of-hearing" | "hearing" | "coda" | "deafblind"
  signLanguages: string[]
  communityRoles: string[]
  verificationLevel: "self-reported" | "community-verified" | "organization-verified" | "certified"
  visualPreferences: {
    signAvatar: string
    colorScheme: "high-contrast" | "standard" | "custom"
    communicationStyle: "visual" | "tactile" | "mixed" | "oral"
    fontSize: "small" | "medium" | "large" | "xl"
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
  domains: {
    [domain: string]: {
      joinDate: string
      localRoles: string[]
      localContributions: Record<string, number>
      localReputation: number
    }
  }
  privacy: {
    showIdentity: boolean
    showLanguages: boolean
    showContributions: boolean
    allowCrossDomainSharing: boolean
  }
}

export interface DeafAUTHToken {
  accessToken: string
  refreshToken: string
  profile: DeafAUTHProfile
  permissions: string[]
  expiresAt: number
}

class DeafAUTHSDK {
  private config: DeafAUTHConfig
  private token: DeafAUTHToken | null = null
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(config: DeafAUTHConfig) {
    this.config = config
    this.loadStoredToken()
  }

  // Initialize DeafAUTH on any domain
  async initialize(): Promise<void> {
    try {
      // Register domain with DeafAUTH service
      await fetch(`${this.config.apiEndpoint}/api/domains/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          domain: this.config.domain,
          theme: this.config.theme,
          customization: this.config.customization,
        }),
      })

      this.emit("initialized", { domain: this.config.domain })
    } catch (error) {
      console.error("DeafAUTH initialization failed:", error)
      throw error
    }
  }

  // Universal login that works on any domain
  async login(options?: {
    redirectUrl?: string
    scopes?: string[]
    preferredLanguage?: string
  }): Promise<DeafAUTHToken> {
    const loginUrl = new URL(`${this.config.apiEndpoint}/auth/login`)
    loginUrl.searchParams.set("client_id", this.config.clientId)
    loginUrl.searchParams.set("domain", this.config.domain)
    loginUrl.searchParams.set("redirect_uri", options?.redirectUrl || window.location.href)

    if (options?.scopes) {
      loginUrl.searchParams.set("scope", options.scopes.join(" "))
    }

    if (options?.preferredLanguage) {
      loginUrl.searchParams.set("lang", options.preferredLanguage)
    }

    // Open DeafAUTH login in popup or redirect
    return new Promise((resolve, reject) => {
      const popup = window.open(
        loginUrl.toString(),
        "deafauth-login",
        "width=500,height=700,scrollbars=yes,resizable=yes",
      )

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== new URL(this.config.apiEndpoint).origin) return

        if (event.data.type === "DEAFAUTH_SUCCESS") {
          this.token = event.data.token
          this.storeToken(this.token)
          this.emit("login", this.token)
          popup?.close()
          window.removeEventListener("message", messageHandler)
          resolve(this.token)
        } else if (event.data.type === "DEAFAUTH_ERROR") {
          popup?.close()
          window.removeEventListener("message", messageHandler)
          reject(new Error(event.data.error))
        }
      }

      window.addEventListener("message", messageHandler)

      // Handle popup blocked or closed
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          window.removeEventListener("message", messageHandler)
          reject(new Error("Login cancelled"))
        }
      }, 1000)
    })
  }

  // Get current user profile
  getProfile(): DeafAUTHProfile | null {
    return this.token?.profile || null
  }

  // Check if user has specific permissions
  hasPermission(permission: string): boolean {
    return this.token?.permissions.includes(permission) || false
  }

  // Update user's domain-specific data
  async updateDomainData(data: {
    roles?: string[]
    contributions?: Record<string, number>
    preferences?: Record<string, any>
  }): Promise<void> {
    if (!this.token) throw new Error("Not authenticated")

    await fetch(`${this.config.apiEndpoint}/api/domains/${this.config.domain}/user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    this.emit("profile-updated", data)
  }

  // Verify another user's identity
  async verifyUser(
    userId: string,
    verificationData: {
      type: "community" | "skill" | "contribution"
      evidence?: string
      notes?: string
    },
  ): Promise<void> {
    if (!this.token) throw new Error("Not authenticated")

    await fetch(`${this.config.apiEndpoint}/api/verification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetUserId: userId,
        domain: this.config.domain,
        ...verificationData,
      }),
    })
  }

  // Get community statistics for current domain
  async getCommunityStats(): Promise<{
    totalUsers: number
    identityBreakdown: Record<string, number>
    languageBreakdown: Record<string, number>
    contributionStats: Record<string, number>
    verificationLevels: Record<string, number>
  }> {
    const response = await fetch(`${this.config.apiEndpoint}/api/domains/${this.config.domain}/stats`)
    return response.json()
  }

  // Event system for real-time updates
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach((callback) => callback(data))
  }

  private storeToken(token: DeafAUTHToken): void {
    localStorage.setItem("deafauth_token", JSON.stringify(token))
  }

  private loadStoredToken(): void {
    const stored = localStorage.getItem("deafauth_token")
    if (stored) {
      try {
        const token = JSON.parse(stored)
        if (token.expiresAt > Date.now()) {
          this.token = token
        } else {
          localStorage.removeItem("deafauth_token")
        }
      } catch (error) {
        localStorage.removeItem("deafauth_token")
      }
    }
  }

  async logout(): Promise<void> {
    if (this.token) {
      await fetch(`${this.config.apiEndpoint}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token.accessToken}`,
        },
      })
    }

    this.token = null
    localStorage.removeItem("deafauth_token")
    this.emit("logout", {})
  }
}

// Factory function for easy integration
export function createDeafAUTH(config: DeafAUTHConfig): DeafAUTHSDK {
  return new DeafAUTHSDK(config)
}

// React hook for easy integration
export function useDeafAUTH() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [profile, setProfile] = React.useState<DeafAUTHProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const deafAuth = React.useMemo(() => {
    return createDeafAUTH({
      apiEndpoint: "https://deafauth.mbtq.dev",
      clientId: process.env.NEXT_PUBLIC_DEAFAUTH_CLIENT_ID || "",
      domain: window.location.hostname,
    })
  }, [])

  React.useEffect(() => {
    deafAuth.initialize().then(() => {
      const currentProfile = deafAuth.getProfile()
      setProfile(currentProfile)
      setIsAuthenticated(!!currentProfile)
      setIsLoading(false)
    })

    deafAuth.on("login", (token: DeafAUTHToken) => {
      setProfile(token.profile)
      setIsAuthenticated(true)
    })

    deafAuth.on("logout", () => {
      setProfile(null)
      setIsAuthenticated(false)
    })
  }, [deafAuth])

  return {
    isAuthenticated,
    profile,
    isLoading,
    login: deafAuth.login.bind(deafAuth),
    logout: deafAuth.logout.bind(deafAuth),
    updateDomainData: deafAuth.updateDomainData.bind(deafAuth),
    verifyUser: deafAuth.verifyUser.bind(deafAuth),
    getCommunityStats: deafAuth.getCommunityStats.bind(deafAuth),
    hasPermission: deafAuth.hasPermission.bind(deafAuth),
  }
}
