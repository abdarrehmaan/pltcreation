import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="bg-[#120003] py-20 md:py-28 overflow-hidden relative border-t border-white/5">
      <div className="container-plt">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Images Composition Container */}
          <div className="relative pb-10 pr-6 md:pr-10">
            {/* Main Image */}
            <div className="relative aspect-[4/5] w-[80%] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <Image 
                src="/banner-chikankari.jpg" 
                alt="Artisan Chikankari Craftsmanship"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
            </div>
            
            {/* Overlapping Secondary Image */}
            <div className="absolute bottom-0 right-0 w-[52%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 md:border-8 border-[#120003] z-10">
              <Image 
                src="/banner-stitched.jpg" 
                alt="Intricate chikankari details"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            
            {/* Subtle Gold Ambient Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>

          {/* Text Content */}
          <div className="max-w-xl">
            <h4 className="text-gold-400 font-bold uppercase tracking-[0.2em] text-sm mb-4">Our Heritage</h4>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8">
              A Legacy of <br />
              <span className="italic font-light text-white/40">Craftsmanship.</span>
            </h2>
            
            <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
              <p>
                Founded in the heart of Prayagraj, PLT Creation was born from a passion to preserve and elevate the centuries-old art of Chikankari and traditional Indian embroidery.
              </p>
              <p>
                We believe true luxury lies in the details. Every piece in our collection passes through the hands of master artisans, taking weeks—sometimes months—to complete. We use only the finest ethically sourced fabrics to ensure that each garment not only looks exquisite but feels like a second skin.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-8">
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-gold-400">150+</span>
                <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Master Artisans</span>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-gold-400">100%</span>
                <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Ethical Fabric</span>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/about" className="group inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gold-400 border-b-2 border-gold-400/40 pb-2 hover:text-gold-300 hover:border-gold-300 transition-colors">
                Discover Our Story 
                <span className="w-8 h-[1px] bg-current group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
