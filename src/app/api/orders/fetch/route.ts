import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || searchParams.get('orderNumber')?.trim() || searchParams.get('phone')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Order Number or Phone Number is required.' }, { status: 400 });
    }

    let order = null;

    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: { equals: query, mode: 'insensitive' } },
            { id: { equals: query, mode: 'insensitive' } },
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
      });
    } catch (dbErr) {
      console.warn('Database lookup failed in /api/orders/fetch:', dbErr);
    }

    if (order) {
      return NextResponse.json({ order, source: 'database' });
    }

    return NextResponse.json({ error: 'Order not found. Please verify your order details.' }, { status: 404 });
  } catch (error: any) {
    console.error('Fetch order error:', error);
    return NextResponse.json({ error: error.message || 'Error fetching order' }, { status: 500 });
  }
}
