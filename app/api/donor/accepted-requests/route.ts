import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (!authResult.success || authResult.user.role !== 'donor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const donorId = authResult.user.id;

  try {
    // Fetch accepted requests for this donor (uses AcceptedByDonor model)
    const acceptedRequests = await (prisma as any).acceptedByDonor.findMany({
      where: {
        donorId: donorId,
      },
      include: {
        request: {
          include: {
            user: true,
          },
        },
      },
    });

    // Map acceptedRequests to return array of requests with flattened user object
    const requests = acceptedRequests.map((item: any) => ({
      ...item.request,
      name: item.request.user?.name || item.request.full_name,
      cnic: item.request.user?.cnic || item.request.cnic_number,
      currentAddress: item.request.user?.address,
      request_type: item.request.type,
      forwardedToSurvey: item.request.forwardedToSurvey,
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
