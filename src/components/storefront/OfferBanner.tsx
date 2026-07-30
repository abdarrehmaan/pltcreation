'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

export default function OfferBanner() {
  return (
    <section className="py-8 md:py-16 bg-transparent relative z-10">
      <div className="container-plt">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl bg-gray-950 group">
          {/* 16:9 Aspect Ratio Image Container — Fits 100% on Mobile & Laptop without cropping */}
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
            <Image
              src="/rakshabandhan-banner.png"
              alt="PLT Creation Rakshabandhan Collection — Beautiful Suits for Every Sister"
              fill
              className="object-contain md:object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
              priority
              unoptimized
            />

            {/* Subtle Gradient & Floating CTA for Laptop / Tablet */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4 sm:p-6 md:p-8">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="animate-pulse text-gold-400" />
                <span>Festive Edition • Rakshabandhan</span>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/collections/rakshabandhan-collection-outfits"
                  className="w-full sm:w-auto btn-gold text-xs md:text-sm px-6 md:px-8 py-3 md:py-3.5 uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-gold transition-all duration-300 hover:scale-105"
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Shop Rakhi Collection</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile CTA Bar below image so zero graphic content is blocked */}
          <div className="sm:hidden p-4 bg-gray-900/90 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                <Sparkles size={13} /> Rakshabandhan Collection
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Limited Festive Edition</span>
            </div>
            <Link
              href="/collections/rakshabandhan-collection-outfits"
              className="w-full btn-gold text-xs py-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-gold"
            >
              <Heart size={14} fill="currentColor" />
              <span>Shop Collection Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
