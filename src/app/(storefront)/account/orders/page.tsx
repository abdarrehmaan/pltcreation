'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Download, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
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

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-gray-500 mb-4">Please log in to view your orders.</p>
        <Link href="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">View and track your recent orders.</p>
        </div>
        <Link href="/account" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Back to Account
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-brand-600" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-card">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Orders Found</h3>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Placed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                    <p className="text-sm font-bold text-brand-700">₹{order.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order #</p>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className={order.status === 'DELIVERED' ? 'text-emerald-500' : 'text-blue-500'} size={20} />
                    <span className={`text-sm font-bold ${order.status === 'DELIVERED' ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        {item.productName}{' '}
                        {item.size || item.color ? `(${[item.size, item.color].filter(Boolean).join('/')})` : ''}{' '}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Track Order
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 border border-brand-200 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
