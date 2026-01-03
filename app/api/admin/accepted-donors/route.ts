import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success || authResult.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch accepted donor requests (pledged by donors)
    const acceptedDonors = await db.acceptedByDonor.findMany({
      include: {
        donor: true,
        request: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        acceptedAt: "desc",
      },
      take: 100, // limit to most recent 100 entries
    })

    return NextResponse.json({ acceptedDonors })
  } catch (error) {
    console.error("Error fetching accepted donors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
