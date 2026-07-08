"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const collectionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

export default function CollectionForm({ initialData }: { initialData?: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialData || {
      isActive: true,
    },
  });

  const onSubmit = async (data: CollectionFormValues) => {
    console.log('Collection data:', data);
    alert('Collection saved successfully (Mock)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-display">
          {initialData ? 'Edit Collection' : 'Add New Collection'}
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/collections" className="btn-ghost">
            <X size={16} /> Cancel
          </Link>
          <button type="submit" className="btn-primary py-2 px-6">
            <Save size={16} /> Save Collection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name *</label>
                <input {...register('name')} className="input-base" placeholder="e.g., Summer Festive '24" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input {...register('slug')} className="input-base" placeholder="summer-festive-24" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} className="input-base h-24 resize-y" placeholder="Brief description of the collection..." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Banner Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon size={32} className="mb-2 text-gray-400" />
              <p className="font-medium text-sm">Upload Banner</p>
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
