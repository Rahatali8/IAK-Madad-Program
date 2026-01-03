import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SurveyDetails({ survey }: any) {
  if (!survey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Survey Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Survey details are not available.</p>
        </CardContent>
      </Card>
    );
  }

  const app = survey.application || {};
  const created = survey.createdAt ? new Date(survey.createdAt) : null;
  const updated = survey.updatedAt ? new Date(survey.updatedAt) : null;

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Survey Report</CardTitle>
              <p className="text-sm text-gray-500">Case #{app.id || survey.applicationId} • Survey ID {survey.id}</p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm">
                <span className="font-semibold">Officer: </span>
                {survey.officerId || "N/A"}
              </div>
              <div className="flex items-center justify-end">
                <span className="font-semibold mr-2">Status: </span>
                <Badge variant={getStatusVariant(survey.status || survey.surveyStatus)}>
                  {survey.status || survey.surveyStatus || "Unknown"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={app.profile_image || '/placeholder-user.jpg'} alt="Applicant" />
                <AvatarFallback>{(app.full_name || app.fullName || "U")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Applicant</div>
                <div>{app.full_name || app.fullName || "—"}</div>
              </div>
            </div>
            <div>
              <div className="font-semibold">CNIC</div>
              <div>{app.cnic_number || app.cnic || "—"}</div>
            </div>
            <div className="md:col-span-2">
              <div className="font-semibold">Address</div>
              <div>{app.address || app.user_address || "—"}</div>
            </div>
            <div>
              <div className="font-semibold">Sent to Admin</div>
              <Badge variant={survey.sentToAdmin ? "secondary" : "outline"}>
                {String(survey.sentToAdmin || false)}
              </Badge>
            </div>
            <div>
              <div className="font-semibold">Created On</div>
              <div>{created ? format(created, 'PPP p') : '—'}</div>
            </div>
            <div>
              <div className="font-semibold">Last Updated</div>
              <div>{updated ? format(updated, 'PPP p') : '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-800">
            {survey.recommendation || survey.surveyRecommendation || 'No recommendation provided.'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applicant Details (Full)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold">Full Name</div>
              <div>{app.full_name || app.fullName || '—'}</div>
            </div>
            <div>
              <div className="font-semibold">Father / Husband</div>
              <div>{app.father_name || app.fatherName || '—'}</div>
            </div>

            <div>
              <div className="font-semibold">CNIC</div>
              <div>{app.cnic_number || app.cnic || '—'}</div>
            </div>
            <div>
              <div className="font-semibold">Phone</div>
              <div>{(app.user && (app.user.phone || app.user.contact_number)) || app.phone || app.contact || '—'}</div>
            </div>

            <div>
              <div className="font-semibold">Email</div>
              <div>{(app.user && app.user.email) || app.email || '—'}</div>
            </div>
            <div>
              <div className="font-semibold">City</div>
              <div>{(app.user && app.user.city) || app.city || '—'}</div>
            </div>

            <div>
              <div className="font-semibold">Marital Status</div>
              <div>{app.marital_status || app.maritalStatus || '—'}</div>
            </div>
            <div>
              <div className="font-semibold">Family Members</div>
              <div>{app.family_count ?? app.familyCount ?? '—'}</div>
            </div>

            <div>
              <div className="font-semibold">Monthly Income</div>
              <div>{app.monthly_income ?? app.monthlyIncome ? `PKR ${app.monthly_income || app.monthlyIncome}` : '—'}</div>
            </div>
            <div>
              <div className="font-semibold">Home / Rent</div>
              <div>{app.home_rent || app.homeRent || '—'}</div>
            </div>

            <div className="md:col-span-2">
              <div className="font-semibold">Situation / Reason</div>
              <div className="text-gray-700">{app.reason || app.situationDescription || '—'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Submitted Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {((app.cnic_front || app.cnicFront) || (app.cnic_back || app.cnicBack) || (app.document || app.document_url)) ? (
              <>
                {(app.cnic_front || app.cnicFront) && (
                  <a href={app.cnic_front || app.cnicFront} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden">
                    <div className="p-2 text-xs text-gray-700">CNIC Front</div>
                    <div className="aspect-w-3 aspect-h-2 bg-gray-100">
                      <img src={app.cnic_front || app.cnicFront} alt="CNIC Front" className="w-full h-full object-cover" />
                    </div>
                  </a>
                )}

                {(app.cnic_back || app.cnicBack) && (
                  <a href={app.cnic_back || app.cnicBack} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden">
                    <div className="p-2 text-xs text-gray-700">CNIC Back</div>
                    <div className="aspect-w-3 aspect-h-2 bg-gray-100">
                      <img src={app.cnic_back || app.cnicBack} alt="CNIC Back" className="w-full h-full object-cover" />
                    </div>
                  </a>
                )}

                {(app.document || app.document_url) && (
                  <a href={app.document || app.document_url} target="_blank" rel="noopener noreferrer" className="block border rounded-lg overflow-hidden">
                    <div className="p-2 text-xs text-gray-700">Other Document</div>
                    <div className="p-2 text-sm text-gray-800 truncate">{(app.document || app.document_url).split('/').pop()}</div>
                  </a>
                )}
              </>
            ) : (
              <div className="col-span-full text-sm text-gray-600">No user-submitted documents found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {(survey.report || survey.surveyReport) ? (
              <div className="text-gray-800">{
                (survey.report || survey.surveyReport).split('\n').map((p: string, i: number) => (
                  <p key={i} className="mb-2 last:mb-0">{p}</p>
                ))
              }</div>
            ) : (
              <p className="text-gray-600">No report text submitted.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(survey.attachments || survey.surveyAttachments || []).length === 0 && (
              <div className="col-span-full text-sm text-gray-600">No attachments found.</div>
            )}
            {(survey.attachments || survey.surveyAttachments || []).map((att: any, index: number) => (
              <a key={att.id || index} href={att.url} target="_blank" rel="noopener noreferrer" className="group block border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                  <img src={att.url} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-2 text-xs text-gray-700 truncate">
                  {att.url.split('/').pop()}
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
