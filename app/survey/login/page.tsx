"use client"

import React, { useState } from "react"
import LoginSidebar from "@/components/login/LoginSidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SurveyLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        // If backend returns user, redirect to survey-dashboard
        router.push("/survey-dashboard")
      } else {
        setError(data.message || data.error || "Login failed")
      }
    } catch (e) {
      setError("Network error. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <LoginSidebar title={"Survey Portal"} description={"Sign in to access survey tools and reports."} />

      <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-start lg:justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border border-gray-100 backdrop-blur bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-xl text-darkblue">Survey Sign In</CardTitle>
              <CardDescription className="text-center text-gray-500">Access the survey dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-semibold py-3 rounded-xl" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                If you have not survey account register here: {" "}
                <Link href="/survey/signup" className="text-darkblue hover:underline font-medium">Register</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
