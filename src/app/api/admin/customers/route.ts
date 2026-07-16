import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
      },
      include: {
        orders: {
          select: {
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedCustomers = customers.map((c: any) => ({
      id: c.id,
      name: c.name || 'Anonymous',
      email: c.email,
      phone: c.phone || '—',
      orders: c.orders.length,
      totalSpent: c.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0),
      joinedAt: c.createdAt,
    }));

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error: any) {
    console.error('Failed to fetch admin customers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
