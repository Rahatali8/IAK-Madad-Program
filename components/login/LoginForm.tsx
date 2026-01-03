"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, CreditCard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"

export default function LoginForm() {
  const [loginType, setLoginType] = useState<"email" | "cnic">("cnic")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const payload = loginType === "email"
        ? { email: identifier, password }
        : { cnic: identifier.replace(/\D/g, ""), password }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (response.ok) {
        login(data.user)

        // Role-based redirect
        switch (data.user.role) {
          case "admin":
            router.push("/dashboard/admin")
            break
          case "survey":
          case "SURVEY_OFFICER":
            router.push("/survey-dashboard")
            break
          case "donor":
            router.push("/dashboard/donor")
            break
          case "user":
          default:
            router.push("/dashboard/user")
            break
        }
      } else {
        setError(data.message || "Login failed. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCNIC = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{0,5})(\d{0,7})(\d{0,1})$/)
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-")
    }
    return cleaned
  }

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (loginType === "cnic") {
      const formatted = formatCNIC(value)
      if (formatted.replace(/\D/g, "").length <= 13) {
        setIdentifier(formatted)
      }
    } else {
      setIdentifier(value)
    }
  }

  const isValidInput = () => {
    if (loginType === "email") {
      return identifier.includes("@") && password.length > 0
    } else {
      return identifier.replace(/\D/g, "").length === 13 && password.length > 0
    }
  }

  return (
    <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-start lg:justify-center p-8">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl border border-gray-100 backdrop-blur bg-white/90">
          <CardHeader>
            <CardTitle className="text-center text-xl text-darkblue">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Access your dashboard And Get Assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login Type Selector */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setLoginType("cnic")
                  setIdentifier("")
                  setError("")
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === "cnic"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                CNIC
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType("email")
                  setIdentifier("")
                  setError("")
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === "email"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {loginType === "email" ? "Email Address" : "CNIC Number"}
                </Label>
                <Input
                  id="identifier"
                  type={loginType === "email" ? "email" : "text"}
                  autoComplete={loginType === "email" ? "email" : "username"}
                  placeholder={
                    loginType === "email"
                      ? "Enter your email address"
                      : "Enter CNIC (12345-1234567-1)"
                  }
                  value={identifier}
                  onChange={handleIdentifierChange}
                  required
                  className="text-center text-lg tracking-wider border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-darkblue hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-cyan-500 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading || !isValidInput()}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-darkblue hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
