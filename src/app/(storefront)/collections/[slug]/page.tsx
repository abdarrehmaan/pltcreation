import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const collections = await prisma.collection.findMany({
    select: { slug: true },
  });
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const collection = await prisma.collection.findUnique({
    where: { slug: decodedSlug },
  });
  if (!collection) return {};
  return {
    title: `${collection.name} Collection`,
    description: collection.description || 'Premium ethnic fashion collection',
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const collection = await prisma.collection.findUnique({
    where: { slug: decodedSlug },
    include: {
      products: {
        orderBy: {
          sortOrder: 'asc',
        },
        include: {
          product: {
            include: {
              images: true,
              category: { select: { name: true } },
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!collection) {
    return notFound();
  }

  // Filter out any inactive products
  const formattedProducts = collection.products
    .filter((cp) => cp.product.isActive)
    .map((cp) => {
      const p = cp.product;
      return {
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
      };
    });

  const bannerImage = collection.bannerImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80';
  const description = collection.description || 'Premium collection of women ethnic wear.';

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImage}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {collection.name}
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
