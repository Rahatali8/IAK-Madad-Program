"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, TrendingUp, Users, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import CallToAction from "@/components/CTA-section"

const successStories = [
  {
    id: 1,
    name: "Fatima Bibi",
    location: "Lahore, Punjab",
    program: "Business Loan",
    amount: "PKR 300,000",
    outcome: "Monthly income increased from PKR 15,000 to PKR 45,000",
    story: "Started a tailoring business and now employs 3 women",
    image: "/swing-machine.jpg",
    verified: true,
  },
  {
    id: 2,
    name: "Muhammad Akram",
    location: "Karachi, Sindh",
    program: "Emergency Medical Aid",
    amount: "PKR 150,000",
    outcome: "Successful heart surgery completed",
    story: "Father of 4 received life-saving cardiac treatment",
    image: "/household.jpg",
    verified: true,
  },
  {
    id: 3,
    name: "Aisha Khan",
    location: "Islamabad, ICT",
    program: "Education Support",
    amount: "PKR 80,000",
    outcome: "Completed MBA degree with distinction",
    story: "First in family to complete higher education",
    image: "/solar-system.jpg",
    verified: true,
  },
  {
    id: 4,
    name: "Ali Hassan",
    location: "Faisalabad, Punjab",
    program: "Microfinance",
    amount: "PKR 50,000",
    outcome: "Vegetable business expanded to 3 locations",
    story: "From street vendor to shop owner in 8 months",
    image: "/WhatsApp Image 2025-09-01 at 10.00.14_dda14157.jpg",
    verified: true,
  },
  {
    id: 5,
    name: "Khadija Begum",
    location: "Peshawar, KPK",
    program: "Women Empowerment",
    amount: "PKR 120,000",
    outcome: "Beauty salon serving 200+ customers monthly",
    story: "Trained 15 other women in beauty skills",
    image: "/fries ka thela.jpeg",
    verified: true,
  },
  {
    id: 6,
    name: "Rashid Ahmed",
    location: "Multan, Punjab",
    program: "Agricultural Support",
    amount: "PKR 200,000",
    outcome: "Crop yield increased by 150%",
    story: "Modern farming techniques transformed his 5-acre farm",
    image: "/vagetable.jpeg",
    verified: true,
  },
  {
    id: 7,
    name: "Saima Malik",
    location: "Quetta, Balochistan",
    program: "Skills Development",
    amount: "PKR 60,000",
    outcome: "Computer training led to office job",
    story: "From housewife to IT professional earning PKR 35,000/month",
    image: "/chees.jpeg",
    verified: true,
  },
  {
    id: 8,
    name: "Tariq Mahmood",
    location: "Sialkot, Punjab",
    program: "Business Expansion",
    amount: "PKR 400,000",
    outcome: "Sports goods export business to 5 countries",
    story: "Employs 25 people and exports globally",
    image: "/swing-machine.jpeg",
    verified: true,
  },
  {
    id: 9,
    name: "Nazia Sultana",
    location: "Hyderabad, Sindh",
    program: "Healthcare Support",
    amount: "PKR 180,000",
    outcome: "Daughter's cancer treatment successful",
    story: "5-year-old daughter is now cancer-free and healthy",
    image: "/simple-thela.jpeg",
    verified: true,
  },
  {
    id: 10,
    name: "Imran Shah",
    location: "Rawalpindi, Punjab",
    program: "Technology Training",
    amount: "PKR 90,000",
    outcome: "Mobile repair shop earning PKR 60,000/month",
    story: "6-month course led to successful tech business",
    image: "/pulao.jpeg",
    verified: true,
  },
  {
    id: 11,
    name: "Rubina Khatoon",
    location: "Gujranwala, Punjab",
    program: "Widow Support",
    amount: "PKR 100,000",
    outcome: "Home-based catering business serves 50+ families",
    story: "Supporting 3 children through food business",
    image: "/v-t.jpeg",
    verified: true,
  },
  {
    id: 12,
    name: "Shahid Iqbal",
    location: "Sargodha, Punjab",
    program: "Livestock Support",
    amount: "PKR 250,000",
    outcome: "Dairy farm produces 200 liters milk daily",
    story: "From 2 buffaloes to 15-animal dairy operation",
    image: "/baby.png",
    verified: true,
  },
]

