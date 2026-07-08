import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'PLT Creation privacy policy — how we collect, use, and protect your personal information.' };
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/70">Last updated: June 2026</p>
      </div>
      <div className="container-plt py-12 max-w-3xl prose prose-sm text-gray-600">
        <p className="text-base">At PLT Creation, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Information We Collect</h2>
        <p>We collect information you provide directly: name, email, phone, shipping address, and payment information. We also collect usage data to improve our services.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Provide customer support</li>
          <li>Send promotional emails (you can opt out anytime)</li>
          <li>Improve our website and services</li>
        </ul>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Information Security</h2>
        <p>We use industry-standard SSL encryption for all transactions. Payment information is processed securely through Razorpay and never stored on our servers.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Your Rights</h2>
        <p>You can request access to, correction of, or deletion of your personal data by contacting us at privacy@pltcreation.in.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Contact Us</h2>
        <p>For privacy-related queries: <a href="mailto:privacy@pltcreation.in" className="text-brand-600">privacy@pltcreation.in</a></p>
      </div>
    </div>
  );
}
