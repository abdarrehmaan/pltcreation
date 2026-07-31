import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const cleanedId = decodeURIComponent(id).trim();

    let order = null;

    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: cleanedId },
            { orderNumber: { equals: cleanedId, mode: 'insensitive' } },
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
      console.warn(`Database query for order '${cleanedId}' failed:`, dbErr);
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('API /api/orders/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
