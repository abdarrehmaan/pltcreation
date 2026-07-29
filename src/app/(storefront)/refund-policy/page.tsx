import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Ban, MessageSquare, Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy — PLT Creation',
  description: 'PLT Creation official refund policy: No Refunds, No Returns, and No Exchanges.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-white/80">Official Store Policy Notice</p>
      </div>

      <div className="container-plt py-12 max-w-3xl">
        <Link href="/return-policy" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-8">
          <ArrowLeft size={18} /> View Store Policy
        </Link>

        {/* Policy Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-10 text-center">
          <Ban size={36} className="text-red-600 mx-auto mb-3" />
          <h2 className="font-display font-extrabold text-2xl text-red-600 mb-2">NO REFUNDS · NO RETURNS · NO EXCHANGES</h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-lg mx-auto font-medium">
            All purchases made at PLT Creation are final. We do not issue monetary refunds or product exchanges under any ordinary circumstances.
          </p>
        </div>

        {/* Mandatory Support & Verification Notice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-8 mb-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base mb-1">Customer Support</h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                For any kind of issue, please call us or send a message on WhatsApp at{' '}
                <a href="https://wa.me/916392006081" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline">
                  +91 63920 06081
                </a>
                . Our team will contact you within 24 hours.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-amber-200/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Video size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base mb-1">Mandatory Unboxing Video</h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                For any product-related issue, a 360-degree unboxing video is mandatory for verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
