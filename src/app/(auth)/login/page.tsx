'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const isButtonDisabled = !form.email || !form.password || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      router.push('/account');
    } else {
      toast.error(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="font-display text-3xl font-bold text-gradient-brand block mb-2">PLT Creation</Link>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-10">Ethnic Couture</p>

          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Login to Continue</h1>
          <p className="text-gray-500 text-sm mb-8">Use Your Registered Mobile Number</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Mobile Number or Email</label>
              <input
                id="login-email"
                type="text"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="priya@example.com"
                className="input-base bg-blue-50/20 focus:bg-white"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-base pr-12 bg-blue-50/20 focus:bg-white"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full py-3.5 flex items-center justify-center text-white font-bold rounded-full transition-all duration-200 focus:outline-none ${
                isButtonDisabled
                  ? 'bg-[#8c9ab0] cursor-not-allowed'
                  : 'bg-[#143596] hover:bg-[#0e2a7b] active:bg-[#0b205d] shadow-md cursor-pointer'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            New User?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Right: Brand visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative"
        style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}
      >
        <div className="text-center text-white">
          <div className="font-display text-5xl font-bold mb-4">PLT Creation</div>
          <p className="text-xl font-light tracking-wide mb-8">Premium Ethnic Couture</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['10,000+', 'Happy Customers'],
              ['500+', 'Products'],
              ['4.8★', 'Average Rating'],
              ['48h', 'Easy Returns'],
            ].map(([v, l]) => (
              <div key={l} className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                <p className="font-bold text-2xl">{v}</p>
                <p className="text-white/70 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
