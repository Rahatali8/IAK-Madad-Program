"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Request } from "./types"

interface CompletedSurveyListProps {
  surveys: Request[]
  onMarkAsRead: (id: number) => void
  readSurveyRequests: number[]
  onResetRead: () => void
}

export function CompletedSurveyList({ surveys, onMarkAsRead, readSurveyRequests, onResetRead }: CompletedSurveyListProps) {
  const isSurveyRead = (id: number | string) => {
    return readSurveyRequests.some((x) => String(x) === String(id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Completed Surveys</h2>
          <p className="text-gray-600">All surveys with submitted reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            {surveys.length} Completed
          </Badge>
          <Button size="sm" variant="ghost" onClick={onResetRead}>
            Reset New
          </Button>
        </div>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No completed surveys yet.</p>
          <p className="text-gray-500">Completed surveys will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey) => (
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
                    <Badge className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Donated
                    </Badge>
                  )}
                  {!isSurveyRead(survey.id) && <Button size="sm" onClick={() => onMarkAsRead(survey.id)}>Done</Button>}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm">
                  <strong>Survey Status:</strong> <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{survey.surveyStatus}</span>
                </p>
                <p className="text-sm">
                  <strong>Recommendation:</strong> {survey.surveyRecommendation || "-"}
                </p>
                <p className="text-sm">
                  <strong>Report:</strong> {survey.surveyReport || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
