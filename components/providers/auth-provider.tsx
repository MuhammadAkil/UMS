"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { authAPI, LoginResponse } from "@/lib/api/auth"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  const login = async () => {
    try {
      setIsLoading(true)
      const response = await authAPI.autoLogin()
      if (response.success) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      }
    } catch (error) {
      console.error("Auto-login failed:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  useEffect(() => {
    // Check if user is already authenticated
    const token = authAPI.getAccessToken()
    const currentUser = authAPI.getUser()
    
    if (token && currentUser) {
      setIsAuthenticated(true)
      setUser(currentUser)
      setIsLoading(false)
    } else {
      // Auto-login if not authenticated
      login()
    }
  }, [])

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 