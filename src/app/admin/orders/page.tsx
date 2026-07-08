import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const orders = [
  { id: 'HFZ-1001', customer: 'Priya Sharma', phone: '98765 43210', items: 2, amount: 4998, payment: 'UPI', status: 'Delivered', date: '10 Jun 2026' },
  { id: 'HFZ-1002', customer: 'Fatima Khan', phone: '91234 56789', items: 1, amount: 3299, payment: 'Card', status: 'Shipped', date: '10 Jun 2026' },
  { id: 'HFZ-1003', customer: 'Ananya Patel', phone: '99887 76655', items: 3, amount: 7200, payment: 'UPI', status: 'Processing', date: '9 Jun 2026' },
  { id: 'HFZ-1004', customer: 'Meera Reddy', phone: '87654 32109', items: 1, amount: 899, payment: 'COD', status: 'Confirmed', date: '9 Jun 2026' },
  { id: 'HFZ-1005', customer: 'Sana Mirza', phone: '76543 21098', items: 2, amount: 5598, payment: 'NetBanking', status: 'Pending', date: '8 Jun 2026' },
  { id: 'HFZ-1006', customer: 'Riya Bose', phone: '65432 10987', items: 1, amount: 2499, payment: 'COD', status: 'Cancelled', date: '7 Jun 2026' },
];

const statusClass: Record<string, string> = {
  Delivered: 'status-badge status-delivered',
  Shipped: 'status-badge status-shipped',
  Processing: 'status-badge status-processing',
  Confirmed: 'status-badge status-confirmed',
  Pending: 'status-badge status-pending',
  Cancelled: 'status-badge status-cancelled',
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All Orders', value: '1,247', color: 'text-gray-900' },
          { label: 'Pending', value: '62', color: 'text-amber-600' },
          { label: 'Processing', value: '124', color: 'text-purple-600' },
          { label: 'Shipped', value: '186', color: 'text-blue-600' },
          { label: 'Delivered', value: '842', color: 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by order ID or customer..." className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none" />
          </div>
          <select className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download size={15} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
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
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs font-bold text-gray-900">{o.id}</td>
                  <td className="font-medium text-gray-900">{o.customer}</td>
                  <td className="text-sm text-gray-500">{o.phone}</td>
                  <td>{o.items}</td>
                  <td className="font-bold">{formatPrice(o.amount)}</td>
                  <td><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">{o.payment}</span></td>
                  <td><span className={statusClass[o.status]}>{o.status}</span></td>
                  <td className="text-xs text-gray-400">{o.date}</td>
                  <td>
                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
                      <option>Update Status</option>
                      <option>Confirm</option>
                      <option>Processing</option>
                      <option>Ship</option>
                      <option>Deliver</option>
                      <option>Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
