import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedOrders = orders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.shippingName || o.user?.name || 'Guest',
      phone: o.shippingPhone || '',
      items: o.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      amount: Number(o.total),
      payment: o.paymentMethod,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error: any) {
    console.error('Failed to fetch admin orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Map status string to OrderStatus enum
    let nextStatus: OrderStatus;
    const cleanStatus = status.toUpperCase();

    if (cleanStatus === 'CONFIRM') {
      nextStatus = OrderStatus.CONFIRMED;
    } else if (cleanStatus === 'SHIP') {
      nextStatus = OrderStatus.SHIPPED;
    } else if (cleanStatus === 'DELIVER') {
      nextStatus = OrderStatus.DELIVERED;
    } else if (cleanStatus === 'CANCEL') {
      nextStatus = OrderStatus.CANCELLED;
    } else {
      nextStatus = cleanStatus as OrderStatus;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: nextStatus,
        paymentStatus: nextStatus === OrderStatus.DELIVERED ? PaymentStatus.PAID : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
