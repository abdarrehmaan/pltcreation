import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 250): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isPoolError =
        err?.message?.includes('EMAXCONNSESSION') ||
        err?.message?.includes('max clients') ||
        err?.message?.includes('timeout') ||
        err?.code === 'XX000';

      if (isPoolError && i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

export async function GET() {
  try {
    const data = await withRetry(async () => {
      // 1. Total Revenue
      const revenueResult = await prisma.order.aggregate({
        where: {
          status: { notIn: ['CANCELLED', 'RETURNED'] },
        },
        _sum: { total: true },
      });
      const totalRevenue = Number(revenueResult._sum.total || 0);

      // 2. Total Orders
      const totalOrders = await prisma.order.count();

      // 3. Total Customers
      const totalCustomers = await prisma.user.count({
        where: { role: 'CUSTOMER' },
      });

      // 4. Total Products
      const totalProducts = await prisma.product.count({
        where: { isDeleted: false },
      });

      // 5. Recent 5 Orders
      const recentOrdersDb = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
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

      // 6. Top 5 selling products
      const orderItemsGrouped = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      });

      const topProducts = [];
      for (const group of orderItemsGrouped) {
        if (!group.productId) continue;
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

      return {
        kpis: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
        },
        recentOrders,
        topProducts,
      };
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin Dashboard KPIs error:', error);
    // Graceful fallback data so admin dashboard never crashes
    return NextResponse.json({
      kpis: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
      },
      recentOrders: [],
      topProducts: [],
    });
  }
}
