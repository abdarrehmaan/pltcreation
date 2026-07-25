import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    let imageUrl = '';

    // 1. Try uploading to Supabase Storage bucket 'products'
    try {
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        if (publicData?.publicUrl) {
          imageUrl = publicData.publicUrl;
        }
      } else {
        console.warn('Supabase upload attempt warning:', error?.message);
      }
    } catch (supErr: any) {
      console.warn('Supabase storage unavailable, falling back to local storage:', supErr.message);
    }

    // 2. Fallback to local public/uploads storage if Supabase failed or returned no URL
    if (!imageUrl) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const localFilePath = path.join(uploadsDir, localFileName);

      await fs.writeFile(localFilePath, buffer);
      imageUrl = `/uploads/${localFileName}`;
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
