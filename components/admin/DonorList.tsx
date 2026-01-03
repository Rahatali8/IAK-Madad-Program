"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Donor } from "./types"

interface DonorListProps {
  donors: Donor[]
  onUpdateDonorStatus: (donorId: number, status: "ACTIVE" | "PENDING" | "REJECTED") => void
  isLoading: boolean
}

export function DonorList({ donors, onUpdateDonorStatus, isLoading }: DonorListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading donors...</p>
      </div>
    )
  }

  if (donors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No donors found</p>
        <p className="text-gray-500">Donor registrations will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      {donors.map((d) => (
        <div key={d.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-indigo-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{d.name}</h3>
              <Badge variant="outline">{d.cnic}</Badge>
            </div>
            <p className="text-sm text-gray-600">
              {d.email} {d.contact_number ? `• ${d.contact_number}` : ""}
            </p>
            {d.organization_name && <p className="text-sm text-gray-500">Org: {d.organization_name}</p>}
            <p className="text-xs text-gray-500 mt-1">Joined: {new Date(d.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
            <Badge
              className={
                d.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : d.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {d.status}
            </Badge>
            {d.status === "PENDING" && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateDonorStatus(d.id, "ACTIVE")}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onUpdateDonorStatus(d.id, "REJECTED")}>
                  Reject
                </Button>
              </>
            )}
            {d.status === "ACTIVE" && (
              <Button size="sm" variant="outline" onClick={() => onUpdateDonorStatus(d.id, "PENDING")}>
                Move to Pending
              </Button>
            )}
            {d.status === "REJECTED" && (
              <Button size="sm" variant="outline" onClick={() => onUpdateDonorStatus(d.id, "PENDING")}>
                Move to Pending
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
