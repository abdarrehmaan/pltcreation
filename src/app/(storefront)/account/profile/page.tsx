'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, ArrowLeft, Loader2, Save, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/account/profile?id=${user.id}`);
        const json = await res.json();
        if (res.ok && json.user) {
          setForm({
            name: json.user.name || user.name || '',
            email: json.user.email || user.email || '',
            phone: json.user.phone || user.phone || '',
          });
        } else {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          });
        }
      } catch (err) {
        setForm({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          phone: form.phone,
        }),
      });

      const json = await res.json();
      if (res.ok && json.user) {
        // Update local Zustand auth state with new name & phone
        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, name: json.user.name, phone: json.user.phone } : null,
        }));
        toast.success('Profile updated successfully!');
      } else {
        toast.error(json.error || 'Failed to update profile');
      }
    } catch (err: any) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
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
      <div className="container-plt max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Account
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <UserIcon className="text-brand-600" size={24} /> Profile Settings
          </h1>
          <p className="text-gray-500 text-sm">Manage your personal information and contact details</p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-base pl-10 text-sm"
                  placeholder="Your full name"
                />
                <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Email Address (Registered)
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={form.email}
                  className="input-base pl-10 text-sm bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Email address cannot be changed as it is tied to your account login.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-base pl-10 text-sm"
                  placeholder="10-digit mobile number"
                />
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck size={16} className="text-green-600" /> Encrypted & Secure Data
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
