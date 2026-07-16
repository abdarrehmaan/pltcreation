import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedReviews = reviews.map((r: any) => ({
      id: r.id,
      name: r.user?.name || 'Anonymous',
      email: r.user?.email || '',
      rating: r.rating,
      title: r.title || '',
      body: r.body || '',
      product: r.product?.name || 'Unknown Product',
      status: r.status,
      date: new Date(r.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error: any) {
    console.error('Failed to fetch admin reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
    }

    let reviewStatus: ReviewStatus;
    if (status === 'APPROVED') {
      reviewStatus = ReviewStatus.APPROVED;
    } else if (status === 'REJECTED') {
      reviewStatus = ReviewStatus.REJECTED;
    } else {
      reviewStatus = ReviewStatus.PENDING;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        status: reviewStatus,
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    console.error('Failed to update review status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
