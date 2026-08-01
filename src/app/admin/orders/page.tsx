'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, FileText, ExternalLink, Plus, X } from 'lucide-react';
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

  // Manual Order Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingLine1: 'Main Street',
    shippingCity: 'Prayagraj',
    shippingState: 'Uttar Pradesh',
    shippingPincode: '211001',
    productName: 'Women Apparel',
    totalAmount: '',
    paymentMethod: 'UPI',
    razorpayPaymentId: '',
  });

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

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.totalAmount) {
      toast.error('Customer Name, Phone, and Total Amount are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order ${data.order.orderNumber} added successfully!`);
        setIsModalOpen(false);
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          shippingLine1: 'Main Street',
          shippingCity: 'Prayagraj',
          shippingState: 'Uttar Pradesh',
          shippingPincode: '211001',
          productName: 'Women Apparel',
          totalAmount: '',
          paymentMethod: 'UPI',
          razorpayPaymentId: '',
        });
        await fetchOrders();
      } else {
        toast.error(data.error || 'Failed to create order.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error creating order.');
    } finally {
      setIsSubmitting(false);
    }
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

  // Quick stats
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
        <div className="flex gap-3 flex-1 w-full max-w-xl">
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

        {/* ADD MANUAL ORDER BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Add Past / Missing Order</span>
        </button>
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
                  <th>Invoice</th>
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
                    <td className="text-xs text-gray-600">{o.phone}</td>
                    <td>
                      <div className="flex items-center gap-2 py-1">
                        {o.itemsList && o.itemsList.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                            {o.itemsList.slice(0, 3).map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="relative w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shadow-xs flex-shrink-0"
                                title={`${item.name} ${item.size ? `(Size: ${item.size})` : ''} - Qty: ${item.quantity}`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <div className="text-xs text-gray-700">
                          <span className="font-bold text-gray-900">{o.itemsCount || o.items} {(o.itemsCount || o.items) === 1 ? 'item' : 'items'}</span>
                          {o.itemsList?.[0] && (
                            <span className="block text-[11px] text-gray-500 font-medium max-w-[140px] truncate" title={o.itemsList[0].name}>
                              {o.itemsList[0].name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-gray-900">₹{o.amount}</td>
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
                      <Link
                        href={`/invoice?query=${encodeURIComponent(o.orderNumber)}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-xs"
                        title="View & Download Official GST Tax Invoice PDF"
                      >
                        <FileText size={13} className="text-amber-700" />
                        <span>Invoice</span>
                        <ExternalLink size={11} className="text-amber-600" />
                      </Link>
                    </td>
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

      {/* CREATE MANUAL / PAST ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Add Past / Missing Order</h2>
            <p className="text-xs text-gray-500 mb-5">
              Enter the Razorpay payment details to add the order to the Admin Panel and generate a Tax Invoice.
            </p>

            <form onSubmit={handleCreateManualOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Email (Optional)</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Kurti Set"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Total Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="e.g. 1499"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CREDIT_CARD">Credit/Debit Card</option>
                    <option value="NET_BANKING">Net Banking</option>
                    <option value="COD">COD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Razorpay Payment ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.razorpayPaymentId}
                    onChange={(e) => setFormData({ ...formData, razorpayPaymentId: e.target.value })}
                    placeholder="pay_xxxxxxxx"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Order...</span>
                    </>
                  ) : (
                    <span>Add Order & Generate Invoice</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
