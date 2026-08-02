import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).trim();
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: decodedSlug },
          { slug: { equals: decodedSlug, mode: 'insensitive' } },
          { id: decodedSlug },
        ],
        isDeleted: false,
      },
      select: { name: true, price: true, isDeleted: true },
    });
    if (!product || product.isDeleted) return {};
    return {
      title: product.name,
      description: `Buy ${product.name} online at PLT Creation. Premium ethnic wear starting from ₹${Number(product.price).toLocaleString('en-IN')}.`,
    };
  } catch (error) {
    return {};
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  
  let dbProduct: any = null;
  let reviews: any[] = [];
  let dbRelated: any[] = [];

  try {
    dbProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: decodedSlug },
          { slug: { equals: decodedSlug, mode: 'insensitive' } },
          { id: decodedSlug },
        ],
        isDeleted: false,
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        _count: { select: { reviews: true } },
      },
    });

    if (dbProduct) {
      reviews = await prisma.review.findMany({
        where: { productId: dbProduct.id, status: 'APPROVED' },
        select: { rating: true },
      });

      if (dbProduct.categoryId) {
        dbRelated = await prisma.product.findMany({
          where: {
            categoryId: dbProduct.categoryId,
            id: { not: dbProduct.id },
            isDeleted: false,
          },
          take: 4,
          include: {
            category: { select: { name: true } },
            images: { orderBy: { sortOrder: 'asc' } },
            variants: true,
          },
        });
      }
    }
  } catch (error) {
    console.error('ProductDetailPage DB query error:', error);
  }

  if (!dbProduct || dbProduct.isDeleted) {
    notFound();
  }

  // Calculate average rating from reviews, fallback to 4.8
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.8;

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    sku: dbProduct.sku,
    description: dbProduct.description || '',
    price: Number(dbProduct.price),
    comparePrice: dbProduct.comparePrice ? Number(dbProduct.comparePrice) : undefined,
    totalStock: dbProduct.totalStock,
    isNewArrival: dbProduct.isNewArrival,
    isBestSeller: dbProduct.isBestSeller,
    category: {
      name: dbProduct.category?.name || 'Ethnic Wear',
      slug: dbProduct.category?.slug || 'ethnic-wear',
    },
    images: (dbProduct.images || []).map((img: any) => ({
      url: img.url,
      alt: img.alt || '',
      color: img.color,
    })),
    variants: (dbProduct.variants || []).map((v: any) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || undefined,
      stock: v.stock,
    })),
    _count: { reviews: dbProduct._count?.reviews || 0 },
    avgRating,
  };

  const relatedProducts = dbRelated.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    totalStock: p.totalStock,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    category: { name: p.category?.name || 'Ethnic Wear' },
    images: (p.images || []).map((img: any) => ({ url: img.url, alt: img.alt || '' })),
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || undefined,
      stock: v.stock,
    })),
    avgRating: 4.8,
  }));

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
