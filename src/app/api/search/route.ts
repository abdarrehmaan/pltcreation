import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';

    if (!q) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { name: { contains: q, mode: 'insensitive' } } },
          ],
        },
        take: 6,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          category: { select: { name: true } },
          images: {
            take: 1,
            orderBy: { sortOrder: 'asc' },
            select: { url: true, alt: true },
          },
        },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: q, mode: 'insensitive' },
        },
        take: 4,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
    ]);

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      categoryName: p.category?.name || '',
      image: p.images[0]?.url || '/placeholder.png',
    }));

    return NextResponse.json({
      products: formattedProducts,
      categories,
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [], categories: [] });
  }
}
