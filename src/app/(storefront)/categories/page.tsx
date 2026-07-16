import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'All Categories | PLT Creation',
  description: 'Shop our wide range of ethnic couture including Chikankari, Kurtis, Co-ord Sets, and more.',
};

const defaultImages: Record<string, string> = {
  'chikankari': 'https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800',
  'coord-sets': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
  'kurtis': 'https://images.unsplash.com/photo-1610419993549-88af5ccb186b?auto=format&fit=crop&q=80&w=800',
  'stitched-suits': 'https://images.unsplash.com/photo-1590403328225-b44c0422c505?auto=format&fit=crop&q=80&w=800',
  'unstitched-suits': 'https://images.unsplash.com/photo-1579456381220-e4b788470a13?auto=format&fit=crop&q=80&w=800',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const dbCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Shop by Category</h1>
        <p className="text-white/70 max-w-xl mx-auto px-4">
          Discover our curated collections of authentic ethnic wear.
        </p>
      </div>

      <div className="container-plt py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dbCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative h-[300px] rounded-2xl overflow-hidden block"
            >
              <img
                src={cat.image || defaultImages[cat.slug] || 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=800'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="font-display text-2xl font-bold mb-1 group-hover:-translate-y-1 transition-transform">{cat.name}</h3>
                <p className="text-white/80 text-sm mb-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all">
                  {cat.description || 'Premium handcrafted apparel'}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-300">
                  Shop Now <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
