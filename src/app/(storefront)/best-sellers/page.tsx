import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import { mockProducts } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Best Sellers',
  description: 'Shop PLT Creation\'s best-selling ethnic wear. Most loved products by our customers.',
};

export default function BestSellersPage() {
  const products = mockProducts.filter(p => p.isBestSeller);
  return (
    <div className="bg-white min-h-screen">
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F8B324 100%)' }}>
        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">⭐ Fan Favourites</p>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Best Sellers</h1>
        <p className="text-white/80">Our most loved ethnic pieces by 10,000+ customers</p>
      </div>
      <div className="container-plt py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">{products.length} best selling products</p>
          <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none">
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
        <ProductGrid products={products.length ? products : mockProducts} columns={4} />
      </div>
    </div>
  );
}
