'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const freeShippingThreshold = 1499;
  const remaining = freeShippingThreshold - subtotal;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="cart-drawer"
        className="cart-drawer animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            <h2 className="font-semibold text-gray-900">My Cart</h2>
            {items.length > 0 && (
              <span className="text-xs font-bold text-white bg-brand-600 rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            className="btn-icon"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-ivory-100 border-b border-gray-100">
            {remaining > 0 ? (
              <>
                <p className="text-xs text-gray-600 mb-1.5">
                  Add <strong className="text-brand-700">{formatPrice(remaining)}</strong> more for FREE shipping!
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #C4748A, #6B2D4F)',
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-emerald-700 font-semibold">🎉 You qualify for FREE shipping!</p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
                <ShoppingBag size={32} className="text-brand-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-500">Discover our beautiful ethnic collection</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => {
                const discount = item.product.comparePrice
                  ? calculateDiscount(item.product.price, item.product.comparePrice)
                  : 0;
                return (
                  <li key={item.id} className="flex gap-4 p-5">
                    {/* Image */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-sm font-semibold text-gray-900 hover:text-brand-700 line-clamp-2 leading-tight block"
                        onClick={closeCart}
                      >
                        {item.product.name}
                      </Link>

                      {item.variant && (
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-gray-500">Size: {item.variant.size}</span>
                          <span className="text-xs text-gray-500">Color: {item.variant.color}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-brand-800">
                          {formatPrice(item.product.price)}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.product.comparePrice!)}
                          </span>
                        )}
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Taxes & shipping calculated at checkout
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                className="btn-secondary text-center text-sm py-3"
                onClick={closeCart}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                className="btn-primary text-sm py-3 flex items-center justify-center gap-2"
                onClick={closeCart}
              >
                Checkout <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
