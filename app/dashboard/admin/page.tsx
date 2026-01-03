"use client"

import { useState, useEffect, ReactNode } from "react"
import { Users, DollarSign, Heart, CreditCard, Search, Eye, CheckCircle, XCircle, Clock, TrendingUp, FileText, LogOut, BarChart3, UserCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Request {
  rejection_reason?: string | null
  id: number
  userId: number
  type: string
  reason: string
  amount?: number
  status: "pending" | "approved" | "rejected" | "completed"
  submittedAt: string
  currentAddress: string
  cnicImage?: string
  additionalData: any
  updated_at?: string
  verification_complete?: boolean
  user: {
    full_name: ReactNode
    fullName: string
    cnic: string
    address: string
  }
  forwardedToSurvey?: boolean
  surveyStatus?: string
  surveyStatusNormalized?: string
  surveyRecommendation?: string | null
  surveyReport?: string | null
  surveyAttachments?: any[]
  sentToAdmin?: boolean
}

interface AcceptedByDonorItem {
  id: number
  amount: number
  isFullfill: boolean
  acceptedAt: string
  donor: {
    id?: number
    name?: string
    email?: string
    cnic?: string
    contact_number?: string
    organization_name?: string | null
  }
  request: Request
}

interface Donor {
  id: number
  name: string
  email: string
  cnic: string
  contact_number?: string | null
  organization_name?: string | null
  status: "PENDING" | "ACTIVE" | "REJECTED"
  created_at: string
}

interface Analytics {
  totalUsers: ReactNode
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalAmount: number
  loanRequests: number
  microfinanceRequests: number
  generalRequests: number
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "accepted-by-donors" | "survey-requests" | "completed-surveys" | "donors" | "overview">("overview")
  const [typeFilter, setTypeFilter] = useState("all")
  const [donors, setDonors] = useState<Donor[]>([])
  const [isLoadingDonors, setIsLoadingDonors] = useState(false)
  const [acceptedByDonors, setAcceptedByDonors] = useState<AcceptedByDonorItem[]>([])
  const [readDonorRequests, setReadDonorRequests] = useState<number[]>([])
  const [surveyRequests, setSurveyRequests] = useState<Request[]>([])
  const [readSurveyRequests, setReadSurveyRequests] = useState<number[]>([])
  const [showPendingCount, setShowPendingCount] = useState(6)
  const [showApprovedCount, setShowApprovedCount] = useState(6)
  const [showRejectedCount, setShowRejectedCount] = useState(6)
  const [showSurveyCount, setShowSurveyCount] = useState(6)
  const [showAcceptedByDonorsCount, setShowAcceptedByDonorsCount] = useState(6)
  const [showAllCount, setShowAllCount] = useState(6)
  const [showDonorsCount, setShowDonorsCount] = useState(6)
  const [showCompletedCount, setShowCompletedCount] = useState(5)

  const [expandedDonorRequests, setExpandedDonorRequests] = useState<{ [id: string]: boolean }>({});
  const handleToggleDonorRequest = (id: number) => {
    setExpandedDonorRequests((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const { toast } = useToast()
  const router = useRouter()

  // New: Fetch accepted donors from API and update state + localStorage
  const fetchAcceptedByDonors = async () => {
    try {
      const res = await fetch('/api/admin/accepted-donors')
      if (res.ok) {
        const data = await res.json()
        if (data.acceptedDonors) {
          setAcceptedByDonors(data.acceptedDonors)
          if (typeof window !== 'undefined') {
            localStorage.setItem('acceptedByDonors', JSON.stringify(data.acceptedDonors))
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch accepted donors', error)
    }
  }

  useEffect(() => {
    fetchRequests()
    fetchAnalytics()
    fetchDonors()
    fetchAcceptedByDonors()
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('acceptedByDonors') : null
      if (raw) setAcceptedByDonors(JSON.parse(raw))
      const readRaw = typeof window !== 'undefined' ? localStorage.getItem('readDonorAcceptedRequests') : null
      if (readRaw) setReadDonorRequests(JSON.parse(readRaw))
      const readSurveyRaw = typeof window !== 'undefined' ? localStorage.getItem('readSurveyRequests') : null
      if (readSurveyRaw) setReadSurveyRequests(JSON.parse(readSurveyRaw))
    } catch { }
  }, [])

  // Periodically refresh accepted donors and analytics
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAcceptedByDonors()
      fetchAnalytics()
      fetchRequests()
      fetchDonors()
    }, 10000) // 10 seconds

    return () => clearInterval(intervalId)
  }, [])

  const updateRequestStatus = async (requestId: number, status: "approved" | "rejected", rejectionReason?: string) => {
    // Optimistically update the UI
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId
          ? { ...req, status, rejection_reason: status === 'rejected' ? rejectionReason : req.rejection_reason }
          : req
      )
    );

    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status, rejectionReason }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Request has been ${status}`,
        })
        // Refetch in the background for consistency
        fetchRequests()
        fetchAnalytics()
        fetchAcceptedByDonors() 
        if (status === 'approved') setActiveTab('approved')
        if (status === 'rejected') setActiveTab('rejected')
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update request status",
          variant: "destructive",
        })
        // Revert on failure
        fetchRequests();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
      // Revert on failure
      fetchRequests();
    }
  }

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, typeFilter])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests)
        // Also fetch persisted survey entries so Survey Requests tab shows forwarded items after reload
        try {
          const sres = await fetch('/api/survey')
          if (sres.ok) {
            const sd = await sres.json()
            // map surveys -> application objects expected by UI
            const surveys = (sd.surveys || []).map((s: any) => {
              const app = s.application || {}
              return {
                id: app.id,
                userId: app.user_id ?? app.user?.id ?? 0,
                user: {
                  // include both names used in UI/types
                  full_name: app.full_name || app.user?.name || '',
                  fullName: app.full_name || app.user?.name || '',
                  cnic: app.cnic_number || app.user?.cnic || '',
                  address: app.user?.address || app.user_address || ''
                },
                type: app.type || '',
                reason: app.reason || '',
                // keep application status (pending/approved/rejected) separate
                status: (app.status || '').toLowerCase(),
                submittedAt: app.created_at || app.submittedAt,
                currentAddress: app.user?.address || app.user_address || '',
                additionalData: app,
                verification_complete: app.verification_complete || false,
                // include survey-specific fields so admin can see completed surveys
                surveyStatus: s.status || '',
                surveyStatusNormalized: (s.status || '').toLowerCase(),
                surveyRecommendation: s.recommendation || null,
                surveyReport: s.report || null,
                surveyAttachments: s.attachments || [],
                sentToAdmin: s.sentToAdmin || false,
              }
            })
            // Show newest forwarded surveys first
            surveys.sort((a: any, b: any) => {
              const at = a?.submittedAt ? new Date(a.submittedAt).getTime() : 0
              const bt = b?.submittedAt ? new Date(b.submittedAt).getTime() : 0
              return bt - at
            })
            setSurveyRequests(surveys)
            // Prune any stored readSurveyRequests that don't correspond to current completed surveys
            try {
              if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('readSurveyRequests')
                if (raw) {
                  const stored: number[] = JSON.parse(raw)
                  const completedIds = surveys.filter((s: any) => (s.surveyStatusNormalized || '').toLowerCase() === 'completed').map((s: any) => Number(s.id))
                  const next = stored.filter((id) => completedIds.includes(Number(id)))
                  setReadSurveyRequests(next)
                  localStorage.setItem('readSurveyRequests', JSON.stringify(next))
                }
              }
            } catch (e) {
              // ignore localStorage errors
            }
          }
        } catch (e) {
          console.error('Failed to load surveys', e)
        }
      } else if (response.status === 401) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const fetchDonors = async () => {
    try {
      setIsLoadingDonors(true)
      const res = await fetch("/api/admin/donors")
      if (res.ok) {
        const data = await res.json()
        setDonors(data.donors || [])
      }
    } catch (e) {
      console.error("Error fetching donors:", e)
    } finally {
      setIsLoadingDonors(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.user.cnic.includes(searchTerm) ||
          request.reason.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((request) => request.type === typeFilter)
    }

    setFilteredRequests(filtered)
  }


  const updateDonorStatus = async (donorId: number, status: "ACTIVE" | "PENDING" | "REJECTED") => {
    // Optimistically update the UI
    setDonors(prevDonors =>
      prevDonors.map(donor =>
        donor.id === donorId ? { ...donor, status } : donor
      )
    );

    try {
      const res = await fetch("/api/admin/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId, status }),
      });

      if (res.ok) {
        toast({ title: "Donor Updated", description: `Status set to ${status}` });
        // Re-fetch to ensure data consistency
        fetchDonors();
      } else {
        toast({ title: "Failed", description: "Could not update donor", variant: "destructive" });
        // Revert on failure
        fetchDonors();
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update donor", variant: "destructive" });
      // Revert on failure
      fetchDonors();
    }
  }

  const handleMarkAsRead = (itemId: number) => {
    if (readDonorRequests.includes(itemId)) return
    const updatedReadRequests = [...readDonorRequests, itemId]
    setReadDonorRequests(updatedReadRequests)
    try {
      localStorage.setItem("readDonorAcceptedRequests", JSON.stringify(updatedReadRequests))
    } catch (error) {
      console.error("Failed to save read requests to localStorage", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      // also clear any client-side state that may persist user info
      try { localStorage.removeItem('acceptedByDonors') } catch { }
      try { localStorage.removeItem('readDonorAcceptedRequests') } catch { }
      try { localStorage.removeItem('readSurveyRequests') } catch { }
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Forward to survey team without selecting a specific officer (officerId = null)
  const forwardToSurveyTeam = async (applicationId: number) => {
    try {
      const res = await fetch('/api/survey/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, officerId: null }),
      })
      if (res.ok) {
        const payload = await res.json()
        toast({ title: 'Forwarded', description: 'Request forwarded to survey team.' })
        // Prefer server's returned application object (survey.application)
        const app = payload?.survey?.application
        if (app) {
          const mapped = {
            id: app.id,
            userId: app.user_id ?? app.user?.id ?? 0,
            user: { full_name: app.full_name || app.user?.name || '', fullName: app.full_name || app.user?.name || '', cnic: app.cnic_number || app.user?.cnic || '', address: app.user?.address || '' },
            type: app.type || '',
            reason: app.reason || '',
            status: (app.status || '').toLowerCase(),
            submittedAt: app.created_at,
            currentAddress: app.user?.address || app.user_address || '',
            additionalData: app,
            verification_complete: app.verification_complete || false,
            forwardedToSurvey: true,
          }
          setSurveyRequests((prev) => [mapped, ...prev])
          setRequests((prev) => prev.filter((r) => r.id !== applicationId))
        } else {
          setRequests((prev) => prev.filter((r) => r.id !== applicationId))
          const forwarded = requests.find((r) => r.id === applicationId)
          if (forwarded) setSurveyRequests((prev) => [forwarded, ...prev])
        }
        // Update acceptedByDonors state to set forwardedToSurvey true for this request
        setAcceptedByDonors((prev) => prev.map(item =>
          item.request.id === applicationId
            ? { ...item, request: { ...item.request, forwardedToSurvey: true } }
            : item
        ))
        setReadSurveyRequests((prev) => {
          const next = prev.filter((id) => id !== applicationId)
          try { localStorage.setItem('readSurveyRequests', JSON.stringify(next)) } catch { }
          return next
        })
        fetchAnalytics()
        setActiveTab('survey-requests')
      } else {
        toast({ title: 'Failed', description: 'Could not forward request', variant: 'destructive' })
      }
    } catch (e) {
      console.error('Forward error', e)
      toast({ title: 'Error', description: 'Failed to forward request', variant: 'destructive' })
    }
  }

  const markSurveyRequestRead = (id: number) => {
    setReadSurveyRequests((prev) => {
      if (prev.includes(id)) return prev
      const next = [id, ...prev]
      try { localStorage.setItem('readSurveyRequests', JSON.stringify(next)) } catch { }
      try {
        toast({ title: 'Marked Done', description: 'Survey marked as donated.' })
      } catch { }
      return next
    })
  }

  // helper to compare ids as strings to avoid type mismatches between stored values
  const isSurveyRead = (id: number | string) => {
    return readSurveyRequests.some((x) => String(x) === String(id))
  }

  const resetReadSurveyRequests = () => {
    setReadSurveyRequests([])
    try { localStorage.removeItem('readSurveyRequests') } catch { }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusTintClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50"
      case "approved":
        return "bg-green-50"
      case "completed":
        return "bg-emerald-50"
      case "rejected":
        return "bg-red-50"
      default:
        return "bg-white"
    }
  }

  const formatCNIC = (cnic: string) => {
    if (cnic.length === 13) {
      return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12)}`
    }
    return cnic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-600 text-center">Welcome to your Welfare Admin Dashboard</p>
        </div>

        {/* Quick Stats - Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Requests Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "pending" 
                ? "border-l-yellow-500 bg-yellow-50" 
                : "border-l-yellow-500 hover:border-l-yellow-600"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className={`h-4 w-4 ${
                activeTab === "pending" ? "text-yellow-600" : "text-yellow-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.pendingRequests || 0}</div>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </CardContent>
          </Card>

          {/* Approved Requests Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "approved" 
                ? "border-l-green-500 bg-green-50" 
                : "border-l-green-500 hover:border-l-green-600"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Requests</CardTitle>
              <CheckCircle className={`h-4 w-4 ${
                activeTab === "approved" ? "text-green-600" : "text-green-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.approvedRequests || 0}</div>
              <p className="text-xs text-gray-500">Successfully approved</p>
            </CardContent>
          </Card>

          {/* Rejected Requests Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "rejected" 
                ? "border-l-red-500 bg-red-50" 
                : "border-l-red-500 hover:border-l-red-600"
            }`}
            onClick={() => setActiveTab("rejected")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
              <XCircle className={`h-4 w-4 ${
                activeTab === "rejected" ? "text-red-600" : "text-red-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.rejectedRequests || 0}</div>
              <p className="text-xs text-gray-500">Rejected applications</p>
            </CardContent>
          </Card>

          {/* Donor Accepted Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "accepted-by-donors" 
                ? "border-l-blue-500 bg-blue-50" 
                : "border-l-blue-500 hover:border-l-blue-600"
            }`}
            onClick={() => setActiveTab("accepted-by-donors")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donor Accepted</CardTitle>
              <UserCheck className={`h-4 w-4 ${
                activeTab === "accepted-by-donors" ? "text-blue-600" : "text-blue-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedByDonors.length}</div>
              <p className="text-xs text-gray-500">Pledged by donors</p>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Survey Requests Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "survey-requests" 
                ? "border-l-purple-500 bg-purple-50" 
                : "border-l-purple-500 hover:border-l-purple-600"
            }`}
            onClick={() => setActiveTab("survey-requests")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Survey Requests</CardTitle>
              <FileText className={`h-4 w-4 ${
                activeTab === "survey-requests" ? "text-purple-600" : "text-purple-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{surveyRequests.length}</div>
              <p className="text-xs text-gray-500">Forwarded to survey</p>
            </CardContent>
          </Card>

          {/* Completed Surveys Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "completed-surveys" 
                ? "border-l-emerald-500 bg-emerald-50" 
                : "border-l-emerald-500 hover:border-l-emerald-600"
            }`}
            onClick={() => setActiveTab("completed-surveys")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Surveys</CardTitle>
              <CheckCircle className={`h-4 w-4 ${
                activeTab === "completed-surveys" ? "text-emerald-600" : "text-emerald-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length}
              </div>
              <p className="text-xs text-gray-500">Survey reports ready</p>
            </CardContent>
          </Card>

          {/* Donors Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "donors" 
                ? "border-l-indigo-500 bg-indigo-50" 
                : "border-l-indigo-500 hover:border-l-indigo-600"
            }`}
            onClick={() => setActiveTab("donors")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donors</CardTitle>
              <Users className={`h-4 w-4 ${
                activeTab === "donors" ? "text-indigo-600" : "text-indigo-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donors.length}</div>
              <p className="text-xs text-gray-500">Registered donors</p>
            </CardContent>
          </Card>

          {/* Total Requests Card */}
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
              activeTab === "overview" 
                ? "border-l-gray-500 bg-gray-50" 
                : "border-l-gray-500 hover:border-l-gray-600"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <BarChart3 className={`h-4 w-4 ${
                activeTab === "overview" ? "text-gray-600" : "text-gray-500"
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalRequests || 0}</div>
              <p className="text-xs text-gray-500">All applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Pending Tab */}
          {activeTab === "pending" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pending Requests</h2>
                  <p className="text-gray-600">Review and take action on pending applications</p>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {requests.filter((r) => r.status === "pending").length} Requests
                </Badge>
              </div>

              {requests.filter((r) => r.status === "pending").length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No pending requests</p>
                  <p className="text-gray-500">All requests have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests
                    .filter((r) => r.status === "pending")
                    .slice(0, showPendingCount)
                    .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-yellow-50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                              <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                            </div>
                            <p className="text-gray-600 capitalize">{request.type} Request</p>
                            <p className="text-sm text-gray-500">{request.reason}</p>
                            {request.amount && (
                              <p className="text-sm font-medium text-green-600">Amount: PKR {request.amount.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </Badge>
                            {request.verification_complete && (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                            <p>Address: {request.currentAddress}</p>
                          </div>

                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-gray-900">Request Details</DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Complete information for {selectedRequest?.user.fullName}'s application
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Basic Information Card */}
                                    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Applicant Name</Label>
                                            <p className="text-gray-900 font-medium">{selectedRequest.user.fullName}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">CNIC</Label>
                                            <p className="text-gray-900">{formatCNIC(selectedRequest.user.cnic)}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Request Type</Label>
                                            <p className="text-gray-900 capitalize">{selectedRequest.type}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Status</Label>
                                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                          {selectedRequest.amount && (
                                            <div className="space-y-1">
                                              <Label className="text-sm font-medium text-gray-700">Monthly Salary</Label>
                                              <p className="text-gray-900 font-medium text-green-600">PKR {selectedRequest.amount.toLocaleString()}</p>
                                            </div>
                                          )}
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Submitted</Label>
                                            <p className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Additional Information Card */}
                                    {selectedRequest.additionalData && Object.keys(selectedRequest.additionalData).length > 0 && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Additional Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(selectedRequest.additionalData)
                                              .filter(([key, value]) => value && !["cnic_front", "cnic_back", "document"].includes(key))
                                              .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                  <Label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</Label>
                                                  <p className="text-gray-900">{String(value)}</p>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Documents Card */}
                                    {(selectedRequest.additionalData?.cnic_front || selectedRequest.additionalData?.cnic_back || selectedRequest.additionalData?.document) && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedRequest.additionalData?.cnic_front && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Front</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_front} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.cnic_back && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Back</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_back} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.document && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">Additional Document</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.document} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Action Buttons */}
                                    {selectedRequest.status === "pending" && (
                                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                        <Button onClick={() => updateRequestStatus(selectedRequest.id, "approved")} className="bg-green-600 hover:bg-green-700 flex-1">
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Request
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            const reason = prompt("Please enter rejection reason") || ""
                                            if (!reason.trim()) return
                                            updateRequestStatus(selectedRequest.id, "rejected", reason)
                                            setActiveTab("rejected")
                                          }}
                                          variant="destructive"
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Request
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, "approved")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const reason = prompt("Please enter rejection reason") || ""
                                if (!reason.trim()) return
                                updateRequestStatus(request.id, "rejected", reason)
                                setActiveTab("rejected")
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Approved Tab */}
          {activeTab === "approved" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Accepted Requests</h2>
                  <p className="text-gray-600">All approved applications ready for survey</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {requests.filter((r) => r.status === "approved" && !acceptedByDonors.some((item) => item.request.id === r.id)).length} Requests
                </Badge>
              </div>

              {requests.filter((r) => r.status === "approved").length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No approved requests</p>
                  <p className="text-gray-500">Approved requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests
                    .filter((r) => r.status === "approved" && !acceptedByDonors.some((item) => item.request.id === r.id))
                    .slice(0, showApprovedCount)
                    .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                              <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                            </div>
                            <p className="text-gray-600 capitalize">{request.type} Request</p>
                            <p className="text-sm text-gray-500">{request.reason}</p>
                            {request.amount && (
                              <p className="text-sm font-medium text-green-600">Amount: PKR {request.amount.toLocaleString()}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Approved at: {request.updated_at ? new Date(request.updated_at).toLocaleString() : "—"}</p>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <Badge className="bg-green-100 text-green-800">
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4" />
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </Badge>
                            {request.verification_complete && (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                            <p>Address: {request.currentAddress}</p>
                          </div>

                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-gray-900">Request Details</DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Complete information for {selectedRequest?.user.fullName}'s application
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Basic Information Card */}
                                    <Card className="border-l-4 border-l-green-500 bg-green-50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Applicant Name</Label>
                                            <p className="text-gray-900 font-medium">{selectedRequest.user.fullName}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">CNIC</Label>
                                            <p className="text-gray-900">{formatCNIC(selectedRequest.user.cnic)}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Request Type</Label>
                                            <p className="text-gray-900 capitalize">{selectedRequest.type}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Status</Label>
                                            <Badge className="bg-green-100 text-green-800 border border-green-200">
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                          {selectedRequest.amount && (
                                            <div className="space-y-1">
                                              <Label className="text-sm font-medium text-gray-700">Monthly Salary</Label>
                                              <p className="text-gray-900 font-medium text-green-600">PKR {selectedRequest.amount.toLocaleString()}</p>
                                            </div>
                                          )}
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Submitted</Label>
                                            <p className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Approved At</Label>
                                            <p className="text-gray-900">{selectedRequest.updated_at ? new Date(selectedRequest.updated_at).toLocaleString() : "—"}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Address Information Card */}
                                    <Card className="border border-gray-200">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Address Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Registered Address</Label>
                                            <p className="text-gray-900">{selectedRequest.user.address}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Current Address</Label>
                                            <p className="text-gray-900">{selectedRequest.currentAddress}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Request Details Card */}
                                    <Card className="border border-gray-200">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Request Details</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Reason for Request</Label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedRequest.reason}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Additional Information Card */}
                                    {selectedRequest.additionalData && Object.keys(selectedRequest.additionalData).length > 0 && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Additional Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(selectedRequest.additionalData)
                                              .filter(([key, value]) => value && !["cnic_front", "cnic_back", "document"].includes(key))
                                              .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                  <Label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</Label>
                                                  <p className="text-gray-900">{String(value)}</p>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Documents Card */}
                                    {(selectedRequest.additionalData?.cnic_front || selectedRequest.additionalData?.cnic_back || selectedRequest.additionalData?.document) && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedRequest.additionalData?.cnic_front && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Front</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_front} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.cnic_back && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Back</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_back} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.document && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">Additional Document</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.document} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {!request.forwardedToSurvey ? (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700"
                                onClick={async () => {
                                  await forwardToSurveyTeam(request.id);
                                  setRequests((prev) => prev.map(r =>
                                    r.id === request.id
                                      ? { ...r, forwardedToSurvey: true }
                                      : r
                                  ));
                                }}>
                                Forward to Survey Team
                              </Button>
                            ) : (
                              <Badge className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Forwarded</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Rejected Tab */}
          {activeTab === "rejected" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Rejected Requests</h2>
                  <p className="text-gray-600">All rejected applications</p>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {requests.filter((r) => r.status === "rejected").length} Requests
                </Badge>
              </div>

              {requests.filter((r) => r.status === "rejected").length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No rejected requests</p>
                  <p className="text-gray-500">Rejected requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests
                    .filter((r) => r.status === "rejected")
                    .slice(0, showRejectedCount)
                    .map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                              <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                            </div>
                            <p className="text-gray-600 capitalize">{request.type} Request</p>
                            <p className="text-sm text-gray-500">{request.reason}</p>
                            {request.rejection_reason && (
                              <p className="text-sm font-medium text-red-600">Rejection Reason: {request.rejection_reason}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <Badge className="bg-red-100 text-red-800">
                              <div className="flex items-center space-x-1">
                                <XCircle className="h-4 w-4" />
                                <span className="capitalize">{request.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                            <p>Address: {request.currentAddress}</p>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {selectedRequest?.user.fullName}'s application
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-medium">Applicant Name</Label>
                                      <p>{selectedRequest.user.fullName}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">CNIC</Label>
                                      <p>{formatCNIC(selectedRequest.user.cnic)}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Request Type</Label>
                                      <p className="capitalize">{selectedRequest.type}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Status</Label>
                                      <Badge className="bg-red-100 text-red-800">
                                        {selectedRequest.status}
                                      </Badge>
                                    </div>
                                    {selectedRequest.rejection_reason && (
                                      <div className="col-span-2">
                                        <Label className="font-medium">Rejection Reason</Label>
                                        <p className="text-red-600">{selectedRequest.rejection_reason}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Donor Accepted Tab */}
          {activeTab === "accepted-by-donors" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Accepted by Donors</h2>
                  <p className="text-gray-600">Requests donors pledged to fulfill</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {acceptedByDonors.length} Requests
                </Badge>
              </div>

              {acceptedByDonors.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No donor-accepted requests yet</p>
                  <p className="text-gray-500">Donor accepted requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedByDonors
                    .slice(0, showAcceptedByDonorsCount)
                    .map((item) => {
                      const isNew = !readDonorRequests.includes(item.request.id)
                      const req = item.request
                      const showDetails = expandedDonorRequests[item.id] || false;
                      const forwarded = req.forwardedToSurvey;
                      return (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">{req.user.full_name}</h3>
                                <Badge variant="outline">{formatCNIC(req.user.cnic)}</Badge>
                                {isNew && (
                                  <Badge variant="destructive" className="animate-pulse">New</Badge>
                                )}
                              </div>
                              <p className="text-gray-600 capitalize">{req.type} Request</p>
                              {req.amount && (
                                <p className="text-sm text-gray-600">Requested: PKR {req.amount.toLocaleString()}</p>
                              )}
                              <p className="text-sm font-medium text-green-700">
                                Donor pledged: {item.isFullfill ? `(PKR ${item.amount.toLocaleString()})` : `PKR ${item.amount.toLocaleString()}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Accepted at: {new Date(item.acceptedAt).toLocaleString()}</p>
                              <p className="text-xs text-gray-600">
                                Donor: {item.donor?.name || '—'}
                                {item.donor?.email ? ` • ${item.donor.email}` : ''}
                                {item.donor?.cnic ? ` • ${item.donor.cnic}` : ''}
                                {item.donor?.contact_number ? ` • ${item.donor.contact_number}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleToggleDonorRequest(item.id)}>
                              {showDetails ? 'Hide Details' : 'View More'}
                            </Button>
                            {isNew && (
                              <Button variant="secondary" size="sm" onClick={() => handleMarkAsRead(item.request.id)}>
                                Mark as Read
                              </Button>
                            )}
                            {!forwarded ? (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700"
                                onClick={async () => {
                                  await forwardToSurveyTeam(item.request.id);
                                  setAcceptedByDonors((prev) => {
                                    const updated = prev.map(d =>
                                      d.request.id === item.request.id
                                        ? { ...d, request: { ...d.request, forwardedToSurvey: true } }
                                        : d
                                    );
                                    if (typeof window !== "undefined") {
                                      localStorage.setItem("acceptedByDonors", JSON.stringify(updated));
                                    }
                                    return updated;
                                  });
                                }}>
                                Forward to Survey Team
                              </Button>
                            ) : (
                              <Badge className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Forwarded</Badge>
                            )}
                          </div>
                          {showDetails && (
                            <div className="mt-4 border-t pt-4 text-sm space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Applicant Name</Label>
                                  <p>{req.user.full_name}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">CNIC</Label>
                                  <p>{formatCNIC(req.user.cnic)}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Request Type</Label>
                                  <p className="capitalize">{req.type}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Status</Label>
                                  <Badge className="bg-green-100 text-green-800">{req.status}</Badge>
                                </div>
                                {req.amount && (
                                  <div>
                                    <Label className="font-medium">Amount</Label>
                                    <p>PKR {req.amount.toLocaleString()}</p>
                                  </div>
                                )}
                                <div>
                                  <Label className="font-medium">Submitted</Label>
                                  <p>{new Date(req.submittedAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="font-medium">Registered Address</Label>
                                <p>{req.user.address}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Current Address</Label>
                                <p>{req.currentAddress}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Reason</Label>
                                <p>{req.reason}</p>
                              </div>
                              {req.additionalData && (
                                <div>
                                  <Label className="font-medium">Additional Information</Label>
                                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md">
                                    {Object.entries(req.additionalData)
                                      .filter(([_, v]) => v !== null && v !== undefined && v !== "")
                                      .map(([k, v]) => {
                                        const isLinkKey = ["cnic_front", "cnic_back", "document"].includes(k)
                                        const label = k.replace(/_/g, " ")
                                        if (isLinkKey) {
                                          return (
                                            <div key={k} className="text-sm col-span-2">
                                              <a className="text-blue-600 hover:underline" href={String(v)} target="_blank" rel="noreferrer">
                                                View {label}
                                              </a>
                                            </div>
                                          )
                                        }
                                        return (
                                          <div key={k} className="text-sm">
                                            <span className="font-medium capitalize mr-2">{label}</span>
                                            <span className="text-gray-700">{String(v)}</span>
                                          </div>
                                        )
                                      })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}

          {/* Survey Requests Tab */}
          {activeTab === "survey-requests" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Survey Requests</h2>
                  <p className="text-gray-600">Requests forwarded to the survey team</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {surveyRequests.length} Requests
                </Badge>
              </div>

              {surveyRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No survey requests</p>
                  <p className="text-gray-500">Survey requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveyRequests.slice(0, showSurveyCount).map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-purple-50">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                            <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                            {!isSurveyRead(request.id) && (
                              <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">New</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 capitalize">{request.type} Request</p>
                          <p className="text-sm text-gray-500">{request.reason}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                          <Badge className="bg-purple-100 text-purple-800">
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span className="capitalize">{request.status}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
                        <div className="text-sm text-gray-500 mb-3 md:mb-0">
                          <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                          <p>Address: {request.currentAddress}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => { markSurveyRequestRead(request.id); setSelectedRequest(request); }}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-gray-900">Survey Request Details</DialogTitle>
                                  <DialogDescription className="text-gray-600">
                                    Complete information for {selectedRequest?.user.fullName}'s survey request
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    {/* Basic Information Card */}
                                    <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Applicant Name</Label>
                                            <p className="text-gray-900 font-medium">{selectedRequest.user.fullName}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">CNIC</Label>
                                            <p className="text-gray-900">{formatCNIC(selectedRequest.user.cnic)}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Request Type</Label>
                                            <p className="text-gray-900 capitalize">{selectedRequest.type}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Status</Label>
                                            <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                                              <FileText className="h-3 w-3 mr-1" />
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                          {selectedRequest.amount && (
                                            <div className="space-y-1">
                                              <Label className="text-sm font-medium text-gray-700">Monthly Salary</Label>
                                              <p className="text-gray-900 font-medium text-green-600">PKR {selectedRequest.amount.toLocaleString()}</p>
                                            </div>
                                          )}
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Submitted</Label>
                                            <p className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Address Information Card */}
                                    <Card className="border border-gray-200">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Address Information</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Registered Address</Label>
                                            <p className="text-gray-900">{selectedRequest.user.address}</p>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Current Address</Label>
                                            <p className="text-gray-900">{selectedRequest.currentAddress}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Request Details Card */}
                                    <Card className="border border-gray-200">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-gray-900">Request Details</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Reason for Request</Label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedRequest.reason}</p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Survey Information Card */}
                                    {(selectedRequest.surveyStatus || selectedRequest.surveyRecommendation || selectedRequest.surveyReport) && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Survey Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            {selectedRequest.surveyStatus && (
                                              <div className="space-y-1">
                                                <Label className="text-sm font-medium text-gray-700">Survey Status</Label>
                                                <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                                                  {selectedRequest.surveyStatus}
                                                </Badge>
                                              </div>
                                            )}
                                            {selectedRequest.surveyRecommendation && (
                                              <div className="space-y-1">
                                                <Label className="text-sm font-medium text-gray-700">Survey Recommendation</Label>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedRequest.surveyRecommendation}</p>
                                              </div>
                                            )}
                                            {selectedRequest.surveyReport && (
                                              <div className="space-y-1">
                                                <Label className="text-sm font-medium text-gray-700">Survey Report</Label>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedRequest.surveyReport}</p>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Additional Information Card */}
                                    {selectedRequest.additionalData && Object.keys(selectedRequest.additionalData).length > 0 && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Additional Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(selectedRequest.additionalData)
                                              .filter(([key, value]) => value && !["cnic_front", "cnic_back", "document"].includes(key))
                                              .map(([key, value]) => (
                                                <div key={key} className="space-y-1">
                                                  <Label className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</Label>
                                                  <p className="text-gray-900">{String(value)}</p>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Documents Card */}
                                    {(selectedRequest.additionalData?.cnic_front || selectedRequest.additionalData?.cnic_back || selectedRequest.additionalData?.document) && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Documents</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedRequest.additionalData?.cnic_front && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Front</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_front} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.cnic_back && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">CNIC Back</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.cnic_back} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                            {selectedRequest.additionalData?.document && (
                                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">Additional Document</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={selectedRequest.additionalData.document} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Survey Attachments Card */}
                                    {selectedRequest.surveyAttachments && selectedRequest.surveyAttachments.length > 0 && (
                                      <Card className="border border-gray-200">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold text-gray-900">Survey Attachments</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {selectedRequest.surveyAttachments.map((attachment: any, index: number) => (
                                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">Attachment {index + 1}</span>
                                                <Button variant="outline" size="sm" asChild>
                                                  <a href={attachment.url || attachment} target="_blank" rel="noreferrer" className="flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                  </a>
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                )}
                                <DialogFooter className="border-t border-gray-200 pt-4">
                                  <Button onClick={() => markSurveyRequestRead(request.id)} className="bg-purple-600 hover:bg-purple-700">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                          <Button size="sm" variant="outline" onClick={() => {
                            // allow admin to return request to approved tab if needed
                            setSurveyRequests((prev) => prev.filter((r) => r.id !== request.id))
                            setRequests((prev) => [request, ...prev])
                            setActiveTab('approved')
                          }}>
                            Return
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Surveys Tab */}
          {activeTab === "completed-surveys" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Completed Surveys</h2>
                  <p className="text-gray-600">All surveys with submitted reports</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length} Completed
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={resetReadSurveyRequests}>Reset New</Button>
                </div>
              </div>

              {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No completed surveys yet.</p>
                  <p className="text-gray-500">Completed surveys will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").slice(0, showCompletedCount).map((survey) => (
                    <div key={survey.id} className="p-5 rounded-xl shadow-md bg-emerald-50 backdrop-blur border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{survey.user?.fullName || "Applicant"}</h3>
                          <p className="text-sm text-gray-500">CNIC: {survey.user?.cnic}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isSurveyRead(survey.id) ? (
                            <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">New</Badge>
                          ) : (
                            <Badge className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Donated</Badge>
                          )}
                          {!isSurveyRead(survey.id) && (
                            <Button size="sm" onClick={() => markSurveyRequestRead(survey.id)}>Done</Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm"><strong>Survey Status:</strong> <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{survey.surveyStatus}</span></p>
                        <p className="text-sm"><strong>Recommendation:</strong> {survey.surveyRecommendation || "-"}</p>
                        <p className="text-sm"><strong>Report:</strong> {survey.surveyReport || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Donors Tab */}
          {activeTab === "donors" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Donor Approvals</h2>
                  <p className="text-gray-600">Approve or reject donor accounts</p>
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {donors.length} Donors
                </Badge>
              </div>

              {isLoadingDonors ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading donors...</p>
                </div>
              ) : donors.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No donors found</p>
                  <p className="text-gray-500">Donor registrations will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donors.slice(0, showDonorsCount).map((d) => (
                    <div key={d.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-indigo-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{d.name}</h3>
                          <Badge variant="outline">{d.cnic}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{d.email} {d.contact_number ? `• ${d.contact_number}` : ""}</p>
                        {d.organization_name && (
                          <p className="text-sm text-gray-500">Org: {d.organization_name}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Joined: {new Date(d.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
                        <Badge className={
                          d.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            d.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                        }>
                          {d.status}
                        </Badge>
                        {d.status === "PENDING" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateDonorStatus(d.id, "ACTIVE")}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateDonorStatus(d.id, "REJECTED")}>Reject</Button>
                          </>
                        )}
                        {d.status === "ACTIVE" && (
                          <Button size="sm" variant="outline" onClick={() => updateDonorStatus(d.id, "PENDING")}>Move to Pending</Button>
                        )}
                        {d.status === "REJECTED" && (
                          <Button size="sm" variant="outline" onClick={() => updateDonorStatus(d.id, "PENDING")}>Move to Pending</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600">Quick overview of all activities</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  Total: {analytics?.totalRequests || 0} Requests
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest requests and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <p className="font-medium">{request.user.fullName}</p>
                              <p className="text-sm text-gray-500">{request.type} • {request.reason.substring(0, 30)}...</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                      {requests.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No requests found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>Overview of your welfare system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rejected Requests</span>
                        <Badge variant="destructive">{analytics?.rejectedRequests || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Loan Requests</span>
                        <Badge variant="outline">{analytics?.loanRequests || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Microfinance</span>
                        <Badge variant="outline">{analytics?.microfinanceRequests || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">General Aid</span>
                        <Badge variant="outline">{analytics?.generalRequests || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Donors</span>
                        <Badge variant="secondary">{donors.length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}