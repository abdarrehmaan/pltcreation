import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id, name, email, phone } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required for syncing' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;

    // Check if user already exists in the public database
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User profile already synced', user: existingUser },
        { status: 200 }
      );
    }

    // Create the user profile in the public table matching the Supabase Auth ID
    const user = await prisma.user.create({
      data: {
        id, // Map 1:1 to Supabase Auth User ID
        name: name?.trim() || null,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'CUSTOMER', // Default role
      },
    });

    // Create user wallet (used for store credit)
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0.0,
      },
    });

    return NextResponse.json(
      {
        message: 'User profile synced successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while syncing user profile' },
      { status: 500 }
    );
  }
}
