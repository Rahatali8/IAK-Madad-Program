"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

interface User {
  id: number
  cnic: string
  fullName: string
  address: string
  role: string
  city?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") {
      setIsLoading(false)
      return
    }

    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/profile", { credentials: "include" })
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser({
            id: data.user.id,
            cnic: data.user.cnic,
            fullName: data.user.fullName,
            address: data.user.address,
            role: data.user.role,
            email: data.user.email,
            phone: data.user.phone,
          });
          // If the authenticated user is an admin, ensure they stay on the admin dashboard
          try {
            const role = data.user.role && String(data.user.role).toLowerCase()
            if (role === "admin") {
              const onAdminArea = pathname?.startsWith("/dashboard/admin") || pathname?.startsWith("/admin")
              if (!onAdminArea) {
                router.push("/dashboard/admin")
              }
            }
          } catch (err) {
            console.error("Admin redirect check failed:", err)
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null);
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      // include credentials so browser will accept the Set-Cookie header that clears the cookie
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      setUser(null)
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
