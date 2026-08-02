'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function SavedAddressesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/account/addresses?userId=${user.id}`);
      const json = await res.json();
      if (res.ok) {
        setAddresses(json.addresses || []);
      } else {
        toast.error(json.error || 'Failed to load addresses');
      }
    } catch (err: any) {
      toast.error('Network error loading addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setForm({
      fullName: user?.name || '',
      phone: user?.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setShowForm(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);
    try {
      const url = '/api/account/addresses';
      const method = editingAddress ? 'PUT' : 'POST';
      const payload = editingAddress
        ? { id: editingAddress.id, userId: user.id, ...form }
        : { userId: user.id, ...form };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        setShowForm(false);
        fetchAddresses();
      } else {
        toast.error(json.error || 'Failed to save address');
      }
    } catch (err: any) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Address deleted!');
        fetchAddresses();
      } else {
        const json = await res.json();
        toast.error(json.error || 'Failed to delete address');
      }
    } catch (err: any) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addr: Address) => {
    if (!user?.id || addr.isDefault) return;

    try {
      const res = await fetch('/api/account/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addr, userId: user.id, isDefault: true }),
      });

      if (res.ok) {
        toast.success('Default address updated!');
        fetchAddresses();
      }
    } catch (err: any) {
      toast.error('Failed to set default address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-screen py-10">
      <div className="container-plt max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Account
          </Link>
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <Plus size={16} /> Add New Address
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <MapPin className="text-brand-600" size={24} /> Saved Delivery Addresses
          </h1>
          <p className="text-gray-500 text-sm">Manage your shipping addresses for faster checkout</p>
        </div>

        {/* Address Form Modal / Inline Section */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-card mb-6 border-2 border-brand-100">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">
              {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="input-base text-sm"
                    placeholder="Recipient's name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-base text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="input-base text-sm"
                  placeholder="House/Flat No., Building Name, Street"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  className="input-base text-sm"
                  placeholder="Landmark, Area, Colony"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input-base text-sm"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="input-base text-sm"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="input-base text-sm"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span className="text-xs font-medium text-gray-700">Set as default delivery address</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-6 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />} Save Address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address Cards List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card text-gray-500 text-sm">
            <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700 mb-1">No saved addresses yet</p>
            <p className="text-xs text-gray-500 mb-4">Add your delivery address for a faster checkout experience.</p>
            <button onClick={handleOpenAdd} className="btn-primary py-2 px-5 text-xs">
              + Add Address Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white rounded-2xl p-5 shadow-card border relative flex flex-col justify-between ${
                  addr.isDefault ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 text-sm">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1 font-mono">{addr.phone}</p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ''}
                    <br />
                    {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-brand-600 font-semibold hover:underline"
                    >
                      Make Default
                    </button>
                  ) : (
                    <span className="text-gray-400">Default Address</span>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEdit(addr)}
                      className="text-gray-500 hover:text-brand-600 flex items-center gap-1 font-medium"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
