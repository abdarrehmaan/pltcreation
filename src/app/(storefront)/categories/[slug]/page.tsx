import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import SectionHeader from '@/components/storefront/SectionHeader';
import { mockProducts } from '@/lib/mock-data';

const categoryMeta: Record<string, { name: string; description: string; image: string }> = {
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

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryMeta[slug];
  if (!cat) return {};
  return {
    title: `${cat.name} Collection`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categoryMeta[slug];
  const products = mockProducts.filter(
    (p) => p.category?.name.toLowerCase().replace(/[\s-]+/g, '-') === slug ||
           p.category?.name.toLowerCase() === slug.replace(/-/g, ' ')
  );
  // fallback: show all if no match
  const displayProducts = products.length ? products : mockProducts;

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80'}
          alt={cat?.name || 'Category'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {cat?.name || 'Products'}
          </h1>
          {cat?.description && (
            <p className="text-white/80 text-sm md:text-base max-w-lg">{cat.description}</p>
          )}
        </div>
      </div>

      <div className="container-plt py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">{displayProducts.length} products found</p>
          <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-200">
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
          </select>
        </div>
        <ProductGrid products={displayProducts} columns={4} />
      </div>
    </div>
  );
}
