import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Sanitize filename to replace spaces and special characters with hyphens
    const cleanOriginalName = file.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\.-]+/g, '');

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${cleanOriginalName}`;

    // Upload to Supabase Storage bucket 'productimages' (or fallback to 'products')
    let bucketName = 'productimages';
    let { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (error && (error.message?.includes('not found') || error.message?.includes('Bucket'))) {
      // Try 'products' bucket if 'productimages' bucket is not found
      bucketName = 'products';
      const fallbackResult = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json(
        { error: `Supabase Storage upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
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

