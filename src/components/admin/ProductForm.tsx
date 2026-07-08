"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required'),
  sku: z.string().min(3, 'SKU is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  comparePrice: z.coerce.number().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  isBestSeller: z.boolean(),
  totalStock: z.coerce.number().min(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any; // You can strongly type this based on your Prisma model
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      totalStock: 10,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    console.log('Form data:', data);
    // Here you would normally POST or PUT to your API
    alert('Product saved successfully (Mock)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-display">
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn-ghost">
            <X size={16} /> Cancel
          </Link>
          <button type="submit" className="btn-primary py-2 px-6">
            <Save size={16} /> Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input {...register('name')} className="input-base" placeholder="e.g., Hand-embroidered Chikankari Kurta" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input {...register('slug')} className="input-base" placeholder="chikankari-kurta" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input {...register('sku')} className="input-base" placeholder="HIF-CHK-001" />
                  {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea {...register('description')} className="input-base h-32 resize-y" placeholder="Detailed product description..." />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" step="0.01" {...register('price')} className="input-base" placeholder="2999.00" />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price (₹)</label>
                <input type="number" step="0.01" {...register('comparePrice')} className="input-base" placeholder="3999.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock *</label>
                <input type="number" {...register('totalStock')} className="input-base" placeholder="10" />
              </div>
            </div>
          </div>

          {/* Images (Mock placeholder) */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon size={32} className="mb-2 text-gray-400" />
              <p className="font-medium">Click to upload images</p>
              <p className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select {...register('categoryId')} className="input-base bg-white">
                  <option value="">Select Category</option>
                  <option value="cat_1">Chikankari</option>
                  <option value="cat_2">Kurtis</option>
                  <option value="cat_3">Stitched Suits</option>
                  <option value="cat_4">Unstitched Suits</option>
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Status & Visibility</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-medium text-gray-700">Active (Visible on store)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isNewArrival')} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-medium text-gray-700">Mark as New Arrival</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isBestSeller')} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm font-medium text-gray-700">Mark as Best Seller</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
