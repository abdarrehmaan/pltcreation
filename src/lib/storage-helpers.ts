import { supabase } from '@/lib/supabase';

/**
 * Extracts relative storage file paths from public Supabase URLs and deletes them from the storage bucket.
 * e.g., https://xyz.supabase.co/storage/v1/object/public/products/products/123.jpg -> products/123.jpg
 */
export async function deleteStorageImages(urls: (string | null | undefined)[]) {
  try {
    const filePaths: string[] = [];

    for (const url of urls) {
      if (!url || typeof url !== 'string') continue;

      if (url.includes('/storage/v1/object/public/products/')) {
        const path = url.split('/storage/v1/object/public/products/')[1];
        if (path) filePaths.push(path);
      } else if (url.includes('/products/') || url.includes('/categories/')) {
        const match = url.match(/(products\/|categories\/).+/);
        if (match) filePaths.push(match[0]);
      }
    }

    if (filePaths.length > 0) {
      const { error } = await supabase.storage.from('products').remove(filePaths);
      if (error) {
        console.warn('Failed to remove images from Supabase storage:', error.message);
      } else {
        console.log(`Successfully deleted ${filePaths.length} image(s) from Supabase storage.`);
      }
    }
  } catch (e) {
    console.warn('Storage delete helper exception:', e);
  }
}
