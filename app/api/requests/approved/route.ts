import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const approvedRequests = await prisma.request.findMany({
      where: {
        status: 'approved',
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Map the requests to include user name, cnic, and address
    const mappedRequests = approvedRequests.map((request) => ({
      ...request,
      name: request.user?.name || request.full_name,
      cnic: request.user?.cnic || request.cnic_number,
      currentAddress: request.user?.address,
      request_type: request.type,
    }));

    return NextResponse.json({ requests: mappedRequests });
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    return NextResponse.json({ error: 'Failed to fetch approved requests' }, { status: 500 });
  }
}
