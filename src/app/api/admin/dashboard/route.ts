import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Total Revenue (sum of all orders not cancelled)
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
      },
      _sum: {
        total: true,
      },
    });
    const totalRevenue = Number(revenueResult._sum.total || 0);

    // 2. Total Orders
    const totalOrders = await prisma.order.count();

    // 3. Total Customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    });

    // 4. Total Products listings
    const totalProducts = await prisma.product.count();

    // 5. Recent 5 Orders with customer details
    const recentOrdersDb = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const recentOrders = recentOrdersDb.map((o: any) => ({
      id: o.orderNumber,
      customer: o.shippingName || o.user?.name || 'Guest',
      amount: Number(o.total),
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    // 6. Top 5 selling products using Prisma client grouping
    const orderItemsGrouped = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const topProducts = [];
    for (const group of orderItemsGrouped) {
      const product = await prisma.product.findUnique({
        where: { id: group.productId },
        select: { name: true, totalStock: true },
      });

      if (product) {
        topProducts.push({
          name: product.name,
          orders: Number(group._sum.quantity || 0),
          revenue: Number(group._sum.totalPrice || 0),
          stock: Number(product.totalStock || 0),
        });
      }
    }

    return NextResponse.json({
      kpis: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts,
    });
  } catch (error: any) {
    console.error('Admin Dashboard KPIs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
