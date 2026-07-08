import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Headphones, Lock, Award } from 'lucide-react';

const badges = [
  {
    Icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ₹1499',
  },
  {
    Icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Within 48 hours of delivery',
  },
  {
    Icon: ShieldCheck,
    title: '100% Authentic',
    description: 'Genuine ethnic wear only',
  },
  {
    Icon: Lock,
    title: 'Secure Payments',
    description: 'SSL encrypted checkout',
  },
  {
    Icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
  },
  {
    Icon: Award,
    title: 'Premium Quality',
    description: 'Handpicked by experts',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-12 border-y border-gray-100 bg-ivory-100">
      <div className="container-plt">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map(({ Icon, title, description }) => (
            <div key={title} className="trust-badge">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Icon size={22} className="text-brand-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-tight">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
