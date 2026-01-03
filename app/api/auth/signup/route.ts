// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      cnic,
      role,
      address,
      city,
      phone,
    } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Safely clean CNIC if provided
    const cleanedCnic = typeof cnic === 'string' && cnic ? cnic.replace(/-/g, '') : undefined;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prevent public signup from creating admin users
    if (role === 'admin') {
      return NextResponse.json({ error: 'Admin signup not allowed' }, { status: 403 });
    }

    // Normalize role values to match Prisma enum (Role contains: user, donor, admin, SURVEY_OFFICER)
    let normalizedRole: string = 'user';
    if (role === 'donor') normalizedRole = 'donor';
    else if (role === 'survey' || role === 'SURVEY_OFFICER') normalizedRole = 'SURVEY_OFFICER';

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cnic: cleanedCnic ?? undefined,
        role: normalizedRole as any,
        address,
        city,
        phone,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
