'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Truck, CreditCard, Smartphone, Building2, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { useAuthStore } from '@/features/auth/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  // Dynamic Site Settings from Admin DB
  const [siteSettings, setSiteSettings] = useState({
    prepaidDiscountPercent: 5,
    codAdvancePercent: 0,
    freeShippingThreshold: 1499,
    standardShippingCharge: 99,
    taxPercent: 0,
  });

  const user = useAuthStore((s) => s.user);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', line1: '', line2: '',
    city: '', state: '', pincode: '',
  });

  // Fetch dynamic site settings on load
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (res.ok && data.settings) {
          setSiteSettings(data.settings);
        }
      } catch (err) {
        console.error('Failed to fetch checkout site settings:', err);
      }
    };

    fetchSiteSettings();
  }, []);

  // Fetch user's saved addresses and auto-fill default address
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/account/addresses?userId=${user.id}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.addresses) && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setForm({
              fullName: defaultAddr.fullName || user.name || '',
              phone: defaultAddr.phone || user.phone || '',
              email: user.email || '',
              line1: defaultAddr.line1 || '',
              line2: defaultAddr.line2 || '',
              city: defaultAddr.city || '',
              state: defaultAddr.state || '',
              pincode: defaultAddr.pincode || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch user saved addresses:', err);
      }
    };

    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      fetchSavedAddresses();
    }
  }, [user]);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setForm({
      fullName: addr.fullName || user?.name || '',
      phone: addr.phone || user?.phone || '',
      email: user?.email || form.email || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    });
  };

  // Dynamic Calculations using Admin Site Settings
  const freeThreshold = Number(siteSettings.freeShippingThreshold || 1499);
  const standardShipping = Number(siteSettings.standardShippingCharge || 99);
  const prepaidPercent = Number(siteSettings.prepaidDiscountPercent || 0);
  const codAdvancePercent = Number(siteSettings.codAdvancePercent || 0);
  const taxPercent = Number(siteSettings.taxPercent || 0);

  const shipping = subtotal >= freeThreshold ? 0 : standardShipping;

  const prepaidDiscount = paymentMethod !== 'cod' && prepaidPercent > 0
    ? Math.round(subtotal * (prepaidPercent / 100))
    : 0;

  const finalTotal = Math.max(0, subtotal - prepaidDiscount + shipping);

  // GST Amount (5% Inclusive in Product Price, or siteSettings.taxPercent if set)
  const activeTaxPercent = taxPercent > 0 ? taxPercent : 5;
  const gstAmount = Math.round((subtotal - prepaidDiscount) * (activeTaxPercent / (100 + activeTaxPercent)));

  const codAdvanceAmount = Math.round(finalTotal * (codAdvancePercent / 100));
  const codRemainingAmount = finalTotal - codAdvanceAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order.');
      router.push('/login');
      return;
    }

    if (!form.fullName || !form.phone || !form.email || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    setLoading(true);

    try {
      // Check if advance payment is required for COD or full payment for prepaid
      const isCodWithAdvance = paymentMethod === 'cod' && codAdvanceAmount > 0;
      const requiresOnlinePayment = paymentMethod !== 'cod' || isCodWithAdvance;

      if (!requiresOnlinePayment) {
        // Direct COD placement without advance payment
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            paymentMethod,
            items,
            subtotal,
            shippingCharge: shipping,
            discount: 0,
            total: finalTotal,
            couponCode: null,
            couponDiscount: 0,
            prepaidDiscount,
            codAdvanceAmount: 0,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success('Order placed successfully! Thank you for shopping with us.');
          useCartStore.getState().clearCart();
          const orderNumber = data.order?.orderNumber;
          if (orderNumber) {
            router.push(`/invoice?query=${encodeURIComponent(orderNumber)}`);
          } else {
            router.push('/account/orders');
          }
        } else {
          toast.error(data.error || 'Failed to place order. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Online payment (UPI / Card / NetBanking for 100%, OR COD 30% advance) using Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const chargeAmount = isCodWithAdvance ? codAdvanceAmount : finalTotal;
      const amountInPaise = Math.round(chargeAmount * 100);
      if (amountInPaise < 100) {
        toast.error('Payment amount must be at least ₹1 (100 paise).');
        setLoading(false);
        return;
      }

      // STEP 1: Call backend create-order API
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        toast.error(orderData.error || 'Failed to initialize payment with Razorpay.');
        setLoading(false);
        return;
      }

      // STEP 2: Open Razorpay Payment Modal
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TK6fduM3YcPbY9';
      const paymentDescription = isCodWithAdvance
        ? `COD ${codAdvancePercent}% Advance Payment`
        : 'Payment for Order';

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'PLT Creation',
        description: paymentDescription,
        order_id: orderData.order_id,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#6B2D4F',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // STEP 3: Verify Payment Signature with Backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Create DB order upon successful verification
              const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: user.id,
                  fullName: form.fullName,
                  phone: form.phone,
                  email: form.email,
                  line1: form.line1,
                  line2: form.line2,
                  city: form.city,
                  state: form.state,
                  pincode: form.pincode,
                  paymentMethod,
                  items,
                  subtotal,
                  shippingCharge: shipping,
                  discount: 0,
                  total: finalTotal,
                  couponCode: null,
                  couponDiscount: 0,
                  prepaidDiscount,
                  codAdvanceAmount: isCodWithAdvance ? codAdvanceAmount : 0,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                }),
              });

              const checkoutData = await checkoutRes.json();
              if (checkoutRes.ok && checkoutData.success) {
                toast.success(
                  isCodWithAdvance
                    ? 'COD Advance payment verified & order placed successfully!'
                    : 'Payment verified & order placed successfully!'
                );
                useCartStore.getState().clearCart();
                const orderNumber = checkoutData.order?.orderNumber;
                if (orderNumber) {
                  router.push(`/invoice?query=${encodeURIComponent(orderNumber)}`);
                } else {
                  router.push('/account/orders');
                }
              } else {
                toast.error(checkoutData.error || 'Payment succeeded but order processing failed.');
              }
            } else {
              toast.error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            toast.error(err.message || 'An error occurred during payment verification.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled by user.');
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', function (response: any) {
        toast.error(response.error?.description || 'Payment failed. Please try again.');
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
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

                {savedAddresses.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Saved Addresses</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === addr.id
                              ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-gray-900">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                          <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Full Name *</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Enter your full name" className="input-base" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Phone Number *</label>
                    <input name="phone" required type="tel" pattern="[6-9][0-9]{9}" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input-base" />
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
                    <input name="pincode" required pattern="[0-9]{6}" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" className="input-base" />
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
                      {id !== 'cod' && prepaidPercent > 0 && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          {prepaidPercent}% OFF
                        </span>
                      )}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === id ? 'border-brand-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl flex items-center gap-2">
                    <Shield size={14} className="text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-medium">
                      You save {formatPrice(prepaidDiscount)} extra with prepaid payment ({prepaidPercent}% OFF)! 100% Secure via Razorpay.
                    </p>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <Shield size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 font-medium">
                      {codAdvancePercent > 0 ? (
                        <>For COD orders, a {codAdvancePercent}% advance payment ({formatPrice(codAdvanceAmount)}) is required to confirm your order. The remaining {100 - codAdvancePercent}% ({formatPrice(codRemainingAmount)}) will be collected at delivery.</>
                      ) : (
                        <>Cash on delivery available. Pay total amount ({formatPrice(finalTotal)}) upon delivery.</>
                      )}
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
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-650 font-medium">
                    <span>Product Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400 text-xs pl-3">
                    <span>Includes 5% GST</span>
                    <span>{formatPrice(gstAmount)}</span>
                  </div>

                  {prepaidDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 text-xs pl-3">
                      <span>Prepaid Discount ({prepaidPercent}%)</span>
                      <span>-{formatPrice(prepaidDiscount)}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-650 font-medium">
                      <span>Delivery Charges</span>
                      <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : 'text-gray-900 font-semibold'}>
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping === 0 ? (
                      <p className="text-[11px] text-emerald-600 font-medium pl-1">
                        🎉 Unlocked FREE Shipping (Orders above {formatPrice(freeThreshold)})
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-700 font-medium pl-1">
                        Standard charge {formatPrice(standardShipping)}. Add {formatPrice(freeThreshold - subtotal)} more for FREE shipping!
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Final Payable Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
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
