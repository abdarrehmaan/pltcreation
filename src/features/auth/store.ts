'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  registeredUsers: (User & { password?: string })[];
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEFAULT_USERS: (User & { password?: string })[] = [
  {
    id: 'u-customer',
    name: 'Jane Doe',
    email: 'customer@pltcreation.com',
    phone: '9876543210',
    role: 'CUSTOMER',
    password: 'password123',
  },
  {
    id: 'u-admin',
    name: 'Admin User',
    email: 'admin@pltcreation.com',
    phone: '8765432109',
    role: 'ADMIN',
    password: 'admin123',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: DEFAULT_USERS,

      login: async (emailOrPhone, password) => {
        // Simple delay to simulate server communication
        await new Promise((resolve) => setTimeout(resolve, 800));

        const cleanInput = emailOrPhone.trim().toLowerCase();
        const cleanPassword = password.trim();

        // Check in registeredUsers
        const foundUser = get().registeredUsers.find(
          (u) =>
            (u.email.toLowerCase() === cleanInput || u.phone === cleanInput) &&
            u.password === cleanPassword
        );

        if (foundUser) {
          // Destructure password out so it's not in session state
          const { password: _, ...userSession } = foundUser;
          set({ user: userSession });
          return { success: true };
        }

        return { success: false, error: 'Invalid email/mobile number or password' };
      },

      register: async (name, email, phone, password) => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        // Check if user already exists
        const exists = get().registeredUsers.some(
          (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
        );

        if (exists) {
          return { success: false, error: 'User with this email or mobile number already exists' };
        }

        const newUser: User & { password?: string } = {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          phone: cleanPhone,
          role: 'CUSTOMER',
          password: password.trim(),
        };

        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
        }));

        return { success: true };
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'plt-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist the user session and registeredUsers list
      partialize: (state) => ({
        user: state.user,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);
