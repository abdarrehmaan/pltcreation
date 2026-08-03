'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Sliders, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    prepaidDiscountPercent: 5,
    codAdvancePercent: 0,
    freeShippingThreshold: 1499,
    standardShippingCharge: 99,
    taxPercent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (res.ok && json.settings) {
        setSettings(json.settings);
      }
    } catch (err: any) {
      console.error('Failed to fetch site settings:', err);
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
      [name]: value === '' ? '' : Number(value),
    }));
    setSavedSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (res.ok && (json.success || json.settings)) {
        toast.success('System settings saved successfully!');
        setSavedSuccess(true);
        if (json.settings) {
          setSettings(json.settings);
        }
      } else {
        toast.error(json.error || 'Failed to save settings');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-amber-600" size={36} />
        <p className="text-sm font-medium text-gray-500">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl pb-12">
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-amber-600" size={24} />
            <h1 className="text-2xl font-extrabold font-serif text-gray-900 tracking-wide">
              System Settings
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure checkout rules, shipping fees, discounts, and default taxes
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          title="Reload Settings"
        >
          <RefreshCw size={14} />
          <span>Reload</span>
        </button>
      </div>

      {/* SETTINGS FORM CARD */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Prepaid Discount */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Prepaid Order Discount (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="prepaidDiscountPercent"
                min="0"
                max="100"
                step="0.01"
                value={settings.prepaidDiscountPercent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="e.g. 5"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Discount percentage applied automatically when payment mode is PREPAID / Online.
            </p>
          </div>

          {/* 2. COD Advance */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              COD Advance Payment (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="codAdvancePercent"
                min="0"
                max="100"
                step="0.01"
                value={settings.codAdvancePercent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="e.g. 0"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Advance percentage required for COD orders (Set 0 to disable advance).
            </p>
          </div>

          {/* 3. Free Shipping Threshold */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Free Shipping Minimum Threshold (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-gray-400">₹</span>
              <input
                type="number"
                name="freeShippingThreshold"
                min="0"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="e.g. 1499"
                required
              />
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Order subtotal threshold above which shipping is completely free for customer.
            </p>
          </div>

          {/* 4. Standard Shipping Charge */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Standard Shipping Charge (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xs font-bold text-gray-400">₹</span>
              <input
                type="number"
                name="standardShippingCharge"
                min="0"
                step="0.01"
                value={settings.standardShippingCharge}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="e.g. 99"
                required
              />
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Standard shipping fee applied when order total is below the threshold.
            </p>
          </div>

          {/* 5. GST / Tax Percent */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-bold text-gray-900">
              GST / Tax Percent (%)
            </label>
            <div className="relative max-w-md">
              <input
                type="number"
                name="taxPercent"
                min="0"
                max="100"
                step="0.01"
                value={settings.taxPercent}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                placeholder="e.g. 0"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">%</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Default tax rate applied to products at store checkout.
            </p>
          </div>
        </div>

        {/* SUBMIT BUTTON & SUCCESS FEEDBACK */}
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold">
            {savedSuccess ? (
              <span className="text-green-600 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> All settings saved and active!
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1">
                <ShieldCheck size={16} /> System rules update instantly
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-700 to-rose-900 text-white hover:from-red-800 hover:to-rose-950 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save System Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
