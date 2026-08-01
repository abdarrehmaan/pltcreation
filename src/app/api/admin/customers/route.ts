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
        addresses: {
          take: 1,
          orderBy: {
            isDefault: 'desc',
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
      phone: c.phone || '',
      orders: c.orders.length,
      totalSpent: c.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0),
      joinedAt: c.createdAt,
      address: c.addresses?.[0] ? {
        line1: c.addresses[0].line1,
        line2: c.addresses[0].line2,
        city: c.addresses[0].city,
        state: c.addresses[0].state,
        pincode: c.addresses[0].pincode,
      } : null,
    }));

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error: any) {
    console.error('Failed to fetch admin customers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
