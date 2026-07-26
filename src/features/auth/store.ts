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
          const cleanInput = emailOrPhone.trim();
          const isEmail = cleanInput.includes('@');

          const signInCredentials = isEmail
            ? { email: cleanInput.toLowerCase(), password }
            : { phone: cleanInput, password };

          const { data, error } = await supabase.auth.signInWithPassword(signInCredentials);

          if (error) {
            return { success: false, error: error.message };
          }

          if (data?.user) {
            // Fetch or sync public profile details from Prisma API
            let res = await fetch(`/api/auth/user?id=${data.user.id}`);
            let profile = null;

            if (res.ok) {
              const profileData = await res.json();
              profile = profileData.user;
            } else if (res.status === 404) {
              // Sync missing profile to Prisma DB
              const syncRes = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: data.user.id,
                  name: data.user.user_metadata?.name || '',
                  email: data.user.email || '',
                  phone: data.user.user_metadata?.phone || '',
                }),
              });
              if (syncRes.ok) {
                const syncData = await syncRes.json();
                profile = syncData.user;
              }
            }

            const userSession: User = {
              id: data.user.id,
              name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              email: data.user.email || profile?.email || '',
              phone: profile?.phone || data.user.user_metadata?.phone || data.user.phone || '',
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
          const cleanEmail = email.trim().toLowerCase();
          const cleanName = name.trim();
          const cleanPhone = phone.trim();

          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                name: cleanName,
                phone: cleanPhone,
              },
            },
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data?.user) {
            // Explicitly sync profile and create wallet in Prisma PostgreSQL database
            try {
              await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: data.user.id,
                  name: cleanName,
                  email: cleanEmail,
                  phone: cleanPhone,
                }),
              });
            } catch (syncErr) {
              console.error('Failed to sync user profile to DB:', syncErr);
            }

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

