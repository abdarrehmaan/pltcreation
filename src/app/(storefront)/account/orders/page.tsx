'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Download, Loader2, Search, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick invoice search input
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchOrders = async () => {
    try {
      const url = user ? `/api/orders?userId=${user.id}` : `/api/orders`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Redirect directly to official Tax Invoice generator for requested Order No / Phone No
    window.open(`/invoice?query=${encodeURIComponent(searchQuery.trim())}`, '_blank');
    setIsSearching(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-gray-900 dark:text-white tracking-wide">
            My Orders & Invoices
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View, track, and download official GST Tax Invoice PDFs for your orders.
          </p>
        </div>
        <Link
          href="/account"
          className="text-xs font-bold text-brand-600 dark:text-amber-400 hover:underline uppercase tracking-wider"
        >
          Back to Account
        </Link>
      </div>

      {/* QUICK INVOICE SEARCH BAR */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-5 rounded-2xl border border-amber-500/30 mb-8 shadow-sm">
        <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Search size={14} />
          Quick Tax Invoice & Order Lookup
        </h3>
        <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Order No (e.g. PLT-2026-0042) or Phone Number..."
            className="flex-1 w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText size={14} />
            <span>Fetch Tax Invoice PDF</span>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="animate-spin text-amber-600" size={36} />
          <p className="text-sm font-medium text-gray-500">Fetching customer orders and tax invoices...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center text-sm font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-12 text-center shadow-card space-y-4">
          <Package className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Orders Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm font-bold">
            Shop Collection Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* ORDER CARD HEADER */}
              <div className="bg-gray-50 dark:bg-neutral-900 px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                      Order Placed
                    </p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                      Total
                    </p>
                    <p className="text-xs font-extrabold text-brand-700 dark:text-amber-400 font-mono">
                      ₹{order.total || order.subtotal || 0}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                    Order Number
                  </p>
                  <p className="text-xs font-bold font-mono text-gray-900 dark:text-white">
                    {order.orderNumber || order.id}
                  </p>
                </div>
              </div>

              {/* ORDER CARD CONTENT */}
              <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={order.status === 'DELIVERED' ? 'text-emerald-600' : 'text-blue-600'}
                      size={18}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        order.status === 'DELIVERED' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {order.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {(order.items || []).map((item: any, idx: number) => (
                      <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{item.productName || item.product?.name || 'Women Apparel'}</span>
                        {item.size || item.color ? (
                          <span className="text-gray-400">({[item.size, item.color].filter(Boolean).join('/')})</span>
                        ) : null}
                        <span className="text-gray-400 font-mono">x{item.quantity || 1}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-neutral-700">
                  <Link
                    href={`/invoice?query=${encodeURIComponent(order.orderNumber || order.id)}`}
                    target="_blank"
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <FileText size={14} />
                    <span>Download Tax Invoice PDF</span>
                  </Link>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex-1 md:flex-none px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
