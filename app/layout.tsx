import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"
import { LayoutClient } from "./LayoutClient"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Welfare Platform - Empowering Lives Through Financial Assistance | Pakistan",
  description: "Leading welfare platform in Pakistan providing financial assistance, medical support, education aid, and livelihood programs. Help families overcome crises with dignity and hope.",
  keywords: "welfare Pakistan, financial assistance Pakistan, microfinance Pakistan, emergency loans, medical aid, education support, livelihood programs, social welfare, poverty alleviation, family support services, Zakat eligibility Pakistan, Sadaqah organization, Poverty alleviation Pakistan, Need-based assistance, Welfare services Pakistan, Community support programs, Sustainable livelihood, Social impact initiatives, Non-profit organization Pakistan, Disaster relief funds, Charitable giving Pakistan",
  authors: [{ name: "Welfare Platform Team" }],
  creator: "Welfare Platform",
  publisher: "Idara Al-Khair",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://welfareplatform.org'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Welfare Platform - Empowering Lives Through Financial Assistance",
    description: "Comprehensive welfare services in Pakistan including emergency loans, medical support, education aid, and livelihood programs for families in need.",
    url: "https://welfareplatform.org",
    siteName: "Welfare Platform",
    images: [
      {
        url: "/og-image.jpg", // Create this image
        width: 1200,
        height: 630,
        alt: "Welfare Platform - Helping Families in Pakistan",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welfare Platform - Empowering Lives Through Financial Assistance",
    description: "Leading welfare platform in Pakistan providing comprehensive support to families in need.",
    images: ["/og-image.jpg"],
    creator: "@welfareplatform",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add actual verification code
  },
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
        <link rel="canonical" href="https://welfareplatform.org" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Welfare Platform",
              "alternateName": "Idara Al-Khair",
              "url": "https://welfareplatform.org",
              "logo": "https://welfareplatform.org/head-logo.png",
              "description": "Leading welfare platform in Pakistan providing comprehensive financial assistance, medical support, education aid, and livelihood programs to families in need.",
              "foundingDate": "2010",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Muhammad Muzahir Sheikh",
                  "jobTitle": "Chairman & Founder"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Pakistan"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-21-1234-5678",
                "contactType": "customer service",
                "availableLanguage": "English",
                "hoursAvailable": "Mo-Fr 09:00-18:00, Sa 10:00-16:00"
              },
              "sameAs": [
                "https://facebook.com/welfareplatform",
                "https://twitter.com/welfareplatform",
                "https://linkedin.com/company/welfareplatform"
              ]
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Welfare Platform",
              "url": "https://welfareplatform.org",
              "description": "Comprehensive welfare platform providing financial assistance and support services in Pakistan",
              "publisher": {
                "@type": "Organization",
                "name": "Idara Al-Khair"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://welfareplatform.org/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://welfareplatform.org"
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}