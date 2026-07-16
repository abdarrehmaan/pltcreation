'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const statusClass: Record<string, string> = {
  PENDING: 'status-badge status-pending',
  APPROVED: 'status-badge status-delivered',
  REJECTED: 'status-badge status-cancelled',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const json = await res.json();
      if (res.ok) {
        setReviews(json.reviews || []);
      } else {
        setError(json.error || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, name: string, status: 'APPROVED' | 'REJECTED') => {
    const actionText = status === 'APPROVED' ? 'approving' : 'rejecting';
    const successText = status === 'APPROVED' ? 'Review approved!' : 'Review rejected!';

    const promise = fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchReviews();
      } else {
        throw new Error(data.error || `Failed to update review status`);
      }
    });

    toast.promise(promise, {
      loading: `Processing ${actionText} review from "${name}"...`,
      success: successText,
      error: (err) => err.message || 'Could not update review status',
    });
  };

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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-display">Review Moderation</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No reviews found in the database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.email}</div>
                    </td>
                    <td className="text-sm text-gray-600 font-medium">{r.product}</td>
                    <td className="text-amber-400">{'★'.repeat(r.rating)}</td>
                    <td className="text-sm text-gray-600 max-w-xs">
                      {r.title && <div className="font-semibold text-gray-800">{r.title}</div>}
                      <div className="line-clamp-2" title={r.body}>{r.body}</div>
                    </td>
                    <td>
                      <span className={statusClass[r.status] || 'status-badge'}>
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {r.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(r.id, r.name, 'APPROVED')}
                              className="btn-icon w-8 h-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              title="Approve Review"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, r.name, 'REJECTED')}
                              className="btn-icon w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100"
                              title="Reject Review"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {r.status !== 'PENDING' && (
                          <span className="text-xs text-gray-400">Moderated</span>
                        )}
                      </div>
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
