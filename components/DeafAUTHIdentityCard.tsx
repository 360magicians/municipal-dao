"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Hand, Eye, Heart, Code, Palette, Users, Award, Shield, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface DeafAUTHProfile {
  deafIdentity: "deaf" | "hard-of-hearing" | "hearing" | "coda"
  signLanguages: string[]
  communityRole: "advocate" | "educator" | "developer" | "artist" | "leader"
  verificationLevel: "community" | "organization" | "certified"
  visualPreferences: {
    signAvatar: string
    colorScheme: "high-contrast" | "standard" | "custom"
    communicationStyle: "visual" | "tactile" | "mixed"
  }
  contributions: {
    accessibility: number
    community: number
    development: number
    advocacy: number
  }
  reputation: number
  joinDate: string
}

interface DeafAUTHIdentityCardProps {
  userId: string
  profile: DeafAUTHProfile
  showDetailed?: boolean
}

export function DeafAUTHIdentityCard({ userId, profile, showDetailed = false }: DeafAUTHIdentityCardProps) {
  const getIdentityColor = (identity: string) => {
    switch (identity) {
      case "deaf":
        return "from-blue-500 to-blue-600"
      case "hard-of-hearing":
        return "from-purple-500 to-purple-600"
      case "hearing":
        return "from-green-500 to-green-600"
      case "coda":
        return "from-orange-500 to-orange-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "advocate":
        return <Heart className="w-4 h-4" />
      case "educator":
        return <Users className="w-4 h-4" />
      case "developer":
        return <Code className="w-4 h-4" />
      case "artist":
        return <Palette className="w-4 h-4" />
      case "leader":
        return <Star className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case "certified":
        return <Award className="w-4 h-4 text-gold-500" />
      case "organization":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "community":
        return <Users className="w-4 h-4 text-green-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const totalContributions = Object.values(profile.contributions).reduce((sum, val) => sum + val, 0)

  if (!showDetailed) {
    // Compact version for voting cards, comments, etc.
    return (
      <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
        <div
          className={`w-8 h-8 bg-gradient-to-r ${getIdentityColor(profile.deafIdentity)} rounded-full flex items-center justify-center text-white text-xs font-bold relative`}
        >
          {profile.visualPreferences.signAvatar ? (
            <span className="text-lg">{profile.visualPreferences.signAvatar}</span>
          ) : (
            <Hand className="w-4 h-4" />
          )}

          {/* Verification badge */}
          <div className="absolute -top-1 -right-1">{getVerificationIcon(profile.verificationLevel)}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <span className="font-medium text-sm truncate">{userId}</span>
            {getRoleIcon(profile.communityRole)}
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              {profile.deafIdentity.toUpperCase()}
            </Badge>
            {profile.signLanguages.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {profile.signLanguages[0]}
              </Badge>
            )}
          </div>
        </div>

        {/* Contribution indicator */}
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-medium">{totalContributions}</span>
        </div>
      </motion.div>
    )
  }

  // Detailed version for profile pages
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${getIdentityColor(profile.deafIdentity)} text-white`}>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            {profile.visualPreferences.signAvatar || "🤟"}
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center space-x-2">
              <span>{userId}</span>
              {getVerificationIcon(profile.verificationLevel)}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              {getRoleIcon(profile.communityRole)}
              <span className="text-sm opacity-90">{profile.communityRole}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Identity & Languages */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Identity & Communication
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge className={`bg-gradient-to-r ${getIdentityColor(profile.deafIdentity)} text-white`}>
              {profile.deafIdentity.replace("-", " ").toUpperCase()}
            </Badge>
            {profile.signLanguages.map((lang) => (
              <Badge key={lang} variant="outline">
                {lang}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Communication: {profile.visualPreferences.communicationStyle} • Joined:{" "}
            {new Date(profile.joinDate).toLocaleDateString()}
          </div>
        </div>

        {/* Contributions */}
        <div className="space-y-4">
          <h4 className="font-semibold">Community Contributions</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accessibility</span>
                <span>{profile.contributions.accessibility}</span>
              </div>
              <Progress value={(profile.contributions.accessibility / 100) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Community</span>
                <span>{profile.contributions.community}</span>
              </div>
              <Progress value={(profile.contributions.community / 100) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Development</span>
                <span>{profile.contributions.development}</span>
              </div>
              <Progress value={(profile.contributions.development / 100) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Advocacy</span>
                <span>{profile.contributions.advocacy}</span>
              </div>
              <Progress value={(profile.contributions.advocacy / 100) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Reputation */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Community Reputation</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{profile.reputation}</div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Based on verified contributions and community validation
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
