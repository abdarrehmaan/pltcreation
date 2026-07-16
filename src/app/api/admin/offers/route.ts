import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [offers, coupons] = await prisma.$transaction([
      prisma.offer.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return NextResponse.json({ offers, coupons });
  } catch (error: any) {
    console.error('Failed to fetch admin offers/coupons:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemType, ...data } = body;

    if (itemType === 'COUPON') {
      const { code, type, value, minOrderValue, maxDiscount, isActive, expiresAt } = data;
      if (!code || !type || value === undefined) {
        return NextResponse.json({ error: 'Code, type, and value are required' }, { status: 400 });
      }

      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          type,
          value,
          minOrderValue: minOrderValue || null,
          maxDiscount: maxDiscount || null,
          isActive: isActive ?? true,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });
      return NextResponse.json({ success: true, item: coupon, itemType: 'COUPON' });
    } else {
      const { title, description, imageUrl, linkUrl, type, isActive } = data;
      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      const offer = await prisma.offer.create({
        data: {
          title,
          description: description || '',
          imageUrl: imageUrl || '',
          linkUrl: linkUrl || '',
          type: type || 'HOMEPAGE_BANNER',
          isActive: isActive ?? true,
        },
      });
      return NextResponse.json({ success: true, item: offer, itemType: 'OFFER' });
    }
  } catch (error: any) {
    console.error('Failed to create offer/coupon:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const itemType = searchParams.get('itemType');

    if (!id || !itemType) {
      return NextResponse.json({ error: 'ID and itemType are required' }, { status: 400 });
    }

    if (itemType === 'COUPON') {
      await prisma.coupon.delete({ where: { id } });
    } else {
      await prisma.offer.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete offer/coupon:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
