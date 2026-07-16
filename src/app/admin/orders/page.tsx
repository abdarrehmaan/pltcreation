'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusClass: Record<string, string> = {
  DELIVERED: 'status-badge status-delivered',
  SHIPPED: 'status-badge status-shipped',
  PROCESSING: 'status-badge status-processing',
  CONFIRMED: 'status-badge status-confirmed',
  PENDING: 'status-badge status-pending',
  CANCELLED: 'status-badge status-cancelled',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (res.ok) {
        setOrders(json.orders || []);
      } else {
        setError(json.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (status === 'Update Status') return;

    const promise = fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh orders list
        await fetchOrders();
      } else {
        throw new Error(data.error || 'Failed to update order status');
      }
    });

    toast.promise(promise, {
      loading: 'Updating order status...',
      success: 'Order status updated successfully!',
      error: (err) => err.message || 'Could not update status',
    });
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);

    const matchesStatus =
      statusFilter === 'All Status' ||
      o.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const processingCount = orders.filter((o) => o.status === 'PROCESSING').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

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
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All Orders', value: totalCount, color: 'text-gray-900' },
          { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
          { label: 'Processing', value: processingCount, color: 'text-purple-600' },
          { label: 'Shipped', value: shippedCount, color: 'text-blue-600' },
          { label: 'Delivered', value: deliveredCount, color: 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none"
          >
            <option>All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No orders found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                      <td className="font-mono text-xs font-bold text-brand-700 hover:underline">
                        <Link href={`/admin/orders/${o.id}`}>{o.orderNumber}</Link>
                      </td>
                    <td className="font-medium text-gray-900">{o.customer}</td>
                    <td className="text-sm text-gray-500">{o.phone}</td>
                    <td>{o.items}</td>
                    <td className="font-bold">{formatPrice(o.amount)}</td>
                    <td>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        {o.payment}
                      </span>
                    </td>
                    <td>
                      <span className={statusClass[o.status] || 'status-badge'}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">{o.date}</td>
                    <td>
                      <select
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        defaultValue="Update Status"
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                      >
                        <option disabled value="Update Status">Update Status</option>
                        <option value="CONFIRM">Confirm</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIP">Ship</option>
                        <option value="DELIVER">Deliver</option>
                        <option value="CANCEL">Cancel</option>
                      </select>
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
