import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { mockProducts } from '@/lib/mock-data';

export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `Buy ${product.name} online at PLT Creation. Premium ethnic wear starting from ₹${product.price.toLocaleString('en-IN')}.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && p.category?.name === product.category?.name)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
