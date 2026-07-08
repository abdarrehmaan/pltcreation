import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Shipping Policy', description: 'PLT Creation shipping policy — free shipping above ₹1499, 3-5 business days delivery.' };
export default function ShippingPolicyPage() {
  const policies = [
    { title: 'Free Shipping', content: 'We offer free standard shipping on all orders above ₹1499 across India. For orders below ₹1499, a flat shipping charge of ₹99 is applicable.' },
    { title: 'Delivery Timeline', content: 'Orders are typically delivered within 3-5 business days for metro cities and 5-7 business days for other locations. You will receive a tracking link via SMS and email once your order is shipped.' },
    { title: 'Shipping Partners', content: 'We ship via reputed logistics partners including Blue Dart, Delhivery, and Ecom Express to ensure timely and safe delivery of your orders.' },
    { title: 'Order Processing', content: 'Orders are processed within 24-48 hours of placement. Orders placed on weekends or public holidays will be processed the next working day.' },
    { title: 'Tracking Your Order', content: 'Once your order is shipped, you will receive a tracking ID via SMS and email. You can also track your order from the My Orders section in your account.' },
    { title: 'Delivery Issues', content: 'If you face any delivery issues, please contact us at support@pltcreation.in or call +91 98765 43210. We will resolve it within 24 hours.' },
  ];
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-4xl font-bold text-white mb-2">Shipping Policy</h1>
        <p className="text-white/70">Last updated: June 2026</p>
      </div>
      <div className="container-plt py-12 max-w-3xl">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex gap-3">
          <span className="text-2xl">🚚</span>
          <div>
            <p className="font-semibold text-blue-800 mb-1">Free Shipping Available!</p>
            <p className="text-sm text-blue-700">Get free shipping on all orders above ₹1499. Standard shipping: ₹99 flat fee for orders below ₹1499.</p>
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
      </div>
    </div>
  );
}
