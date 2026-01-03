import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  if (status === 'approved') {
    // Returning dummy data as requested to avoid schema changes.
    return NextResponse.json({ requests: [] });
  }

  return NextResponse.json({ requests: [] });
}