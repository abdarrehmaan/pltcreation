import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId')?.trim();
    const phone = searchParams.get('phone')?.trim();

    let orders: any[] = [];

    try {
      if (userId || phone) {
        orders = await prisma.order.findMany({
          where: {
            OR: [
              ...(userId ? [{ userId }] : []),
              ...(phone ? [{ shippingPhone: { equals: phone } }, { user: { phone: { equals: phone } } }] : []),
            ],
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            user: true,
            address: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
    } catch (dbErr) {
      console.warn('Database query in /api/orders failed:', dbErr);
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('API /api/orders GET error:', error);
    return NextResponse.json({ orders: [] });
  }
}
