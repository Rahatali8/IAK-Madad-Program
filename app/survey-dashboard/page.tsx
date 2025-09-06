"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SurveyList from "@/components/survey/SurveyList";
import SurveyDetails from "@/components/survey/SurveyDetails";
import SurveyForm from "@/components/survey/SurveyForm";

export default function SurveyDashboardPage() {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [activeTab, setActiveTab] = useState("assigned");

  const assignedSurveys = (surveys.filter((s: any) => s.status !== "Completed" && (s.officerId || s.officerId === null)) || []).slice();
  const unassignedSurveys = (surveys.filter((s: any) => s.officerId === null && s.status !== "Completed") || []).slice();
  const completedSurveys = (surveys.filter((s: any) => s.status === "Completed") || []).slice();

  useEffect(() => {
    fetch("/api/survey")
      .then((res) => res.json())
      .then((data) => {
        const list = (data.surveys || []).slice();
        list.sort((a: any, b: any) => {
          const at = a?.application?.created_at ? new Date(a.application.created_at).getTime() : 0;
          const bt = b?.application?.created_at ? new Date(b.application.created_at).getTime() : 0;
          return bt - at;
        });
        setSurveys(list);
        // Only auto-select when user is on assigned tab and there are assigned surveys
        const assigned = (list.filter((s: any) => s.status !== "Completed" && (s.officerId || s.officerId === null)) || []).slice();
        if (activeTab === 'assigned' && assigned.length > 0) {
          setSelectedSurvey(assigned[0]);
        } else {
          setSelectedSurvey(null);
        }
      });
  }, [activeTab]);

  // Clear selection when assigned surveys become empty
  useEffect(() => {
    if (assignedSurveys.length === 0) setSelectedSurvey(null)
  }, [assignedSurveys.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex items-stretch overflow-auto relative">
      
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-tr from-sky-200 via-indigo-200 to-rose-200 opacity-40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-bl from-amber-200 via-pink-200 to-sky-200 opacity-40 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-indigo-100 shadow-2xl flex flex-col py-8 px-6 relative z-10">

        {/* Branding / Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 flex items-center justify-center shadow-xl">
            <span className="text-2xl font-extrabold text-white">SD</span>
          </div>
          <h2 className="mt-3 font-extrabold text-lg text-indigo-700">Survey Dashboard</h2>
          <span className="mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
            Officer Panel
          </span>
        </div>

        {/* Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-col w-full space-y-3">
            
            {/* Assigned */}
            <TabsTrigger
              value="assigned"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-between font-semibold
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-sky-500 
              data-[state=active]:text-white shadow-sm hover:shadow-md transition-all"
            >
              <span className="flex items-center gap-2">📋 Assigned</span>
              <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                {assignedSurveys.length}
              </span>
            </TabsTrigger>
            {/* Completed */}
            <TabsTrigger
              value="completed"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-between font-semibold
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 
              data-[state=active]:text-white shadow-sm hover:shadow-md transition-all"
            >
              <span className="flex items-center gap-2">✅ Completed</span>
              {completedSurveys.length > 0 && (
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                  {completedSurveys.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Divider + Tip */}
        <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          💡 Tip: Refresh your queue regularly
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* Assigned Tab */}
          <TabsContent value="assigned">
            <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-indigo-700">Survey Officer <span className="text-amber-600">· VIP</span></h1>
                <p className="text-sm text-gray-600 mt-1">Manage your assigned & forwarded surveys with ease.</p>
              </div>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 text-white px-5 py-2 rounded-lg shadow-lg transition-all"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Queue */}
              <div className="col-span-1">
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border p-4">
                  <h3 className="text-lg font-bold mb-2">Your Queue</h3>
                  <p className="text-xs text-gray-400 mb-3">Newest first • {assignedSurveys.length} items</p>
                  <SurveyList surveys={assignedSurveys} selectedSurvey={selectedSurvey} onSelect={setSelectedSurvey} />
                </div>
              </div>

              {/* Details */}
              <div className="col-span-1">
                {selectedSurvey ? (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border">
                    <SurveyDetails survey={selectedSurvey} />
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <p className="font-medium">No survey selected</p>
                      <p className="text-sm">Select an item from your queue to view details</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 space-y-4">
                {selectedSurvey ? (
                  <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg border">
                    <h4 className="font-semibold text-lg mb-3">Survey Actions</h4>
                    <SurveyForm survey={selectedSurvey} refresh={() => window.location.reload()} />
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border text-gray-500">
                    <p className="font-medium mb-2">No actions available</p>
                    <p className="text-sm">When you select a survey from the queue you will be able to submit a report and attachments.</p>
                  </div>
                )}
                <div className="bg-gradient-to-r from-indigo-50 to-sky-50 p-4 rounded-xl border border-dashed border-sky-200 text-sm text-gray-600">
                  <strong>Quick tips:</strong>
                  <ul className="list-disc ml-5 mt-2 text-xs space-y-1">
                    <li>Pick newest items first</li>
                    <li>Attach photos for faster processing</li>
                    <li>Forward to admin if unsure</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed">
            <h1 className="text-3xl font-bold text-emerald-700 mb-2">Completed Surveys</h1>
            <p className="text-gray-500 mb-6">All surveys with submitted reports.</p>
            <div className="space-y-4">
              {completedSurveys.length === 0 ? (
                <div className="text-center py-10 text-gray-500">✨ No completed surveys yet.</div>
              ) : (
                completedSurveys.map((survey: any) => (
                  <div key={survey.id} className="p-5 rounded-xl shadow-md bg-white/90 backdrop-blur border">
                    <h3 className="font-semibold text-lg">{survey.application?.full_name || "Applicant"}</h3>
                    <p className="text-sm text-gray-500 mb-2">CNIC: {survey.application?.cnic_number}</p>
                    <p className="text-sm"><strong>Status:</strong> <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">{survey.status}</span></p>
                    <p className="text-sm"><strong>Recommendation:</strong> {survey.recommendation || "-"}</p>
                    <p className="text-sm"><strong>Report:</strong> {survey.report || "-"}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
