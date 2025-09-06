// Professional survey report view
import React from "react";
import { format } from "date-fns";

export default function SurveyDetails({ survey }: any) {
  if (!survey) return null;
  const app = survey.application || {};

  const created = survey.createdAt ? new Date(survey.createdAt) : survey.createdAt;
  const updated = survey.updatedAt ? new Date(survey.updatedAt) : survey.updatedAt;

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Survey Report</h2>
            <p className="text-sm text-gray-500">Case #{app.id || survey.applicationId} • Survey ID {survey.id}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Officer: {survey.officerId || "—"}</div>
            <div className="text-sm text-gray-600">Status: <span className="font-medium">{survey.status || survey.surveyStatus || "—"}</span></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>Applicant: <span className="font-medium">{app.full_name || app.fullName || "—"}</span></div>
          <div>CNIC: <span className="font-medium">{app.cnic_number || app.cnic || "—"}</span></div>
          <div>Address: <span className="font-medium">{app.address || app.user_address || "—"}</span></div>
          <div>Sent to Admin: <span className="font-medium">{String(survey.sentToAdmin || false)}</span></div>
          <div>Created: <span className="font-medium">{created ? format(created, 'PPP p') : '—'}</span></div>
          <div>Updated: <span className="font-medium">{updated ? format(updated, 'PPP p') : '—'}</span></div>
        </div>
      </header>

      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
        <div className="prose max-w-none">
          <p className="text-gray-800">{survey.recommendation || survey.surveyRecommendation || 'No recommendation provided.'}</p>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Survey Report</h3>
        <div className="prose max-w-none">
          {(survey.report || survey.surveyReport) ? (
            <div>{(survey.report || survey.surveyReport).split('\n').map((p: string, i: number) => (<p key={i}>{p}</p>))}</div>
          ) : (
            <p className="text-gray-600">No report text submitted.</p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Attachments</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(survey.attachments || survey.surveyAttachments || []).length === 0 && (
            <div className="text-sm text-gray-600">No attachments</div>
          )}
          {(survey.attachments || survey.surveyAttachments || []).map((att: any) => (
            <a key={att.id || att.url} href={att.url} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden">
              <img src={att.url} alt={att.url} className="w-full h-40 object-cover" />
              <div className="p-2 text-xs text-gray-700">{att.url.split('/').pop()}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
