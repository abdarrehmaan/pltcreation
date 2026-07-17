import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await prisma.product.findUnique({
    where: { slug: decodedSlug },
    select: { name: true, price: true },
  });
  if (!product) return {};
  return {
    title: product.name,
    description: `Buy ${product.name} online at PLT Creation. Premium ethnic wear starting from ₹${Number(product.price).toLocaleString('en-IN')}.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const dbProduct = await prisma.product.findUnique({
    where: { slug: decodedSlug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!dbProduct || !dbProduct.isActive) {
    notFound();
  }

  // Calculate average rating from reviews, fallback to 4.8
  const reviews = await prisma.review.findMany({
    where: { productId: dbProduct.id, status: 'APPROVED' },
    select: { rating: true },
  });
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.8;

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    sku: dbProduct.sku,
    price: Number(dbProduct.price),
    comparePrice: dbProduct.comparePrice ? Number(dbProduct.comparePrice) : undefined,
    totalStock: dbProduct.totalStock,
    isNewArrival: dbProduct.isNewArrival,
    isBestSeller: dbProduct.isBestSeller,
    category: { name: dbProduct.category.name, slug: dbProduct.category.slug },
    images: dbProduct.images.map((img) => ({ url: img.url, alt: img.alt || '' })),
    variants: dbProduct.variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || undefined,
      stock: v.stock,
    })),
    _count: { reviews: dbProduct._count.reviews },
    avgRating,
  };

  const dbRelated = await prisma.product.findMany({
    where: {
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
      isActive: true,
    },
    take: 4,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  const relatedProducts = dbRelated.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    totalStock: p.totalStock,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    category: { name: p.category.name },
    images: p.images.map((img) => ({ url: img.url, alt: img.alt || '' })),
    variants: p.variants.map((v) => ({
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

