'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: async (emailOrPhone, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: emailOrPhone.trim().toLowerCase(),
            password: password,
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data?.user) {
            // Fetch public profile details from Prisma API
            const res = await fetch(`/api/auth/user?id=${data.user.id}`);
            let profile = null;
            if (res.ok) {
              const profileData = await res.json();
              profile = profileData.user;
            }

            const userSession: User = {
              id: data.user.id,
              name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              email: data.user.email!,
              phone: profile?.phone || data.user.phone || '',
              role: profile?.role || 'CUSTOMER',
            };

            set({ user: userSession });
            return { success: true };
          }

          return { success: false, error: 'Login failed' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Login failed' };
        }
      },

      register: async (name, email, phone, password) => {
        try {
          // Sign up user in Supabase Auth (the DB trigger will sync to public users and wallets tables)
          const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                name: name.trim(),
                phone: phone.trim(),
              },
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data?.user) {
            return { success: true };
          }

          return { success: false, error: 'Registration failed' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Registration failed' };
        }
      },

      logout: () => {
        supabase.auth.signOut().then(() => {
          set({ user: null });
        });
      },
    }),
    {
      name: 'plt-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
