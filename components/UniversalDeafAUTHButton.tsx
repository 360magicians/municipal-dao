"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hand, Shield, Users } from "lucide-react"
import { useDeafAUTHContext } from "./DeafAUTHProvider"
import { motion } from "framer-motion"

interface UniversalDeafAUTHButtonProps {
  variant?: "login" | "profile" | "compact"
  showDomain?: boolean
  customText?: string
}

export function UniversalDeafAUTHButton({
  variant = "login",
  showDomain = true,
  customText,
}: UniversalDeafAUTHButtonProps) {
  const { isAuthenticated, profile, login, logout, isLoading } = useDeafAUTHContext()

  if (isLoading) {
    return (
      <Button disabled variant="outline">
        <Hand className="w-4 h-4 mr-2 animate-pulse" />
        Loading...
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => login()}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Hand className="w-4 h-4 mr-2" />
        {customText || "Sign in with DeafAUTH"}
      </Button>
    )
  }

  if (variant === "compact") {
    return (
      <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.02 }}>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
          {profile?.visualPreferences.signAvatar || "🤟"}
        </div>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          DeafAUTH
        </Badge>
      </motion.div>
    )
  }

  if (variant === "profile") {
    return (
      <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
          {profile?.visualPreferences.signAvatar || "🤟"}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{profile?.id}</span>
            <Badge variant="outline" className="text-xs">
              {profile?.deafIdentity.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Verified by DeafAUTH</span>
            {showDomain && (
              <>
                <span>•</span>
                <span>{window.location.hostname}</span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" onClick={logout}>
      <Users className="w-4 h-4 mr-2" />
      {profile?.id} • Sign out
    </Button>
  )
}
