import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PLT Creation — our story, mission, and passion for premium women\'s ethnic fashion.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
          alt="About PLT Creation"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(107,45,79,0.85), rgba(196,116,138,0.6))' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Our Story</h1>
          <p className="text-white/80 text-lg max-w-2xl">Celebrating the timeless beauty of Indian ethnic fashion</p>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding">
        <div className="container-plt max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-tag justify-start">Our Mission</div>
              <h2 className="section-title text-left text-2xl md:text-3xl">Bringing Ethnic Elegance to Every Woman</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founded with a passion for authentic Indian craftsmanship, PLT Creation was born from the belief that every woman deserves to experience the luxury of premium ethnic wear without compromise.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We work directly with skilled artisans across India — from the Chikankari embroiderers of Lucknow to the silk weavers of Varanasi — to bring you pieces that are truly one-of-a-kind.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every PLT Creation piece tells a story — of heritage, craftsmanship, and the enduring beauty of Indian textile traditions.
              </p>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
                alt="PLT Creation craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-ivory-100">
        <div className="container-plt">
          <div className="section-header">
            <div className="section-tag">What We Stand For</div>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Premium Quality', desc: 'Every piece is carefully curated and quality-checked before it reaches you.' },
              { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our top priority — from browsing to delivery.' },
              { icon: Leaf, title: 'Sustainable Fashion', desc: 'We champion ethical production and support Indian artisan communities.' },
              { icon: Users, title: 'Community', desc: 'Join 10,000+ women who celebrate ethnic fashion with PLT Creation.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-card text-center">
                <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container-plt">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Ready to Discover PLT Creation?</h2>
          <p className="text-gray-500 mb-8">Browse our latest collection and find your perfect ethnic ensemble.</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      </section>
    </div>
  );
}
