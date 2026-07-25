import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await prisma.$transaction(async (tx: any) => {
      // Delete child records first to respect FK constraints
      await tx.orderItem.deleteMany({});
      await tx.returnRequest.deleteMany({});
      await tx.invoice.deleteMany({});
      await tx.order.deleteMany({});
      await tx.wishlistItem.deleteMany({});
      await tx.cartItem.deleteMany({});
      await tx.productImage.deleteMany({});
      await tx.productVariant.deleteMany({});
      await tx.collectionProduct.deleteMany({});
      await tx.review.deleteMany({});
      await tx.product.deleteMany({});
      await tx.category.deleteMany({});
      await tx.collection.deleteMany({});
      await tx.offer.deleteMany({});
      await tx.coupon.deleteMany({});
    });

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/collections');
    revalidatePath('/admin/orders');

    return NextResponse.json({
      success: true,
      message: 'All sample and seed data cleared successfully. Admin panel is now clean.',
    });
  } catch (error: any) {
    console.error('Clear sample data error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear sample data' },
      { status: 500 }
    );
  }
}
