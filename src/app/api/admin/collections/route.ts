import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('Failed to fetch admin collections:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, bannerImage, isActive } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || '',
        bannerImage: bannerImage || '',
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, collection }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

