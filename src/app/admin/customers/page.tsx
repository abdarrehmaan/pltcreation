import React from 'react';
import { Search } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543210', orders: 5, totalSpent: 14500, joinedAt: '2025-10-15' },
  { id: '2', name: 'Ayesha Khan', email: 'ayesha@example.com', phone: '+91 8765432109', orders: 2, totalSpent: 5200, joinedAt: '2026-01-20' },
  { id: '3', name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 7654321098', orders: 12, totalSpent: 38900, joinedAt: '2024-11-05' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search customers..." className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
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
              {mockCustomers.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold text-gray-900 text-sm">{c.name}</td>
                  <td className="text-sm text-gray-600">
                    <div>{c.email}</div>
                    <div className="text-xs text-gray-400">{c.phone}</div>
                  </td>
                  <td className="text-sm text-gray-900">{c.orders}</td>
                  <td className="text-sm font-semibold text-gray-900">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="text-sm text-gray-600">{new Date(c.joinedAt).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge status-delivered">Active</span>
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
