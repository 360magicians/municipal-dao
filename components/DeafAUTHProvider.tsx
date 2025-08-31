"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useDeafAUTH } from "@/lib/deafauth-sdk"

const DeafAUTHContext = createContext<ReturnType<typeof useDeafAUTH> | null>(null)

export function DeafAUTHProvider({ children }: { children: React.ReactNode }) {
  const deafAuth = useDeafAUTH()

  return <DeafAUTHContext.Provider value={deafAuth}>{children}</DeafAUTHContext.Provider>
}

export function useDeafAUTHContext() {
  const context = useContext(DeafAUTHContext)
  if (!context) {
    throw new Error("useDeafAUTHContext must be used within DeafAUTHProvider")
  }
  return context
}
