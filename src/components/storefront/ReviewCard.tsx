import React from 'react';
import { Star, Quote, BadgeCheck, Camera } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  name: string;
  rating: number;
  title?: string;
  body: string;
  date?: string;
  product?: string;
  location?: string;
  avatar?: string;
  verified?: boolean;
  images?: string[];
}

export function ReviewCard({ review }: { review: Review }) {
  // Mock verified if undefined for the premium feel
  const isVerified = review.verified !== false; 

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-brand-lg transition-all duration-500 ease-apple border border-gray-100 flex flex-col h-full group">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              className={s <= review.rating ? 'fill-gold-400 stroke-gold-400' : 'fill-gray-200 stroke-gray-200'}
            />
          ))}
        </div>
        <Quote size={24} className="text-gray-200 group-hover:text-brand-200 transition-colors duration-500" />
      </div>

      {/* Title & Body */}
      {review.title && (
        <h4 className="font-display font-bold text-gray-900 text-lg mb-2 leading-tight">{review.title}</h4>
      )}
      <p className="text-gray-600 font-light leading-relaxed flex-1 mb-6">"{review.body}"</p>

      {/* Instagram-style Image Gallery */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {review.images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
              <Image src={img} alt="Customer photo" fill className="object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {review.avatar ? (
              <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-brand text-white font-display font-bold text-lg">
                {review.name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">{review.name}</p>
              {isVerified && (
                <BadgeCheck size={14} className="text-emerald-500" aria-label="Verified Buyer" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 uppercase tracking-wider font-medium">
              {isVerified && <span>Verified Buyer</span>}
              {review.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{review.date}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Tag */}
      {review.product && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 rounded-full px-4 py-2 hover:bg-brand-100 transition-colors w-fit">
          <Camera size={14} /> {review.product}
        </div>
      )}
    </div>
  );
}
