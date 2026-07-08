import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import SectionHeader from '@/components/storefront/SectionHeader';
import { mockProducts } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Shop the latest new arrivals in women\'s ethnic wear at PLT Creation. Fresh Chikankari, Kurtis, Co-ord Sets and more.',
};

export default function NewArrivalsPage() {
  const products = mockProducts.filter(p => p.isNewArrival);
  return (
    <div className="bg-white min-h-screen">
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <p className="text-gold-300 text-xs font-bold uppercase tracking-widest mb-2">✨ Fresh Picks</p>
        <h1 className="font-display text-4xl font-bold text-white mb-2">New Arrivals</h1>
        <p className="text-white/70">The latest additions to our ethnic collection</p>
      </div>
      <div className="container-plt py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">{products.length} new styles</p>
          <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none">
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        <ProductGrid products={products.length ? products : mockProducts} columns={4} />
      </div>
    </div>
  );
}
