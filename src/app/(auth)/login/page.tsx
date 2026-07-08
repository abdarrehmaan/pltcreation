'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="font-display text-3xl font-bold text-gradient-brand block mb-2">PLT Creation</Link>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-10">Ethnic Couture</p>

          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your PLT Creation account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email Address</label>
              <input
                id="login-email"
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-base"
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
                  type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-base pr-12"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 justify-center disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-white text-xs text-gray-400">or continue with</span></div>
          </div>

          <button
            id="google-login"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">Sign up for free</Link>
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
