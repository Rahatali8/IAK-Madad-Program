
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: Request) {
  // Authenticate user
  const auth = await verifyAuth(request);
  let surveys = [];
  if (auth.user.role === "admin") {
    // Admin: show all surveys for requests that have been forwarded to survey team
    surveys = await db.survey.findMany({
      where: { application: { forwardedToSurvey: true } },
      include: { application: true, attachments: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Officer: show assigned or unassigned
    const officerId = auth.user.id;
    surveys = await db.survey.findMany({
      where: { OR: [{ officerId: null }, { officerId }] },
      include: { application: true, attachments: true },
      orderBy: { createdAt: "desc" },
    });
  }
  return new Response(JSON.stringify({ surveys }), { status: 200 });
}


export async function POST(request: Request) {
  // Authenticate user
  const auth = await verifyAuth(request);
  // Do not log auth or cookie data here to avoid leaking sensitive tokens.
  if (!auth.success || !auth.user || (auth.user.role !== "SURVEY_OFFICER" && auth.user.role !== "admin")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const officerId = auth.user.id;
  const data = await request.json();
  const { surveyId, status, recommendation, report, attachments } = data;

  // Try to claim survey if unassigned
  const survey = await db.survey.findUnique({ where: { id: surveyId } })
  if (!survey) return new Response(JSON.stringify({ error: 'Survey not found' }), { status: 404 })

  if (!survey.officerId) {
    await db.survey.update({ where: { id: surveyId }, data: { officerId } })
  }

  // Update survey record (must now be assigned to officer)
  // Normalize attachments: accept either array of strings or array of { url }
  const normalizedAttachments: string[] = (attachments || []).map((a: any) => {
    if (!a) return String(a);
    if (typeof a === "string") return a;
    if (typeof a === "object" && a.url) return a.url;
    // fallback to string conversion
    return String(a);
  });

  const updatedSurvey = await db.survey.update({
    where: { id: surveyId },
    data: {
      status,
      recommendation,
      report,
      updatedAt: new Date(),
      attachments: { create: normalizedAttachments.map((url) => ({ url })) },
    },
    include: { application: true, attachments: true },
  })

  // If completed, mark request verification flag
  if (status === 'Completed') {
    try {
      await db.$executeRaw`UPDATE requests SET verification_complete = true WHERE id = ${updatedSurvey.applicationId}`
    } catch (e) {
      console.error('Failed to mark request verification:', e)
    }
  }

  return new Response(JSON.stringify({ survey: updatedSurvey }), { status: 200 });
}
