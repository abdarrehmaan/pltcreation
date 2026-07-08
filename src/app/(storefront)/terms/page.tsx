import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions', description: 'PLT Creation terms and conditions for using our website and services.' };
export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-white/70">Last updated: June 2026</p>
      </div>
      <div className="container-plt py-12 max-w-3xl prose prose-sm text-gray-600">
        <p className="text-base">By accessing and using pltcreation.in, you agree to be bound by these Terms and Conditions.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Use of Website</h2>
        <p>You agree to use this website for lawful purposes only. You must not use this site in any way that causes damage to the website or impairs its availability.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Product Information</h2>
        <p>We make every effort to display product colors and images accurately. However, actual colors may vary due to monitor settings. Sizes are as per our standard size chart.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Pricing</h2>
        <p>All prices are in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to change prices without prior notice. Orders placed at a price will be honored at that price.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Intellectual Property</h2>
        <p>All content on this website, including images, text, logos, and design, is the intellectual property of PLT Creation and may not be reproduced without written permission.</p>
        <h2 className="font-display text-xl font-bold text-gray-900 mt-8 mb-3">Contact</h2>
        <p>For queries: <a href="mailto:legal@pltcreation.in" className="text-brand-600">legal@pltcreation.in</a></p>
      </div>
    </div>
  );
}
