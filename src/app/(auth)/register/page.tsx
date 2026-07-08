'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="font-display text-3xl font-bold text-gradient-brand block mb-2">PLT Creation</Link>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-10">Ethnic Couture</p>

          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Join thousands of women who love PLT Creation</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Full Name</label>
              <input id="reg-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your full name" className="input-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Email Address</label>
              <input id="reg-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Phone Number</label>
              <input id="reg-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input-base" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <input id="reg-password" name="password" type={showPw ? 'text' : 'password'} required minLength={8} value={form.password} onChange={handleChange} placeholder="Minimum 8 characters" className="input-base pr-12" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-700 font-semibold mb-2">🎁 New member benefits:</p>
              <ul className="space-y-1">
                {['10% off your first order', 'Early access to new arrivals', 'Exclusive member-only deals', 'Easy order tracking'].map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle size={12} /> {b}
                  </li>
                ))}
              </ul>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 justify-center disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}>
        <div className="text-center text-white">
          <div className="font-display text-5xl font-bold mb-4">Welcome to PLT Creation</div>
          <p className="text-lg font-light tracking-wide text-white/80">Your journey to premium ethnic fashion starts here.</p>
        </div>
      </div>
    </div>
  );
}
