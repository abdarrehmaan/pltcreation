'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Chikankari',
    slug: 'chikankari',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    count: '120+ Styles',
    color: 'from-rose-900 to-rose-700',
  },
  {
    name: 'Co-ord Sets',
    slug: 'coord-sets',
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80',
    count: '85+ Styles',
    color: 'from-purple-900 to-purple-700',
  },
  {
    name: 'Kurtis',
    slug: 'kurtis',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    count: '200+ Styles',
    color: 'from-brand-900 to-brand-700',
  },
  {
    name: 'Stitched Suits',
    slug: 'stitched-suits',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
    count: '95+ Styles',
    color: 'from-amber-900 to-amber-700',
  },
  {
    name: 'Unstitched Suits',
    slug: 'unstitched-suits',
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&auto=format&fit=crop&q=80',
    count: '60+ Fabrics',
    color: 'from-teal-900 to-teal-700',
  },
  {
    name: 'Sale',
    slug: 'sale',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    count: 'Up to 50% Off',
    color: 'from-red-900 to-red-700',
    isSale: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function FeaturedCategories() {
  return (
    <section id="featured-categories" className="section-padding bg-transparent">
      <div className="container-plt">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <div className="section-tag">Shop by Category</div>
          <h2 className="section-title">Curated Collections</h2>
          <p className="section-subtitle">
            From handcrafted Chikankari to modern Co-ord Sets — find your perfect ethnic style.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={itemVariants}>
              <Link
                href={`/categories/${cat.slug}`}
                id={`category-${cat.slug}`}
                className="category-card block"
                style={{ aspectRatio: '4/5' }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                />

                {cat.isSale && (
                  <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    Sale
                  </div>
                )}

                <div className="category-card-content">
                  <h3 className="font-display text-base font-bold text-white leading-tight mb-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/75">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link href="/categories" className="btn-secondary">
            Browse All Categories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
