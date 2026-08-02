import ProductGridSkeleton from '@/components/storefront/ProductGridSkeleton';

export default function GlobalStorefrontLoading() {
  return (
    <ProductGridSkeleton
      count={8}
      columns={4}
      title="PLT Creation"
      subtitle="Loading Ethnic Couture Collection..."
    />
  );
}
