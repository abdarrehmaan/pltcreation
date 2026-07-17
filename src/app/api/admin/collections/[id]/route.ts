import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ collection });
  } catch (error: any) {
    console.error('Failed to fetch collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, slug, description, bannerImage, isActive } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const sanitizedSlug = slug ? slug.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') : undefined;

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name,
        slug: sanitizedSlug,
        description: description || '',
        bannerImage: bannerImage || '',
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    console.error('Failed to update collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete collection:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

