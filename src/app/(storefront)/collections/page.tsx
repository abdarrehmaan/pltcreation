import type { Metadata } from 'next';
import CollectionsBanner from '@/components/storefront/CollectionsBanner';
import { mockCollections } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore PLT Creation\'s curated seasonal collections — Eid, Wedding Season, Monsoon and more.',
};

export default function CollectionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Collections</h1>
        <p className="text-white/70">Thoughtfully curated themes for every season and celebration</p>
      </div>
      <div className="py-12">
        <CollectionsBanner collections={mockCollections} />
      </div>
    </div>
  );
}
