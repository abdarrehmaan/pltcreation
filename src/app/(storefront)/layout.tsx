import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import LuxuryEffects from '@/components/ui/LuxuryEffects';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LuxuryEffects />
      <Header />
      <main className="min-h-screen relative z-0 storefront-main">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
