import React from 'react';
import ProductCard from './ProductCard';

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
  isFeatured?: boolean;
  totalStock?: number;
  avgRating?: number;
  _count?: { reviews: number };
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export default function ProductGrid({ products, columns = 4, className = '' }: ProductGridProps) {
  return (
    <div className={`grid ${colClasses[columns]} gap-4 md:gap-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
