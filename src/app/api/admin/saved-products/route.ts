import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            wishlistItems: true,
          },
        },
      },
      orderBy: {
        wishlistItems: {
          _count: 'desc',
        },
      },
    });

    const savedProducts = products
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || 'Uncategorized',
        price: Number(p.price),
        sku: p.sku,
        totalStock: p.totalStock,
        isActive: p.isActive,
        saveCount: p._count.wishlistItems,
      }))
      .filter((p: any) => p.saveCount > 0);

    return NextResponse.json({ savedProducts });
  } catch (error: any) {
    console.error('Failed to fetch admin saved products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
