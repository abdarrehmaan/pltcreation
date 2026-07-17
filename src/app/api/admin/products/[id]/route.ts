import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Format for form defaultValues
    const formattedProduct = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt || '', color: img.color || '' })),
      variants: product.variants.map((v) => ({
        size: v.size,
        color: v.color,
        colorHex: v.colorHex || '',
        stock: v.stock,
      })),
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (error: any) {
    console.error('Failed to get product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      categoryId,
      price,
      comparePrice,
      isActive,
      isFeatured,
      isNewArrival,
      isBestSeller,
      totalStock,
      images,
      variants,
    } = body;

    const sanitizedSlug = slug ? slug.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') : undefined;

    const updatedProduct = await prisma.$transaction(async (tx: any) => {
      // 1. Update basic product details
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug: sanitizedSlug,
          sku,
          description: description || '',
          categoryId,
          price,
          comparePrice: comparePrice || null,
          isActive,
          isFeatured,
          isNewArrival,
          isBestSeller,
          totalStock: totalStock || 0,
        },
      });

      // 2. Sync images
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            alt: img.alt || name,
            sortOrder: idx,
            color: img.color || null,
          })),
        });
      }

      // 3. Sync variants
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || null,
            stock: v.stock || 0,
            sku: `${sku}-${v.size}-${v.color}`.toUpperCase(),
          })),
        });
      }

      return product;
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
