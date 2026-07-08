import React from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { mockCollections } from '@/lib/mock-data';

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search collections..." className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>
        <Link href="/admin/collections/new" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
          <Plus size={16} /> Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Collection Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCollections.map((c) => (
                <tr key={c.id}>
                  <td>
                    {c.bannerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.bannerImage} alt={c.name} className="w-16 h-8 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-8 bg-gray-100 rounded"></div>
                    )}
                  </td>
                  <td className="font-semibold text-gray-900 text-sm">{c.name}</td>
                  <td className="text-sm text-gray-600">{c.slug}</td>
                  <td>
                    <span className="status-badge status-delivered">Active</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Link href={`/admin/collections/${c.id}/edit`} className="btn-icon w-8 h-8" title="Edit">
                        <Edit size={14} className="text-blue-500" />
                      </Link>
                      <button className="btn-icon w-8 h-8" title="Delete">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
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
