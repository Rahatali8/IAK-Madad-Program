import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);

  if (!authResult.success || authResult.user.role !== 'donor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const donorId = authResult.user.id;

  try {
    const donations = await db.donation.findMany({
      where: {
        userId: donorId,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const acceptedRequests = donations.length;

    let monthlyDonations = 0;
    if (donations.length > 0) {
      const firstDonationDate = new Date(donations[0].date);
      const lastDonationDate = new Date(donations[donations.length - 1].date);
      const months = (lastDonationDate.getFullYear() - firstDonationDate.getFullYear()) * 12 + (lastDonationDate.getMonth() - firstDonationDate.getMonth()) + 1;
      monthlyDonations = totalDonated / (months || 1);
    }
    
    // Simple impact score: 1 point per 1000 PKR donated
    const impactScore = Math.floor(totalDonated / 1000);

    const stats = {
      totalDonated,
      acceptedRequests,
      monthlyDonations,
      impactScore,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching donor stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
