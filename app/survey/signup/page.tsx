"use client"

import React, { useState } from "react"
import LoginSidebar from "@/components/login/LoginSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SurveySignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const payload = { name, email, password, role: "survey" }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || data.message || "Signup failed")
      }
    } catch (e) {
      setError("Network error. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-darkblue mb-4">Account Created</h2>
              <p className="text-gray-600 mb-6">Your survey account has been created. You can now sign in.</p>
              <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]">
                <Link href="/survey/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <LoginSidebar title={"Survey Portal"} description={"Create a survey account to access tools."} />

      <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-start lg:justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border border-gray-100 backdrop-blur bg-white/90">
            <CardHeader>
              <CardTitle className="text-center text-xl text-darkblue">Survey Register</CardTitle>
              <CardDescription className="text-center text-gray-500">Create a simple survey account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-semibold py-3 rounded-xl" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                Already have an account? {" "}
                <Link href="/survey/login" className="text-darkblue hover:underline font-medium">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
