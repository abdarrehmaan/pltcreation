import React from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return notFound();
  }

  const initialData = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    isActive: category.isActive,
  };

  return (
    <div>
      <CategoryForm initialData={initialData} />
    </div>
  );
}
