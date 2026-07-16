'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (res.ok) {
        setCategories(json.categories || []);
      } else {
        setError(json.error || 'Failed to fetch categories');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    const promise = fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchCategories();
      } else {
        throw new Error(data.error || 'Failed to delete category');
      }
    });

    toast.promise(promise, {
      loading: `Deleting category "${name}"...`,
      success: 'Category deleted successfully!',
      error: (err) => err.message || 'Could not delete category',
    });
  };

  // Filter categories
  const filteredCategories = categories.filter((c) =>
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
            placeholder="Search categories by name or slug..."
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <Link href="/admin/categories/new" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
          <Plus size={16} /> Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No categories found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((c) => (
                  <tr key={c.id}>
                    <td className="font-semibold text-gray-900 text-sm">{c.name}</td>
                    <td className="text-sm text-gray-600">{c.slug}</td>
                    <td className="text-sm font-semibold text-gray-900">{c.productsCount}</td>
                    <td>
                      <span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-returned'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Link href={`/admin/categories/${c.id}/edit`} className="btn-icon w-8 h-8" title="Edit">
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
