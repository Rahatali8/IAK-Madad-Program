"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"
import { Request } from "./types"
import { formatCNIC } from "@/lib/utils"
import { Label } from "../ui/label"
import { RequestDetails } from "./RequestDetails"

interface RequestListProps {
  requests: Request[]
  title: string
  status: "pending" | "approved" | "rejected"
  onUpdateStatus: (requestId: number, status: "approved" | "rejected", rejectionReason?: string) => void
  onForwardToSurvey?: (requestId: number) => void
}

export function RequestList({ requests, title, status, onUpdateStatus, onForwardToSurvey }: RequestListProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {status === "pending" && "Review and take action on pending applications"}
            {status === "approved" && "All approved applications ready for survey"}
            {status === "rejected" && "All rejected applications"}
          </p>
        </div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          {requests.length} Requests
        </Badge>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No {status} requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">{request.name}</h3>
                    <Badge variant="outline">{formatCNIC(request.cnic)}</Badge>
                  </div>
                  <p className="text-gray-600 capitalize">{request.request_type} Request</p>
                  <p className="text-sm text-gray-500">{request.reason}</p>
                  {request.amount && <p className="text-sm font-medium text-green-600">Amount: PKR {request.amount.toLocaleString()}</p>}
                </div>
                <div className="flex items-center space-x-2">{getStatusBadge(request.status)}</div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  <p>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                  <p>Address: {request.currentAddress}</p>
                </div>

                <div className="flex space-x-2">
  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
    <Eye className="h-4 w-4 mr-1" />
    View Details
  </Button>
  {status === "pending" && (
    <>
      <Button size="sm" onClick={() => onUpdateStatus(request.id, "approved")} className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          const reason = prompt("Please enter rejection reason") || ""
          if (!reason.trim()) return
          onUpdateStatus(request.id, "rejected", reason)
        }}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </>
  )}
  {status === "approved" && onForwardToSurvey && !request.forwardedToSurvey && (
    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onForwardToSurvey(request.id)}>
      Forward to Survey Team
    </Button>
  )}
  {status === "approved" && request.forwardedToSurvey && (
    <Badge className="bg-green-600 text-white">Forwarded</Badge>
  )}
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
</DialogContent>
</Dialog>
)}
</div>
);
}

