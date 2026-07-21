'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/banner1.jpg',
    tag: 'New Season Collection',
    title: 'Elegance Redefined',
    subtitle: 'Discover PLT Creation\'s signature collection — where timeless craftsmanship meets modern grace.',
    cta: 'Shop New Arrivals',
    ctaHref: '/new-arrivals',
    align: 'left',
  },
  {
    id: 2,
    image: '/banner2.png',
    tag: 'Festive Collection',
    title: 'Stunning Co-ord Sets For Every Occasion',
    subtitle: 'Modern ethnic fusion — effortlessly chic co-ord sets that turn every moment into a celebration.',
    cta: 'Explore Collections',
    ctaHref: '/collections',
    align: 'right',
  },
  {
    id: 3,
    image: '/banner3.png',
    tag: 'Everyday Luxury',
    title: 'Premium Kurtis & Suits',
    subtitle: 'From casual days to festive nights — discover the perfect ethnic piece for every you.',
    cta: 'Shop Now',
    ctaHref: '/products',
    align: 'right',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLElement>(null);

  // Parallax for the images
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      id="hero-banner"
      ref={containerRef}
      className="relative w-full md:min-h-screen overflow-hidden bg-gray-950 flex flex-col md:flex-row md:items-center pt-16 md:pt-20"
      aria-label="Hero banner"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Immersive Background Images with Parallax */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:absolute md:inset-[-5%] md:w-auto md:h-auto z-0 shrink-0 overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0 md:inset-[-5%]"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ x: parallaxX, y: parallaxY }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              unoptimized={slide.image.startsWith('/')}
            />
            {/* Gradient Overlays for Readability and Luxury feel */}
            <div className={`absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent md:bg-gradient-to-${slide.align === 'left' ? 'r' : 'l'} md:from-gray-900/90 md:via-gray-900/50 md:to-transparent z-10`} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-900/40 z-10 hidden md:block" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className={`relative z-20 container-plt w-full pt-6 pb-20 md:py-20 flex ${slide.align === 'left' ? 'justify-start' : 'justify-end'} bg-gray-950 md:bg-transparent`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`max-w-2xl ${slide.align === 'left' ? 'text-left md:text-left' : 'text-left md:text-right'} w-full`}
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 sm:mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em]"
            >
              <Sparkles size={12} className="text-brand-400" />
              {slide.tag}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.2] sm:leading-[1.05] mb-3 sm:mb-6 tracking-tight drop-shadow-2xl"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-gray-300 text-xs sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-10 max-w-lg ${slide.align === 'left' ? 'mr-auto' : 'md:ml-auto'} font-light drop-shadow-md`}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-5 items-center ${slide.align === 'left' ? 'justify-start' : 'md:justify-end'}`}
            >
              <Link
                href={slide.ctaHref}
                id={`hero-cta-${slide.id}`}
                className="w-full sm:w-auto text-center btn-gold text-xs sm:text-sm md:text-base px-6 py-3 sm:px-10 sm:py-4 uppercase tracking-widest font-bold"
              >
                {slide.cta}
              </Link>
              <Link
                href="/collections"
                className="w-full sm:w-auto text-center btn-ghost text-white border border-white/30 hover:bg-white hover:text-gray-900 text-xs sm:text-sm md:text-base px-6 py-3 sm:px-10 sm:py-4 uppercase tracking-widest font-bold backdrop-blur-sm"
              >
                Explore Collections
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`mt-8 sm:mt-12 flex items-center gap-4 border-t border-white/20 pt-6 max-w-md ${slide.align === 'left' ? 'mr-auto' : 'md:ml-auto'}`}
            >
               <div className="flex -space-x-2">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="w-8 h-8 rounded-full border border-gray-900 bg-gray-200 overflow-hidden shrink-0">
                     <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               <div className="flex flex-col text-left">
                 <div className="flex items-center gap-1 text-gold-400">
                   {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                 </div>
                 <span className="text-white text-xs font-semibold mt-0.5">Trusted by 10,000+ women</span>
               </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls & Pagination Overlay */}
      <div className="absolute w-full px-6 flex justify-between bottom-6 md:w-auto md:px-0 md:bottom-10 md:right-10 z-30 md:flex md:items-center gap-8">
        {/* Dots */}
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-500 rounded-full ${
                i === current ? 'w-10 h-1.5 bg-white' : 'w-2 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        
        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all flex items-center justify-center border border-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all flex items-center justify-center border border-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
