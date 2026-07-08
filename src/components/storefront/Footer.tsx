"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Link2, AtSign, Play, Rss, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] text-gray-400 font-sans mt-20">
      {/* Brand & Security Banner */}
      <div className="border-b border-white/5 bg-black/20">
        <div className="container-plt py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <img src="/logo.png" alt="PLT Creation" className="h-16 w-auto object-contain drop-shadow-lg brightness-110" />
            </Link>
          </div>
          <div className="flex items-center gap-6 md:gap-12 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              <span>100% Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-brand-500" />
              <span>Global Payment Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-plt py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Story */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-[0.2em]">The Heritage</h3>
            <p className="text-sm leading-relaxed mb-8 max-w-sm text-gray-400">
              PLT Creation brings the royal heritage of Indian craftsmanship to the modern woman. Every piece in our collection is a testament to the meticulous art of Chikankari and traditional needlework, designed to make you feel extraordinary.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Link2, href: '#', label: 'Instagram' },
                { Icon: AtSign, href: '#', label: 'Facebook' },
                { Icon: Play, href: '#', label: 'YouTube' },
                { Icon: Rss, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-brand-600 hover:text-white hover:scale-110 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-[0.2em]">Collections</h3>
            <ul className="space-y-4">
              {[
                { label: 'Chikankari', href: '/categories/chikankari' },
                { label: 'Co-ord Sets', href: '/categories/coord-sets' },
                { label: 'Designer Suits', href: '/categories/stitched-suits' },
                { label: 'Unstitched', href: '/categories/unstitched-suits' },
                { label: 'New Arrivals', href: '/new-arrivals' },
                { label: 'Limited Edition', href: '/collections/limited' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-brand-400 transition-colors hover:translate-x-1 inline-block duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-[0.2em]">Client Care</h3>
            <ul className="space-y-4">
              {[
                { label: 'Contact Concierge', href: '/contact' },
                { label: 'Shipping & Delivery', href: '/shipping-policy' },
                { label: 'Returns & Exchanges', href: '/return-policy' },
                { label: 'Size Guide', href: '/size-guide' },
                { label: 'Track Your Order', href: '/account/orders' },
                { label: 'FAQ', href: '/faq' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-brand-400 transition-colors hover:translate-x-1 inline-block duration-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-[0.2em]">Boutique</h3>
            <div className="space-y-5">
              <div className="flex gap-4">
                <Phone size={18} className="text-brand-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium mb-1">+91 98765 43210</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Mon–Sat, 10am–7pm IST</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail size={18} className="text-brand-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium mb-1">concierge@pltcreation.in</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">24/7 Support</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin size={18} className="text-brand-500 mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  PLT Creation Flagship Store,<br />
                  Civil Lines, Prayagraj,<br />
                  Uttar Pradesh 211001, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black">
        <div className="container-plt py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-6 text-xs font-medium uppercase tracking-widest order-2 md:order-1">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-gray-500 text-center md:text-left order-3 md:order-2">
            © {new Date().getFullYear()} PLT CREATION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-3 order-1 md:order-3">
            {['VISA', 'MASTERCARD', 'AMEX', 'UPI'].map((brand) => (
              <span
                key={brand}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10 text-gray-400 bg-white/5"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
