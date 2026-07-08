import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/storefront/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with PLT Creation — we are here to help with your orders, returns, and any queries.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-white/80">We're here to help — reach out anytime!</p>
      </div>

      <div className="container-plt section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="space-y-6">
              {[
                { Icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 10am–7pm IST' },
                { Icon: Mail, label: 'Email', value: 'hello@pltcreation.in', sub: 'We reply within 24 hours' },
                { Icon: MapPin, label: 'Location', value: 'Prayagraj, Uttar Pradesh', sub: 'India' },
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
