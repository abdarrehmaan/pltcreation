import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteStorageImages } from '@/lib/storage-helpers';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const softDeleted = await prisma.product.findMany({
      where: { isDeleted: true },
      include: { images: true },
    });

    let count = 0;
    for (const p of softDeleted) {
      if (p.images && p.images.length > 0) {
        await deleteStorageImages(p.images.map((img) => img.url));
      }

      await prisma.$transaction(async (tx) => {
        await tx.productImage.deleteMany({ where: { productId: p.id } });
        await tx.productVariant.deleteMany({ where: { productId: p.id } });
        await tx.collectionProduct.deleteMany({ where: { productId: p.id } });
        await tx.wishlistItem.deleteMany({ where: { productId: p.id } });
        await tx.cartItem.deleteMany({ where: { productId: p.id } });
        await tx.review.deleteMany({ where: { productId: p.id } });
        await tx.product.delete({ where: { id: p.id } });
      });
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Permanently removed ${count} old soft-deleted product record(s) from database.`,
    });
  } catch (error: any) {
    console.error('Purge soft-deleted products error:', error);
    return NextResponse.json({ error: error.message || 'Failed to purge soft-deleted products' }, { status: 500 });
  }
}
