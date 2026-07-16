import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, ArrowRight } from 'lucide-react';

export default function OfferBanner() {
  return (
    <section className="py-10 bg-[#0e0002]">
      <div className="container-plt">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Offer 1 */}
          <Link
            href="/categories/chikankari"
            id="offer-chikankari"
            className="relative rounded-3xl overflow-hidden group block"
            style={{ minHeight: '240px' }}
          >
            <Image
              src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=900&auto=format&fit=crop&q=80"
              alt="Chikankari Collection Offer"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-brand-700/40" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-gold-300" />
                <span className="text-gold-300 text-xs font-bold uppercase tracking-wider">Limited Time Offer</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                Up to 40% Off<br />Chikankari
              </h3>
              <p className="text-white/75 text-sm mb-4">Handcrafted elegance at unbeatable prices</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 group-hover:gap-3 transition-all">
                Shop Now <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Offer 2 */}
          <div className="grid grid-rows-2 gap-5">
            <Link
              href="/new-arrivals"
              id="offer-new-arrivals"
              className="relative rounded-3xl overflow-hidden group block"
            >
              <Image
                src="https://images.unsplash.com/photo-1561414927-6d86591d0c4f?w=900&auto=format&fit=crop&q=80"
                alt="New Arrivals"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-700/40" />
              <div className="absolute inset-0 flex flex-col justify-center p-6">
                <span className="text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">🆕 Just Arrived</span>
                <h3 className="font-display text-xl font-bold text-white mb-1">New Co-ord Sets</h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Explore <ArrowRight size={13} />
                </span>
              </div>
            </Link>

            <Link
              href="/categories/sale"
              id="offer-sale"
              className="relative rounded-3xl overflow-hidden group block"
            >
              <Image
                src="https://images.unsplash.com/photo-1583391265517-35bbdad01209?w=900&auto=format&fit=crop&q=80"
                alt="Sale Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/40" />
              <div className="absolute inset-0 flex flex-col justify-center p-6">
                <span className="text-red-200 text-xs font-bold uppercase tracking-wider mb-2">🔥 Hot Sale</span>
                <h3 className="font-display text-xl font-bold text-white mb-1">Sale Collection — Up to 50% Off</h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  Grab Deals <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
