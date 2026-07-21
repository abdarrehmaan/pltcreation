import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category?.name || 'Uncategorized',
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      totalStock: p.totalStock,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      sku: p.sku,
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error: any) {
    console.error('Failed to fetch admin products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    if (!name || !slug || !sku || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Name, slug, sku, categoryId and price are required' },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

    const createdProduct = await prisma.$transaction(async (tx: any) => {
      const product = await tx.product.create({
        data: {
          name,
          slug: sanitizedSlug,
          sku,
          description: description || '',
          categoryId,
          price,
          comparePrice: comparePrice || null,
          isActive: isActive ?? true,
          isFeatured: isFeatured ?? false,
          isNewArrival: isNewArrival ?? false,
          isBestSeller: isBestSeller ?? false,
          totalStock: totalStock || 0,
        },
      });

      // Insert images if provided
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt || name,
            sortOrder: idx,
            color: img.color || null,
          })),
        });
      }

      // Insert variants if provided
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: product.id,
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
    revalidatePath('/');
    revalidatePath('/best-sellers');
    revalidatePath('/new-arrivals');

    return NextResponse.json({ success: true, product: createdProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
