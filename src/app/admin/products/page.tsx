'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const json = await res.json();
      if (res.ok) {
        setProducts(json.products || []);
      } else {
        setError(json.error || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    const promise = fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh products list
        await fetchProducts();
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    });

    toast.promise(promise, {
      loading: `Deleting product "${name}"...`,
      success: 'Product deleted successfully!',
      error: (err) => err.message || 'Could not delete product',
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  // Calculate quick stats
  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive).length;
  const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
  const lowStockCount = products.filter((p) => p.totalStock > 0 && p.totalStock <= 5).length;

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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, category or SKU..."
              className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>
        <Link href="/admin/products/new" id="add-product-btn" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: totalCount.toString() },
          { label: 'Active Listings', value: activeCount.toString() },
          { label: 'Out of Stock', value: outOfStockCount.toString() },
          { label: 'Low Stock (≤5)', value: lowStockCount.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No products found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Compare Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          {p.isNewArrival && <span className="text-[9px] bg-gold-50 text-gold-600 px-1 py-0.5 rounded font-bold">NEW</span>}
                          {p.isBestSeller && <span className="text-[9px] bg-brand-50 text-brand-600 px-1 py-0.5 rounded font-bold">BEST</span>}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{p.category}</td>
                    <td className="font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="font-semibold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="text-gray-400 line-through text-sm">{p.comparePrice ? formatPrice(p.comparePrice) : '—'}</td>
                    <td>
                      <span className={`text-sm font-semibold ${
                        p.totalStock === 0 ? 'text-red-500' : p.totalStock <= 5 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {p.totalStock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${p.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        {p.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-icon w-8 h-8" title="Preview">
                          <Eye size={14} className="text-gray-500" />
                        </a>
                        <Link href={`/admin/products/${p.id}/edit`} className="btn-icon w-8 h-8" title="Edit">
                          <Edit size={14} className="text-blue-500" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
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
