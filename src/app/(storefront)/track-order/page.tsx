import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Track Your Order — PLT Creation',
  description: 'Track your PLT Creation shipment status in real-time using your order number and phone/email.',
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const queriedOrderId = params.orderId || '';

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div
        className="py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 60%, #c9a84c 100%)' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-widest mb-4">
          <Truck size={14} /> Live Shipment Tracking
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">Track Your Order</h1>
        <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base px-4">
          Enter your order details below to check current delivery status and tracking updates.
        </p>
      </div>

      <div className="container-plt py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Lookup Form */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl mb-12">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={20} className="text-brand-600" /> Order Lookup
            </h2>

            <form method="GET" action="/track-order" className="space-y-5">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 tracking-wider mb-2">
                  Order Number / ID *
                </label>
                <input
                  type="text"
                  name="orderId"
                  required
                  placeholder="e.g. PLT-10842"
                  defaultValue={queriedOrderId}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 tracking-wider mb-2">
                  Email Address or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter email or 10-digit mobile number"
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search size={16} /> Track Shipment Status
              </button>
            </form>
          </div>

          {/* Demonstration timeline if queried or help section */}
          {queriedOrderId ? (
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200/80 animate-fade-in">
              <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
                <div>
                  <p className="text-xs uppercase font-bold text-brand-600 tracking-wider">Tracking Result</p>
                  <h3 className="font-display text-xl font-bold text-gray-900">Order #{queriedOrderId}</h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  In Transit
                </span>
              </div>

              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {[
                  { title: 'Order Confirmed', date: 'Jul 26, 2026 - 10:30 AM', done: true, desc: 'Your order was successfully verified.' },
                  { title: 'Packed & Dispatched', date: 'Jul 27, 2026 - 02:15 PM', done: true, desc: 'Handed over to BlueDart courier partner.' },
                  { title: 'In Transit', date: 'Jul 28, 2026 - 08:00 AM', active: true, desc: 'Arrived at regional sorting hub.' },
                  { title: 'Out for Delivery', date: 'Estimated: Jul 29, 2026', pending: true, desc: 'Will be delivered by 7:00 PM.' },
                ].map((step) => (
                  <div key={step.title} className="relative flex items-start gap-4 pl-10">
                    <div
                      className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        step.done
                          ? 'bg-emerald-500'
                          : step.active
                          ? 'bg-brand-600 ring-4 ring-brand-100'
                          : 'bg-gray-300'
                      }`}
                    >
                      {step.done ? <CheckCircle2 size={16} /> : step.active ? <Truck size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-400 font-medium mb-1">{step.date}</p>
                      <p className="text-xs text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center bg-brand-50/40 rounded-3xl p-8 border border-brand-100">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">Already Have an Account?</h3>
              <p className="text-xs text-gray-600 mb-6">
                You can also view all your recent order invoices, tracking numbers, and delivery details under your account profile.
              </p>
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
              >
                Go to My Account Orders <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
