import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

const mockOffers = [
  { id: '1', title: 'Summer Fest - 20% OFF', type: 'HOMEPAGE_BANNER', status: 'Active' },
  { id: '2', title: 'Welcome Coupon (WELCOME10)', type: 'COUPON', status: 'Active' },
];

export default function AdminOffersPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-display">Offers & Coupons</h2>
        <Link href="#" className="btn-primary text-sm px-5 py-2.5">
          <Plus size={16} /> Create Offer
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOffers.map((o) => (
              <tr key={o.id}>
                <td className="font-semibold text-gray-900 text-sm">{o.title}</td>
                <td className="text-sm text-gray-600">{o.type}</td>
                <td><span className="status-badge status-delivered">{o.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-icon w-8 h-8"><Edit size={14} className="text-blue-500" /></button>
                    <button className="btn-icon w-8 h-8"><Trash2 size={14} className="text-red-500" /></button>
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
