'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Zap, Star, ChevronLeft, ChevronRight, Minus, Plus, Shield, Truck, RotateCcw, Share2, X } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useWishlistStore } from '@/features/wishlist/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductGrid from '@/components/storefront/ProductGrid';
import SectionHeader from '@/components/storefront/SectionHeader';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Variant {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  description?: string;
  totalStock: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  avgRating?: number;
  category?: { name: string; slug?: string };
  images?: { url: string; alt?: string; color?: string | null }[];
  variants?: Variant[];
  _count?: { reviews: number };
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  // Find first variant that is in stock, or fallback to the first variant
  const initialVariant = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(initialVariant?.size || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(initialVariant?.color || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'fabric' | 'reviews'>('description');

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;
  
  const sizes = [...new Set((product.variants || []).map((v) => v.size))];
  const colors = [...new Set((product.variants || []).map((v) => v.color))];

  // Filter images based on selected color
  const filteredImages = React.useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return [{ url: `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80`, alt: product.name }];
    }
    
    if (selectedColor) {
      const colorImages = product.images.filter(
        (img: any) => img.color && img.color.toLowerCase() === selectedColor.toLowerCase()
      );
      if (colorImages.length > 0) {
        // Show color-specific images first, then common images (images with no color assigned)
        const commonImages = product.images.filter((img: any) => !img.color);
        return [...colorImages, ...commonImages];
      }
    }
    
    return product.images;
  }, [product.images, selectedColor, product.name]);

  const images = filteredImages;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIdx, setLightboxImageIdx] = useState(0);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // minimum pixels to count as swipe

    if (diff > swipeThreshold) {
      // Swiped left -> next image
      setLightboxImageIdx((prev) => (prev + 1) % images.length);
    } else if (diff < -swipeThreshold) {
      // Swiped right -> previous image
      setLightboxImageIdx((prev) => (prev - 1 + images.length) % images.length);
    }

    // Reset touch variables
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Selected variant must match both selected size and color exactly
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedImage(0); // Reset main image to the first image of the new color
    
    // Check if there is a variant with the new color and the current size
    const exists = product.variants?.some((v) => v.color === color && v.size === selectedSize);
    if (!exists) {
      // Select the first size available for the new color (preferring in stock)
      const firstAvailable = product.variants?.find((v) => v.color === color && v.stock > 0) || product.variants?.find((v) => v.color === color);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    
    // Check if there is a variant with the new size and the current color
    const exists = product.variants?.some((v) => v.size === size && v.color === selectedColor);
    if (!exists) {
      // Select the first color available for the new size (preferring in stock)
      const firstAvailable = product.variants?.find((v) => v.size === size && v.stock > 0) || product.variants?.find((v) => v.size === size);
      if (firstAvailable) {
        setSelectedColor(firstAvailable.color);
      }
    }
  };

  const stockAvailable = selectedVariant ? selectedVariant.stock : product.totalStock;
  const canAddToCart = stockAvailable > 0;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: images[0]?.url || product.images?.[0]?.url || `https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80`,
      },
      selectedVariant ? {
        id: selectedVariant.id,
        size: selectedVariant.size,
        color: selectedVariant.color,
        colorHex: selectedVariant.colorHex,
        stock: selectedVariant.stock,
      } : undefined,
      quantity
    );
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container-plt py-4">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} className="text-gray-300" />
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug || product.category.name.toLowerCase()}`}>
                {product.category.name}
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Product section */}
      <div className="container-plt pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                    i === selectedImage ? 'border-brand-600' : 'border-transparent hover:border-gray-300'
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div 
              onClick={() => {
                setLightboxImageIdx(selectedImage);
                setIsLightboxOpen(true);
              }}
              className="relative flex-1 rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group" 
              style={{ aspectRatio: '3/4' }}
            >
              <Image
                src={images[selectedImage]?.url || images[0].url}
                alt={images[selectedImage]?.alt || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-102"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <div className="badge-discount">{discount}% OFF</div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <Link
                href={`/categories/${product.category.slug || 'all'}`}
                className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-2 hover:text-brand-800"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.avgRating && product._count?.reviews ? (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={s <= Math.round(product.avgRating!) ? 'fill-amber-400 stroke-amber-400' : 'fill-gray-200 stroke-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{product.avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product._count.reviews} reviews)</span>
                <button className="text-sm text-brand-600 hover:underline ml-1">Write a Review</button>
              </div>
            ) : null}

            {/* Price */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl md:text-3xl font-bold text-brand-800">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #6B2D4F, #C4748A)' }}>
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">SKU: {product.sku}</p>

            {/* Prepaid offer */}
            <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <Shield size={14} className="text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">
                Get extra 5% OFF on prepaid orders · 100% Secure Payment Protection
              </p>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900">Color:</p>
                  {selectedColor && <p className="text-sm text-gray-500">{selectedColor}</p>}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => {
                    const variant = product.variants?.find((v) => v.color === color);
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 hover:scale-110',
                          selectedColor === color ? 'border-brand-600 scale-110 shadow-brand' : 'border-transparent'
                        )}
                        style={{ backgroundColor: variant?.colorHex || '#ccc' }}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">Size:</p>
                  <button className="text-xs text-brand-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => {
                    const variantForSize = product.variants?.find(
                      (v) => v.size === size && v.color === selectedColor
                    );
                    const isOutOfStockForSelectedColor = variantForSize ? variantForSize.stock === 0 : true;
                    const isCompletelyOutOfStock = !product.variants?.some((v) => v.size === size && v.stock > 0);

                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        disabled={isCompletelyOutOfStock}
                        className={cn(
                          'min-w-[2.75rem] h-10 px-3 rounded-xl text-sm font-semibold border-2 transition-all',
                          isCompletelyOutOfStock
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through'
                            : isOutOfStockForSelectedColor
                            ? 'border-gray-250 text-gray-400 bg-gray-50/50 line-through hover:border-brand-300'
                            : selectedSize === size
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-gray-200 text-gray-700 hover:border-brand-300'
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock */}
            <p className={cn(
              'text-sm font-semibold mb-4',
              stockAvailable === 0 ? 'text-red-500' :
              stockAvailable <= 5 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {stockAvailable === 0 ? '✗ Out of Stock' :
               stockAvailable <= 5 ? `⚡ Only ${stockAvailable} left!` : '✓ In Stock'}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <p className="text-sm font-semibold text-gray-900 w-20">Quantity:</p>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
                  onClick={() => setQuantity(Math.min(stockAvailable, quantity + 1))}
                  disabled={quantity >= stockAvailable}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="btn-secondary flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <Link
                href="/checkout"
                id="buy-now-btn"
                className="btn-primary flex items-center justify-center gap-2 py-3.5"
                onClick={handleAddToCart}
              >
                <Zap size={18} />
                Buy Now
              </Link>
            </div>

            <div className="flex gap-3">
              <button
                id={`wishlist-detail-${product.id}`}
                onClick={() => {
                  toggleItem({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    comparePrice: product.comparePrice,
                    image: images[0].url,
                  });
                  toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
                }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                  wishlisted ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'
                )}
              >
                <Heart size={16} className={wishlisted ? 'fill-brand-600 stroke-brand-600' : ''} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
                aria-label="Share product"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={16} className="text-brand-500 flex-shrink-0" />
                <span>Free delivery on orders above ₹1499 · Estimated 3-5 business days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={16} className="text-brand-500 flex-shrink-0" />
                <span>Easy returns within 48 hours of delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200 mb-8">
            {(['description', 'fabric', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-all',
                  activeTab === tab
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab === 'description' ? 'Description' : tab === 'fabric' ? 'Fabric & Care' : 'Reviews'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <>
                  <p>This exquisite piece from PLT Creation's premium collection showcases the finest craftsmanship and attention to detail. Made with carefully selected fabrics and embellishments, it's designed to make you feel confident and beautiful for every occasion.</p>
                  <ul className="mt-4 space-y-2">
                    <li>✓ Premium quality fabric with excellent finish</li>
                    <li>✓ Carefully crafted embroidery/detailing</li>
                    <li>✓ Comfortable fit for all-day wear</li>
                    <li>✓ Suitable for festive, casual, and party occasions</li>
                    <li>✓ Includes matching dupatta/accessories as shown</li>
                  </ul>
                </>
              )}
            </div>
          )}

          {activeTab === 'fabric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fabric Details</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Material</span>
                    <span className="font-medium text-gray-900">Premium Cotton / Georgette</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Weight</span>
                    <span className="font-medium text-gray-900">Medium Weight</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Transparency</span>
                    <span className="font-medium text-gray-900">Non-transparent</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Stretch</span>
                    <span className="font-medium text-gray-900">Slight stretch</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Care Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2"><span>🧺</span> Hand wash or gentle machine wash in cold water</li>
                  <li className="flex items-start gap-2"><span>🚫</span> Do not bleach or use harsh detergents</li>
                  <li className="flex items-start gap-2"><span>🌡️</span> Iron on medium heat, inside out</li>
                  <li className="flex items-start gap-2"><span>🪣</span> Do not tumble dry; lay flat to dry</li>
                  <li className="flex items-start gap-2"><span>🏪</span> Dry clean recommended for embroidered pieces</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center gap-6 mb-8 p-6 bg-ivory-100 rounded-2xl">
                <div className="text-center">
                  <p className="font-display text-5xl font-bold text-brand-700">{product.avgRating?.toFixed(1) || '—'}</p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={16} className={s <= Math.round(product.avgRating || 0) ? 'fill-amber-400 stroke-amber-400' : 'fill-gray-200 stroke-gray-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{product._count?.reviews || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs w-4 text-gray-600">{star}</span>
                      <Star size={10} className="fill-amber-400 stroke-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : '2%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center py-8">Be the first to review this product!</p>

              <button id="write-review-btn" className="btn-primary mx-auto block">
                Write a Review
              </button>
            </div>
          )}
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <SectionHeader
              tag="You May Also Like"
              title="Related Products"
              align="left"
              viewAllHref={`/categories/${product.category?.slug || 'all'}`}
              viewAllLabel="View All"
            />
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 sm:p-6 no-print"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <div className="flex justify-end w-full">
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close viewer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center relative w-full select-none">
            {/* Left Nav */}
            {images.length > 1 && (
              <button 
                onClick={() => setLightboxImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 sm:left-4 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            {/* Image display */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-full max-h-[80vh] flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={images[lightboxImageIdx]?.url} 
                alt={images[lightboxImageIdx]?.alt || product.name} 
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-305 select-none pointer-events-none"
              />
            </div>

            {/* Right Nav */}
            {images.length > 1 && (
              <button 
                onClick={() => setLightboxImageIdx((prev) => (prev + 1) % images.length)}
                className="absolute right-2 sm:right-4 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white/10"
                aria-label="Next image"
              >
                <ChevronRight size={36} />
              </button>
            )}
          </div>

          {/* Bottom indicators */}
          <div className="py-4 text-center text-white/80 text-sm font-medium">
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mb-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImageIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === lightboxImageIdx ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
            <p>
              Image {lightboxImageIdx + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
