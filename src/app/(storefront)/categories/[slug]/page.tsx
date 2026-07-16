import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

const defaultMeta: Record<string, { name: string; description: string; image: string }> = {
  chikankari: {
    name: 'Chikankari',
    description: 'Handcrafted with love — exquisite Chikankari embroidery that celebrates the artistry of Lucknow.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80',
  },
  'coord-sets': {
    name: 'Co-ord Sets',
    description: 'Modern ethnic fusion — effortlessly chic co-ord sets for every occasion.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&q=80',
  },
  kurtis: {
    name: 'Kurtis',
    description: 'From casual days to festive nights — the perfect kurti for every moment.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
  },
  'stitched-suits': {
    name: 'Stitched Suits',
    description: 'Ready-to-wear premium suits crafted for the modern Indian woman.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b1dd8?w=1600&q=80',
  },
  'unstitched-suits': {
    name: 'Unstitched Suits',
    description: 'Premium fabrics and materials — stitch them exactly to your measurements.',
    image: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=1600&q=80',
  },
  sale: {
    name: 'Sale Collection',
    description: 'Incredible deals on premium ethnic wear — up to 50% off!',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&q=80',
  },
};

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  if (!category) return {};
  return {
    title: `${category.name} Collection`,
    description: category.description || 'Premium ethnic fashion',
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    include: {
      images: true,
      category: { select: { name: true } },
    },
  });

  const formattedProducts = products.map((p) => ({
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
  }));

  const bannerImage = category.image || defaultMeta[slug]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80';
  const description = category.description || defaultMeta[slug]?.description || 'Premium collection of women ethnic wear.';

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImage}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-lg">{description}</p>
        </div>
      </div>

      <div className="container-plt py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">{formattedProducts.length} products found</p>
        </div>
        <ProductGrid products={formattedProducts} columns={4} />
      </div>
    </div>
  );
}
