import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import LuxuryEffects from '@/components/ui/LuxuryEffects';
import { prisma } from '@/lib/prisma';

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbFeatured = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 3,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  const featuredProducts = dbFeatured.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    images: p.images.map((img) => ({ url: img.url, alt: img.alt || '' })),
  }));

  return (
    <>
      <LuxuryEffects />
      <Header featuredProducts={featuredProducts} />
      <main className="min-h-screen relative z-0 storefront-main">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

