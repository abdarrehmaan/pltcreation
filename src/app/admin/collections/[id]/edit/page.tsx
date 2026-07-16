import React from 'react';
import CollectionForm from '@/components/admin/CollectionForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id },
  });
  
  if (!collection) {
    return notFound();
  }

  // Format the data for the form
  const initialData = {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description || '',
    isActive: collection.isActive,
    bannerImage: collection.bannerImage || '',
  };

  return (
    <div>
      <CollectionForm initialData={initialData} />
    </div>
  );
}

