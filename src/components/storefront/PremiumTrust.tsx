import React from 'react';
import { ShieldCheck, Leaf, Sparkles, RefreshCcw, HeartHandshake, PackageCheck } from 'lucide-react';

export default function PremiumTrust() {
  const trustFeatures = [
    {
      icon: Sparkles,
      title: "Master Craftsmanship",
      desc: "Authentic, handcrafted detailing by expert artisans.",
    },
    {
      icon: Leaf,
      title: "Premium Fabrics",
      desc: "Ethically sourced, breathable, and luxurious materials.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "100% encrypted and safe global transactions.",
    },
    {
      icon: RefreshCcw,
      title: "Easy 48h Returns",
      desc: "Hassle-free returns and exchanges within 48 hours.",
    },
    {
      icon: PackageCheck,
      title: "Fast Delivery",
      desc: "Complimentary express shipping on orders over ₹1499.",
    },
    {
      icon: HeartHandshake,
      title: "Satisfaction Guarantee",
      desc: "We aren't happy until you are absolutely thrilled.",
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="container-plt">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">The PLT Creation Promise</h2>
          <p className="text-gray-500 font-light text-lg">Experience luxury without compromise. We stand by the quality of our craftsmanship and your shopping experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {trustFeatures.map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-ivory-50 border border-ivory-200 flex items-center justify-center mb-6 group-hover:bg-brand-50 transition-colors duration-500">
                <Icon size={28} className="text-brand-600 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">{title}</h3>
              <p className="text-gray-500 font-light leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
