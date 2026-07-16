'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star, Flame } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useWishlistStore } from '@/features/wishlist/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images?: { url: string; alt?: string }[];
  category?: { name: string };
  variants?: { size: string; color: string; colorHex?: string; stock: number }[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  totalStock?: number;
  avgRating?: number;
  _count?: { reviews: number };
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageIdx, setImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const images = product.images || [];
  const mainImage = images[imageIdx]?.url || `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80`;
  const hoverImage = images[1]?.url || mainImage;
  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: mainImage,
      },
      undefined,
      1
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: mainImage,
      category: product.category?.name,
    });
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <div 
      className="group flex flex-col relative transition-all duration-500 ease-apple hover:-translate-y-1"
      onMouseEnter={() => {
        setIsHovered(true);
        if (images[1]) setImageIdx(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIdx(0);
      }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-brand transition-all duration-500 ease-apple">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={mainImage}
            alt={images[imageIdx]?.alt || product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              isHovered ? "scale-105" : "scale-100"
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-md">
              {discount}% OFF
            </span>
          )}
          {product.isTrending && (
             <span className="bg-gradient-gold text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
               <Flame size={10} /> Trending
             </span>
          )}
          {product.isNewArrival && !product.isTrending && (
            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-md shadow-sm border border-white/50 transition-all duration-300 z-10 hover:scale-110 hover:bg-white',
            wishlisted && 'bg-white'
          )}
          onClick={handleWishlist}
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={cn(
              'transition-colors',
              wishlisted ? 'fill-brand-600 stroke-brand-600' : 'stroke-gray-600'
            )}
          />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className={cn(
          "absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-400 ease-apple z-10",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
           <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase font-bold tracking-widest text-white bg-gray-900/90 hover:bg-black backdrop-blur-md shadow-lg transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={14} /> Add
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-11 flex items-center justify-center py-3 rounded-xl text-gray-900 bg-white/90 hover:bg-white backdrop-blur-md shadow-lg transition-colors"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col px-1">
        {/* Rating & Stock */}
        <div className="flex items-center justify-between mb-1.5">
          {product.avgRating ? (
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <Star size={10} className="fill-gold-500 stroke-gold-500" />
              <span>{product.avgRating.toFixed(1)}</span>
            </div>
          ) : <div />}
          
          {(product.totalStock !== undefined && product.totalStock <= 5 && product.totalStock > 0) && (
            <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
              Only {product.totalStock} left
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-lg font-semibold text-gray-900 hover:text-brand-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          {product.category?.name || 'Couture'}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-gray-900 text-base">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through decoration-gray-300">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
