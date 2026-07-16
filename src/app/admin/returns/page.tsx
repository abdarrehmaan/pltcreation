'use client';

import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReturns = async () => {
    try {
      const res = await fetch('/api/admin/returns');
      const json = await res.json();
      if (res.ok) {
        setReturns(json.returns || []);
      } else {
        setError(json.error || 'Failed to fetch return requests');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const promise = fetch('/api/admin/returns', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchReturns();
      } else {
        throw new Error(data.error || 'Failed to update return request');
      }
    });

    toast.promise(promise, {
      loading: 'Updating return request status...',
      success: `Return request ${status.toLowerCase()} successfully!`,
      error: (err) => err.message || 'Could not update return request',
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
        <h2 className="text-xl font-bold text-gray-900 font-display">Return Requests</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {returns.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No return requests recorded.</div>
        ) : (
          <div className="overflow-x-auto">
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
                {returns.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-brand-600 text-sm hover:underline cursor-pointer">{r.orderId}</td>
                    <td className="text-sm text-gray-900">{r.customer}</td>
                    <td className="text-sm text-gray-600">{r.reason}</td>
                    <td className="text-sm font-medium">₹{r.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`status-badge ${r.status === 'APPROVED' ? 'status-delivered' : r.status === 'REJECTED' ? 'status-cancelled' : 'status-pending'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-icon w-8 h-8" title="View Details"><Eye size={14} /></button>
                        {r.status === 'REQUESTED' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'APPROVED')}
                              className="btn-icon w-8 h-8 text-emerald-600"
                              title="Approve"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'REJECTED')}
                              className="btn-icon w-8 h-8 text-red-600"
                              title="Reject"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
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
