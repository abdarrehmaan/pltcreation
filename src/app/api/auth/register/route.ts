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

    // Upsert user profile matching Supabase Auth ID
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        name: name?.trim() || undefined,
        email: cleanEmail,
        phone: cleanPhone || undefined,
      },
      create: {
        id,
        name: name?.trim() || null,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'CUSTOMER',
      },
    });

    // Ensure user wallet exists (used for store credit)
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
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

