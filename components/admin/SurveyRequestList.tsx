"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Eye, FileText } from "lucide-react"
import { useState } from "react"
import { Request } from "./types"
import { formatCNIC } from "@/lib/utils"
import { Label } from "../ui/label"

interface SurveyRequestListProps {
  requests: Request[]
  onReturn: (request: Request) => void
  onMarkAsRead: (id: number) => void
  readSurveyRequests: number[]
}

export function SurveyRequestList({ requests, onReturn, onMarkAsRead, readSurveyRequests }: SurveyRequestListProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  const isSurveyRead = (id: number | string) => {
    return readSurveyRequests.some((x) => String(x) === String(id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Survey Requests</h2>
          <p className="text-gray-600">Requests forwarded to the survey team</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {requests.length} Requests
        </Badge>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No survey requests</p>
          <p className="text-gray-500">Survey requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-purple-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">{request.user.fullName}</h3>
                    <Badge variant="outline">{formatCNIC(request.user.cnic)}</Badge>
                    {!isSurveyRead(request.id) && <Badge className="bg-red-600 text-white animate-pulse">New</Badge>}
                  </div>
                  <p className="text-gray-600 capitalize">{request.type} Request</p>
                  <p className="text-sm text-gray-500">{request.reason}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Badge className="bg-purple-100 text-purple-800">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="capitalize">{request.status}</span>
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
                      <Button size="sm" variant="outline" onClick={() => { onMarkAsRead(request.id); setSelectedRequest(request) }}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Survey Request</DialogTitle>
                        <DialogDescription>Details for {selectedRequest?.user.fullName}</DialogDescription>
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
                              <Badge className="bg-purple-100 text-purple-800">{selectedRequest.status}</Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">Reason</Label>
                            <p>{selectedRequest.reason}</p>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={() => onMarkAsRead(request.id)}>Mark as Read</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline" onClick={() => onReturn(request)}>
                    Return
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
