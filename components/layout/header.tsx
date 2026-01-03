"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ProfileDropdown } from "@/components/profile-dropdown";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdminArea = pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin");

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !(servicesRef.current as HTMLElement).contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[aria-expanded][aria-expanded='true']")
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 rounded-b-2xl bg-white/90 shadow-xl border border-blue-100">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <img src="/head-logo.png" alt="Welfare Platform Logo" className="h-16 w-auto drop-shadow-md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-semibold text-lg">
          <Link href="/about" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">About</Link>
          <Link href="/success-stories" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">Success Stories</Link>
          <div className="relative">
            <button
              className="text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-1 px-2 py-1 rounded-md"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
            >
              Services <ChevronDown className="w-4 h-4" />
            </button>
            {servicesOpen && (
              <div ref={servicesRef} className="absolute bg-white shadow-xl rounded-xl mt-2 w-52 z-50 border border-blue-100">
                <Link href="/services" className="block w-full text-left px-5 py-3 text-base text-blue-900 hover:bg-blue-50 rounded-t-xl">Services</Link>
                <Link href="/how-it-works" className="block w-full text-left px-5 py-3 text-base text-blue-900 hover:bg-blue-50 rounded-b-xl">How It Works</Link>
              </div>
            )}
          </div>
          {!user && (
            <>
              <Link href="/stats-sec" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">Overview</Link>
              <Link href="/donor/signup" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">Donor Signup</Link>
            </>
          )}

          {user && (
            <>
              <Link href="/apply" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">Apply</Link>
              <Link href="/dashboard/user" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">
                User Dashboard
              </Link>
              {String(user.role).toLowerCase() !== "donor" && (
                <Link href="/donor/signup" className="text-blue-900 hover:text-blue-600 transition-colors px-2 py-1 rounded-md">
                  Donor Signup
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAdminArea ? (
            null
          ) : pathname.startsWith("/dashboard/donor") ? (
            null
          ) : user ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link href="/login">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              <div className="relative group">
                {/* <Link href="/signup">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center gap-1">
                    Sign Up
                  </Button>
                </Link> */}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/about" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/services" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/success-stories" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Success Stories</Link>
            <Link href="/how-it-works" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>How It Works</Link>

            {!user && (
              <Link href="/stats-sec" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Overview
              </Link>
            )}

            {user && !isAdminArea && (
              <>
                <Link href="/apply" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Apply</Link>
                <Link href="/dashboard/user" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>User Dashboard</Link>
                {String(user.role).toLowerCase() !== "donor" && (
                  <Link href="/donor/signup" className="block text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Donor Signup</Link>
                )}
              </>
            )}

            <div className="space-y-3">
              {user ? (
                <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full justify-center bg-red-500 text-white">Logout</Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold">
                      Login
                    </Button>
                  </Link>
                  {/* <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold">
                      Sign Up
                    </Button>
                  </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
