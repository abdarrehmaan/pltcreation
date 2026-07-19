'use client';

import React, { useState, useEffect } from 'react';
import { Search, Heart, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminSavedProductsPage() {
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchSavedProducts = async () => {
    try {
      const res = await fetch('/api/admin/saved-products');
      const json = await res.json();
      if (res.ok) {
        setSavedProducts(json.savedProducts || []);
      } else {
        setError(json.error || 'Failed to fetch saved products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  const filteredProducts = savedProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
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
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Saved Products (Wishlists)</h2>
          <p className="text-sm text-gray-500">Track which products are saved most by customers</p>
        </div>
        <div className="relative flex-1 w-full max-w-xs sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved products..."
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            <Heart size={32} className="mx-auto text-gray-300 mb-3" />
            No saved products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Total Saves</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                    </td>
                    <td className="text-sm text-gray-600">{p.category}</td>
                    <td className="font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="font-semibold text-gray-900">{formatPrice(p.price)}</td>
                    <td>
                      <div className="flex items-center gap-1.5 font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full w-fit text-sm">
                        <Heart size={14} className="fill-brand-600 stroke-brand-600" />
                        {p.saveCount} saves
                      </div>
                    </td>
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
