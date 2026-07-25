import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.' },
        { status: 400 }
      );
    }

    // 1. Fetch all product image URLs stored in the database
    const dbImages = await prisma.productImage.findMany({
      select: { url: true },
    });

    const activeUrls = new Set(dbImages.map((img: { url: string }) => img.url));

    // 2. List files in the Supabase 'products' storage bucket
    const { data: bucketFiles, error: listError } = await supabase.storage
      .from('products')
      .list('', { limit: 500 });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    if (!bucketFiles || bucketFiles.length === 0) {
      return NextResponse.json({ message: 'No files found in the products storage bucket.', deletedCount: 0 });
    }

    // 3. Identify files not present in the activeUrls set
    const unusedFiles: string[] = [];
    for (const file of bucketFiles) {
      const publicUrlData = supabase.storage.from('products').getPublicUrl(file.name);
      const publicUrl = publicUrlData.data.publicUrl;

      if (!activeUrls.has(publicUrl) && !activeUrls.has(file.name)) {
        unusedFiles.push(file.name);
      }
    }

    if (unusedFiles.length === 0) {
      return NextResponse.json({ message: 'All storage images are currently in use.', deletedCount: 0 });
    }

    // 4. Delete unused files from Supabase bucket
    const { data: deletedFiles, error: deleteError } = await supabase.storage
      .from('products')
      .remove(unusedFiles);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${unusedFiles.length} unused image(s) from Supabase storage.`,
      deletedFiles,
    });
  } catch (error: any) {
    console.error('Supabase storage cleanup error:', error);
    return NextResponse.json({ error: error.message || 'Storage cleanup failed' }, { status: 500 });
  }
}
