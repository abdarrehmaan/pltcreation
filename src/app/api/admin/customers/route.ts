import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let customers: any[] = [];
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        customers = await prisma.user.findMany({
          where: {
            role: 'CUSTOMER',
          },
          include: {
            orders: {
              select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                createdAt: true,
              },
            },
            addresses: {
              orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
              ],
            },
            wallet: {
              include: {
                transactions: {
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;
      } catch (err: any) {
        if (attempt < 3 && (err?.message?.includes('EMAXCONNSESSION') || err?.message?.includes('max clients') || err?.message?.includes('timeout'))) {
          await new Promise((r) => setTimeout(r, 250 * attempt));
        } else {
          console.error('Failed to fetch admin customers after retries:', err);
          return NextResponse.json({ customers: [] });
        }
      }
    }

    const formattedCustomers = customers.map((c: any) => ({
      id: c.id,
      name: c.name || 'Anonymous',
      email: c.email,
      phone: c.phone || 'N/A',
      orders: c.orders.length,
      ordersList: c.orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt,
      })),
      totalSpent: c.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0),
      joinedAt: c.createdAt,
      addresses: c.addresses.map((a: any) => ({
        id: a.id,
        fullName: a.fullName,
        phone: a.phone,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        isDefault: a.isDefault,
      })),
      wallet: c.wallet ? {
        id: c.wallet.id,
        balance: Number(c.wallet.balance),
        transactions: c.wallet.transactions.map((t: any) => ({
          id: t.id,
          amount: Number(t.amount),
          type: t.type,
          description: t.description,
          createdAt: t.createdAt,
        })),
      } : { balance: 0, transactions: [] },
    }));

    return NextResponse.json({ customers: formattedCustomers });
  } catch (error: any) {
    console.error('Failed to fetch admin customers:', error);
    return NextResponse.json({ customers: [] });
  }
}

