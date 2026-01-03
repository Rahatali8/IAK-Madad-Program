"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import FloatingBot from "@/components/FloatingBot"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/survey-dashboard")

  return (
    <>
      {isAdminPage ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingBot />
        </div>
      )}
    </>
  )
}
