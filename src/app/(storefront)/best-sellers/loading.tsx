import ProductGridSkeleton from '@/components/storefront/ProductGridSkeleton';

export default function BestSellersLoading() {
  return (
    <ProductGridSkeleton
      count={8}
      columns={4}
      title="Best Sellers"
      subtitle="Loading top rated customer favorites..."
    />
  );
}
