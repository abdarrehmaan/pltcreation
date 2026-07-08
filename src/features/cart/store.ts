'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
}

export interface CartVariant {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
}

export interface CartLineItem {
  id: string; // cartItemId = productId + variantId
  product: CartProduct;
  variant?: CartVariant;
  quantity: number;
}

interface CartState {
  items: CartLineItem[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: CartProduct, variant?: CartVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      couponDiscount: 0,

      addItem: (product, variant, quantity = 1) => {
        const id = variant ? `${product.id}-${variant.id}` : product.id;
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { id, product, variant, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'plt-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
