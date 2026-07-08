import React from 'react';
import CollectionForm from '@/components/admin/CollectionForm';
import { mockCollections } from '@/lib/mock-data';

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock finding the collection
  const collection = mockCollections.find(c => c.id === id) || mockCollections[0];
  
  // Format the data for the form
  const initialData = {
    ...collection,
    isActive: true, // Assuming it's active for mock
  };

  return (
    <div>
      <CollectionForm initialData={initialData} />
    </div>
  );
}
