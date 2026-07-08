import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const mockReturns = [
  { id: '1', orderId: 'ORD-2026-8899', customer: 'Priya Sharma', reason: 'Size too small', status: 'REQUESTED', amount: 2999 },
  { id: '2', orderId: 'ORD-2026-7755', customer: 'Ayesha Khan', reason: 'Defective item', status: 'APPROVED', amount: 5200 },
];

export default function AdminReturnsPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-display">Return Requests</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Reason</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReturns.map((r) => (
              <tr key={r.id}>
                <td className="font-semibold text-brand-600 text-sm hover:underline cursor-pointer">{r.orderId}</td>
                <td className="text-sm text-gray-900">{r.customer}</td>
                <td className="text-sm text-gray-600">{r.reason}</td>
                <td className="text-sm font-medium">₹{r.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${r.status === 'APPROVED' ? 'status-delivered' : 'status-pending'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-icon w-8 h-8" title="View Details"><Eye size={14} /></button>
                    {r.status === 'REQUESTED' && (
                      <>
                        <button className="btn-icon w-8 h-8 text-emerald-600" title="Approve"><CheckCircle size={14} /></button>
                        <button className="btn-icon w-8 h-8 text-red-600" title="Reject"><XCircle size={14} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
