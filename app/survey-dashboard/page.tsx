"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SurveyList from "@/components/survey/SurveyList";
import SurveyDetails from "@/components/survey/SurveyDetails";
import SurveyForm from "@/components/survey/SurveyForm";
import { Menu, X, LogOut } from "lucide-react";

export default function SurveyDashboardPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("assigned");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-auto relative">

      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-tr from-cyan-200 via-blue-200 to-purple-200 opacity-30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-bl from-pink-200 via-rose-200 to-cyan-200 opacity-30 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-blue-100 shadow-2xl flex flex-col py-8 px-6 z-50 transform transition-transform duration-300 lg:hidden ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Close Button */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="self-end mb-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Branding / Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 flex items-center justify-center shadow-xl">
            <span className="text-2xl font-extrabold text-white">SD</span>
          </div>
          <h2 className="mt-3 font-extrabold text-lg text-blue-700">Survey Dashboard</h2>
          <span className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            Officer Panel
          </span>
        </div>

        {/* Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-col w-full space-y-3">
            <TabsTrigger
              value="assigned"
              className="w-full py-3 px-4 rounded-xl flex items-center justify-between font-semibold
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500
              data-[state=active]:text-white shadow-sm hover:shadow-md transition-all"
            >
              <span className="flex items-center gap-2">📋 Assigned</span>
              <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold">
                {assignedSurveys.length}
              </span>
            </TabsTrigger>
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

        {/* Queue */}
        <div className="mt-10">
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg border p-4">
            <h3 className="text-lg font-bold mb-2">Your Queue</h3>
            <p className="text-xs text-gray-400 mb-3">Newest first • {assignedSurveys.length} items</p>
            <SurveyList surveys={assignedSurveys} selectedSurvey={selectedSurvey} onSelect={setSelectedSurvey} />
            <button
              onClick={() => setActiveTab("completed")}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              📋 View Completed Surveys
            </button>
          </div>
        </div>

        {/* Divider + Tip */}
        <div className="mt-auto pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          💡 Tip: Refresh your queue regularly
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 relative z-10">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700">Survey Officer <span className="text-cyan-600">· VIP</span></h1>
              <p className="text-sm text-gray-600 mt-1">Manage your assigned & forwarded surveys with ease.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
              onClick={() => setActiveTab("completed")}
            >
              📋 View Completed Surveys
            </button>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Header Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-8"></div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* Assigned Tab */}
          <TabsContent value="assigned">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
              {/* Queue - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block col-span-1">
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border p-6 sticky top-4">
                  <h3 className="text-lg font-bold mb-4">Your Queue</h3>
                  <p className="text-xs text-gray-400 mb-4">Newest first • {assignedSurveys.length} items</p>
                  <SurveyList surveys={assignedSurveys} selectedSurvey={selectedSurvey} onSelect={setSelectedSurvey} />
                </div>
              </div>

              {/* Details */}
              <div className="col-span-1 lg:col-span-1">
                {selectedSurvey ? (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border h-full">
                    <SurveyDetails survey={selectedSurvey} />
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl border flex items-center justify-center text-gray-400 h-full min-h-[400px]">
                    <div className="text-center">
                      <p className="font-medium">No survey selected</p>
                      <p className="text-sm">Select an item from your queue to view details</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 lg:col-span-1 space-y-4">
                {selectedSurvey ? (
                  <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg border h-full">
                    <h4 className="font-semibold text-lg mb-3">Survey Actions</h4>
                    <SurveyForm survey={selectedSurvey} refresh={() => window.location.reload()} />
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border text-gray-500 h-full min-h-[400px]">
                    <p className="font-medium mb-2">No actions available</p>
                    <p className="text-sm">When you select a survey from the queue you will be able to submit a report and attachments.</p>
                  </div>
                )}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-dashed border-cyan-200 text-sm text-gray-600">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-emerald-700 mb-2">Completed Surveys</h1>
                <p className="text-gray-500">All surveys with submitted reports.</p>
              </div>
              <button
                onClick={() => setActiveTab("assigned")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSurveys.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-lg font-medium">No completed surveys yet.</p>
                  <p className="text-sm">Complete some surveys to see them here!</p>
                </div>
              ) : (
                completedSurveys.map((survey: any) => (
                  <div key={survey.id} className="group p-6 rounded-2xl shadow-lg bg-white/90 backdrop-blur border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-1">{survey.application?.full_name || "Applicant"}</h3>
                        <p className="text-sm text-gray-600 font-mono">CNIC: {survey.application?.cnic_number}</p>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ✅ Completed
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Recommendation:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          survey.recommendation === 'Eligible' ? 'bg-green-100 text-green-700' :
                          survey.recommendation === 'Not Eligible' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {survey.recommendation || "N/A"}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Report Summary:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {survey.report ? survey.report.substring(0, 100) + (survey.report.length > 100 ? '...' : '') : 'No report provided'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      👁️ View Full Details
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Details Modal for Completed Surveys */}
            {selectedSurvey && selectedSurvey.id && completedSurveys.some((s: any) => s.id === selectedSurvey.id) && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Survey Details</h2>
                    <button
                      onClick={() => setSelectedSurvey(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <SurveyDetails survey={selectedSurvey} />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
