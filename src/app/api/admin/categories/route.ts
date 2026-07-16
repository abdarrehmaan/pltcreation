import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    const formattedCategories = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
      productsCount: c._count.products,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error: any) {
    console.error('Failed to fetch admin categories:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, isActive } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
