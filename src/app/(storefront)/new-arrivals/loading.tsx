import ProductGridSkeleton from '@/components/storefront/ProductGridSkeleton';

export default function NewArrivalsLoading() {
  return (
    <ProductGridSkeleton
      count={8}
      columns={4}
      title="New Arrivals"
      subtitle="Loading latest ethnic couture additions..."
    />
  );
}
