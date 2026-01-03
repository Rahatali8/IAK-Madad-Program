"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  DollarSign,
  FileText,
  Shield,
  Clock,
  Phone,
} from "lucide-react"
import { Footer } from "@/components/layout/footer"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle, count: 24 },
    { id: "application", name: "Applications", icon: FileText, count: 8 },
    { id: "eligibility", name: "Eligibility", icon: Users, count: 6 },
    { id: "financial", name: "Financial", icon: DollarSign, count: 5 },
    { id: "security", name: "Security", icon: Shield, count: 3 },
    { id: "process", name: "Process", icon: Clock, count: 2 },
  ]

  const faqs = [
    {
      id: 1,
      category: "application",
      question: "How do I apply for financial assistance?",
      answer:
        "You can apply for financial assistance by visiting our website and filling out the online application form. You'll need to provide personal information, financial details, and supporting documents. Our team will review your application within 48 hours.",
    },
    {
      id: 2,
      category: "eligibility",
      question: "Who is eligible for welfare assistance?",
      answer:
        "Pakistani citizens who are facing financial hardship, have a monthly household income below PKR 50,000, and can provide proper documentation are eligible. Priority is given to widows, orphans, disabled individuals, and families affected by natural disasters.",
    },
    {
      id: 3,
      category: "financial",
      question: "What is the maximum amount I can receive?",
      answer:
        "The assistance amount varies based on your specific needs and circumstances. Emergency assistance ranges from PKR 10,000 to PKR 100,000, while long-term support can go up to PKR 500,000. Educational scholarships range from PKR 25,000 to PKR 200,000 annually.",
    },
    {
      id: 4,
      category: "process",
      question: "How long does the approval process take?",
      answer:
        "Emergency cases are processed within 24 hours. Regular applications take 48-72 hours for initial review. Complete processing including verification and approval typically takes 5-7 working days.",
    },
    {
      id: 5,
      category: "application",
      question: "What documents do I need to submit?",
      answer:
        "Required documents include: CNIC copy, income certificate, bank statement (last 3 months), utility bills, medical reports (if applicable), and any relevant supporting documents for your specific case.",
    },
    {
      id: 6,
      category: "security",
      question: "Is my personal information secure?",
      answer:
        "Yes, we use bank-level encryption and security measures to protect your data. All information is stored securely and only accessed by authorized personnel for verification purposes. We never share your data with third parties.",
    },
    {
      id: 7,
      category: "eligibility",
      question: "Can I apply if I'm already receiving government assistance?",
      answer:
        "Yes, you can still apply. However, we consider all sources of income and assistance when evaluating your application. Our goal is to provide additional support where government programs may not be sufficient.",
    },
    {
      id: 8,
      category: "financial",
      question: "Do I need to repay the assistance?",
      answer:
        "Most of our assistance programs are grants that don't require repayment. However, some microfinance and business development loans do have repayment terms with very low or zero interest rates.",
    },
    {
      id: 9,
      category: "application",
      question: "Can I track my application status?",
      answer:
        "Yes, once you submit your application, you'll receive a tracking number. You can check your status online using this number or contact our support team for updates.",
    },
    {
      id: 10,
      category: "eligibility",
      question: "Are there age restrictions for applicants?",
      answer:
        "Applicants must be 18 years or older to apply independently. For minors, a legal guardian can apply on their behalf. Senior citizens (60+) receive priority consideration in our review process.",
    },
    {
      id: 11,
      category: "financial",
      question: "How is the assistance amount determined?",
      answer:
        "The amount is determined based on your specific needs, family size, income level, and the type of assistance required. Our assessment team evaluates each case individually to ensure fair and appropriate support.",
    },
    {
      id: 12,
      category: "process",
      question: "What happens after my application is approved?",
      answer:
        "After approval, you'll receive a confirmation call and email. The assistance will be disbursed through your preferred method (bank transfer, mobile wallet, or collection from our office) within 2-3 working days.",
    },
    {
      id: 13,
      category: "application",
      question: "Can I apply for multiple types of assistance?",
      answer:
        "Yes, you can apply for different types of assistance, but each application is evaluated separately. For example, you might receive both medical assistance and educational support if you qualify for both.",
    },
    {
      id: 14,
      category: "security",
      question: "How do you verify applications?",
      answer:
        "We have a thorough verification process including document verification, field visits by our team, reference checks, and database cross-checking to ensure authenticity and prevent fraud.",
    },
    {
      id: 15,
      category: "eligibility",
      question: "Can overseas Pakistanis apply?",
      answer:
        "Currently, our programs are designed for residents of Pakistan. However, overseas Pakistanis can contribute to our programs or sponsor specific cases through our donor platform.",
    },
    {
      id: 16,
      category: "financial",
      question: "Are there any fees for applying?",
      answer:
        "No, there are absolutely no fees for applying or receiving assistance. Our services are completely free. Be cautious of anyone asking for fees - this would be fraudulent.",
    },
    {
      id: 17,
      category: "application",
      question: "What if my application is rejected?",
      answer:
        "If your application is rejected, you'll receive a detailed explanation. You can appeal the decision within 30 days by providing additional documentation or clarification. You can also reapply after 6 months.",
    },
    {
      id: 18,
      category: "eligibility",
      question: "Do you assist businesses and entrepreneurs?",
      answer:
        "Yes, we have specific programs for small business owners and entrepreneurs, including microfinance loans, business development grants, and skill development programs.",
    },
    {
      id: 19,
      category: "security",
      question: "How can I report fraud or suspicious activity?",
      answer:
        "Report any suspicious activity to our fraud hotline at +92 21 1234 5678 or email fraud@welfareplatform.org. We take all reports seriously and investigate thoroughly.",
    },
    {
      id: 20,
      category: "application",
      question: "Can I update my application after submission?",
      answer:
        "Yes, you can update your application within 24 hours of submission. After that, contact our support team to make changes. Major changes might require a new application.",
    },
    {
      id: 21,
      category: "eligibility",
      question: "What if I don't have all required documents?",
      answer:
        "Contact our support team to discuss alternative documentation. We understand that some people may not have all documents and we try to work with available alternatives while maintaining verification standards.",
    },
    {
      id: 22,
      category: "financial",
      question: "How often can I apply for assistance?",
      answer:
        "You can apply for emergency assistance once every 6 months. For ongoing support programs like education or medical assistance, you can reapply annually or as needed based on your circumstances.",
    },
    {
      id: 23,
      category: "process",
      question: "Can I visit your office in person?",
      answer:
        "Yes, we have offices in major cities. You can visit during office hours (9 AM - 6 PM, Monday to Saturday) for assistance with applications, document submission, or general inquiries.",
    },
    {
      id: 24,
      category: "application",
      question: "Is there a mobile app for applications?",
      answer:
        "Currently, applications are processed through our website. However, we're developing a mobile app that will be launched soon. You can apply through our mobile-optimized website in the meantime.",
    },
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 bg-cover bg-center bg-fixed h-[60vh] flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20210711/original/pngtree-caring-for-the-elderly-public-welfare-design-psd-layering-picture-image_1125477.jpg')",
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
            <span className="text-darkblue">Frequently Asked</span>{" "}
            <span className="text-lightblue"> Questions</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-base xs:text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-100 opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find answers to common questions about our welfare programs, application process, and services.
          </motion.p>
                        {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg bg-white border-white/20 text-black placeholder:text-darkblue"
              />
            </div>

        </div>
      </section>


      {/* FAQ Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle className="text-darkblue">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeCategory === category.id ? "bg-gradient-to-r from-[#1B0073] to-[#00A5E0] hover:opacity-90 text-white" : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-auto">
                        {category.id === "all" ? faqs.length : category.count}
                      </Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-darkblue">Still Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-[#1B0073] to-[#00A5E0] hover:opacity-90 text-white">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Items */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredFAQs.length} of {faqs.length} questions
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(faq.id)}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-darkblue pr-4">{faq.question}</CardTitle>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedItems.includes(faq.id) && (
                      <CardContent className="pt-0">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
                    <p className="text-gray-500 mb-4">We couldn't find any questions matching your search.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setActiveCategory("all")
                      }}
                    >
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
