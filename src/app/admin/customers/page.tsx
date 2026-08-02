'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye, X, MapPin, Wallet, User, ShoppingBag, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

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
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
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
                  <th>Wallet Balance</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold text-gray-900 text-sm">{c.name}</td>
                    <td className="text-sm text-gray-600">
                      <div>{c.email}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.phone}</div>
                    </td>
                    <td className="text-sm text-gray-900">{c.orders}</td>
                    <td className="text-sm font-semibold text-gray-900">{formatPrice(c.totalSpent)}</td>
                    <td className="text-sm font-semibold text-brand-600">{formatPrice(c.wallet?.balance || 0)}</td>
                    <td className="text-sm text-gray-600">
                      {new Date(c.joinedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL MODAL / DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 font-bold text-lg flex items-center justify-center border border-brand-100">
                  {selectedCustomer.name ? selectedCustomer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <p className="text-xs text-gray-500">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Settings Overview */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold uppercase">Profile Settings</span>
                <span className="font-bold text-gray-900 text-sm">{selectedCustomer.name}</span>
                <span className="text-gray-500 block">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase">Joined On</span>
                <span className="font-semibold text-gray-900">
                  {new Date(selectedCustomer.joinedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase">Total Orders / Spent</span>
                <span className="font-bold text-gray-900 text-sm">
                  {selectedCustomer.orders} Orders ({formatPrice(selectedCustomer.totalSpent)})
                </span>
              </div>
            </div>

            {/* Saved Addresses Section */}
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-brand-600" /> Saved Addresses ({selectedCustomer.addresses?.length || 0})
              </h3>
              {(!selectedCustomer.addresses || selectedCustomer.addresses.length === 0) ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl">No saved addresses on file for this customer.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCustomer.addresses.map((addr: any) => (
                    <div key={addr.id} className="border border-gray-200 rounded-xl p-3 bg-white text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>{addr.fullName}</span>
                        {addr.isDefault && <span className="bg-brand-50 text-brand-700 text-[10px] px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-gray-500 font-mono">{addr.phone}</p>
                      <p className="text-gray-700">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet Section */}
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-brand-600" /> My Wallet (Balance: {formatPrice(selectedCustomer.wallet?.balance || 0)})
              </h3>
              {(!selectedCustomer.wallet?.transactions || selectedCustomer.wallet.transactions.length === 0) ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl">No wallet activity logged.</p>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs max-h-44 overflow-y-auto divide-y divide-gray-100">
                  {selectedCustomer.wallet.transactions.map((tx: any) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        {tx.type === 'CREDIT' ? (
                          <ArrowDownLeft size={14} className="text-green-600" />
                        ) : (
                          <ArrowUpRight size={14} className="text-red-600" />
                        )}
                        <span>{tx.description}</span>
                      </div>
                      <span className={`font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{formatPrice(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History Summary */}
            <div>
              <h3 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <ShoppingBag size={16} className="text-brand-600" /> Order History ({selectedCustomer.ordersList?.length || 0})
              </h3>
              {(!selectedCustomer.ordersList || selectedCustomer.ordersList.length === 0) ? (
                <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-xl">No orders placed yet.</p>
              ) : (
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs divide-y divide-gray-100">
                  {selectedCustomer.ordersList.map((ord: any) => (
                    <div key={ord.id} className="p-3 flex items-center justify-between bg-white">
                      <span className="font-mono font-bold text-gray-900">{ord.orderNumber}</span>
                      <span className="text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="font-bold text-gray-900">{formatPrice(ord.total)}</span>
                      <span className="status-badge status-delivered">{ord.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-ghost text-xs py-2 px-5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
