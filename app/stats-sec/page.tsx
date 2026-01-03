'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Users, Home, BookOpen } from 'lucide-react';
import { BarChart as DayBarChart, Bar as DayBar, XAxis as DayXAxis, YAxis as DayYAxis, Tooltip as DayTooltip, ResponsiveContainer as DayResponsiveContainer, Legend as DayLegend, LineChart as SignupLineChart, Line as SignupLine } from 'recharts';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CallToAction from '@/components/CTA-section';


const COLORS = ['#38bdf8', '#06b6d4', '#fbbf24', '#f472b6', '#a3e635', '#f87171'];

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const data = [
  { name: "W 1", requests: 100 },
  { name: "W 2", requests: 120 },
  { name: "W 3", requests: 240 },
  { name: "W 4", requests: 260 },
  { name: "W 5", requests: 310 },
  { name: "W 6", requests: 360 },
  { name: "W 7", requests: 380 },
  { name: "W 8", requests: 430 },
  { name: "W 9", requests: 475 },
];

export default function DashboardAnalytics() {
  const [chartHeight, setChartHeight] = useState(250);
  const [dailyRequests, setDailyRequests] = useState<{ date: string, count: number }[]>([]);
  const [dailyByType, setDailyByType] = useState<any[]>([]);
  const [requestTypes, setRequestTypes] = useState<string[]>([]);
  const [signupsDaily, setSignupsDaily] = useState<{ date: string, count: number }[]>([]);

  useEffect(() => {
    const updateHeight = () => {
      setChartHeight(window.innerWidth < 768 ? 200 : 250);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  useEffect(() => {
    async function fetchDaily() {
      const res = await fetch('/api/stats/requests-daily');
      const data = await res.json();
      setDailyRequests(data.daily || []);
      setDailyByType(data.dailyByType || []);
      setRequestTypes(data.types || []);
    }
    fetchDaily();
    const interval = setInterval(fetchDaily, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    async function fetchSignups() {
      const res = await fetch('/api/stats/signups-daily');
      const data = await res.json();
      setSignupsDaily(data.daily || []);
    }
    fetchSignups();
    const interval = setInterval(fetchSignups, 10000);
    return () => clearInterval(interval);
  }, []);

  const [requests, setRequests] = useState<any>({ total: 0, weekly: [], byType: [], latest: [] });
  const [signups, setSignups] = useState<any>({ total: 0, weekly: [] });
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const reqRes = await fetch('/api/stats/requests-full').then(r => r.json());
      const signRes = await fetch('/api/stats/signups').then(r => r.json());
      setRequests(reqRes);
      setSignups(signRes);
      setCategories(reqRes.byType.map((t: any) => t.name));
      setSelectedCategory(reqRes.byType[0]?.name || '');
      setLoading(false);
    }
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = requests.latest.filter((r: any) =>
    r.type === selectedCategory
  );

  // Aggregated metrics for VIP header cards
  const totalRequests = requests.total || 0;
  const approvedCount = requests.latest.filter((r: any) => (r.status || '').toLowerCase() === 'approved').length;
  const pendingCount = requests.latest.filter((r: any) => (r.status || '').toLowerCase() === 'pending').length;
  const totalSignups = signups.total || 0;


  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-lightblue font-medium animate-pulse">Loading stats...</p>
      </div>
    );


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-b-3xl shadow-xl mb-10 h-[80vh] flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-white" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg mt-5">
                <span className="text-[#1B0073]">Live </span>{" "}
                <span className="text-[#00A5E0]">Welfare Programs</span>
                <br />
              </h1>
              <span className="text-[#1B0073] font-bold text-4xl">Stats & Analytics Dashboard</span>
              <p className="text-black">
                Get real-time insights into all welfare requests, user signups, and platform activity. Visualize trends, monitor impact, and make data-driven decisions for a better tomorrow.
              </p>
              <div className="flex gap-4 mt-4">
                <span className="inline-block bg-white/20 px-4 py-2 rounded-lg text-base font-semibold shadow bg-gradient-to-r from-[#1B0073] to-[#00A5E0] hover:opacity-90 text-white">Auto-updating Live Data</span>
                <span className="inline-block bg-white/20 px-4 py-2 rounded-lg text-base font-semibold shadow border-2  text-[#1B0073] hover:bg-[#00A5E0] hover:text-white">VIP Analytics</span>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#1B0073] mb-4">Monthly Requests</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="requests" stroke="#00A5E0" strokeWidth={3} />
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-t from-blue-100/60 to-transparent rounded-b-3xl z-0" />
        </section>

        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {/* Day-wise Request Type Distribution (Stacked Bar) */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/40 shadow hover:shadow-lg transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-4">
              <h2 className="text-lg font-semibold mb-4 text-center text-darkblue">Request Type Distribution (Day-wise)</h2>
              <DayResponsiveContainer width="100%" height={chartHeight}>
                <DayBarChart data={dailyByType.map(row => {
                  // flatten types array to keys
                  const out: any = { date: row.date };
                  row.types.forEach((t: any) => { out[t.type] = t.count });
                  return out;
                })}>
                  <DayXAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <DayYAxis allowDecimals={false} />
                  <DayTooltip />
                  <DayLegend />
                  {requestTypes.map((type, idx) => (
                    <DayBar key={type} dataKey={type} stackId="a" fill={COLORS[idx % COLORS.length]} />
                  ))}
                </DayBarChart>
              </DayResponsiveContainer>
            </div>
          </div>
          {/* Day-wise Requests Bar Chart */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/40 shadow hover:shadow-lg transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-4">
              <h2 className="text-lg font-semibold mb-4 text-center text-darkblue">Requests per Day (Last 14 Days)</h2>
              <DayResponsiveContainer width="100%" height={chartHeight}>
                <DayBarChart data={dailyRequests}>
                  <DayXAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <DayYAxis allowDecimals={false} />
                  <DayTooltip />
                  <DayBar dataKey="count" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </DayBarChart>
              </DayResponsiveContainer>
            </div>
          </div>
          {/* Day-wise User Signups Line Chart */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/40 shadow hover:shadow-lg transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur p-4">
              <h2 className="text-lg font-semibold mb-4 text-center text-darkblue">User Signups per Day</h2>
              <DayResponsiveContainer width="100%" height={chartHeight}>
                <SignupLineChart data={signupsDaily}>
                  <DayXAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <DayYAxis allowDecimals={false} />
                  <DayTooltip />
                  <DayLegend />
                  <SignupLine type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                </SignupLineChart>
              </DayResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filter & Request Cards Section */}
        <div className="bg-white/60 backdrop-blur-xl shadow-xl rounded-2xl p-8 max-w-7xl mx-auto mt-10">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full transition shadow-sm hover:shadow ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'bg-white/80 text-darkblue border border-blue-100'
                  }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-6 text-center text-darkblue tracking-wide drop-shadow">{selectedCategory} Requests</h3>
          {filteredRequests.length === 0 ? (
            <p className="text-center text-gray-500">No requests found for this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredRequests.map((req: any, index: number) => {
                const genderImg = req.gender === 'female' ? '/user-female.jpg' : '/user-male.png';
                return (
                  <div key={index} className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/50 via-blue-500/40 to-indigo-600/50 shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-5 rounded-2xl bg-white/80 backdrop-blur-xl p-6">
                      <div className="relative">
                        <img
                          src={genderImg}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-200/80 group-hover:scale-105 transition-transform bg-white"
                          alt={req.full_name || 'User'}
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.25)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-extrabold text-darkblue truncate flex items-center gap-2">
                          <Users className="inline w-5 h-5 text-lightblue" /> {req.full_name}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1 mb-1">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{req.user?.city || 'No city'}</span>
                          <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{req.user?.phone || 'No phone'}</span>
                          {req.material && <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{req.material}</span>}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {req.user?.address || 'No address'} <span className="font-semibold text-darkblue">– PKR {req.monthly_income?.toLocaleString?.() ?? req.monthly_income}</span>
                        </p>
                        <span
                          className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-semibold shadow ${statusColors[req.status?.toLowerCase?.() || 'pending']
                            }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Platform Highlights Cards Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16 mb-10">
        <div className="relative mb-8">
          <div className="flex items-center justify-center">
            <div className="hidden lg:block flex-1 mr-8">
              <div className="h-0.5 bg-gradient-to-l from-blue-600 via-cyan-500 to-transparent"></div>
            </div>
            <div className="text-center px-8">
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#1B0073]">Platform <span className="text-[#00A5E0]">Highlights</span></h2>
            </div>
            <div className="hidden lg:block flex-1 ml-8">
              <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tile 1 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-lightblue flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-darkblue">Thousands of Users</h3>
                <p className="text-gray-700 text-sm mt-1">Join a growing community making a real impact every day.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 2 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-amber-400/60 via-orange-500/40 to-yellow-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-amber-900">Diverse Requests</h3>
                <p className="text-gray-700 text-sm mt-1">Support for food, education, health, and more—tailored to real needs.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-amber-600 to-orange-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 3 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-400/60 via-fuchsia-500/40 to-rose-500/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-sm">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-pink-900">Nationwide Reach</h3>
                <p className="text-gray-700 text-sm mt-1">Connecting donors and recipients across major cities.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-pink-600 to-fuchsia-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 4 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-400/60 via-teal-500/40 to-green-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-emerald-900">Live Analytics</h3>
                <p className="text-gray-700 text-sm mt-1">Real-time stats and transparent insights.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 5 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-400/60 via-blue-500/40 to-purple-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-indigo-900">Verified Requests</h3>
                <p className="text-gray-700 text-sm mt-1">Every request is checked for authenticity.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-indigo-600 to-blue-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 6 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-rose-400/60 via-red-500/40 to-orange-500/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-rose-900">Instant Notifications</h3>
                <p className="text-gray-700 text-sm mt-1">Stay updated with every new event.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-rose-600 to-orange-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
          {/* Tile 7 */}
          <div className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-cyan-900">Secure & Private</h3>
                <p className="text-gray-700 text-sm mt-1">Your data and donations are fully protected.</p>
                <div className="mt-3 h-[3px] w-0 bg-gradient-to-r from-cyan-600 to-blue-500 group-hover:w-full transition-all duration-700"></div>
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
              </div>
            </div>
          </div>
        </div>
            <CallToAction/>

      </div>
    </>
  );
}
