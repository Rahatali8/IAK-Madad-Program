"use client"

import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
  <footer className="bg-darkblue text-white pt-10 pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-8">
          {/* Company Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/footer-logo.png"
                alt="Welfare Platform Logo"
                className="h-16 w-auto drop-shadow-lg"
              />
            </Link>
            <p className="text-blue-100 leading-relaxed text-sm md:text-base">
              Empowering communities across Pakistan through comprehensive welfare programs, financial assistance, and sustainable development initiatives.
            </p>
            <div className="flex space-x-3 mt-4">
              <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-blue-800 transition shadow-md">
                <Facebook className="h-5 w-5 text-cyan-400" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-blue-800 transition shadow-md">
                <Twitter className="h-5 w-5 text-cyan-400" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-blue-800 transition shadow-md">
                <Instagram className="h-5 w-5 text-cyan-400" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-blue-800 transition shadow-md">
                <Youtube className="h-5 w-5 text-cyan-400" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold tracking-wide mb-2 text-cyan-300">Quick Links</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/about" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold tracking-wide mb-2 text-cyan-300">Support</h3>
            <ul className="space-y-2 text-sm md:text-base">
              <li>
                <Link href="/help" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-100 hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold tracking-wide mb-2 text-cyan-300">Contact Info</h3>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-cyan-400" />
                <span className="text-blue-100">+92 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <span className="text-blue-100">info@welfareplatform.org</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cyan-400 mt-1" />
                <span className="text-blue-100">123 Welfare Street, Karachi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
  <div className="mt-8 bg-blue-800 rounded-t-xl shadow-inner border-t border-blue-700">
          <div className="flex flex-col md:flex-row justify-between items-center px-4 py-5">
            <p className="text-blue-100 text-xs md:text-sm">© 2024 Welfare Platform. All rights reserved.</p>
            <p className="text-blue-100 text-xs md:text-sm flex items-center gap-1">Made with <Heart className="inline h-4 w-4 text-red-400 mx-1" fill="#f87171" /> for the people of Pakistan</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
