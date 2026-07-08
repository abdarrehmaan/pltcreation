import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'PLT Creation refund policy — how we process refunds for returned items.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-white/70">Last updated: June 2026</p>
      </div>
      <div className="container-plt py-12 max-w-3xl">
        <Link href="/return-policy" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-8">
          <ArrowLeft size={18} /> View full Return Policy
        </Link>
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
            <p className="mb-4 leading-relaxed">
              Once your return is received and inspected by our quality check team, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
            </p>
            <p className="leading-relaxed">
              If you are approved, your refund will be processed. By default, refunds are issued as <strong>PLT Creation Store Credit</strong>, which is instantly added to your account and never expires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Original Payment Methods</h2>
            <p className="leading-relaxed">
              If you request a refund to your original payment method, please allow <strong>5-7 business days</strong> for the credit to appear on your statement. Processing times may vary depending on your bank or credit card issuer. Shipping costs are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Late or Missing Refunds</h2>
            <p className="mb-4 leading-relaxed">If you haven't received a refund yet, first check your bank account again.</p>
            <p className="mb-4 leading-relaxed">Then contact your credit card company, it may take some time before your refund is officially posted.</p>
            <p className="leading-relaxed">Next contact your bank. There is often some processing time before a refund is posted.</p>
            <p className="mt-4 leading-relaxed">
              If you've done all of this and you still have not received your refund yet, please contact us at <a href="mailto:support@pltcreation.in" className="text-brand-600 hover:underline">support@pltcreation.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
