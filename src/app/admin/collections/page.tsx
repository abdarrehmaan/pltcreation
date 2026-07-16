'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections');
      const json = await res.json();
      if (res.ok) {
        setCollections(json.collections || []);
      } else {
        setError(json.error || 'Failed to fetch collections');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete collection "${name}"?`)) {
      return;
    }

    const promise = fetch(`/api/admin/collections/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchCollections();
      } else {
        throw new Error(data.error || 'Failed to delete collection');
      }
    });

    toast.promise(promise, {
      loading: `Deleting collection "${name}"...`,
      success: 'Collection deleted successfully!',
      error: (err) => err.message || 'Could not delete collection',
    });
  };

  // Filter collections
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections by name or slug..."
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <Link href="/admin/collections/new" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
          <Plus size={16} /> Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredCollections.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No collections found matching filters.</div>
        ) : (
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
                {filteredCollections.map((c) => (
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
                      <span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-returned'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Link href={`/admin/collections/${c.id}/edit`} className="btn-icon w-8 h-8" title="Edit">
                          <Edit size={14} className="text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="btn-icon w-8 h-8"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
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
