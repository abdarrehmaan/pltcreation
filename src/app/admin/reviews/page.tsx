import React from 'react';
import { mockReviews } from '@/lib/mock-data';
import { Check, X } from 'lucide-react';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-display">Review Moderation</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReviews.map((r) => (
              <tr key={r.id}>
                <td className="font-semibold text-gray-900 text-sm">{r.name}</td>
                <td className="text-amber-400">{'★'.repeat(r.rating)}</td>
                <td className="text-sm text-gray-600 max-w-xs truncate">{r.body}</td>
                <td><span className="status-badge status-pending">Pending Approval</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-icon w-8 h-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"><Check size={14} /></button>
                    <button className="btn-icon w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100"><X size={14} /></button>
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
