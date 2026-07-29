import type { Metadata } from 'next';
import { Ban, ShieldAlert, Phone, Video, CheckCircle2, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return, Refund & Exchange Policy — PLT Creation',
  description: 'Official PLT Creation policy: No Returns, No Refunds, and No Exchanges on all orders.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest mb-4">
          <ShieldAlert size={14} /> Official Store Policy
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">Return, Refund & Exchange Policy</h1>
        <p className="text-white/80">Please read our store policy before placing an order.</p>
      </div>

      <div className="container-plt py-12 max-w-4xl">
        {/* Core Policy Highlight Card */}
        <div className="bg-red-50/80 border-2 border-red-200 rounded-3xl p-8 mb-12 shadow-sm">
          <div className="flex items-center gap-3 text-red-700 font-bold text-xl mb-6">
            <Ban size={28} className="flex-shrink-0" />
            <span>Strict Policy Notice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-red-100 text-center shadow-xs">
              <span className="block font-display font-extrabold text-2xl text-red-600 mb-1">NO RETURNS</span>
              <p className="text-xs text-gray-500 font-medium">All sales are final upon delivery.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-red-100 text-center shadow-xs">
              <span className="block font-display font-extrabold text-2xl text-red-600 mb-1">NO REFUNDS</span>
              <p className="text-xs text-gray-500 font-medium">Monetary refunds are not issued.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-red-100 text-center shadow-xs">
              <span className="block font-display font-extrabold text-2xl text-red-600 mb-1">NO EXCHANGES</span>
              <p className="text-xs text-gray-500 font-medium">Size or color exchanges are not supported.</p>
            </div>
          </div>

          <p className="text-sm text-red-950 font-medium leading-relaxed">
            At PLT Creation, every single garment undergoes rigorous multi-step quality control checks prior to dispatch to ensure pristine condition, accurate sizing, and fine craftsmanship. Therefore, we maintain a strict **No Return, No Refund, and No Exchange** policy on all orders.
          </p>
        </div>

        {/* Support & Verification Mandatory Card */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-8 mb-12 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">Customer Support Assistance</h3>
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
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Video size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-1">Mandatory Unboxing Video Requirement</h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                For any product-related issue (e.g., damaged transit parcel), a **360-degree unboxing video** starting from the unopened sealed package is mandatory for verification.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="space-y-6">
          <div className="border border-gray-100 rounded-2xl p-6 bg-white">
            <h2 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-600" /> Quality Assurance Guarantee
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Prior to packing, our expert team inspects stitching, threadwork, fabric integrity, and measurements to verify compliance with designer standards.
            </p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-6 bg-white">
            <h2 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-600" /> Color & Stitching Disclaimers
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Slight color variations may occur due to studio lighting or monitor settings. As Chikankari and handcrafted embroidery are authentic artisan crafts, slight irregularities in thread patterns are natural indicators of genuine handcrafting.
            </p>
          </div>
        </div>

        {/* Help Banner */}
        <div className="mt-12 p-8 bg-gray-900 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold mb-1">Need help with an order?</h3>
            <p className="text-gray-400 text-sm">Reach out to our customer care team via Call or WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/916392006081"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-colors whitespace-nowrap"
          >
            WhatsApp Support: +91 63920 06081
          </a>
        </div>
      </div>
    </div>
  );
}
