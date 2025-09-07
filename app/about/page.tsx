'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Target, TrendingUp, Shield } from "lucide-react"
import ArcGalleryHero from "@/components/arc-gallery-hero";
import CallToAction from "@/components/CTA-section"

export default function AboutPage() {
  const milestones = [
    { year: "2010", title: "Foundation", description: "Idara Al-Khair established with a vision to serve humanity" },
    { year: "2015", title: "Digital Platform", description: "Launched online welfare management system" },
    { year: "2018", title: "50,000 Families", description: "Reached milestone of helping 50,000+ families" },
    { year: "2020", title: "COVID Response", description: "Emergency relief program during pandemic" },
    { year: "2022", title: "Microfinance Launch", description: "Started comprehensive microfinance program" },
    { year: "2024", title: "AI Integration", description: "Implemented AI-powered application processing" },
  ]

  const images = [
    '/hero1.jpg',
    '/hero2.jpg',
    '/user-male.png',
    '/user-female.jpg',
    '/welfare-work.png',
    '/head-logo.png',
    '/footer-logo.png',
    '/freepik__abstract-digital-art-featuring-a-series-of-horizon__489.png',
    '/image 15.png',
    '/VkvvhXlWo3hEBzcqwTpjd_aa4bf9ee998f4ec0b17a8bf16fe3e9e2.jpg',
    '/hyperrealistic_commercial_product_photography_of_luxury_chrome_sunglasses_on_male_model_extreme_chi_fanguv2w9zx489lcivwa_2.png',
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every case with empathy and understanding, treating each person with dignity and respect.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Complete transparency in our operations, funding, and decision-making processes.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building stronger communities through collaborative efforts and sustainable development.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "Focused on creating measurable, long-term positive impact in people's lives. positive impact in people's lives.",
    },
  ]

  const team = [
    {
      name: "Muhammad Muzahir Sheikh",
      role: "Chairman & Founder",
      image: "/chairmain.jpg",
      description: "Leading social welfare initiatives for over 20 years",
    },
    {
      name: "Muhammad saad Sheikh",
      role: "Head of Technology Department",
      image: "/Saad Bhai.jpg",
      description: "Expert in welfare program management and community development",
    },
    {
      name: "Miss Tasneem sheikh",
      role: "Director of Operations",
      image: "/placeholder.svg?height=200&width=200&text=AH",
      description: "Driving digital transformation in welfare services",
    },
  ]



  const [showFullJourney, setShowFullJourney] = useState(false);

  return (
    <div className="min-h-screen bg-white">


      <main className="relative min-h-[40vh] sm:min-h-[50vh] bg-background px-0 xs:px-2 sm:px-4 pt-4 sm:pt-8">
        <ArcGalleryHero
          images={images}
          startAngle={20}
          endAngle={160}
          radiusLg={480}
          radiusMd={320}
          radiusSm={180}
          cardSizeLg={120}
          cardSizeMd={90}
          cardSizeSm={60}
        />
      </main>


      {/* Mission & Vision - redesigned */}
      <section className="py-12 px-4 sm:py-20 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Our Core <span className="text-cyan-600">Mission & Vision</span></h2>
              <p className="text-lg text-slate-600 leading-relaxed">We provide comprehensive welfare services that empower individuals and families to achieve self-sufficiency, dignity, and prosperity. Our programs focus on sustainable solutions, community empowerment, and transparent operations.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 grid place-items-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Holistic Programs</h4>
                    <p className="text-sm text-slate-600">Integrated services addressing root causes and immediate needs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-lg bg-green-50 text-green-600 grid place-items-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Community Focus</h4>
                    <p className="text-sm text-slate-600">Working closely with communities to build sustainable capacity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-lg bg-violet-50 text-violet-600 grid place-items-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Sustainable Impact</h4>
                    <p className="text-sm text-slate-600">Programs designed for long-term measurable outcomes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 rounded-lg bg-amber-50 text-amber-600 grid place-items-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Compassion & Care</h4>
                    <p className="text-sm text-slate-600">We treat every person with dignity and empathy.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">Support Our Work</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['/images/mission1.jpg','/images/welfare-aged.png','/images/mission3.jpg','/images/mission4.jpg'].map((src, i) => (
                <figure key={i} className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                  <img src={src} alt={`mission-${i}`} className="w-full h-40 object-cover" />
                  <figcaption className="p-3 text-xs text-slate-600">{i === 0 ? 'Support Programs' : i === 1 ? 'Welfare of Aged' : i === 2 ? 'Community Growth' : 'Hope & Opportunity'}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>






      {/* Values */}
      <section className="py-10 px-2 sm:py-16 sm:px-4 bg-gray-50 m-2 sm:m-5">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-darkblue drop-shadow-2xl">
              Our Core <span className="text-lightblue">Values</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-16 items-stretch">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
          shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
          transition-shadow h-full"
              >
                <CardHeader
                  className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-4 sm:p-6 text-center 
            transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] 
            ring-1 ring-transparent group-hover:ring-blue-200/60 h-full flex flex-col justify-between"
                >
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 
            rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                    <value.icon className="h-7 w-7 sm:h-8 sm:w-8 text-lightblue" />
                  </div>

                  <div>
                    <CardTitle className="text-lg sm:text-2xl font-extrabold tracking-tight text-darkblue mb-2">
                      {value.title}
                    </CardTitle>
                    <CardContent>
                      <p className="text-gray-600 text-xs sm:text-sm">{value.description}</p>
                    </CardContent>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Timeline - Horizontal Revealable Journey */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-darkblue drop-shadow-2xl">Our <span className="text-lightblue">Journey</span></h2>
            <p className="text-2xl text-gray-700">A timeline of our growth, innovation, and impact</p>
          </div>
          <div className="relative w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-8 relative overflow-x-auto pb-8">
              {/* First milestone */}
              <div className="flex flex-col items-center min-w-[260px]">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-4">
                  <span className="text-white text-2xl font-extrabold drop-shadow-lg">{milestones[0].year}</span>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 w-full max-w-xs">
                  <h3 className="text-xl font-bold text-darkblue mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    {milestones[0].title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">{milestones[0].description}</p>
                </div>
              </div>

              {/* Connecting line or button */}
              {!showFullJourney && (
                <div className="flex flex-col items-center">
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mb-4 mt-10" />
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all font-bold text-xl whitespace-nowrap"
                    onClick={() => setShowFullJourney(true)}
                  >
                    View Full Journey
                  </Button>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mt-4" />
                </div>
              )}

              {showFullJourney && (
                <>
                  {milestones.slice(1, -1).map((milestone, index) => (
                    <>
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full" />
                      <div key={index} className="flex flex-col items-center min-w-[260px]">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-4">
                          <span className="text-white text-2xl font-extrabold drop-shadow-lg">{milestone.year}</span>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 w-full max-w-xs">
                          <h3 className="text-xl font-bold text-darkblue mb-2 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                            {milestone.title}
                          </h3>
                          <p className="text-gray-700 text-base leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              )}

              {/* Last milestone always at the end */}
              <div className="h-1 w-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full" />
              <div className="flex flex-col items-center min-w-[260px]">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white mb-4">
                  <span className="text-white text-2xl font-extrabold drop-shadow-lg">{milestones[milestones.length - 1].year}</span>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 w-full max-w-xs">
                  <h3 className="text-xl font-bold text-darkblue mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    {milestones[milestones.length - 1].title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">{milestones[milestones.length - 1].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-gray-50 m-5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-darkblue drop-shadow-2xl">
              Meet Our <span className="text-lightblue">Visionary Leaders</span>
            </h2>
            <p className="text-xl text-gray-600">
              Dedicated professionals working to make a difference
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group relative rounded-2xl p-[1px] 
          bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
          shadow-[0_10px_30px_rgba(17,24,39,0.08)] 
          hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
          transition-shadow h-full"
              >
                {/* h-full important for equal height */}
                <CardHeader
                  className="h-full flex flex-col justify-between relative rounded-2xl 
            bg-white/80 backdrop-blur-xl p-6 text-center 
            transition-transform duration-300 group-hover:-translate-y-1 
            group-hover:scale-[1.01] ring-1 ring-transparent 
            group-hover:ring-blue-200/60"
                >
                  <div>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <CardTitle className="text-2xl font-extrabold tracking-tight text-darkblue mb-1">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-lightblue font-medium">
                      {member.role}
                    </CardDescription>
                  </div>

                  <CardContent className="mt-4">
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50 m-5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-darkblue drop-shadow-2xl">
              Our Impact in <span className="text-lightblue">Numbers</span>
            </h2>
            <p className="text-xl text-gray-600">
              Measurable results of our commitment to social welfare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Families Helped */}
            <div className="group relative rounded-2xl p-[1px] h-full 
        bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
        shadow-[0_10px_30px_rgba(17,24,39,0.08)] 
        hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
        transition-shadow">
              <div className="h-full flex flex-col justify-between relative rounded-2xl 
          bg-white/80 backdrop-blur-xl p-10 text-center 
          transition-transform duration-300 group-hover:-translate-y-1 
          group-hover:scale-[1.01] ring-1 ring-transparent 
          group-hover:ring-blue-200/60">
                <div className="text-4xl font-extrabold text-lightblue mb-2">500+</div>
                <p className="text-gray-600 font-medium">
                  Families Helped By Us in all over Pakistan
                </p>
              </div>
            </div>

            {/* Total Assistance */}
            <div className="group relative rounded-2xl p-[1px] h-full 
        bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
        shadow-[0_10px_30px_rgba(17,24,39,0.08)] 
        hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
        transition-shadow">
              <div className="h-full flex flex-col justify-between relative rounded-2xl 
          bg-white/80 backdrop-blur-xl p-10 text-center 
          transition-transform duration-300 group-hover:-translate-y-1 
          group-hover:scale-[1.01] ring-1 ring-transparent 
          group-hover:ring-blue-200/60">
                <div className="text-4xl font-extrabold text-green-600 mb-2">PKR 500M+</div>
                <p className="text-gray-600 font-medium">Total Assistance</p>
              </div>
            </div>

            {/* Welfare Programs */}
            <div className="group relative rounded-2xl p-[1px] h-full 
        bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
        shadow-[0_10px_30px_rgba(17,24,39,0.08)] 
        hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
        transition-shadow">
              <div className="h-full flex flex-col justify-between relative rounded-2xl 
          bg-white/80 backdrop-blur-xl p-10 text-center 
          transition-transform duration-300 group-hover:-translate-y-1 
          group-hover:scale-[1.01] ring-1 ring-transparent 
          group-hover:ring-blue-200/60">
                <div className="text-4xl font-extrabold text-purple-600 mb-2">12</div>
                <p className="text-gray-600 font-medium">
                  Welfare Programs in all over Pakistan
                </p>
              </div>
            </div>

            {/* Success Rate */}
            <div className="group relative rounded-2xl p-[1px] h-full 
        bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 
        shadow-[0_10px_30px_rgba(17,24,39,0.08)] 
        hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] 
        transition-shadow">
              <div className="h-full flex flex-col justify-between relative rounded-2xl 
          bg-white/80 backdrop-blur-xl p-10 text-center 
          transition-transform duration-300 group-hover:-translate-y-1 
          group-hover:scale-[1.01] ring-1 ring-transparent 
          group-hover:ring-blue-200/60">
                <div className="text-4xl font-extrabold text-orange-600 mb-2">94%</div>
                <p className="text-gray-600 font-medium">
                  Success Rate in all over Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <CallToAction />
    </div>
  )
}
