
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };

    let user = null;
    if (decoded.role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
      });
      if (admin) {
        user = {
          id: admin.id,
          fullName: admin.name,
          email: admin.email,
          cnic: admin.cnic,
          role: "admin",
          address: "", // Admins might not have an address in the same way
          phone: "",
        };
      }
    } else if (decoded.role === "donor") {
      const donor = await prisma.donors.findUnique({
        where: { id: decoded.id },
      });
      if (donor) {
        user = {
          id: donor.id,
          fullName: donor.name,
          email: donor.email,
          cnic: donor.cnic,
          role: "donor",
          address: donor.organization_name || "",
          phone: donor.contact_number,
        };
      }
    } else {
      const regularUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (regularUser) {
        user = {
          id: regularUser.id,
          fullName: regularUser.name,
          email: regularUser.email,
          cnic: regularUser.cnic,
          role: "user",
          address: regularUser.address,
          phone: regularUser.phone,
        };
      }
    }

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err);
    // If token is invalid or expired, it will throw an error
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
