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

  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

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
                    <div className="flex gap-3 mb-2">
                      <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{item.variant.size}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{item.variant.color}</span>
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
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck size={13} /> Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Add {formatPrice(999 - subtotal)} more for free shipping</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">Inclusive of all taxes</p>
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
