"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { DollarSign, BookOpen, Home, Stethoscope, GraduationCap, Utensils, Phone, MapPin, Clock, Target, Heart, ArrowRight } from "lucide-react"
import CallToAction from "@/components/CTA-section"
import FloatingBot from "@/components/FloatingBot"
import RequestsFeedVertical from "@/components/RequestsFeedVertical";
import RecentNews from "@/components/recent-news"


export default function HomePage() {
  const [, setDailyRequests] = useState<{ date: string, count: number }[]>([]);
  useEffect(() => {
    async function fetchDaily() {
      const res = await fetch('/api/stats/requests-daily');
      const data = await res.json();
      setDailyRequests(data.daily || []);
    }
    fetchDaily();
    const interval = setInterval(fetchDaily, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);
  const [, setStats] = useState({
    totalHelped: 15420,
    totalDonated: 2850000,
    activeProjects: 156,
    successRate: 94,
    familiesSupported: 8500,
    scholarshipsGiven: 1200,
    medicalCases: 3400,
    emergencyRelief: 2800,
  })



  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalHelped: prev.totalHelped + Math.floor(Math.random() * 3),
        totalDonated: prev.totalDonated + Math.floor(Math.random() * 1000),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])




  const services = [
    {
      icon: DollarSign,
      title: "Financial Assistance",
      description:
        "We provide emergency loans and microfinance support to uplift small businesses, assist low-income families, and help individuals overcome sudden financial crises with dignity and confidence.",
      color: "bg-green-100 text-green-600",
      cases: "2,400+ Cases",
      image: "/help12.png",
      href: "/services",
    },
    {
      icon: Stethoscope,
      title: "Medical Support",
      description:
        "From covering hospital expenses to providing essential medicines, we ensure patients receive timely healthcare services and struggling families get much-needed relief during medical emergencies.",
      color: "bg-red-100 text-red-600",
      cases: "3,400+ Patients",
      image: "/help3.png",
      href: "/services",
    },
    {
      icon: GraduationCap,
      title: "Education Support",
      description:
        "Scholarships, school supplies, and financial aid programs help deserving students continue their studies, achieve academic excellence, and build brighter futures without interruptions or obstacles.",
      color: "bg-blue-100 text-lightblue",
      cases: "1,200+ Students",
      image: "/help11.png",
      href: "/services",
    },
    {
      icon: Home,
      title: "Marriage Support",
      description:
        "We ease marriage expenses through financial aid, dowry assistance, and household setup support, helping underprivileged families start new journeys with hope, dignity, and lasting stability.",
      color: "bg-purple-100 text-purple-600",
      cases: "800+ Homes",
      image: "/help7.png",
      href: "/services",
    },
    {
      icon: Utensils,
      title: "Business Development",
      description:
        "We provide seed capital, expert guidance, and essential resources to help aspiring entrepreneurs start or expand small businesses, promoting self-reliance, growth, and sustainable livelihoods.",
      color: "bg-orange-100 text-orange-600",
      cases: "5,600+ Families",
      image: "/help10.png",
      href: "/services",
    },
    {
      icon: BookOpen,
      title: "Livelihood Support",
      description:
        "Providing tools, sewing machines, carts, and small resources to deserving families so they can start earning with dignity, support their children’s education, and build a stable future.",
      color: "bg-cyan-100 text-cyan-600",
      cases: "1200+ Families Supported",
      image: "/help6.png",
      href: "/services",
    },

  ];




  const achievements = [
    { number: "15+", label: "Years of Service", icon: Clock },
    { number: "50+", label: "Cities Covered", icon: MapPin },
    { number: "94%", label: "Success Rate", icon: Target },
    { number: "24/7", label: "Support Available", icon: Phone },
  ]

  // Background carousel state (decorative only)
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCarouselIndex((i) => (i + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  // Rotating service words for left-side hero (4-5 related words)
  const serviceWords = ["Education", "Healthcare", "Scholarships", "Emergency Relief", "Livelihoods"];
  const [serviceIndex, setServiceIndex] = useState(0);
  useEffect(() => {
    const id2 = setInterval(() => setServiceIndex((i) => (i + 1) % serviceWords.length), 3200);
    return () => clearInterval(id2);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <div className="px-0 xs:px-2 sm:px-4 pt-2 sm:pt-6">
        <section className="relative w-full min-h-[85vh] bg-white overflow-hidden flex items-center">
          {/* Full-bleed decorative background carousel (covers entire hero section) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full overflow-hidden">
              <div className="absolute inset-0">
                <img src="/baby.png" alt="Happy child receiving welfare support in Pakistan" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${carouselIndex === 0 ? 'opacity-100 blur-sm' : 'opacity-0 blur-md'}`} />
                <img src="/chairmain.jpg" alt="Welfare Platform founder Muhammad Muzahir Sheikh" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${carouselIndex === 1 ? 'opacity-100 blur-sm' : 'opacity-0 blur-md'}`} />
                <img src="/stories-hero1.jpg" alt="Success stories of families helped by welfare programs" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${carouselIndex === 2 ? 'opacity-100 blur-sm' : 'opacity-0 blur-md'}`} />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 h-full py-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center h-full">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000 ml-10 mb-10 relative">
                {/* Decorative blurred gradient blob behind text */}
                <div className="left-spotlight absolute -left-20 -top-12 w-72 h-72 rounded-full pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="inline-block">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#00A5E0] to-lightblue text-white text-sm font-semibold shadow-sm mb-3">Our Focus</div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-gray drop-shadow-sm">
                    <span className="word-animation">
                      <span className="word text-darkblue">Empowering</span>{" "}
                      <span className="word text-darkblue">Lives</span>{" "}
                      <span className="word text-darkblue">Through</span>{" "}
                      <span key={serviceIndex} className="word text-lightblue rotating">{serviceWords[serviceIndex]}</span>
                    </span>
                  </h1>

                  <div className="typing-animation-container max-w-xl">
                    <p className="text-base sm:text-lg md:text-xl text-gray leading-relaxed typing-text">{`Dedicated to providing ${serviceWords[serviceIndex].toLowerCase()} services that uplift families and build lasting impact.`}</p>
                  </div>

                  {/* feature chips */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="feature-chip inline-flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-white/70 backdrop-blur-sm ring-1 ring-white/40">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium">Community Care</span>
                    </div>
                    <div className="feature-chip inline-flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-white/70 backdrop-blur-sm ring-1 ring-white/40">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm font-medium">Education Programs</span>
                    </div>
                    <div className="feature-chip inline-flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-white/70 backdrop-blur-sm ring-1 ring-white/40">
                      <Stethoscope className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium">Medical Aid</span>
                    </div>
                  </div>

                  {/* CTAs and small stat badges */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6 w-full">
                    <div className="w-full sm:w-auto">
                      <Link href="/donate">
                        <button className="vip-cta w-full sm:w-auto bg-gradient-to-r from-[#00A5E0] lightblue text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 justify-center transition-transform hover:-translate-y-1">
                          Donate Now <ArrowRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Link href="/signup">
                        <button className="w-full sm:w-auto border-2 border-[#0D6DB7] text-lightblue px-5 py-2 rounded-lg shadow-sm hover:bg-[#0D6DB7] hover:text-white transition">Get Help</button>
                      </Link>
                    </div>

                    <div className="ml-0 sm:ml-4 hidden sm:flex items-center gap-3">
                      <div className="stat-badge text-lightblue text-sm font-semibold">15+ yrs</div>
                      <div className="stat-badge text-lightblue text-sm font-semibold">94% success</div>
                      <div className="stat-badge text-lightblue text-sm font-semibold">8.5k families</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Hero Image in Circle + Animated Circles */}
              <div className="hidden md:flex relative justify-center items-center h-full">
                <div className="relative z-10 w-[300px] h-[300px] md:w-[460px] md:h-[460px]">
                  <div className="hero-circle-lift absolute left-0 bottom-0 w-72 h-72 rounded-full bg-white border-2 border-[#0D6DB7] flex items-center justify-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-md">
                    <img src="/hero-back.png" alt="Family receiving financial assistance from Welfare Platform" className="rounded-full object-cover object-center w-full h-full" />
                  </div>
                  <div className="hero-circle-lift absolute left-[80px] top-4 w-36 h-36 rounded-full bg-white border-2 border-[#8DC63F] flex items-center justify-center shadow-md transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-md">
                    <img src="/hero-back.png" alt="Community support and welfare programs in action" className="rounded-full object-cover object-center w-full h-full" />
                  </div>
                  <div className="hero-circle-lift absolute left-[270px] top-24 w-48 h-48 rounded-full bg-white border-2 border-[#0D6DB7] flex items-center justify-center shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-md">
                    <img src="/hero-back.png" alt="Welfare Platform helping families achieve financial stability" className="rounded-full object-cover object-center w-full h-full" />
                  </div>
                  <div className="hero-circle-lift group absolute right-[35px] top-[350px] w-36 h-36 rounded-full bg-white border-2 border-lightblue flex items-center justify-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-md">
                    <img src="/hero-back.png" alt="Empowering lives through comprehensive welfare services" className="rounded-full object-cover object-center w-full h-full" />
                  </div>
                </div>

                <style jsx>{`
                  @keyframes circleMove1 { 0%{transform:translateY(0)}50%{transform:translateY(-10px)}100%{transform:translateY(0)} }
                  .animate-circle-move1{animation:circleMove1 6s ease-in-out infinite}
                  @keyframes circleMove2 { 0%{transform:translateX(0)}50%{transform:translateX(10px)}100%{transform:translateX(0)} }
                  .animate-circle-move2{animation:circleMove2 7s ease-in-out infinite}
                  @keyframes circleFloat {0%{transform:translateY(0)}50%{transform:translateY(-12px)}100%{transform:translateY(0)}}
                  .animate-circle-float{animation:circleFloat 8s ease-in-out infinite}

                  .word-animation .word{display:inline-block;opacity:0;transform:translateY(20px);animation:wordFadeIn .8s ease-out forwards}
                  .word-animation .word:nth-child(1){animation-delay:.1s}.word-animation .word:nth-child(3){animation-delay:.2s}.word-animation .word:nth-child(5){animation-delay:.3s}.word-animation .word:nth-child(7){animation-delay:.4s}
                  @keyframes wordFadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}

                  .typing-animation-container{width:100%;overflow:hidden}
                  .typing-text{overflow:hidden;border-right:2px solid #0D6DB7;white-space:nowrap;display:inline-block;width:0;animation:typing 4s steps(50) infinite alternate-reverse}
                  @keyframes typing{0%{width:0}100%{width:100%}}

                  /* rotating service word */
                  .rotating{display:inline-block;position:relative;transition:all .4s ease-in-out}

                  /* CTA shimmer */
                  .vip-cta{position:relative;overflow:hidden}
                  .vip-cta::after{content:'';position:absolute;left:-40%;top:0;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);transform:skewX(-20deg);transition:left .9s ease-in-out}
                  .vip-cta:hover::after{left:120%}

                  .left-spotlight{background:radial-gradient(circle at 30% 30%, rgba(0,165,224,0.12), rgba(13,109,183,0.06) 40%, transparent 60%)}
                  .feature-chip{backdrop-filter:blur(6px)}
                  .stat-badge{background:linear-gradient(180deg,#ffffffcc,#ffffffaa);padding:6px 10px;border-radius:10px;box-shadow:0 6px 18px rgba(11,20,40,0.06)}
                  @media (max-width: 640px){
                    .hero-circle-lift{display:none}
                    .left-spotlight{display:none}
                  }
                `}</style>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Requests Feed Section - Vertically scrollable, social style */}
      <div className="w-full flex flex-col items-center py-8 p-7 bg-gradient-to-b from-blue-50 via-white to-blue-100 ">
        <div className="w-full h-[600px] overflow-y-auto space-y-6 px-2 scrollbar-thin scrollbar-thumb-blue-200 scroll-smooth">
          <RequestsFeedVertical />
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="relative py-10 px-2 sm:py-16 sm:px-4 bg-gradient-to-b from-[#F8FAFF] via-white to-[#F5F7FF] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
          <div className="absolute -bottom-28 -right-20 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-tr from-indigo-600/10 to-blue-500/10 blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 relative">
          <div className="relative mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              <div className="hidden lg:block flex-1 mr-8">
                <div className="h-0.5 bg-gradient-to-l from-blue-600 via-cyan-500 to-transparent"></div>
              </div>
              <div className="text-center px-2 sm:px-8">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-darkblue">Trusted Excellence <span className="text-lightblue">in Welfare</span></h2>
                <p className="text-base sm:text-lg text-[#5F5F5F] max-w-2xl sm:max-w-3xl mx-auto">
                  Together, we can create lasting change in the lives of those who need it most. Your support makes a real
                  difference in our community.
                </p>
              </div>
              <div className="hidden lg:block flex-1 ml-8">
                <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-16">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow"
              >
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-4 sm:p-6 text-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] ring-1 ring-transparent group-hover:ring-blue-200/60">
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                    <achievement.icon className="h-5 w-5 sm:h-6 sm:w-6 text-lightblue" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-extrabold tracking-tight text-darkblue mb-1">{achievement.number}</div>
                  <div className="text-xs sm:text-md font-medium text-gray">{achievement.label}</div>
                  <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>



          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="group relative h-64 overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
              {/* Image slides right */}
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full">
                <img
                  src="/verify.png"
                  alt="100% verification process for welfare applications"
                  className="w-full h-full object-cover"
                />
              </div>


              {/* Text slides left */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <h3 className="text-xl font-semibold text-darkblue mb-2">100% Verified</h3>
                <p className="text-md text-gray leading-relaxed">
                  Every application undergoes rigorous verification by our dedicated team.
                  We review documents, conduct field validations, and cross-check references
                  to ensure authenticity.
                </p>
              </div>

              {/* Label */}
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-md drop-shadow-[0_0_8px_rgba(0,102,255,0.8)] animate-pulse">
                100% Verified
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="group relative h-64 overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
              {/* Image slides right */}
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full">
                <img
                  src="/fast-p.png"
                  alt="Fast processing of welfare applications within 24-48 hours"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text slides left */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <h3 className="text-xl font-semibold text-darkblue mb-2">Fast Processing</h3>
                <p className="text-md text-gray leading-relaxed">
                  Priority triage ensures urgent cases are processed first. Emergency requests
                  are handled within 24 hours, and standard applications within 48 hours.
                  Automation plus expert review makes it quick and reliable.
                </p>
              </div>

              {/* Label */}
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-md drop-shadow-[0_0_8px_rgba(0,102,255,0.8)] animate-pulse">
                Fast Process
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="group relative h-64 overflow-hidden border-0 shadow-lg rounded-2xl bg-white">
              {/* Image slides right */}
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full">
                <img
                  src="/nation-w.png"
                  alt="Nationwide network covering all provinces of Pakistan"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text slides left */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <h3 className="text-xl font-semibold text-darkblue mb-2">Nationwide Network</h3>
                <p className="text-md text-gray leading-relaxed">
                  With 50+ offices and 200+ field coordinators, we maintain a strong presence
                  across all provinces. Local teams understand local needs—enabling faster
                  verification and smoother assistance delivery.
                </p>
              </div>

              {/* Label */}
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-md drop-shadow-[0_0_8px_rgba(0,102,255,0.8)] animate-pulse">
                Nationwide Network
              </div>
            </Card>
          </div>
        </div>
      </section>




      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-8">
            <div className="flex items-center justify-center">
              <div className="hidden lg:block flex-1 mr-8">
                <div className="h-0.5 bg-gradient-to-l from-blue-600 via-cyan-500 to-transparent"></div>
              </div>
              <div className="text-center px-8">
                <h2 className="text-5xl md:text-5xl font-bold mb-3 text-darkblue">Valueable Welfare<span className="text-lightblue"> Programs</span></h2>
                <p className="text-lg text-[#5F5F5F] max-w-3xl mx-auto">
                  Together, we can create lasting change in the lives of those who need it most. Your support makes a real
                  difference in our community.
                </p>
              </div>
              <div className="hidden lg:block flex-1 ml-8">
                <div className="h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link key={index} href={service.href} aria-label={service.title} className="group block relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <div className="absolute inset-0">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-[filter] duration-700 ease-out group-hover:blur-sm bg-white" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-900/10 to-transparent" />
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="p-5 flex items-center gap-3">
                    <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold drop-shadow">{service.title}</h3>
                      <span className="text-white/80 text-xs">{service.cases}</span>
                    </div>
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 translate-y-full group-hover:translate-y-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100">
                  <div className="bg-blue-50/95 backdrop-blur-sm p-5 h-full rounded-t-2xl border-t border-blue-100/80">
                    <p className="text-md text-light text-gray">{service.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* recent news section */}
      <RecentNews />


      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-5xl font-bold text-darkblue mb-3">How We <span className="text-lightblue">Help You</span></h2>
            <p className="text-lg text-[#5F5F5F] max-w-3xl mx-auto">
              A clear, four-step journey from application to disbursement—fast, transparent, and secure.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute hidden md:block left-0 right-0 top-10 h-px bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200" />

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Apply Online", desc: "Submit your application securely with required details.", icon: BookOpen },
                { step: "02", title: "Verification", desc: "Our team validates your documents and information.", icon: Clock },
                { step: "03", title: "Review", desc: "Experts assess your case and finalize the assistance.", icon: Target },
                { step: "04", title: "Disbursement", desc: "Funds or support are delivered quickly and safely.", icon: DollarSign },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div
                    className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="rounded-2xl bg-white/80 backdrop-blur-xl p-6 h-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center text-md font-semibold shadow-sm">
                            {item.step}
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-darkblue flex items-center justify-center shadow-sm">
                            <item.icon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="hidden md:block w-10 h-10 rounded-full bg-gradient-to-tr from-white to-white/40 shadow-inner" />
                      </div>
                      <h3 className="text-lg font-semibold text-darkblue mb-2">{item.title}</h3>
                      <p className="text-md text-gray leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CallToAction />

      <FloatingBot />
    </div>
  )
}