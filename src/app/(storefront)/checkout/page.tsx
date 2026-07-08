'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Truck, CreditCard, Smartphone, Building2, Store, RefreshCcw } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { formatPrice, calculateShipping } from '@/lib/utils';
import toast from 'react-hot-toast';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: Truck, desc: 'Pay when delivered' },
  { id: 'takeaway', label: 'Takeaway', icon: Store, desc: '*30% prepaid for order value' },
  { id: 'exchange', label: 'Exchange', icon: RefreshCcw, desc: 'Exchange an existing item' },
];

export default function CheckoutPage() {
  const { items, getSubtotal, couponDiscount, couponCode } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal - couponDiscount);
  const total = subtotal - couponDiscount + shipping;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', line1: '', line2: '',
    city: '', state: '', pincode: '',
  });

  const prepaidDiscount = !['cod', 'takeaway', 'exchange'].includes(paymentMethod) ? Math.round(total * 0.05) : 0;
  const finalTotal = total - prepaidDiscount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Order placed successfully! You will receive a confirmation email shortly.');
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-screen">
      <div className="py-10 text-center" style={{ background: 'linear-gradient(135deg, #6B2D4F 0%, #C4748A 100%)' }}>
        <h1 className="font-display text-3xl font-bold text-white">Checkout</h1>
        <nav className="flex items-center justify-center gap-2 text-white/70 text-sm mt-2">
          <span>Cart</span><ChevronRight size={14} />
          <span className="text-white font-semibold">Details</span><ChevronRight size={14} />
          <span>Confirmation</span>
        </nav>
      </div>

      <div className="container-plt py-10">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Address + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping address */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-semibold text-gray-900 mb-5 text-lg">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Name *</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Enter your full name" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Phone Number *</label>
                    <input name="phone" required type="tel" pattern="[6-9]\\d{9}" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input-base" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Email Address *</label>
                    <input name="email" required type="email" value={form.email} onChange={handleChange} placeholder="For order confirmation" className="input-base" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Address Line 1 *</label>
                    <input name="line1" required value={form.line1} onChange={handleChange} placeholder="House/Flat no., Street, Area" className="input-base" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Address Line 2</label>
                    <input name="line2" value={form.line2} onChange={handleChange} placeholder="Landmark (optional)" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">City *</label>
                    <input name="city" required value={form.city} onChange={handleChange} placeholder="Your city" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">State *</label>
                    <select name="state" required value={form.state} onChange={handleChange} className="input-base">
                      <option value="">Select State</option>
                      {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Pincode *</label>
                    <input name="pincode" required pattern="\\d{6}" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" className="input-base" />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-semibold text-gray-900 mb-5 text-lg">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === id ? 'bg-brand-100' : 'bg-gray-100'
                      }`}>
                        <Icon size={18} className={paymentMethod === id ? 'text-brand-700' : 'text-gray-600'} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      {!['cod', 'takeaway', 'exchange'].includes(id) && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">5% OFF</span>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === id ? 'border-brand-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                      </div>
                    </label>
                  ))}
                </div>

                {!['cod', 'takeaway', 'exchange'].includes(paymentMethod) && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
                    <Shield size={14} className="text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-medium">
                      You save {formatPrice(prepaidDiscount)} extra with prepaid payment! 100% Secure via Razorpay.
                    </p>
                  </div>
                )}
                {['cod', 'takeaway'].includes(paymentMethod) && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <Shield size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 font-medium">
                      For {paymentMethod === 'cod' ? 'COD' : 'Takeaway'} orders, a 30% advance payment ({formatPrice(finalTotal * 0.30)}) is required to confirm your order. The remaining 70% ({formatPrice(finalTotal * 0.70)}) will be collected at the time of {paymentMethod === 'cod' ? 'delivery' : 'pickup'}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        {item.product.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs leading-tight line-clamp-2">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-gray-400">{item.variant.size} / {item.variant.color}</p>}
                        <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Coupon ({couponCode})</span><span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  {prepaidDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Prepaid Discount (5%)</span><span>-{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span><span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  id="place-order-btn"
                  disabled={loading}
                  className="btn-primary w-full mt-5 py-4 text-base disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? 'Placing Order...' : paymentMethod === 'cod' ? '📦 Place Order (COD)' : '🔒 Pay & Place Order'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  By placing this order, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
