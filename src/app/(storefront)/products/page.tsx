import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import { mockProducts } from '@/lib/mock-data';
import { SlidersHorizontal, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of premium women\'s ethnic wear — Chikankari, Kurtis, Co-ord Sets, Suits and more.',
};

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; search?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const products = mockProducts;

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div
        className="py-12 text-center"
        style={{
          background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)',
        }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">All Products</h1>
        <p className="text-white/80 text-sm">
          {products.length} exquisite ethnic pieces
        </p>
      </div>

      <div className="container-plt py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={resolvedSearchParams.search || ''}
              className="input-base pl-9 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <select
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
              defaultValue={resolvedSearchParams.sort || 'newest'}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <ProductGrid products={products} columns={4} />

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                page === 1
                  ? 'bg-brand-600 text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
