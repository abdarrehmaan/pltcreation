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
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
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
            const isUnconfirmed = error.message.toLowerCase().includes('email not confirmed');
            return {
              success: false,
              error: isUnconfirmed
                ? 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.'
                : error.message,
              needsConfirmation: isUnconfirmed,
            };
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
            // Sync profile and wallet in Prisma DB
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

            const needsConfirmation = !data.session && !data.user.confirmed_at;
            return { success: true, needsConfirmation };
          }

          return { success: false, error: 'Registration failed' };
        } catch (err: any) {
          return { success: false, error: err.message || 'Registration failed' };
        }
      },

      resendConfirmationEmail: async (email: string) => {
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
          });
          if (error) {
            return { success: false, error: error.message };
          }
          return { success: true };
        } catch (err: any) {
          return { success: false, error: err.message || 'Failed to resend confirmation email' };
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


