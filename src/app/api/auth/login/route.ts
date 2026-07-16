import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { emailOrPhone, password } = await request.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required fields' },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { phone: cleanInput },
        ],
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email/phone or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email/phone or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}
