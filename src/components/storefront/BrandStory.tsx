import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="bg-[#120003] py-24 md:py-32 overflow-hidden relative border-t border-white/5">
      <div className="container-plt">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Images Grid */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-[4/5] w-[85%] rounded-[2rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1560507074-b9eb43faab00?w=800&auto=format&fit=crop&q=80" 
                alt="Artisan crafting embroidery"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating Image */}
            <div className="absolute -bottom-10 -right-4 w-1/2 aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-8 border-[#120003]">
              <Image 
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80" 
                alt="Intricate chikankari details"
                fill
                className="object-cover"
              />
            </div>
            {/* Abstract Shape */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold-200/40 rounded-full blur-3xl -z-10" />
          </div>

          {/* Text Content */}
          <div className="max-w-xl">
            <h4 className="text-gold-600 font-bold uppercase tracking-[0.2em] text-sm mb-4">Our Heritage</h4>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8">
              A Legacy of <br />
              <span className="italic font-light text-white/40">Craftsmanship.</span>
            </h2>
            
            <div className="space-y-6 text-white/65 font-light leading-relaxed text-lg">
              <p>
                Founded in the heart of Prayagraj, PLT Creation was born from a passion to preserve and elevate the centuries-old art of Chikankari and traditional Indian embroidery.
              </p>
              <p>
                We believe true luxury lies in the details. Every piece in our collection passes through the hands of master artisans, taking weeks—sometimes months—to complete. We use only the finest ethically sourced fabrics to ensure that each garment not only looks exquisite but feels like a second skin.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-white">150+</span>
                <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Master Artisans</span>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-white">100%</span>
                <span className="text-xs uppercase tracking-widest text-white/50 font-bold mt-1">Ethical Fabric</span>
              </div>
            </div>

            <div className="mt-12">
              <Link href="/about" className="group inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/40 pb-2 hover:text-brand-400 hover:border-brand-400 transition-colors">
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
