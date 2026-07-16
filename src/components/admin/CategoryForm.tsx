"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      isActive: true,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setSaving(true);
    try {
      const url = initialData ? `/api/admin/categories/${initialData.id}` : '/api/admin/categories';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(initialData ? 'Category updated successfully!' : 'Category created successfully!');
        router.refresh();
        router.push('/admin/categories');
      } else {
        toast.error(json.error || 'Failed to save category');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-display">
          {initialData ? 'Edit Category' : 'Add New Category'}
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/categories" className="btn-ghost">
            <X size={16} /> Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary py-2 px-6 flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input {...register('name')} className="input-base" placeholder="e.g., Chikankari" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input {...register('slug')} className="input-base" placeholder="chikankari" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} className="input-base h-24 resize-y" placeholder="Brief description of the category..." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Category Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon size={32} className="mb-2 text-gray-400" />
              <p className="font-medium text-sm">Upload Image</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm font-medium text-gray-700">Active (Visible on store)</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
