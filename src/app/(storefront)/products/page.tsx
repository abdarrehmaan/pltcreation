import type { Metadata } from 'next';
import ProductGrid from '@/components/storefront/ProductGrid';
import { prisma } from '@/lib/prisma';
import { SlidersHorizontal, Search } from 'lucide-react';
import Link from 'next/link';

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
  const search = resolvedSearchParams.search;
  const sort = resolvedSearchParams.sort || 'newest';
  const page = Number(resolvedSearchParams.page) || 1;
  const pageSize = 8;

  const where: any = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'popular') {
    orderBy = { isBestSeller: 'desc' };
  } else if (sort === 'rating') {
    orderBy = { isFeatured: 'desc' };
  }

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / pageSize) || 1;
  const skip = (page - 1) * pageSize;

  const dbProducts = await prisma.product.findMany({
    where,
    orderBy,
    take: pageSize,
    skip,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    totalStock: p.totalStock,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    isTrending: p.isTrending,
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
          {totalProducts} exquisite ethnic pieces
        </p>
      </div>

      <div className="container-plt py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <form method="GET" action="/products" className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={search || ''}
              className="input-base pl-9 py-2 text-sm"
            />
            {resolvedSearchParams.sort && (
              <input type="hidden" name="sort" value={resolvedSearchParams.sort} />
            )}
          </form>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <select
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
              defaultValue={sort}
              {...{
                onchange: "const url = new URL(window.location.href); url.searchParams.set('sort', this.value); url.searchParams.delete('page'); window.location.href = url.pathname + url.search;"
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
            <Link href="/products" className="btn-primary inline-block">
              Clear Filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const url = `/products?page=${pageNum}${sort ? `&sort=${sort}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
              return (
                <Link
                  key={pageNum}
                  href={url}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center ${
                    pageNum === page
                      ? 'bg-brand-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

