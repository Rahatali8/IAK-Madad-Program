
"use client";

import { useState } from "react";
import { Users, BadgeCheck, Award, HelpCircle } from "lucide-react";

export default function UserDashboard() {
  const [cnic, setCnic] = useState("");
  const [requestData, setRequestData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setRequestData(null);
    setLoading(true);
    if (!cnic || cnic.length < 13) {
      setError("Valid CNIC (13 digits) is required.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/user/search?cnic=${cnic}`);
      const data = await res.json();
      if (res.ok && data.requests?.length > 0) {
        setRequestData(data.requests[0]);
      } else {
        setError(data.message || "No record found.");
      }
    } catch (err) {
      setError("Something went wrong, please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-10">
      <section className="w-full max-w-6xl mx-auto px-2 py-6">
        <h3 className="relative text-center text-3xl md:text-4xl font-extrabold text-darkblue mb-6">
          <span className="inline-block whitespace-nowrap overflow-hidden animate-typing">
            Welcome to Dashboard 📈
          </span>
          <span className="block w-auto h-1 mx-auto mt-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-glow"></span>

          <style jsx>{`
    @keyframes typing {
      0% { width: 0 }
      40% { width: 100% }
      60% { width: 100% }
      100% { width: 0 }
    }
    .animate-typing {
      display: inline-block;
      width: 0;
      animation: typing 3s steps(25, end) infinite;
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.8); }
      50% { box-shadow: 0 0 25px rgba(168,85,247,0.9); }
    }
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
  `}</style>
        </h3>

        <p className="text-lg text-gray-600 text-center mb-6 leading-relaxed">
          Welcome to your secure dashboard — protected with advanced authentication and data encryption to ensure your safety and privacy.
        </p>
        {/* Verified section */}
        <div className="hover:bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text Content - Left Side */}
            <div className="flex-1 text-start lg:text-left">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-darkblue mb-3">
                  Verified <span className="text-lightblue">&</span> Secure
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Streamline your verification process with our advanced tracking system and secure data management
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm border border-blue-200">Secure</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium shadow-sm border border-green-200">Efficient</span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium shadow-sm border border-purple-200">Real-time</span>
              </div>
            </div>

            {/* Interactive Image with Hover Effect - Right Side */}
            <div className="relative group cursor-pointer">
              {/* Main Image - Avatar Style */}
              <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300 border-4 border-whit">
                <img
                  src="/user-male.png"
                  alt="Verification System"
                  className="w-full h-full object-cover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  animate-pulse"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-darkblue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Hover Details Card */}
              <div className="absolute -bottom-6 -left-6 w-72 bg-white rounded-2xl shadow-2xl p-5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-lightblue rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-darkblue text-md mb-2">Smart Verification</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Real-time status tracking</li>
                      <li>• Automated validation checks</li>
                      <li>• Secure data handling</li>
                      <li>• Instant notifications</li>
                    </ul>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-lightblue rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
              <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
            </div>
          </div>
        </div>

        {/* Section: Community Impact */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-50 rounded-3xl p-8 mb-8 border border-purple-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Side - Content with Animated Arrow */}
            <div className="flex-1 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-4 flex items-center gap-3">
                <Users className="w-10 h-10 text-purple-500" />
                Join a Thriving Community
              </h2>

              <p className="text-lg text-purple-800 mb-4 leading-relaxed">
                Thousands of users, one mission: helping each other. Every request, every donation, every story matters here.

                {/* Animated Arrow pointing to image */}
                <span className="inline-block ml-3 animate-bounce">
                  <svg className="w-6 h-6 text-purple-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </p>

              <ul className="text-base text-purple-700 space-y-2 pl-4">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Real people, real impact
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Verified stories and transparent process
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Support and hope for all
                </li>
              </ul>
            </div>

            {/* Right Side - Avatar Cards */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Main Avatar */}
                <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-300 bg-white transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/welfare-work.png"
                    alt="Community Impact"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Avatar Cards */}
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-blue-500 bg-white">
                  <img
                    src="/welfare-work.png"
                    alt="Community Member"
                    className="w-full h-full object-cover animate-zoom"
                  />
                </div>

                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-purple-500 bg-white">
                  <img
                    src="/welfare-work.png"
                    alt="Community Member"
                    className="w-full h-full object-cover animate-zoom"
                  />
                </div>

                <div className="absolute top-1/2 -right-6 w-12 h-12 rounded-lg overflow-hidden shadow-md border-2 border-lime-500 bg-white transform -translate-y-1/2">
                  <img
                    src="/welfare-work.png"
                    alt="Community Member"
                    className="w-full h-full object-cover animate-zoom"
                  />
                </div>

             <style jsx>{`
                 @keyframes zoom {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.15); }
                  }
                  .animate-zoom {
                  animation: zoom 3s ease-in-out infinite;
                  transition: transform 0.5s ease;
               }
            `}</style>

              </div>
            </div>
          </div>
        </div>

        {/* VIP Experience section - Same pattern as Verified */}
        <div className="hover:bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 mb-8 border border-pink-100 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Text Content - Left Side */}
            <div className="flex-1 text-start lg:text-left">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-pink-900 mb-3">
                  VIP <span className="text-pink-500">Experience</span>
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A modern, fast, and beautiful way to check your status. Designed for ease, clarity, and a touch of luxury.
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium shadow-sm border border-pink-200">Instant</span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium shadow-sm border border-purple-200">Premium</span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm border border-blue-200">24/7 Support</span>
              </div>
            </div>

            {/* Interactive Image with Hover Effect - Right Side */}
            <div className="relative group cursor-pointer">
              {/* Main Image - Avatar Style */}
              <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300 border-4 border-white">
                <img
                  src="/user-female.jpg"
                  alt="VIP Experience"
                  className="w-full h-full object-cover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Hover Details Card */}
              <div className="absolute -bottom-6 -left-6 w-72 bg-white rounded-2xl shadow-2xl p-5 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-pink-900 text-md mb-2">Premium Features</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Priority processing</li>
                      <li>• Enhanced security</li>
                      <li>• Dedicated support</li>
                      <li>• Fast-track verification</li>
                    </ul>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-500 rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
              <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
            </div>
          </div>
        </div>

        {/* Request Portal Section */}
        <div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-center text-darkblue mb-4">
            Request <span className="text-lightblue">Portal</span>
          </h3>
          {/* 👇 Instruction Text + Animated Arrow */}
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600 font-medium mb-2">
              Check your current request status below
            </p>
            <button
              onClick={() => {
                document.getElementById("searchBar")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mx-auto flex flex-col items-center text-blue-600 hover:text-blue-800 transition"
            >
              <svg
                className="w-6 h-6 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  name="cnic"
                  value={cnic}
                  onChange={e => setCnic(e.target.value)}
                  placeholder="Search by CNIC..."
                  className="searchBar w-full md:w-80 px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg bg-blue-50"
                  maxLength={13}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    className="appearance-none px-4 pr-10 py-2 rounded-lg border border-blue-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  >
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>

                  {/* Custom Dropdown Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-blue-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </form>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl">
              <table className="min-w-full bg-white rounded-2xl">
                <thead>
                  <tr className="bg-blue-50 text-blue-900 text-left text-sm">
                    <th className="py-3 px-4 font-semibold">User ID</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Address</th>
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <span className="inline-block animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></span>
                      </td>
                    </tr>
                  )}
                  {error && !loading && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-red-600 font-semibold">{error}</td>
                    </tr>
                  )}
                  {requestData && !loading && (
                    <>
                      <tr className="hover:bg-blue-50 transition">
                        <td className="py-4 px-4 font-mono text-blue-900">{requestData.id || requestData.orderId || '—'}</td>
                        <td className="py-4 px-4 flex items-center gap-2">
                          <img
                            src={requestData.gender === 'female' ? '/user-female.jpg' : '/user-male.png'}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 shadow"
                          />
                          <span className="font-semibold text-blue-900">{requestData.full_name || requestData.name}</span>
                        </td>
                        <td className="py-4 px-4 text-blue-800">{requestData.city || requestData.address || '—'}</td>
                        <td className="py-4 px-4 text-blue-800">{requestData.type || requestData.product || '—'}</td>
                        <td className="py-4 px-4 text-blue-800">{requestData.created_at ? new Date(requestData.created_at).toLocaleDateString() : (requestData.date || '—')}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${((requestData.status || '').toLowerCase() === 'approved') ? 'bg-green-100 text-green-700' : ((requestData.status || '').toLowerCase() === 'pending') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{requestData.status}</span>
                        </td>
                      </tr>
                      {((requestData.status || '').toLowerCase() === 'rejected') && requestData.rejection_reason && (
                        <tr>
                          <td colSpan={6} className="py-4 px-4">
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                              <div className="font-semibold mb-1">Rejection Reason</div>
                              <div>{requestData.rejection_reason}</div>
                              {requestData.updated_at && (
                                <div className="text-xs text-red-700 mt-1">Rejected on: {new Date(requestData.updated_at).toLocaleString()}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  {!loading && !requestData && !error && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">No requests found. Please search by CNIC.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {loading && (
                <div className="py-8 text-center">
                  <span className="inline-block animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></span>
                </div>
              )}
              {error && !loading && (
                <div className="py-4 text-center text-red-600 font-semibold">{error}</div>
              )}
              {requestData && !loading && (
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">User ID:</span>
                    <span className="font-mono text-blue-900">{requestData.id || requestData.orderId || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">Customer:</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={requestData.gender === 'female' ? '/user-female.jpg' : '/user-male.png'}
                        alt="User"
                        className="w-6 h-6 rounded-full object-cover border-2 border-blue-200 shadow"
                      />
                      <span className="font-semibold text-blue-900">{requestData.full_name || requestData.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">Address:</span>
                    <span className="text-blue-800">{requestData.city || requestData.address || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">Product:</span>
                    <span className="text-blue-800">{requestData.type || requestData.product || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900">Date:</span>
                    <span className="text-blue-800">{requestData.created_at ? new Date(requestData.created_at).toLocaleDateString() : (requestData.date || '—')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${((requestData.status || '').toLowerCase() === 'approved') ? 'bg-green-100 text-green-700' : ((requestData.status || '').toLowerCase() === 'pending') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{requestData.status}</span>
                  </div>
                  {((requestData.status || '').toLowerCase() === 'rejected') && requestData.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      <div className="font-semibold mb-1">Rejection Reason</div>
                      <div>{requestData.rejection_reason}</div>
                      {requestData.updated_at && (
                        <div className="text-xs text-red-700 mt-1">Rejected on: {new Date(requestData.updated_at).toLocaleString()}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {!loading && !requestData && !error && (
                <div className="py-8 text-center text-gray-400">No requests found. Please search by CNIC.</div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* More Information Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-3xl md:text-4xl font-extrabold text-center text-darkblue mb-2">
          Need <span className="text-lightblue">Assistance?</span>
        </h3>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Find answers to common questions and get the support you need for a seamless experience
        </p>

        {/* Info/FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Card 1: Need Help? */}
            <div className="flex-1 bg-gradient-to-br from-cyan-100 via-white to-blue-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-cyan-500" />
                Need Help?
              </h2>
              <ul className="text-gray-700 text-base space-y-2 pl-2">
                <li><span className="font-semibold text-blue-700">•</span> Enter your 13-digit CNIC to instantly check your latest request status.</li>
                <li><span className="font-semibold text-blue-700">•</span> No login or signup required—just pure convenience.</li>
                <li><span className="font-semibold text-blue-700">•</span> All data is secure and private, visible only to you.</li>
                <li><span className="font-semibold text-blue-700">•</span> For any issues, contact our support team at <a href="mailto:support@khairwelfare.org" className="underline text-cyan-700">support@khairwelfare.org</a></li>
              </ul>
            </div>

            {/* Card 2: How to Use */}
            <div className="flex-1 bg-gradient-to-br from-blue-100 via-white to-cyan-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-1">?</span>
                How to Use
              </h2>
              <ol className="list-decimal list-inside text-gray-700 text-base space-y-2 pl-2">
                <li>Type your 13-digit CNIC number in the search box above.</li>
                <li>Click the <span className="font-semibold text-blue-700">Search</span> button.</li>
                <li>See your latest request status instantly in the table.</li>
                <li>If you need more help, contact our support team.</li>
              </ol>
              <a href="mailto:support@khairwelfare.org" className="mt-2 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center w-fit">
                Contact Support
              </a>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-400 text-xs pb-4">
          Powered by <span className="font-bold text-blue-700">Al-Khair Welfare Platform</span> — Making a difference, one request at a time.
        </footer>
      </div>
    </div>
  );
}
