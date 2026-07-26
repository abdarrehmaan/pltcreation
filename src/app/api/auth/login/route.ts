import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { emailOrPhone } = await request.json();

    if (!emailOrPhone) {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();

    // Find user by email or phone in public database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          { phone: cleanInput },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in public database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User found',
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
    console.error('Login lookup error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during user lookup' },
      { status: 500 }
    );
  }
}

