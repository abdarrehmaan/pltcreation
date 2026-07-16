'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, Package, TrendingUp, IndianRupee, ArrowUp, ArrowDown, Eye, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const statusClass: Record<string, string> = {
  DELIVERED: 'status-badge status-delivered',
  SHIPPED: 'status-badge status-shipped',
  PROCESSING: 'status-badge status-processing',
  CONFIRMED: 'status-badge status-confirmed',
  PENDING: 'status-badge status-pending',
  CANCELLED: 'status-badge status-cancelled',
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center">
        {error}
      </div>
    );
  }

  const { kpis, recentOrders, topProducts } = data;

  const kpiItems = [
    {
      label: 'Total Revenue',
      value: formatPrice(kpis.totalRevenue),
      change: 'Live',
      up: true,
      icon: IndianRupee,
      color: 'bg-brand-50 text-brand-700',
      subtext: 'Completed sales',
    },
    {
      label: 'Total Orders',
      value: kpis.totalOrders.toLocaleString(),
      change: 'Live',
      up: true,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-700',
      subtext: 'Lifetime orders',
    },
    {
      label: 'Customers',
      value: kpis.totalCustomers.toLocaleString(),
      change: 'Live',
      up: true,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700',
      subtext: 'Registered customers',
    },
    {
      label: 'Products',
      value: kpis.totalProducts.toLocaleString(),
      change: 'Live',
      up: true,
      icon: Package,
      color: 'bg-amber-50 text-amber-700',
      subtext: 'Active in catalog',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiItems.map(({ label, value, change, up, icon: Icon, color, subtext }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-emerald-600">
                {change}
              </span>
              <span className="text-xs text-gray-400">{subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
          </div>
          <div className="h-52 flex items-center justify-center bg-gradient-to-br from-brand-50 to-ivory-200 rounded-xl">
            <div className="text-center">
              <TrendingUp size={40} className="text-brand-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Revenue chart tracking live transactions</p>
              <p className="text-xs text-gray-300">(All systems functional)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="h-52 flex flex-col justify-center gap-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Gross Sales Volume</span>
              <span className="font-bold text-gray-900">{formatPrice(kpis.totalRevenue)}</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Average Order Value</span>
              <span className="font-bold text-gray-900">
                {kpis.totalOrders > 0 ? formatPrice(kpis.totalRevenue / kpis.totalOrders) : '₹0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-brand-600 hover:underline font-medium">View All</a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs font-semibold text-gray-900">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="font-semibold">{formatPrice(order.amount)}</td>
                      <td>
                        <span className={statusClass[order.status] || 'status-badge'}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-xs text-gray-400">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
          </div>
          {topProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No product sales recorded.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {topProducts.map((p: any, i: number) => (
                <div key={p.name} className="flex items-center gap-3 p-4">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.orders} sold · Stock: {p.stock}</p>
                  </div>
                  <p className="text-sm font-bold text-brand-700 flex-shrink-0">{formatPrice(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
