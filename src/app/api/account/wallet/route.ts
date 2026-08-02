import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let wallet: any = null;

    // Retry helper for temporary connection spikes
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        wallet = await prisma.wallet.findUnique({
          where: { userId },
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        if (!wallet) {
          wallet = await prisma.wallet.create({
            data: {
              userId,
              balance: 0,
            },
            include: {
              transactions: true,
            },
          });
        }
        break; // Success, exit retry loop
      } catch (err: any) {
        if (attempt < 3 && (err?.message?.includes('EMAXCONNSESSION') || err?.message?.includes('max clients') || err?.message?.includes('timeout'))) {
          await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
        } else {
          // If all retries exhausted, return 0 balance default so page loads cleanly
          return NextResponse.json({
            wallet: {
              id: 'temp-wallet',
              balance: 0,
              transactions: [],
            },
          });
        }
      }
    }

    return NextResponse.json({
      wallet: {
        id: wallet.id,
        balance: Number(wallet.balance || 0),
        transactions: (wallet.transactions || []).map((t: any) => ({
          id: t.id,
          amount: Number(t.amount || 0),
          type: t.type,
          description: t.description,
          createdAt: t.createdAt,
        })),
      },
    });
  } catch (error: any) {
    console.error('Fetch wallet error:', error);
    return NextResponse.json({
      wallet: {
        id: 'fallback-wallet',
        balance: 0,
        transactions: [],
      },
    });
  }
}
