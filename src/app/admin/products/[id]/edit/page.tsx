import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description || '',
    categoryId: product.categoryId,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
    totalStock: product.totalStock,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt || '' })),
    variants: product.variants.map((v) => ({
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || '',
      stock: v.stock,
    })),
  };

  return (
    <div>
      <ProductForm initialData={initialData} />
    </div>
  );
}
