"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Image as ImageIcon, Loader2, Trash2, Upload, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

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
  initialData?: any;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; alt: string; color?: string }[]>(
    initialData?.images || []
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      totalStock: 10,
    },
  });

  // State for colors selector
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(() => {
    if (initialData?.variants) {
      const uniqueColors: { name: string; hex: string }[] = [];
      const seen = new Set();
      initialData.variants.forEach((v: any) => {
        const colorName = v.color || 'Default';
        if (colorName !== 'Default' && !seen.has(colorName)) {
          seen.add(colorName);
          uniqueColors.push({ name: colorName, hex: v.colorHex || '#CCCCCC' });
        }
      });
      return uniqueColors;
    }
    return [];
  });

  // State for sizes selector
  const [sizes, setSizes] = useState<string[]>(() => {
    if (initialData?.variants) {
      const uniqueSizes = new Set<string>();
      initialData.variants.forEach((v: any) => {
        const sizeName = v.size || 'Free Size';
        if (sizeName !== 'Free Size' || initialData.variants.length > 1 || (initialData.variants.length === 1 && v.color !== 'Default')) {
          uniqueSizes.add(sizeName);
        }
      });
      return Array.from(uniqueSizes);
    }
    return [];
  });

  // State for variant stocks
  const [variantStock, setVariantStock] = useState<Record<string, number>>(() => {
    if (initialData?.variants) {
      const stocks: Record<string, number> = {};
      initialData.variants.forEach((v: any) => {
        stocks[`${v.size}-${v.color}`] = v.stock;
      });
      return stocks;
    }
    return {};
  });

  // Inputs for adding colors
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#6B2D4F'); // Default brand color
  
  // Custom size input
  const [customSizeInput, setCustomSizeInput] = useState('');

  const addColor = () => {
    if (!newColorName.trim()) return;
    const name = newColorName.trim();
    if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Color already exists');
      return;
    }
    setColors([...colors, { name, hex: newColorHex }]);
    setNewColorName('');
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const toggleStandardSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const addCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const size = customSizeInput.trim().toUpperCase();
    if (sizes.includes(size)) {
      toast.error('Size already exists');
      return;
    }
    setSizes([...sizes, size]);
    setCustomSizeInput('');
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  // Generate active combinations
  const getCombinations = () => {
    const activeSizes = sizes.length > 0 ? sizes : ['Free Size'];
    const activeColors = colors.length > 0 ? colors : [{ name: 'Default', hex: '#CCCCCC' }];

    // If both colors and sizes are empty, we return an empty array (simple product)
    if (sizes.length === 0 && colors.length === 0) {
      return [];
    }

    const combos: { size: string; colorName: string; colorHex: string }[] = [];
    activeSizes.forEach((size) => {
      activeColors.forEach((color) => {
        combos.push({
          size,
          colorName: color.name,
          colorHex: color.hex,
        });
      });
    });
    return combos;
  };

  const combinations = getCombinations();
  const hasVariants = combinations.length > 0;

  useEffect(() => {
    if (hasVariants) {
      const total = combinations.reduce((sum, combo) => {
        const key = `${combo.size}-${combo.colorName}`;
        return sum + (variantStock[key] || 0);
      }, 0);
      setValue('totalStock', total);
    }
  }, [variantStock, sizes, colors, setValue, hasVariants]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const json = await res.json();
        if (res.ok) {
          setCategories(json.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

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

        setUploadedImages((prev) => [...prev, { url: publicUrl, alt: file.name }]);
      }
      toast.success('Images uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}. Make sure you created a public bucket named "products" in Supabase!`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setSaving(true);
    try {
      let finalVariants: { size: string; color: string; colorHex?: string; stock: number }[] = [];
      if (hasVariants) {
        finalVariants = combinations.map((combo) => {
          const key = `${combo.size}-${combo.colorName}`;
          return {
            size: combo.size,
            color: combo.colorName,
            colorHex: combo.colorName === 'Default' ? undefined : combo.colorHex,
            stock: variantStock[key] || 0,
          };
        });
      } else {
        finalVariants = [
          {
            size: 'Free Size',
            color: 'Default',
            colorHex: '#CCCCCC',
            stock: data.totalStock,
          },
        ];
      }

      const payload = {
        ...data,
        slug: slugify(data.slug),
        images: uploadedImages,
        variants: finalVariants,
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(initialData ? 'Product updated successfully!' : 'Product created successfully!');
        router.refresh();
        router.push('/admin/products');
      } else {
        toast.error(json.error || 'Failed to save product');
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
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn-ghost">
            <X size={16} /> Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary py-2 px-6 flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            Save Product
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
                <input 
                  type="number" 
                  {...register('totalStock')} 
                  className={cn("input-base", hasVariants && "bg-gray-50 cursor-not-allowed")} 
                  placeholder="10" 
                  readOnly={hasVariants}
                />
                {hasVariants && (
                  <p className="text-gray-400 text-[10px] mt-1">Automatically calculated from variant stocks.</p>
                )}
              </div>
            </div>
          </div>

          {/* Product Variants & Inventory */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 font-display">Product Variants</h3>
            <p className="text-xs text-gray-400 mb-6">
              Create product variants if this item has multiple sizes or colors. Otherwise, leave this section empty.
            </p>

            <div className="space-y-6">
              {/* Color Management */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color Variants</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colors.map((color, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-800 shadow-sm"
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeColor(index)} 
                        className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {colors.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No color variants added yet.</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input 
                    type="text" 
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color Name (e.g. Yellow)" 
                    className="input-base text-sm py-1.5"
                  />
                  <div className="relative flex items-center border border-gray-300 rounded-xl overflow-hidden px-2 bg-white">
                    <input 
                      type="color" 
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono ml-2 uppercase">{newColorHex}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={addColor} 
                    className="btn-ghost py-1.5 px-4 text-xs font-bold border border-gray-300 hover:bg-gray-50"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* Size Management */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Size Variants</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((size) => {
                    const isSelected = sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleStandardSize(size)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all",
                          isSelected 
                            ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Custom and Active Sizes list */}
                {sizes.some(s => !['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].includes(s)) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sizes.filter(s => !['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].includes(s)).map((size) => (
                      <div 
                        key={size} 
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-800 shadow-sm"
                      >
                        <span>{size}</span>
                        <button 
                          type="button" 
                          onClick={() => removeSize(size)} 
                          className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 max-w-xs">
                  <input 
                    type="text" 
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder="Custom Size (e.g. 3XL)" 
                    className="input-base text-sm py-1.5"
                  />
                  <button 
                    type="button" 
                    onClick={addCustomSize} 
                    className="btn-ghost py-1.5 px-4 text-xs font-bold border border-gray-300 hover:bg-gray-50"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Variant Stock Inventory Table */}
              {hasVariants && (
                <div className="border border-gray-200 rounded-xl overflow-hidden mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Stock Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 bg-white">
                      {combinations.map((combo) => {
                        const key = `${combo.size}-${combo.colorName}`;
                        return (
                          <tr key={key} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-3.5 h-3.5 rounded-full border border-gray-350 shadow-sm" 
                                  style={{ backgroundColor: combo.colorHex }}
                                />
                                <span className="text-sm font-medium text-gray-900">{combo.colorName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                {combo.size}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                value={variantStock[key] !== undefined ? variantStock[key] : ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setVariantStock({
                                    ...variantStock,
                                    [key]: isNaN(val) ? 0 : val
                                  });
                                }}
                                className="input-base py-1 px-2.5 text-sm w-28"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Images</h3>
            
            {/* Gallery Preview */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {uploadedImages.map((img: any, index) => (
                  <div key={index} className="flex flex-col border border-gray-200 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                    <div className="relative group aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.alt || 'Product'} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-650 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="Delete image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {colors.length > 0 && (
                      <div className="p-2 bg-white border-t border-gray-100">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Variant Color
                        </label>
                        <select
                          value={img.color || ''}
                          onChange={(e) => {
                            const newImages = [...uploadedImages];
                            newImages[index] = { ...newImages[index], color: e.target.value };
                            setUploadedImages(newImages);
                          }}
                          className="w-full text-[11px] border border-gray-200 rounded-lg p-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-700"
                        >
                          <option value="">Common Image</option>
                          {colors.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mb-2 text-brand-600" size={32} />
                  <p className="font-medium text-brand-600">Uploading images...</p>
                </>
              ) : (
                <>
                  <Upload size={32} className="mb-2 text-gray-400" />
                  <p className="font-medium">Click to upload product images</p>
                  <p className="text-xs mt-1 text-gray-400">Supports JPG, PNG, WEBP (multiple allowed)</p>
                </>
              )}
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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
