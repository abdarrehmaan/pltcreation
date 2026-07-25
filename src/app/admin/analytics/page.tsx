'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || 'Failed to load analytics');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  const { kpis, topProducts } = data;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(kpis.totalRevenue), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: 'Total Orders', value: kpis.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-100' },
    { label: 'Total Customers', value: kpis.totalCustomers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Active Catalog', value: `${kpis.totalProducts} Items`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Analytics Dashboard</h2>
          <p className="text-xs text-gray-500">Live database metrics and performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon size={24} className={color} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Live DB</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Top Products Performance */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Top Performing Products</h3>
        {topProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No sales recorded yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topProducts.map((p: any, idx: number) => (
              <div key={p.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.orders} units sold · Stock: {p.stock}</p>
                  </div>
                </div>
                <p className="font-bold text-brand-700 text-sm">{formatPrice(p.revenue)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
