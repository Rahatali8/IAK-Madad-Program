import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, BadgeCheck, IdCard, ShieldCheck, UserCircle, Mail, MapPin, Phone } from "lucide-react";

// Utility to generate a pastel color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
}

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  if (!user) return null;

  // Get first letter of name for fallback
  const initial = user.fullName?.charAt(0)?.toUpperCase() || " ";
  
  // Database fields - check for actual data and show empty if not available
  const cnic = user.cnic || "Not provided";
  const email = user.email || "Not provided";
  const phone = user.phone || "Not provided";
  const address = user.address || "Not provided";

  return (
    <>
      <button
        className="flex items-center focus:outline-none rounded-full p-0.5 transition"
        onClick={() => setOpen(true)}
        style={{ background: stringToColor(user.fullName || user.cnic || "U") }}
      >
        <Avatar>
          <AvatarFallback
            className="text-lg md:text-xl"
            style={{ background: stringToColor(user.fullName || user.cnic || "U") }}
          >
            {initial}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Sliding Card */}
      <div
        className={`fixed inset-0 z-[9999] flex items-start justify-end pr-6 pt-20 ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div className={`transform origin-top-right transition-all duration-300 ease-in-out ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* VIP Card Content (bottom-right modal) */}
          <div className="w-[22rem] max-w-lg rounded-2xl shadow-lg mt-0 flex flex-col items-center overflow-visible relative bg-white" style={{ paddingTop: 0 }}>
            {/* Close button inside card */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-20 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none hover:bg-blue-300 border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow transition"
              aria-label="Close profile card"
            >
              &times;
            </button>
            
            {/* Active Status - Top Left Corner */}
            {/* <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Active
              </span>
            </div> */}
            
            {/* Blue Top Section with Smooth Gradient Animation */}
            <div 
              className="w-full h-18 rounded-t-2xl flex flex-col justify-center items-center relative"
              // style={{
              //   background: 'linear-gradient(-45deg, #1B0073, #6A00F4, #00A5E0, #1B0073)',
              //   backgroundSize: '400% 400%',
              //   animation: 'gradientShift 6s ease infinite'
              // }}
            >
              
              {/* Avatar in center - below the blue section */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 z-10">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarFallback
                    className="text-3xl font-bold"
                    style={{ background: stringToColor(user.fullName || user.cnic || ".") }}
                  >
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col pt-10 px-4 w-full">
              
              {/* User Full Name - Centered below avatar */}
              <div className="font-bold text-2xl text-gray-900 mb-4 text-center">
                {user.fullName}
              </div>
              
              <div className="w-full border-b border-gray-200 my-2"></div>
              
              <div className="w-full flex flex-col gap-4">
                {/* Email */}
                <div className="flex items-start gap-3 text-base text-gray-700">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Email Address</div>
                    <div className="font-medium break-words">{email}</div>
                  </div>
                </div>

                {/* CNIC Number */}
                <div className="flex items-start gap-3 text-base text-gray-700">
                  <IdCard className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">CNIC Number</div>
                    <div className="font-mono font-semibold tracking-wider break-words">{cnic}</div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-3 text-base text-gray-700">
                  <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Phone Number</div>
                    <div className="font-medium break-words">{phone}</div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 text-base text-gray-700">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="font-medium break-words">{address}</div>
                  </div>
                </div>
              </div>

              {/* Donor Profile Link (only for donor role) */}
              {user.role && String(user.role).toLowerCase() === "donor" && (
                <Link
                  href="/dashboard/donor"
                  className="mt-6 w-full bg-white border border-[#e6e6f0] text-darkblue py-2 rounded-lg font-semibold hover:bg-[#f6f7fb] transition text-lg shadow text-center block"
                  onClick={() => setOpen(false)}
                >
                  Donor Dashboard
                </Link>
              )}

              {/* Admin Dashboard Link (only for admin role) */}
              {user.role && String(user.role).toLowerCase() === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="mt-6 w-full bg-white border border-[#e6e6f0] text-darkblue py-2 rounded-lg font-semibold hover:bg-[#f6f7fb] transition text-lg shadow text-center block"
                  onClick={() => setOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              
              {/* Sign Out Button */}
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/");
                }}
                className="mt-4  mb-4 w-full bg-gradient-to-r from-[#1B0073] to-[#00A5E0] text-white py-2 rounded-lg font-semibold hover:opacity-95 transition text-lg shadow"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for closing (behind modal) */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Gradient Animation Styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}