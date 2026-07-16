import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReturnStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const returns = await prisma.returnRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedReturns = returns.map((r: any) => ({
      id: r.id,
      orderId: r.order?.orderNumber || 'Unknown',
      customer: r.user?.name || 'Guest',
      reason: r.reason,
      amount: Number(r.refundAmount || r.order?.total || 0),
      status: r.status,
    }));

    return NextResponse.json({ returns: formattedReturns });
  } catch (error: any) {
    console.error('Failed to fetch return requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Return request ID and status are required' },
        { status: 400 }
      );
    }

    const nextStatus = status.toUpperCase() as ReturnStatus;

    const updated = await prisma.returnRequest.update({
      where: { id },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json({ success: true, returnRequest: updated });
  } catch (error: any) {
    console.error('Failed to update return request status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
