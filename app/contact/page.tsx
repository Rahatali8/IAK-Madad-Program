"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MessageCircle, Headphones, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import CallToAction from "@/components/CTA-section"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+92 21 1234 5678",
      availability: "24/7 Available",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries via email",
      contact: "@welfareplatform.org",
      availability: "Response within 2 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our representatives",
      contact: "Available on website",
      availability: "9 AM - 9 PM",
    },
    {
      icon: Headphones,
      title: "WhatsApp",
      description: "Quick support via WhatsApp",
      contact: "+92 300 1234567",
      availability: "24/7 Available",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 bg-cover bg-center bg-fixed h-[50vh] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20210711/original/pngtree-caring-for-the-elderly-public-welfare-design-psd-layering-picture-image_1125477.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-darkblue">We're Here</span>{" "}
            <span className="text-lightblue"> to Help</span>
          </motion.h1>

          <motion.p
            className="text-base xs:text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-100 opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Have questions about our services? Need assistance with your application? Our dedicated support team is
            available 24/7 to help you.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Contact Methods Section */}
          <div className="text-center mb-16">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-darkblue drop-shadow-2xl">
              Multiple Ways<span className="text-lightblue"> to Reach Us</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Choose the most convenient way to get in touch with our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 items-stretch">
            {contactMethods.map((method, index) => (
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
                  {/* Icon top-right corner */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 
          rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                    <method.icon className="h-6 w-6 sm:h-7 sm:w-7 text-lightblue" />
                  </div>

                  <div>
                    <CardTitle className="text-lg sm:text-xl font-extrabold tracking-tight text-darkblue mb-2">
                      {method.title}
                    </CardTitle>
                    <CardContent className="text-center">
                      <p className="text-gray-600 text-xs sm:text-sm">{method.description}</p>
                      <p className="font-semibold text-darkblue mt-2">{method.contact}</p>
                      <Badge variant="secondary" className="text-xs mt-2">{method.availability}</Badge>
                    </CardContent>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>


          {/* Left: Image with Hover Effect | Right: Info Card */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side with Image + hover card */}
            <div className="relative h-80 md:h-full group rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/hero1.jpg"
                alt="Welfare Platform support team ready to help families in need"
                className="w-full h-full object-cover transition duration-700 group-hover:blur-sm"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                <h2 className="text-2xl font-bold text-darkblue">We’re Always With You</h2>
                <p className="mt-2 text-gray-700">
                  Your support means the world to us. Together, we can bring hope, dignity, and care to those who need it the most.
                  Every step you take with us builds a stronger, brighter future.
                </p>
              </div>
            </div>

            {/* Right side Info */}
            <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100">
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center text-darkblue text-xl font-bold">
                  <Clock className="h-6 w-6 mr-2 text-lightblue" />
                  Office Hours
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  We’re here to assist you throughout the week.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 mt-2">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Monday – Friday</span>
                  <span className="font-semibold text-darkblue">9:00 AM – 6:00 PM</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Saturday</span>
                  <span className="font-semibold text-darkblue">10:00 AM – 4:00 PM</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Sunday</span>
                  <span className="font-semibold text-red-600">Closed</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-green-50">
                    <span className="text-gray-700 font-medium">Emergency Support</span>
                    <span className="font-bold text-green-700">24/7 Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <CallToAction />
    </div>
  )
}
