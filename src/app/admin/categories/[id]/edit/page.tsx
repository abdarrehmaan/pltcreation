import React from 'react';
import CategoryForm from '@/components/admin/CategoryForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock data
  const initialData = {
    id: id,
    name: 'Chikankari',
    slug: 'chikankari',
    description: 'Beautiful hand-embroidered chikankari from Lucknow.',
    isActive: true,
  };

  return (
    <div>
      <CategoryForm initialData={initialData} />
    </div>
  );
}
