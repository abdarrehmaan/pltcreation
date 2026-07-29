import type { Metadata } from 'next';
import HeroBanner from '@/components/storefront/HeroBanner';
import FeaturedCategories from '@/components/storefront/FeaturedCategories';
import ProductGrid from '@/components/storefront/ProductGrid';

export const dynamic = 'force-dynamic';
import SectionHeader from '@/components/storefront/SectionHeader';
import PremiumTrust from '@/components/storefront/PremiumTrust';
import BrandStory from '@/components/storefront/BrandStory';
import { ReviewCard } from '@/components/storefront/ReviewCard';
import { mockReviews } from '@/lib/mock-data';
import CollectionsBanner from '@/components/storefront/CollectionsBanner';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'PLT Creation — Premium Women\'s Ethnic Wear | Chikankari, Kurtis & More',
  description:
    'Discover PLT Creation\'s exquisite collection of Chikankari, Kurtis, Co-ord Sets, Stitched & Unstitched Suits. Free shipping above ₹1499. No exchange & no return policy.',
};

export default async function HomePage() {
  let formattedProducts: any[] = [];
  let collections: any[] = [];
  let categories: any[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    formattedProducts = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || undefined,
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
  } catch (error) {
    console.warn('HomePage products query warning:', error);
  }

  try {
    const collectionsDb = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    collections = collectionsDb.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      bannerImage: c.bannerImage || 'https://picsum.photos/seed/collection/1200/800',
    }));
  } catch (error) {
    console.warn('HomePage collections query warning:', error);
  }

  try {
    const categoriesDb = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const localCategoryImages: Record<string, string> = {
      chikankari: '/banner-chikankari.jpg',
      'coord-sets': '/banner-coord.png',
      dresses: '/banner-dresses.jpg',
      kurtis: '/banner-kurti.jpg',
      'stitched-suits': '/banner-stitched.jpg',
      'unstitched-suits': '/banner-unstitched.jpg',
    };

    categories = categoriesDb.map((c) => ({
      name: c.name,
      slug: c.slug,
      image: c.image || localCategoryImages[c.slug] || '/banner-dresses.jpg',
      count: `${c._count.products} Styles`,
    }));
  } catch (error) {
    console.warn('HomePage categories query warning:', error);
  }

  const featuredAllProducts = formattedProducts.slice(0, 8);
  const newArrivals = formattedProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const trending = formattedProducts.filter((p) => p.isTrending).slice(0, 4);
  const bestSellers = formattedProducts.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <HeroBanner />

      {/* All Products Section (Featured Preview) */}
      <section id="all-products" className="py-12 md:py-20 bg-transparent relative border-b border-white/10">
        <div className="container-plt">
          <SectionHeader
            tag="Featured Showcase"
            title="All Products"
            subtitle="Explore a selection of our handcrafted luxury ethnic wear."
            viewAllHref="/all-products"
            viewAllLabel="View Entire Catalog"
          />
          <ProductGrid products={featuredAllProducts} columns={4} />
          
          <div className="mt-10 text-center">
            <a
              href="/all-products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-gray-900 font-semibold text-sm shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              Explore All Products ({formattedProducts.length}) →
            </a>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <BrandStory />

      {/* New Arrivals (Editorial Layout) */}
      <section id="new-arrivals" className="py-12 md:py-24 bg-transparent relative">
        <div className="container-plt">
          <SectionHeader
            tag="Latest Drop"
            title="New Arrivals"
            subtitle="The newest silhouettes crafted for the modern muse."
            viewAllHref="/new-arrivals"
            viewAllLabel="Shop New Arrivals"
          />
          <ProductGrid products={newArrivals} columns={4} />
        </div>
      </section>

      {/* Collections Lookbook */}
      <CollectionsBanner collections={collections} />

      {/* Featured Categories */}
      <FeaturedCategories categories={categories} />

      {/* Trending & Best Sellers */}
      <section id="trending" className="py-12 md:py-24 bg-transparent border-t border-white/10">
        <div className="container-plt">
          <SectionHeader
            tag="Curated For You"
            title="Trending Now"
            subtitle="Pieces our community is loving right now."
            viewAllHref="/products?sort=trending"
          />
          <ProductGrid products={trending} columns={4} />
          
          <div className="mt-24">
            <SectionHeader
              tag="The Classics"
              title="Best Sellers"
              subtitle="Timeless designs that deserve a spot in your wardrobe."
              viewAllHref="/best-sellers"
            />
            <ProductGrid products={bestSellers} columns={4} />
          </div>
        </div>
      </section>

      {/* Reviews Gallery */}
      <section id="reviews" className="py-12 md:py-24 bg-transparent">
        <div className="container-plt">
          <SectionHeader
            tag="Social Proof"
            title="PLT Creation Muses"
            subtitle="Real stories from our beloved community."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-100">
            {[
              { value: '600+', label: 'Happy Customers' },
              { value: '4.8/5', label: 'Average Rating' },
              { value: '20+', label: 'Master Artisans' },
              { value: '100%', label: 'Ethical Sourcing' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center group">
                <p className="font-display text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-500 ease-apple">{value}</p>
                <p className="text-xs uppercase tracking-widest text-white/60 font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <PremiumTrust />
    </>
  );
}
