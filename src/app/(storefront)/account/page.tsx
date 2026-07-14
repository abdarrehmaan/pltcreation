'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Heart, MapPin, Wallet, RotateCcw, User, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import toast from 'react-hot-toast';

const accountLinks = [
  { label: 'My Orders', desc: 'Track, return or buy again', icon: Package, href: '/account/orders' },
  { label: 'My Wishlist', desc: 'Saved for later', icon: Heart, href: '/wishlist' },
  { label: 'Saved Addresses', desc: 'Manage delivery addresses', icon: MapPin, href: '/account/addresses' },
  { label: 'My Wallet', desc: 'Store credit & refunds', icon: Wallet, href: '/account/wallet' },
  { label: 'Return Requests', desc: 'Track your returns', icon: RotateCcw, href: '/account/returns' },
  { label: 'Profile Settings', desc: 'Manage personal info', icon: User, href: '/account/profile' },
];

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      toast.error('Please log in to access your account.');
      router.push('/login');
    }
  }, [mounted, user, router]);

  const handleSignOut = () => {
    logout();
    toast.success('Logged out successfully.');
    router.push('/');
  };

  // Prevent flash of unauthenticated content during client-side transition
  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-screen">
      <div className="py-12 text-center relative" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <Link href="/" className="absolute top-4 left-6 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors">
          ← Back to Store
        </Link>
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 border border-white/10 font-bold text-2xl text-white">
          {user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
        </div>
        <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-white/85 text-xs mb-1 uppercase tracking-wide">{user.role}</p>
        <p className="text-white/70 text-sm">{user.email}</p>
      </div>
      <div className="container-plt py-10 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accountLinks.map(({ label, desc, icon: Icon, href }) => (
            <Link key={label} href={href} className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all duration-200 group border border-gray-100/50">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                <Icon size={22} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-100 hover:border-red-200 text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm cursor-pointer focus:outline-none"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
