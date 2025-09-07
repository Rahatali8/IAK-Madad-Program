import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer" // 👈 import Footer
import FloatingBot from "@/components/FloatingBot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Welfare Platform - Financial Assistance Portal",
  description:
    "A comprehensive platform for financial assistance and welfare programs. Empowering communities through loans, microfinance, and emergency support.",
  keywords: "welfare, financial assistance, loans, microfinance, emergency support, Pakistan",
  generator: "AIT",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/head-logo.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">

            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingBot />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
