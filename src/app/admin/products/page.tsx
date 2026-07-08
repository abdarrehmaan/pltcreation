import React from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={15} /> Filter
          </button>
        </div>
        <Link href="/admin/products/new" id="add-product-btn" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: mockProducts.length.toString() },
          { label: 'Active', value: mockProducts.length.toString() },
          { label: 'Out of Stock', value: '2' },
          { label: 'Low Stock', value: '4' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
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
              {mockProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt={p.name} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        {p.isNewArrival && <span className="text-[10px] text-gold-600 font-bold">NEW</span>}
                        {p.isBestSeller && <span className="text-[10px] text-brand-600 font-bold ml-1">BESTSELLER</span>}
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-600">{p.category?.name || '—'}</td>
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
                    <span className="status-badge status-delivered">Active</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <a href={`/products/${p.slug}`} target="_blank" className="btn-icon w-8 h-8" title="Preview">
                        <Eye size={14} className="text-gray-500" />
                      </a>
                      <Link href={`/admin/products/${p.id}/edit`} className="btn-icon w-8 h-8" title="Edit">
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
