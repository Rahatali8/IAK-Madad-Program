"use client"

import LoginSidebar from "@/components/login/LoginSidebar"
import LoginForm from "@/components/login/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <LoginSidebar />
      <LoginForm />
    </div>
  )
}