export default function SuccessStoriesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 bg-cover bg-center bg-fixed h-[80vh] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('/success-stories-hero-section.jpg')",
        }}
      >
        {/* Overlay for opacity */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto text-center relative z-10">
          {/* Heading */}
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[#1B0073]"> Success Stories </span>{" "}
            <span className="text-[#00A5E0]"> from Our Community</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base xs:text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-white opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discover how the Khair Welfare Program by Idara Al-Khair has transformed lives across Pakistan. These are real stories of hope, determination, and success.
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#1B0073] to-[#00A5E0] hover:opacity-90 text-white"
              asChild
            >
              <Link href="/signup">Start Your Journey <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2  text-[#1B0073] hover:bg-[#00A5E0] hover:text-white"
              asChild
            >
              <Link href="/stats-sec">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-gray-50 m-5">
        <h1 className="text-center font-bold text-5xl text-[#1B0073] pb-10">Our Impect <span className="text-[#00A5E0]">In Numbers</span></h1>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "1000+", label: "Success Stories", color: "text-green-600" },
              { value: "PKR 5M+", label: "Lives Transformed", color: "text-blue-600" },
              { value: "95%", label: "Success Rate", color: "text-purple-600" },
              { value: "150+", label: "Cities Covered", color: "text-orange-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow"
              >
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-8 text-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] ring-1 ring-transparent group-hover:ring-blue-200/60">
                  <div className={`text-3xl sm:text-4xl font-extrabold mb-2 ${stat.color}`}>{stat.value}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-center font-bold text-5xl text-[#1B0073] pb-10">Featured Success <span className="text-[#00A5E0]">Stories</span></h1>
            <p className="text-xl text-gray-600">
              Meet the inspiring individuals who have transformed their lives through our programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {successStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow h-full"
              >
                <Card className="relative rounded-2xl bg-white/80 backdrop-blur-xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] ring-1 ring-transparent group-hover:ring-blue-200/60 h-full flex flex-col">

                  {/* Image fix aspect ratio */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={story.image}
                      alt={`Success story of ${story.name}`}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Header */}
                  <CardHeader className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800">{story.program}</Badge>
                      {story.verified && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <CardDescription>{story.location}</CardDescription>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="flex flex-col justify-between flex-grow">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Assistance Provided:</p>
                        <p className="text-sm text-blue-700">{story.amount}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Outcome:</p>
                        <p className="text-sm text-green-700">{story.outcome}</p>
                      </div>
                      <p className="text-sm text-gray-600 italic mt-auto">"{story.story}"</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Program Impact */}
      <section className="py-16 px-4 bg-gray-50 m-5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1B0073] drop-shadow-2xl">
              Impact by <span className="text-[#00A5E0]">Program</span>
            </h2>
            <p className="text-xl text-gray-600">How our initiatives are transforming lives</p>
          </div>

          {/* Equal height cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {[
              {
                icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
                title: "Business Development",
                value: "3,500+",
                sub: "Businesses Started",
                extra: "Average Growth: 200%",
                color: "text-blue-600",
              },
              {
                icon: <Heart className="h-6 w-6 text-red-600" />,
                title: "Healthcare Support",
                value: "2,800+",
                sub: "Lives Saved",
                extra: "98% Recovery Rate",
                color: "text-red-600",
              },
              {
                icon: <Users className="h-6 w-6 text-green-600" />,
                title: "Education Programs",
                value: "1,200+",
                sub: "Degrees Completed",
                extra: "85% Job Placement",
                color: "text-green-600",
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-purple-600" />,
                title: "Skills Development",
                value: "4,100+",
                sub: "People Trained",
                extra: "92% Employment Rate",
                color: "text-purple-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-indigo-600/60 shadow-[0_10px_30px_rgba(17,24,39,0.08)] hover:shadow-[0_20px_40px_rgba(17,24,39,0.12)] transition-shadow h-full"
              >
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl p-8 text-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.01] ring-1 ring-transparent group-hover:ring-blue-200/60 h-full flex flex-col justify-between">

                  {/* Floating Icon */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-4">{item.title}</h3>
                    <div className="space-y-2">
                      <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                      <p className="text-sm text-gray-600">{item.sub}</p>
                      <div className="text-lg font-semibold text-gray-800">{item.extra}</div>
                    </div>
                  </div>

                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse [mask-image:linear-gradient(90deg,transparent,black,transparent)]"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <CallToAction />

    </div>
  )
}
