// Survey input form for officer
import React from "react";


import { useState } from "react";

export default function SurveyForm({ survey, refresh }: any) {
  const [report, setReport] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  if (!survey) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let attachments: any[] = [];

    // Upload files if any (placeholder behavior)
    if (files && files.length > 0) {
      // For demo: create objects with url equal to file name
      attachments = Array.from(files).map((f) => ({ url: f.name }));
      // TODO: Implement actual file upload and return real URLs
    }

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId: survey.id,
          status: "Completed",
          recommendation,
          report,
          attachments,
        }),
      });
      if (res.ok) {
      }
    } catch (e) {
      console.error('Failed to submit survey', e);
    }

    setLoading(false);
    setReport("");
    setRecommendation("");
    setFiles(null);
    if (refresh) refresh();
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold">Survey Report Submission</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Report</label>
        <textarea
          className="w-full border rounded p-3 min-h-[140px]"
          placeholder="Write detailed findings, observations and notes..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
        <select
          className="w-full border rounded p-2"
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          required
        >
          <option value="">Select Recommendation</option>
          <option value="Eligible">Verified (Eligible)</option>
          <option value="Not Eligible">Not Verified</option>
          <option value="Needs Info">Needs More Info</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
        <button type="button" className="px-3 py-2 border rounded" onClick={() => { setReport(''); setRecommendation(''); setFiles(null); }}>
          Reset
        </button>
      </div>
    </form>
  );
}
