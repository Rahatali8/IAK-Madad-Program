
"use client"

import { useState, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog"
import { Users, DollarSign, Heart, CreditCard, Search, Eye, CheckCircle, XCircle, Clock, TrendingUp, FileText, LogOut, } from "lucide-react"
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
  // survey-related fields (when mapping surveys -> request-like objects)
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
  const [activeTab, setActiveTab] = useState("pending")
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

  const [expandedDonorRequests, setExpandedDonorRequests] = useState<{ [id: string]: boolean }>({});
  const handleToggleDonorRequest = (id: number) => {
    setExpandedDonorRequests((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const { toast } = useToast()
  const router = useRouter()


  useEffect(() => {
    fetchRequests()
    fetchAnalytics()
    fetchDonors()



    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('acceptedByDonors') : null
      if (raw) setAcceptedByDonors(JSON.parse(raw))
      const readRaw = typeof window !== 'undefined' ? localStorage.getItem('readDonorAcceptedRequests') : null
      if (readRaw) setReadDonorRequests(JSON.parse(readRaw))
      const readSurveyRaw = typeof window !== 'undefined' ? localStorage.getItem('readSurveyRequests') : null
      if (readSurveyRaw) setReadSurveyRequests(JSON.parse(readSurveyRaw))
    } catch { }
  }, [])

  // Removed surveyReports effect

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
            // setSurveyReports(surveys.filter((s: any) => s.status === 'Completed' && s.sentToAdmin))
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

  const updateRequestStatus = async (requestId: number, status: "approved" | "rejected", rejectionReason?: string) => {
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
        fetchRequests()
        fetchAnalytics()
        if (status === 'approved') setActiveTab('approved')
        if (status === 'rejected') setActiveTab('rejected')
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update request status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const updateDonorStatus = async (donorId: number, status: "ACTIVE" | "PENDING" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId, status }),
      })
      if (res.ok) {
        toast({ title: "Donor Updated", description: `Status set to ${status}` })
        fetchDonors()
      } else {
        toast({ title: "Failed", description: "Could not update donor", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to update donor", variant: "destructive" })
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

  // Assign request to survey officer
  const assignToSurvey = async (applicationId: number, officerId: number | null) => {
    if (!officerId) {
      toast({ title: "Select Officer", description: "Please select a survey officer to assign." })
      return
    }
    try {
      const res = await fetch('/api/survey/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, officerId }),
      })
      if (res.ok) {
        toast({ title: 'Assigned', description: 'Request forwarded to survey team.' })
        fetchRequests()
        fetchAnalytics()
      } else {
        toast({ title: 'Failed', description: 'Could not assign request', variant: 'destructive' })
      }
    } catch (e) {
      console.error('Assign error', e)
      toast({ title: 'Error', description: 'Failed to assign request', variant: 'destructive' })
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
      return next
    })
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage all welfare requests and applications</p>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalRequests}</div>
                <p className="text-xs text-muted-foreground">All time applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analytics.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.approvedRequests}</div>
                <p className="text-xs text-muted-foreground">Successfully approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.rejectedRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Rejected requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Users signed up</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row gap-6 md:mt-6">
            {/* Left-side vertical tab list (desktop) */}
            <aside className="w-full md:w-72 mt-4 md:mt-40 self-start">
              <div>
                <TabsList className="flex flex-col">
                  {/* Survey Reports tab and content removed */}
                  <TabsTrigger value="pending" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter((r) => r.status === "pending").length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="approved" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Accepted</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter((r) => r.status === "approved" && !acceptedByDonors.some((d) => d.request.id === r.id)).length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="rejected" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{requests.filter((r) => r.status === "rejected").length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="accepted-by-donors" className="w-full flex items-center justify-between py-3 px-3 text-sm !bg-transparent !shadow-none data-[state=active]:!bg-transparent data-[state=active]:!shadow-none">
                    <span className="text-sm font-medium text-gray-700">Accepted by Donors</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{acceptedByDonors.length}</Badge>
                  </TabsTrigger>
				  <div className="my-1 border-t" />
                  <TabsTrigger value="survey-requests" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Survey Requests</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{surveyRequests.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed-surveys" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Completed Surveys</span>
                    <Badge className="bg-emerald-700 text-white text-xs px-2 py-0.5 rounded-full">{surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="donors" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">Donors</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{donors.length}</Badge>
                  </TabsTrigger>

                  <TabsTrigger value="all-requests" className="w-full flex items-center justify-between py-3 px-3 rounded-md text-sm hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">All Requests</span>
                    <Badge className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">{filteredRequests.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
            </aside>

            {/* Right-side content panel */}
            <div className="flex-1">
              {/* Mobile: compact tab grid shown above content */}
              <div className="md:hidden">
                <TabsList className="grid grid-cols-2 gap-2">
                  <TabsTrigger value="pending" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Pending <Badge className="ml-2">{requests.filter((r) => r.status === "pending").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Accepted <Badge className="ml-2">{requests.filter((r) => r.status === "approved").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Rejected <Badge className="ml-2">{requests.filter((r) => r.status === "rejected").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="accepted-by-donors" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Accepted by Donors <Badge className="ml-2">{acceptedByDonors.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="survey-requests" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Survey Requests <Badge className="ml-2">{surveyRequests.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed-surveys" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Completed Surveys <Badge className="ml-2">{surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="donors" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    Donors <Badge className="ml-2">{donors.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="all-requests" className="w-full text-left py-2 px-3 rounded-md text-sm bg-white">
                    All Requests <Badge className="ml-2">{filteredRequests.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              {/* Completed Surveys Tab */}
              <TabsContent value="completed-surveys">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Surveys</CardTitle>
                    <CardDescription>All surveys with submitted reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No completed surveys yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").map((survey) => (
                          <div key={survey.id} className="p-5 rounded-xl shadow-md bg-white/90 backdrop-blur border">
                            <h3 className="font-semibold text-lg">{survey.user?.fullName || "Applicant"}</h3>
                            <p className="text-sm text-gray-500 mb-2">CNIC: {survey.user?.cnic}</p>
                            <p className="text-sm"><strong>Survey Status:</strong> <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{survey.surveyStatus}</span></p>
                            <p className="text-sm"><strong>Recommendation:</strong> {survey.surveyRecommendation || "-"}</p>
                            <p className="text-sm"><strong>Report:</strong> {survey.surveyReport || "-"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              </div>

              {/* Pending */}
              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>Review and take action on pending applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requests.filter((r) => r.status === "pending").length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No pending requests</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests
                          .filter((r) => r.status === "pending")
                          .slice(0, showPendingCount)
                          .map((request) => (
                            <div key={request.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusTintClass(request.status)}`}>
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
                                  <Badge className={getStatusColor(request.status)}>
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(request.status)}
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
                                              <Badge className={getStatusColor(selectedRequest.status)}>
                                                {selectedRequest.status}
                                              </Badge>
                                            </div>
                                            {selectedRequest.amount && (
                                              <div>
                                                <Label className="font-medium">Monthly Salery</Label>
                                                <p>PKR {selectedRequest.amount.toLocaleString()}</p>
                                              </div>
                                            )}
                                            <div>
                                              <Label className="font-medium">Submitted</Label>
                                              <p>{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
                                            {Object.entries(selectedRequest.additionalData || {}).map(([key, value]) => (
                                              value ? (
                                                <div key={key} className="text-sm">
                                                  <span className="font-medium capitalize mr-2">{key.replace(/_/g, " ")}</span>
                                                  <span className="text-gray-700">{String(value)}</span>
                                                </div>
                                              ) : null
                                            ))}
                                          </div>

                                          {(selectedRequest.additionalData?.cnic_front || selectedRequest.additionalData?.cnic_back || selectedRequest.additionalData?.document) && (
                                            <div className="space-y-2">
                                              <Label className="font-medium">Documents</Label>
                                              <ul className="list-disc list-inside text-sm">
                                                {selectedRequest.additionalData?.cnic_front && (
                                                  <li>
                                                    <a className="text-blue-600 hover:underline" href={selectedRequest.additionalData.cnic_front} target="_blank" rel="noreferrer">View CNIC Front</a>
                                                  </li>
                                                )}
                                                {selectedRequest.additionalData?.cnic_back && (
                                                  <li>
                                                    <a className="text-blue-600 hover:underline" href={selectedRequest.additionalData.cnic_back} target="_blank" rel="noreferrer">View CNIC Back</a>
                                                  </li>
                                                )}
                                                {selectedRequest.additionalData?.document && (
                                                  <li>
                                                    <a className="text-blue-600 hover:underline" href={selectedRequest.additionalData.document} target="_blank" rel="noreferrer">View Document</a>
                                                  </li>
                                                )}
                                              </ul>
                                            </div>
                                          )}

                                          {selectedRequest.status === "pending" && (
                                            <div className="flex space-x-2 pt-2">
                                              <Button onClick={() => updateRequestStatus(selectedRequest.id, "approved")} className="bg-green-600 hover:bg-green-700">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  const reason = prompt("Please enter rejection reason") || ""
                                                  if (!reason.trim()) return
                                                  updateRequestStatus(selectedRequest.id, "rejected", reason)
                                                  setActiveTab("rejected")
                                                }}
                                                variant="destructive"
                                              >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Reject
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>

                                  {/* AssignDialog removed */}
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Survey Requests */}
              <TabsContent value="survey-requests">
                <Card>
                  <CardHeader>
                    <CardTitle>Survey Requests</CardTitle>
                    <CardDescription>Requests forwarded to the survey team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {surveyRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No survey requests</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {surveyRequests.slice(0, showSurveyCount).map((request) => (
                          <div key={request.id} className={`border rounded-lg p-4 ${getStatusTintClass(request.status)}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                                  <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                                  {!readSurveyRequests.includes(request.id) && (
                                    <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">New</Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 capitalize">{request.type} Request</p>
                                <p className="text-sm text-gray-500">{request.reason}</p>
                              </div>
                              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                <Badge className={getStatusColor(request.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(request.status)}
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
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Survey Request</DialogTitle>
                                      <DialogDescription>
                                        Details for {selectedRequest?.user.fullName}
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
                                            <Badge className={getStatusColor(selectedRequest.status)}>
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="font-medium">Reason</Label>
                                          <p>{selectedRequest.reason}</p>
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={() => markSurveyRequestRead(request.id)}>Mark as Read</Button>
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
                        {surveyRequests.length > showSurveyCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowSurveyCount((c) => c + 6)}>Show more</Button>
                            {showSurveyCount > 6 && (
                              <Button variant="outline" onClick={() => setShowSurveyCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                        {requests.filter((r) => r.status === "pending").length > showPendingCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowPendingCount((c) => c + 6)}>Show more</Button>
                            {showPendingCount > 6 && (
                              <Button variant="outline" onClick={() => setShowPendingCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Completed Surveys (desktop content) */}
              <TabsContent value="completed-surveys">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Surveys</CardTitle>
                    <CardDescription>All surveys with submitted reports.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No completed surveys yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {surveyRequests.filter((s) => s.surveyStatusNormalized === "completed").map((survey) => (
                          <div key={survey.id} className="p-5 rounded-xl shadow-md bg-white/90 backdrop-blur border">
                            <h3 className="font-semibold text-lg">{survey.user?.fullName || "Applicant"}</h3>
                            <p className="text-sm text-gray-500 mb-2">CNIC: {survey.user?.cnic}</p>
                            <p className="text-sm"><strong>Survey Status:</strong> <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{survey.surveyStatus}</span></p>
                            <p className="text-sm"><strong>Recommendation:</strong> {survey.surveyRecommendation || "-"}</p>
                            <p className="text-sm"><strong>Report:</strong> {survey.surveyReport || "-"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Accepted by Donors (client-only via localStorage) */}
              <TabsContent value="accepted-by-donors">
                <Card>
                  <CardHeader>
                    <CardTitle>Accepted by Donors</CardTitle>
                    <CardDescription>Requests donors pledged to fulfill</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {acceptedByDonors.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No donor-accepted requests yet</p>
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
                              <div key={item.id} className={`border rounded-lg p-4 ${getStatusTintClass("approved")}`}>
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
                                        <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
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
                        {acceptedByDonors.length > showAcceptedByDonorsCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowAcceptedByDonorsCount((c) => c + 6)}>Show more</Button>
                            {showAcceptedByDonorsCount > 6 && (
                              <Button variant="outline" onClick={() => setShowAcceptedByDonorsCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Accepted */}
              <TabsContent value="approved">
                <Card>
                  <CardHeader>
                    <CardTitle>Accepted Requests</CardTitle>
                    <CardDescription>All Accepted Requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requests.filter((r) => r.status === "approved").length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No approved requests</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests
                          .filter((r) => r.status === "approved" && !acceptedByDonors.some((item) => item.request.id === r.id))
                          .slice(0, showApprovedCount)
                          .map((request) => (
                            <div key={request.id} className={`border rounded-lg p-4 ${getStatusTintClass(request.status)}`}>
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
                                  <Badge className={getStatusColor(request.status)}>
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(request.status)}
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
                                            <Badge className={getStatusColor(selectedRequest.status)}>
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                          {selectedRequest.amount && (
                                            <div>
                                              <Label className="font-medium">Amount</Label>
                                              <p>PKR {selectedRequest.amount.toLocaleString()}</p>
                                            </div>
                                          )}
                                          <div>
                                            <Label className="font-medium">Submitted</Label>
                                            <p>{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                          </div>
                                          <div>
                                            <Label className="font-medium">Approved At</Label>
                                            <p>{selectedRequest.updated_at ? new Date(selectedRequest.updated_at).toLocaleString() : "—"}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Registered Address</Label>
                                          <p>{selectedRequest.user.address}</p>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Current Address</Label>
                                          <p>{selectedRequest.currentAddress}</p>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Reason</Label>
                                          <p>{selectedRequest.reason}</p>
                                        </div>

                                        {selectedRequest.additionalData && (
                                          <div>
                                            <Label className="font-medium">Additional Information</Label>
                                            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md">
                                              {Object.entries(selectedRequest.additionalData)
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
                          ))}
                        {requests.filter((r) => r.status === "approved").length > showApprovedCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowApprovedCount((c) => c + 6)}>Show more</Button>
                            {showApprovedCount > 6 && (
                              <Button variant="outline" onClick={() => setShowApprovedCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rejected */}


              <TabsContent value="all-requests">
                <Card>
                  <CardHeader>
                    <CardTitle>All Requests</CardTitle>
                    <CardDescription>Manage all welfare applications</CardDescription>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="search"
                            placeholder="Search by name, CNIC, or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No requests found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.slice(0, showAllCount).map((request) => (
                          <div key={request.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusTintClass(request.status)}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                                  <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                                </div>
                                <p className="text-gray-600 capitalize">{request.type} Request</p>
                                <p className="text-sm text-gray-500">{request.reason}</p>
                                {request.amount && (
                                  <p className="text-sm font-medium text-green-600">
                                    Amount: PKR {request.amount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(request.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(request.status)}
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

                              <div className="flex flex-wrap gap-2">
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
                                            <Badge className={getStatusColor(selectedRequest.status)}>
                                              {selectedRequest.status}
                                            </Badge>
                                          </div>
                                          {selectedRequest.amount && (
                                            <div>
                                              <Label className="font-medium">Amount</Label>
                                              <p>PKR {selectedRequest.amount.toLocaleString()}</p>
                                            </div>
                                          )}
                                          <div>
                                            <Label className="font-medium">Submitted</Label>
                                            <p>{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Registered Address</Label>
                                          <p>{selectedRequest.user.address}</p>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Current Address</Label>
                                          <p>{selectedRequest.currentAddress}</p>
                                        </div>

                                        <div>
                                          <Label className="font-medium">Reason</Label>
                                          <p>{selectedRequest.reason}</p>
                                        </div>

                                        {selectedRequest.additionalData && (
                                          <div>
                                            <Label className="font-medium">Additional Information</Label>
                                            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md">
                                              {Object.entries(selectedRequest.additionalData)
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

                                        {/* Removed large CNIC image preview; using links above instead */}

                                        {selectedRequest.status === "pending" && (
                                          <div className="flex space-x-2 pt-4">
                                            <Button
                                              onClick={() => updateRequestStatus(selectedRequest.id, "approved")}
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              Approve
                                            </Button>
                                            <Button
                                              onClick={() => updateRequestStatus(selectedRequest.id, "rejected")}
                                              variant="destructive"
                                            >
                                              <XCircle className="h-4 w-4 mr-2" />
                                              Reject
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                {request.status === "pending" && (
                                  <>
                                    {/* AssignDialog removed */}
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
                                      onClick={() => updateRequestStatus(request.id, "rejected")}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredRequests.length > showAllCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowAllCount((c) => c + 6)}>Show more</Button>
                            {showAllCount > 6 && (
                              <Button variant="outline" onClick={() => setShowAllCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="donors">
                <Card>
                  <CardHeader>
                    <CardTitle>Donor Approvals</CardTitle>
                    <CardDescription>Approve or reject donor accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDonors ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
                        <p className="text-gray-600 mt-3">Loading donors...</p>
                      </div>
                    ) : donors.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No donors found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {donors.slice(0, showDonorsCount).map((d) => (
                          <div key={d.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
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
                        {donors.length > showDonorsCount && (
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setShowDonorsCount((c) => c + 6)}>Show more</Button>
                            {showDonorsCount > 6 && (
                              <Button variant="outline" onClick={() => setShowDonorsCount((c) => Math.max(6, c - 6))}>Show less</Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
