import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { mockProducts } from '@/lib/mock-data';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock finding the product
  const product = mockProducts.find(p => p.id === id) || mockProducts[0];
  
  // Format the data for the form
  const initialData = {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
    categoryId: 'cat_1', // Mock category id since our mock data only has name
  };

  return (
    <div>
      <ProductForm initialData={initialData} />
    </div>
  );
}
