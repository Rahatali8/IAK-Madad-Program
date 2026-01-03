"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { formatCNIC } from "@/lib/utils"
import { useState } from "react"
import { AcceptedByDonorItem } from "./types"

interface AcceptedByDonorListProps {
  items: AcceptedByDonorItem[]
  readRequests: number[]
  onMarkAsRead: (itemId: number) => void
  onForwardToSurvey: (requestId: number) => void
}

export function AcceptedByDonorList({ items, readRequests, onMarkAsRead, onForwardToSurvey }: AcceptedByDonorListProps) {
  const [expandedRequests, setExpandedRequests] = useState<{ [id: string]: boolean }>({})

  const handleToggleRequest = (id: number) => {
    setExpandedRequests((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accepted by Donors</h2>
          <p className="text-gray-600">Requests donors pledged to fulfill</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {items.length} Requests
        </Badge>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No donor-accepted requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isNew = !readRequests.includes(item.request.id)
            const req = item.request
            const showDetails = expandedRequests[item.id] || false
            const forwarded = req.forwardedToSurvey

            return (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{req.user.full_name}</h3>
                      <Badge variant="outline">{formatCNIC(req.user.cnic)}</Badge>
                      {isNew && <Badge variant="destructive" className="animate-pulse">New</Badge>}
                    </div>
                    <p className="text-gray-600 capitalize">{req.type} Request</p>
                    {req.amount && <p className="text-sm text-gray-600">Requested: PKR {req.amount.toLocaleString()}</p>}
                    <p className="text-sm font-medium text-green-700">
                      Donor pledged: {item.isFullfill ? `(PKR ${item.amount.toLocaleString()})` : `PKR ${item.amount.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Accepted at: {new Date(item.acceptedAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">
                      Donor: {item.donor?.name || "—"}
                      {item.donor?.email ? ` • ${item.donor.email}` : ""}
                      {item.donor?.cnic ? ` • ${item.donor.cnic}` : ""}
                      {item.donor?.contact_number ? ` • ${item.donor.contact_number}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleRequest(item.id)}>
                    {showDetails ? "Hide Details" : "View More"}
                  </Button>
                  {isNew && (
                    <Button variant="secondary" size="sm" onClick={() => onMarkAsRead(item.request.id)}>
                      Mark as Read
                    </Button>
                  )}
                  {!forwarded ? (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => onForwardToSurvey(item.request.id)}>
                      Forward to Survey Team
                    </Button>
                  ) : (
                    <Badge className="bg-green-600 text-white">Forwarded</Badge>
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
  )
}
