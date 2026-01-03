"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Sparkles,
  Briefcase,
  Gift,
  PlusCircle,
  Eye,
  CheckCircle,
  Shield,
  Star,
  Trophy,
  X,
  LogOut,
  Mail,
  Phone,
  Building,
  CalendarDays,
  Hash,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Donor, Request, Analytics } from "@/components/admin/types";
import { Badge } from "@/components/ui/badge"
import { formatCNIC } from "@/lib/utils"
import { RequestDetails } from "@/components/admin/RequestDetails"

const VIP_LEVELS = [
  { threshold: 1000, level: "Bronze", icon: <Star className="h-4 w-4 text-orange-400" /> },
  { threshold: 5000, level: "Silver", icon: <Shield className="h-4 w-4 text-slate-400" /> },
  { threshold: 10000, level: "Gold", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
];

const getVIPLevel = (impactScore: number) => {
  let level = { level: "New", icon: <Star className="h-4 w-4" /> };
  for (const l of VIP_LEVELS) {
    if (impactScore >= l.threshold) {
      level = { level: l.level, icon: l.icon };
    }
  }
  return level;
};


export default function DonorDashboard() {
  const router = useRouter();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [availableRequests, setAvailableRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        donorRes,
        analyticsRes,
        availableRes,
        acceptedRes,
      ] = await Promise.all([
        fetch("/api/auth/session"),
        fetch("/api/donor/stats"),
        fetch("/api/requests/approved"),
        fetch("/api/donor/accepted-requests"),
      ]);

      if (donorRes.status === 401) {
        router.push("/login");
        return;
      }

      const donorData = await donorRes.json();
      if (donorData.user && donorData.user.role === 'donor') {
        setDonor(donorData.user);
      } else {
        router.push("/login");
        return;
      }

  const analyticsData = await analyticsRes.json();
  setAnalytics(analyticsData);

  const availableData = await availableRes.json();
  setAvailableRequests(Array.isArray(availableData.requests) ? availableData.requests : []);

  const acceptedData = await acceptedRes.json();
  setAcceptedRequests(Array.isArray(acceptedData.requests) ? acceptedData.requests : []);
  
} catch (err: any) {
  setError(err.message || "Failed to fetch data.");
} finally {
  setLoading(false);
}
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const onFundSuccess = () => {
    fetchData(); 
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading Your Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-50">
        <div className="text-center p-8 border border-red-200 rounded-lg bg-white shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something Went Wrong
          </h2>
          <p className="text-gray-700">{error}</p>
          <Button onClick={() => router.push("/")} className="mt-6">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-800 to-blue-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12">
          <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2 sm:space-x-5 bg-black/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
              <div className="relative">
                <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-blue-300 drop-shadow-lg animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold tracking-normal md:tracking-wide bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg uppercase leading-tight">
                  VIP Donor Dashboard
                </h1>
                <p className="text-xs sm:text-base text-blue-200 font-semibold italic mt-1 flex items-center gap-2 select-none">
                  <Sparkles className="h-4 w-4" />
                  Empowering change through generosity
                  <Sparkles className="h-4 w-4" />
                </p>
              </div>
            </div>

            {donor && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative group focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-full transition-transform hover:scale-110">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-800 to-blue-500 flex items-center justify-center shadow-lg border-4 border-white/30">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-white select-none">{donor.name?.charAt(0) || "D"}</span>
                    </div>
                    {analytics && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-[10px] md:text-xs px-2 py-1 rounded-full font-semibold shadow-md flex items-center gap-1 select-none">
                        {getVIPLevel(analytics.impactScore || 0).level}
                      </div>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" sideOffset={15} className="w-screen max-w-sm p-0">
                  <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-center overflow-hidden shadow-lg">
                            <span className="text-4xl font-bold text-white select-none">{donor.name?.charAt(0) || "D"}</span>
                          </div>
                          {analytics && (
                            <div className="absolute -top-1 -right-1">
                              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                {getVIPLevel(analytics.impactScore || 0).icon}
                                <span>{getVIPLevel(analytics.impactScore || 0).level}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">{donor.name}</h2>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          {donor.email}
                        </p>
                      </div>

                      {analytics && (
                        <div className="mt-6 rounded-xl bg-gray-50 p-4">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-blue-900">{analytics.impactScore || 0}</p>
                              <p className="text-xs text-gray-500">Impact Score</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-blue-900">{(analytics.totalDonated || 0).toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Donated (PKR)</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-blue-900">{analytics.acceptedRequests || 0}</p>
                              <p className="text-xs text-gray-500">Lives Touched</p>
                            </div>
                          </div>
                          <Progress value={analytics.impactScore || 0} className="mt-4 h-2 rounded-full" />
                        </div>
                      )}

                      <div className="mt-6 space-y-4 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <Hash className="h-5 w-5 text-gray-400" />
                          <span>CNIC: {formatCNIC(donor.cnic)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span>{donor.contact_number || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-gray-400" />
                          <span>{donor.organization_name || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-gray-400" />
                          <span>Member since {new Date(donor.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                      <Button
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:brightness-110 transition"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 p-2 rounded-xl">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span className="font-bold">Available Requests</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-bold">My Donations</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="mt-6">
            <AvailableRequestList requests={availableRequests} onFundSuccess={onFundSuccess} donorId={donor?.id}/>
          </TabsContent>

          <TabsContent value="donations" className="mt-6">
            <MyDonationsList requests={acceptedRequests} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AvailableRequestList({ requests, onFundSuccess, donorId }: { requests: Request[], onFundSuccess: () => void, donorId: number | undefined }) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [fundingRequest, setFundingRequest] = useState<Request | null>(null);
  const [isFunding, setIsFunding] = useState(false);

  const handleFundClick = (request: Request) => {
    setFundingRequest(request);
  };
  
  const handleConfirmFund = async () => {
    if (!fundingRequest || !donorId) return;

    setIsFunding(true);
    try {
      const response = await fetch(`/api/donor/accept-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: fundingRequest.id, donorId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fund the request.');
      }
      
      onFundSuccess();
      setFundingRequest(null);
    } catch (error) {
      console.error(error);
      alert('There was an error funding the request.');
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Requests</h2>
          <p className="text-gray-600">Browse and fund requests that have been approved</p>
        </div>
        <Badge variant="secondary" className="bg-blue-200 text-gray-800">
          {requests.length} Requests
        </Badge>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No available requests at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-lg">{request.name}</h3>
                                  <Badge variant="secondary" className="capitalize">
                                    {request.request_type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">
                                  CNIC: {formatCNIC(request.cnic)}
                                </p>
                              </div>
                <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approved
                    </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  <p>Submitted: {new Date(request.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleFundClick(request)}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Fund
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedRequest?.name}'s application
              </DialogDescription>
            </DialogHeader>
            <RequestDetails request={selectedRequest} />
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}

      {fundingRequest && (
          <Dialog open={!!fundingRequest} onOpenChange={() => setFundingRequest(null)}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Confirm Donation</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                      <p>Are you sure you want to fund this request for <strong>{fundingRequest.name}</strong>?</p>
                      <p className="text-sm text-gray-500 mt-2">Request type: {fundingRequest.request_type}</p>
                  </div>
                  <div className="flex justify-end gap-4">
                      <Button variant="outline" onClick={() => setFundingRequest(null)}>Cancel</Button>
                      <Button onClick={handleConfirmFund} disabled={isFunding}>
                          {isFunding ? 'Processing...' : 'Confirm & Fund'}
                      </Button>
                  </div>
              </DialogContent>
          </Dialog>
      )}
    </div>
  )
}

function MyDonationsList({ requests }: { requests: Request[] }) {
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Donations</h2>
                    <p className="text-gray-600">A history of all the requests you have funded</p>
                </div>
                <Badge variant="secondary" className="bg-blue-200 text-gray-800">
                    {requests.length} Donations
                </Badge>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">You haven't made any donations yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-semibold text-lg">{request.name}</h3>
                                        <Badge variant="outline">{formatCNIC(request.cnic)}</Badge>
                                    </div>
                                    <p className="text-gray-600 capitalize">{request.request_type} Request</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className="bg-purple-100 text-purple-800">
                                        <Gift className="h-4 w-4 mr-1" />
                                        Funded
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-500">
                                    <p>Funded on: {new Date(request.updated_at).toLocaleDateString()}</p>
                                </div>

                                <div className="flex space-x-2">
  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
    <Eye className="h-4 w-4 mr-1" />
    View Details
  </Button>
</div>
</div>
</div>
))}
</div>
)}
{selectedRequest && (
<Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Request Details</DialogTitle>
    <DialogDescription>
      Complete information for {selectedRequest?.name}'s application
    </DialogDescription>
  </DialogHeader>
  <RequestDetails request={selectedRequest} />
  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogClose>
</DialogContent>
</Dialog>
)}
</div>
);
}