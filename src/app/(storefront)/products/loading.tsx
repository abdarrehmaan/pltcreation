import ProductGridSkeleton from '@/components/storefront/ProductGridSkeleton';

export default function ProductsLoading() {
  return (
    <ProductGridSkeleton
      count={8}
      columns={4}
      title="All Products"
      subtitle="Loading complete collection of ethnic couture..."
    />
  );
}
