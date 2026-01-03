
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { cnic, password } = await req.json();

  const donor = await prisma.donors.findUnique({ where: { cnic } });

  if (!donor) {
    return NextResponse.json({ error: 'No donor found with this CNIC' }, { status: 400 });
  }

  // Enforce approval: only ACTIVE donors can log in
  if (donor.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Your account is pending approval by admin.' }, { status: 403 });
  }

  const passwordMatch = await bcrypt.compare(password, donor.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: donor.id,
      role: 'donor',
      name: donor.name,
      cnic: donor.cnic,
      email: donor.email,
      contact_number: donor.contact_number,
      organization_name: donor.organization_name,
      created_at: donor.created_at,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return NextResponse.json({ message: 'Login successful' });
}
