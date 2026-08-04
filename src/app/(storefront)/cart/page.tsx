'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { formatPrice, calculateShipping } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const [siteSettings, setSiteSettings] = useState({
    freeShippingThreshold: 1499,
    standardShippingCharge: 99,
    prepaidDiscountPercent: 5,
    taxPercent: 0,
  });

  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (res.ok && data.settings) {
          setSiteSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to fetch cart site settings:', err);
      }
    };

    fetchSiteSettings();
  }, []);

  const subtotal = getSubtotal();
  const freeThreshold = Number(siteSettings.freeShippingThreshold || 1499);
  const standardShipping = Number(siteSettings.standardShippingCharge || 99);
  const prepaidPercent = Number(siteSettings.prepaidDiscountPercent || 5);
  const taxPercent = Number(siteSettings.taxPercent || 0);

  const shipping = subtotal >= freeThreshold ? 0 : standardShipping;
  const prepaidDiscount = prepaidPercent > 0 ? Math.round(subtotal * (prepaidPercent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - prepaidDiscount + shipping);

  const activeTaxPercent = taxPercent > 0 ? taxPercent : 5;
  const gstAmount = Math.round((subtotal - prepaidDiscount) * (activeTaxPercent / (100 + activeTaxPercent)));
  const remainingForFree = freeThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-20">
        <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center">
          <ShoppingBag size={40} className="text-brand-300" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-screen">
      <div
        className="py-10 text-center"
        style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}
      >
        <h1 className="font-display text-3xl font-bold text-white">Shopping Cart</h1>
      </div>

      <div className="container-plt py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-4 shadow-card">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={item.product.image || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-brand-700 text-sm leading-snug block mb-1">
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.variant.size && (
                        <span className="text-xs font-semibold text-gray-900 bg-gray-100 border border-gray-300 rounded-full px-2.5 py-0.5">
                          Size: {item.variant.size}
                        </span>
                      )}
                      {item.variant.color && (
                        <span className="text-xs font-semibold text-gray-900 bg-gray-100 border border-gray-300 rounded-full px-2.5 py-0.5">
                          Color: {item.variant.color}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-800">{formatPrice(item.product.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Product Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Includes {activeTaxPercent}% GST</span>
                  <span>{formatPrice(gstAmount)}</span>
                </div>
                {prepaidDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Prepaid Discount ({prepaidPercent}%)</span>
                    <span>-{formatPrice(prepaidDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-gray-900">
                  <span className="flex items-center gap-1"><Truck size={13} /> Delivery Charges</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-bold' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 ? (
                  <p className="text-xs text-amber-700 font-medium">
                    Standard charge {formatPrice(standardShipping)}. Add {formatPrice(remainingForFree)} more for FREE shipping!
                  </p>
                ) : (
                  <p className="text-xs text-emerald-700 font-semibold">🎉 You qualify for FREE shipping!</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Final Payable Amount</span>
                  <span className="text-brand-700">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                id="proceed-checkout-btn"
                className="btn-primary w-full text-center mt-5 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                🔒 Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
