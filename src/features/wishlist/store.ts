'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  category?: string;
}

interface WishlistState {
  items: WishlistProduct[];
  addItem: (product: WishlistProduct) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (product: WishlistProduct) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'plt-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
