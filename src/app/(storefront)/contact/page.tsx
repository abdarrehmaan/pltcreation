import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Video, AlertCircle } from 'lucide-react';
import ContactForm from '@/components/storefront/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — PLT Creation',
  description: 'Get in touch with PLT Creation — we are here to help with your orders and any customer support queries.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-white/80">We're here to help — reach out anytime!</p>
      </div>

      <div className="container-plt py-12 md:py-20">
        {/* Support & Unboxing Notice Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 md:p-8 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageSquare size={24} />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-display font-bold text-gray-900 text-lg flex items-center gap-2">
                  Customer Support Notice
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium mt-1">
                  For any kind of issue, please call us or send a message on WhatsApp at{' '}
                  <a href="https://wa.me/916392006081" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline">
                    +91 63920 06081
                  </a>
                  . Our team will contact you within 24 hours.
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900 font-semibold">
                <Video size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Mandatory Verification Notice: For any product-related issue, a 360-degree unboxing video is mandatory for verification.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="space-y-6">
              {[
                { Icon: Phone, label: 'Phone & WhatsApp', value: '+91 63920 06081', sub: 'Mon–Sat, 10am–7pm IST (Response within 24h)' },
                { Icon: Mail, label: 'Email Support', value: 'pltcreation.in@gmail.com', sub: '24/7 assistance' },
                { Icon: MapPin, label: 'Location', value: 'PLT Creation Flagship Store, Prayagraj', sub: 'Uttar Pradesh 211001, India' },
                { Icon: Clock, label: 'Business Hours', value: 'Monday – Saturday', sub: '10:00 AM – 7:00 PM IST' },
              ].map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
