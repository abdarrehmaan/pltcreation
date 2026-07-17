"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Image as ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

const collectionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function CollectionForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.bannerImage || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialData || {
      isActive: true,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('Collection banner uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}. Make sure you created a public bucket named "products" in Supabase!`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const onSubmit = async (data: CollectionFormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        slug: slugify(data.slug),
        bannerImage: imageUrl || null,
      };

      const url = initialData ? `/api/admin/collections/${initialData.id}` : '/api/admin/collections';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(initialData ? 'Collection updated successfully!' : 'Collection created successfully!');
        router.refresh();
        router.push('/admin/collections');
      } else {
        toast.error(json.error || 'Failed to save collection');
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
          {initialData ? 'Edit Collection' : 'Add New Collection'}
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/collections" className="btn-ghost">
            <X size={16} /> Cancel
          </Link>
          <button type="submit" disabled={saving || uploading} className="btn-primary py-2 px-6 flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Collection
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
            
            {/* Image Preview */}
            {imageUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-4 aspect-[2/1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Collection Banner" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin mb-2 text-brand-600" size={24} />
                      <p className="font-medium text-sm text-brand-600">Uploading banner...</p>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="mb-2 text-gray-400" />
                      <p className="font-medium text-sm">Upload Banner Image</p>
                      <p className="text-xs mt-1 text-gray-400">Supports JPG, PNG, WEBP</p>
                    </>
                  )}
                </div>
              </>
            )}
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
