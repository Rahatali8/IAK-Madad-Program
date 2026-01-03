import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (!authResult.success || authResult.user.role !== 'donor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { requestId, donorId } = body;

    if (!requestId || !donorId) {
      return NextResponse.json({ error: 'Missing requestId or donorId' }, { status: 400 });
    }

    // This is a dummy implementation.
    // In a real scenario, this is where you would update the database
    // to associate the donor with the request.
    console.log(`Dummy: Donor ${donorId} accepted request ${requestId}`);

    return NextResponse.json({ success: true, message: 'Request accepted successfully (dummy response)' });

  } catch (error) {
    console.error('Error in accept-request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}