import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cnic, email, password } = body;

    let user: any = null;
    let role = 'user';

    // Check if it's email login
    if (email) {
      // First check admin table
      user = await prisma.admin.findUnique({
        where: { email: email },
      });
      role = 'admin';

      // If not found in admin, check donors table
      if (!user) {
        user = await prisma.donors.findUnique({
          where: { email: email },
        });
        role = 'donor';
      }
        // If not found in donors, check regular users table
        if (!user) {
          user = await prisma.user.findUnique({ where: { email: email } });
          role = 'user';
        }
    } else {
      // Regular user/donor login with CNIC
      const cleanInputCnic = (cnic ?? "").replace(/-/g, "");

      user = await prisma.user.findUnique({
        where: { cnic: cleanInputCnic },
      });

      if (!user) {
        user = await prisma.donors.findUnique({
          where: { cnic: cleanInputCnic },
        });
        role = 'donor';
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Enforce approval for donors: only ACTIVE donors can log in
    if (role === 'donor' && user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is pending approval by admin.' }, { status: 403 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid CNIC or password' }, { status: 401 });
    }

    // Sign JWT token with comprehensive details
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role || role, 
        cnic: user.cnic,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number || user.phone,
        organization_name: user.organization_name,
        created_at: user.created_at,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Store token in cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Return a consistent user object structure
    const { password: _, ...userWithoutPassword } = user;
    const userWithRole = { ...userWithoutPassword, role };
    return NextResponse.json({ user: userWithRole }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
