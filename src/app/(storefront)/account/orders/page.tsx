'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Download } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-202606-001',
    date: 'June 05, 2026',
    status: 'Delivered',
    total: 3499,
    items: [
      { name: 'Midnight Blue Hand-Embroidered Kurta', qty: 1 },
      { name: 'Emerald Silk Co-ord Set', qty: 1 }
    ]
  },
  {
    id: 'ORD-202605-089',
    date: 'May 12, 2026',
    status: 'Processing',
    total: 1299,
    items: [
      { name: 'Rose Gold Sequin Saree', qty: 1 }
    ]
  }
];

export default function OrdersPage() {
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

      <div className="space-y-6">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Placed</p>
                  <p className="text-sm font-medium text-gray-900">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                  <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order #</p>
                  <p className="text-sm font-medium text-gray-900">{order.id}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Package className={order.status === 'Delivered' ? 'text-emerald-500' : 'text-blue-500'} size={20} />
                  <span className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      {item.name} <span className="text-gray-400">x{item.qty}</span>
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
    </div>
  );
}
