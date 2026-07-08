'use client';

import React, { useState } from 'react';
import { Mail, Key, CheckCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1600&q=85')] bg-cover bg-center bg-no-repeat bg-fixed -z-20"
      />
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm -z-10" />

      <div className="container-plt">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
            
            {/* Decorative Gold Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold-500/20 rounded-full blur-[80px]" />

            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-gold-lg">
                <Crown size={28} className="text-white" />
              </div>

              <h4 className="text-gold-400 font-bold uppercase tracking-[0.3em] text-xs mb-3">
                The Insider Club
              </h4>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Unlock Exclusive <br className="hidden md:block"/> Access & Privileges.
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                Join <span className="font-semibold text-white">PLT Creation Insider</span> to receive early access to limited edition collections, exclusive sales, and a 10% welcome gift.
              </p>

              {submitted ? (
                <div className="flex items-center justify-center gap-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl py-6 px-8 max-w-md mx-auto animate-fade-in">
                  <CheckCircle size={28} className="text-emerald-400" />
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">Welcome to the Club.</p>
                    <p className="text-sm text-gray-300 mt-1">Your welcome gift is waiting in your inbox.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <div className="flex-1 relative group">
                    <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-400 transition-colors" />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 rounded-full bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:bg-white/10 transition-all font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    id="newsletter-submit"
                    className="btn-gold rounded-full px-8 py-4 flex-shrink-0 disabled:opacity-60 flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-bold shadow-gold-lg"
                  >
                    {loading ? 'Processing...' : (
                      <>
                        Unlock Access <Key size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-8">
                By joining, you agree to our Terms of Service. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
