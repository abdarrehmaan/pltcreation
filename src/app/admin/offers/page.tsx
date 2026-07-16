'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Image as ImageIcon, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'offers' | 'coupons'>('offers');
  
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemType: 'OFFER', // OFFER or COUPON
    // Offer specific fields
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    offerType: 'HOMEPAGE_BANNER',
    // Coupon specific fields
    code: '',
    couponType: 'PERCENTAGE',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    expiresAt: '',
    isActive: true,
  });

  const fetchOffersAndCoupons = async () => {
    try {
      const res = await fetch('/api/admin/offers');
      const json = await res.json();
      if (res.ok) {
        setOffers(json.offers || []);
        setCoupons(json.coupons || []);
      } else {
        setError(json.error || 'Failed to fetch offers and coupons');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersAndCoupons();
  }, []);

  const handleDelete = async (id: string, name: string, itemType: 'OFFER' | 'COUPON') => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType.toLowerCase()} "${name}"?`)) {
      return;
    }

    const promise = fetch(`/api/admin/offers?id=${id}&itemType=${itemType}`, {
      method: 'DELETE',
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchOffersAndCoupons();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    });

    toast.promise(promise, {
      loading: 'Deleting...',
      success: 'Deleted successfully!',
      error: (err) => err.message || 'Could not delete',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        itemType: formData.itemType,
        isActive: formData.isActive,
      };

      if (formData.itemType === 'COUPON') {
        payload.code = formData.code;
        payload.type = formData.couponType;
        payload.value = Number(formData.value);
        payload.minOrderValue = formData.minOrderValue ? Number(formData.minOrderValue) : null;
        payload.maxDiscount = formData.maxDiscount ? Number(formData.maxDiscount) : null;
        payload.expiresAt = formData.expiresAt || null;
      } else {
        payload.title = formData.title;
        payload.description = formData.description;
        payload.imageUrl = formData.imageUrl || `https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=1200&auto=format&fit=crop&q=80`;
        payload.linkUrl = formData.linkUrl;
        payload.type = formData.offerType;
      }

      const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`${formData.itemType === 'COUPON' ? 'Coupon' : 'Offer'} created successfully!`);
        setIsOpen(false);
        // Reset form
        setFormData({
          itemType: 'OFFER',
          title: '',
          description: '',
          imageUrl: '',
          linkUrl: '',
          offerType: 'HOMEPAGE_BANNER',
          code: '',
          couponType: 'PERCENTAGE',
          value: '',
          minOrderValue: '',
          maxDiscount: '',
          expiresAt: '',
          isActive: true,
        });
        await fetchOffersAndCoupons();
      } else {
        toast.error(json.error || 'Failed to save');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'offers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Banners & Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'coupons' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Promo Coupons ({coupons.length})
          </button>
        </div>

        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, itemType: activeTab === 'offers' ? 'OFFER' : 'COUPON' }));
            setIsOpen(true);
          }}
          className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5"
        >
          <Plus size={16} /> Create {activeTab === 'offers' ? 'Offer' : 'Coupon'}
        </button>
      </div>

      {activeTab === 'offers' ? (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {offers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No banner offers created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Title / Description</th>
                    <th>Banner Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr key={o.id}>
                      <td>
                        {o.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={o.imageUrl} alt={o.title} className="w-20 h-10 object-cover rounded-lg border bg-gray-50" />
                        ) : (
                          <div className="w-20 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon size={16} className="text-gray-400" /></div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-gray-900 text-sm">{o.title}</div>
                        <div className="text-xs text-gray-400 max-w-xs truncate">{o.description}</div>
                      </td>
                      <td className="text-sm text-gray-600 font-mono text-xs">
                        {o.type}
                      </td>
                      <td>
                        <span className={`status-badge ${o.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                          {o.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(o.id, o.title, 'OFFER')}
                          className="btn-icon w-8 h-8 hover:bg-red-50 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {coupons.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No promo coupons created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Discount Value</th>
                    <th>Min Order / Max Discount</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-sm font-bold text-brand-700 bg-brand-50/50 px-2.5 py-1 rounded-lg w-fit">
                        {c.code}
                      </td>
                      <td className="text-sm text-gray-600 font-medium">
                        {c.type === 'PERCENTAGE' ? 'Percentage' : c.type === 'FIXED' ? 'Flat Amount' : 'Free Shipping'}
                      </td>
                      <td className="font-bold text-gray-900">
                        {c.type === 'PERCENTAGE' ? `${c.value}%` : formatPrice(Number(c.value))}
                      </td>
                      <td className="text-sm text-gray-500">
                        <div>Min: {c.minOrderValue ? formatPrice(Number(c.minOrderValue)) : '—'}</div>
                        {c.type === 'PERCENTAGE' && <div>Max Cap: {c.maxDiscount ? formatPrice(Number(c.maxDiscount)) : 'No limit'}</div>}
                      </td>
                      <td className="text-xs text-gray-400">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'Never'}
                      </td>
                      <td>
                        <span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(c.id, c.code, 'COUPON')}
                          className="btn-icon w-8 h-8 hover:bg-red-50 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modern Creation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 font-display">
                Create New {formData.itemType === 'COUPON' ? 'Promo Coupon' : 'Banner Offer'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="btn-icon w-8 h-8 text-gray-400 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Item Type</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: 'OFFER' }))}
                    className={`py-1.5 text-xs font-bold rounded-md ${
                      formData.itemType === 'OFFER' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Banner Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: 'COUPON' }))}
                    className={`py-1.5 text-xs font-bold rounded-md ${
                      formData.itemType === 'COUPON' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    Promo Coupon
                  </button>
                </div>
              </div>

              {formData.itemType === 'OFFER' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-base"
                      placeholder="e.g., Diwali Festive Splendor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-base h-20 resize-none"
                      placeholder="e.g., Get flat 20% off on all Chikankari collections."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Banner Type</label>
                      <select
                        name="offerType"
                        value={formData.offerType}
                        onChange={handleInputChange}
                        className="input-base bg-white"
                      >
                        <option value="HOMEPAGE_BANNER">Homepage Banner</option>
                        <option value="CATEGORY_BANNER">Category Banner</option>
                        <option value="PRODUCT_BADGE">Product Badge</option>
                        <option value="POPUP">Newsletter Popup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL</label>
                      <input
                        type="text"
                        name="linkUrl"
                        value={formData.linkUrl}
                        onChange={handleInputChange}
                        className="input-base"
                        placeholder="e.g., /collections/diwali"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Custom Image URL (Optional)</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="input-base"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        name="code"
                        required
                        value={formData.code}
                        onChange={handleInputChange}
                        className="input-base font-mono uppercase"
                        placeholder="E.g., DIWALI20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type</label>
                      <select
                        name="couponType"
                        value={formData.couponType}
                        onChange={handleInputChange}
                        className="input-base bg-white"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Flat Discount (₹)</option>
                        <option value="FREE_SHIPPING">Free Shipping</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Value *</label>
                      <input
                        type="number"
                        name="value"
                        required
                        min="0"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="input-base"
                        placeholder="e.g. 20 or 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Min Order</label>
                      <input
                        type="number"
                        name="minOrderValue"
                        min="0"
                        value={formData.minOrderValue}
                        onChange={handleInputChange}
                        className="input-base"
                        placeholder="e.g. 999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Max Cap</label>
                      <input
                        type="number"
                        name="maxDiscount"
                        min="0"
                        value={formData.maxDiscount}
                        onChange={handleInputChange}
                        className="input-base"
                        placeholder="e.g. 300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="input-base"
                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as Active immediately</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 py-2 flex items-center justify-center gap-1.5"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save {formData.itemType === 'COUPON' ? 'Coupon' : 'Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
