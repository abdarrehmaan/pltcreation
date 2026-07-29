import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteStorageImages } from '@/lib/storage-helpers';

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
        collections: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formattedProduct = {
      ...product,
      collectionId: product.collections[0]?.collectionId || '',
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
      collectionId,
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

      // Update collection relationship
      await tx.collectionProduct.deleteMany({ where: { productId: id } });
      if (collectionId) {
        await tx.collectionProduct.create({
          data: {
            productId: id,
            collectionId,
          },
        });
      }

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

    revalidatePath('/products');
    revalidatePath(`/products/${updatedProduct.slug}`);
    revalidatePath('/');
    revalidatePath('/best-sellers');
    revalidatePath('/new-arrivals');

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

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 1. Delete image files from Supabase Storage
    if (product.images && product.images.length > 0) {
      const imageUrls = product.images.map((img) => img.url);
      await deleteStorageImages(imageUrls);
    }

    // 2. Hard delete product & associated relations from Database
    await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.collectionProduct.deleteMany({ where: { productId: id } });
      await tx.wishlistItem.deleteMany({ where: { productId: id } });
      await tx.cartItem.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });

    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/');
    revalidatePath('/admin/products');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to hard delete product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
