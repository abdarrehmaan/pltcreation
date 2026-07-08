import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy',
  description: 'PLT Creation return and refund policy — easy returns within 48 hours of delivery.',
};

const policies = [
  {
    title: '48-Hour Return Window',
    content: 'We accept returns within 48 hours of delivery. If you are not completely satisfied with your purchase, you can return it for store credit.',
  },
  {
    title: 'Eligible Items',
    content: 'Items must be unused, unwashed, and in their original condition with all tags attached. Custom stitching orders, altered items, and sale items are not eligible for returns.',
  },
  {
    title: 'How to Initiate a Return',
    content: 'Log in to your account, go to My Orders, select the item you wish to return, and click "Request Return". Our team will review and respond within 24 hours.',
  },
  {
    title: 'Refund Process',
    content: 'Once your return is approved and we receive the item, refunds will be credited to your PLT Creation Store Wallet within 3-5 business days. Store wallet credit can be used for future purchases.',
  },
  {
    title: 'Non-Returnable Items',
    content: 'The following items cannot be returned: custom stitched suits, unstitched suit fabrics that have been cut or used, items marked as "Final Sale", and items without original tags.',
  },
  {
    title: 'Exchange Policy',
    content: 'We currently offer size exchanges subject to stock availability. Please initiate an exchange request within 48 hours of delivery.',
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Return & Refund Policy</h1>
        <p className="text-white/70">Last updated: June 2026</p>
      </div>
      <div className="container-plt py-12 max-w-3xl">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-10 flex gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-emerald-800 mb-1">Our Commitment to You</p>
            <p className="text-sm text-emerald-700">We want you to love every PLT Creation purchase. Returns are accepted within 48 hours of delivery, with refunds credited to your store wallet.</p>
          </div>
        </div>
        <div className="space-y-6">
          {policies.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                <span className="text-brand-600 font-bold text-lg">{i + 1}.</span> {p.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{p.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 bg-ivory-100 rounded-2xl">
          <p className="font-semibold text-gray-900 mb-1">Questions?</p>
          <p className="text-sm text-gray-600">Contact us at <a href="mailto:returns@pltcreation.in" className="text-brand-600 hover:underline">returns@pltcreation.in</a> or call us at +91 98765 43210.</p>
        </div>
      </div>
    </div>
  );
}
