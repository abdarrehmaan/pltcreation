'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const json = await res.json();
      if (res.ok) {
        setCustomers(json.customers || []);
      } else {
        setError(json.error || 'Failed to fetch customers');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email or phone..."
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No customers found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email / Phone</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold text-gray-900 text-sm">{c.name}</td>
                    <td className="text-sm text-gray-600">
                      <div>{c.email}</div>
                      <div className="text-xs text-gray-400">{c.phone}</div>
                    </td>
                    <td className="text-sm text-gray-900">{c.orders}</td>
                    <td className="text-sm font-semibold text-gray-900">{formatPrice(c.totalSpent)}</td>
                    <td className="text-sm text-gray-600">
                      {new Date(c.joinedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className="status-badge status-delivered">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
