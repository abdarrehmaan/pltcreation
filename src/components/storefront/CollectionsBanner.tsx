import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
}

export default function CollectionsBanner({ collections }: { collections: Collection[] }) {
  // Take up to 3 collections for the editorial layout
  const displayCols = collections.slice(0, 3);

  return (
    <section id="collections" className="section-padding bg-ivory-50 relative overflow-hidden">
      <div className="container-plt relative z-10">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <Sparkles size={14} /> Lookbook
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1]">
              The Edit: <br />
              <span className="text-gray-400 italic font-light">Curated Collections</span>
            </h2>
          </div>
          <Link href="/collections" className="group flex items-center gap-2 text-sm uppercase font-bold tracking-widest text-brand-700 hover:text-brand-900 transition-colors pb-2 border-b-2 border-brand-200 hover:border-brand-700">
            View All Collections <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 h-auto md:h-[600px] lg:h-[700px]">
          {displayCols.map((col, i) => {
            const isFeatured = i === 0; // First item is larger
            return (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                id={`collection-${col.slug}`}
                className={cn(
                  "relative rounded-2xl md:rounded-[2rem] overflow-hidden group block",
                  isFeatured ? "md:col-span-7 lg:col-span-8 h-[400px] md:h-full" : "md:col-span-5 lg:col-span-4 h-[300px] md:h-full"
                )}
              >
                <Image
                  src={col.bannerImage || `https://picsum.photos/seed/${col.id}/800/800`}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className={cn(
                  "absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-12 transition-all duration-500 ease-apple translate-y-4 group-hover:translate-y-0",
                )}>
                  <div className="overflow-hidden mb-2">
                    <h3 className={cn(
                      "font-display font-bold text-white leading-tight",
                      isFeatured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                    )}>
                      {col.name}
                    </h3>
                  </div>
                  
                  {col.description && (
                    <div className="overflow-hidden">
                      <p className={cn(
                        "text-gray-200 font-light max-w-md transition-all duration-500 ease-apple opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0",
                        isFeatured ? "text-base md:text-lg mb-6" : "text-sm mb-4"
                      )}>
                        {col.description}
                      </p>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-white bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
