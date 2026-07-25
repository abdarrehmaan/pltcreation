'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    prepaidDiscountPercent: 5,
    codAdvancePercent: 0,
    freeShippingThreshold: 999,
    standardShippingCharge: 99,
    taxPercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cleaningStorage, setCleaningStorage] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (res.ok) {
        setSettings(json.settings);
      } else {
        setError(json.error || 'Failed to fetch settings');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Site settings updated successfully!');
      } else {
        toast.error(json.error || 'Failed to save settings');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSampleData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL sample and seed data (products, categories, collections, orders, offers, coupons)? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      const res = await fetch('/api/admin/clear-data', { method: 'POST' });
      const json = await res.json();

      if (res.ok && json.success) {
        toast.success('All sample data cleared successfully! Admin panel is now clean.');
      } else {
        toast.error(json.error || 'Failed to clear sample data');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setClearing(false);
    }
  };

  const handleStorageCleanup = async () => {
    if (!window.confirm('Scan Supabase storage bucket and delete all orphaned image files that are not linked to any active product?')) {
      return;
    }

    setCleaningStorage(true);
    try {
      const res = await fetch('/api/admin/storage-cleanup', { method: 'POST' });
      const json = await res.json();

      if (res.ok && json.success) {
        toast.success(json.message || 'Unused storage images cleaned up!');
      } else {
        toast.error(json.error || json.message || 'Storage cleanup failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during storage cleanup');
    } finally {
      setCleaningStorage(false);
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-display">System Settings</h2>
        <p className="text-sm text-gray-500">Configure checkout rules, shipping fees, discounts, and taxes</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prepaid Order Discount (%)</label>
            <input
              type="number"
              name="prepaidDiscountPercent"
              min="0"
              max="100"
              step="0.01"
              value={settings.prepaidDiscountPercent}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. 5"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Discount percentage applied when payment mode is PREPAID.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">COD Advance Payment (%)</label>
            <input
              type="number"
              name="codAdvancePercent"
              min="0"
              max="100"
              step="0.01"
              value={settings.codAdvancePercent}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. 0"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Advance percentage required for COD orders (0 to disable).</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Minimum Threshold (₹)</label>
            <input
              type="number"
              name="freeShippingThreshold"
              min="0"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. 999"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Order value threshold above which shipping is free.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Standard Shipping Charge (₹)</label>
            <input
              type="number"
              name="standardShippingCharge"
              min="0"
              step="0.01"
              value={settings.standardShippingCharge}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. 99"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Standard charge applied when order value is below the threshold.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">GST / Tax Percent (%)</label>
            <input
              type="number"
              name="taxPercent"
              min="0"
              max="100"
              step="0.01"
              value={settings.taxPercent}
              onChange={handleChange}
              className="input-base"
              placeholder="e.g. 0"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Default tax rate applied to products at checkout.</p>
          </div>
        </div>

        <div className="border-t pt-5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm font-semibold"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save System Settings
          </button>
        </div>
      </form>

      {/* Danger Zone & Maintenance */}
      <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-red-900 text-base">System Maintenance & Cleanup</h3>
        <p className="text-xs text-red-700 leading-relaxed">
          Manage sample data and clean up unused media files in Supabase storage.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleClearSampleData}
            disabled={clearing}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            {clearing ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            {clearing ? 'Clearing Data...' : 'Remove All Sample Data'}
          </button>

          <button
            type="button"
            onClick={handleStorageCleanup}
            disabled={cleaningStorage}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            {cleaningStorage ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            {cleaningStorage ? 'Scanning & Purging Storage...' : 'Cleanup Unused Storage Images'}
          </button>
        </div>
      </div>
    </div>
  );
}
