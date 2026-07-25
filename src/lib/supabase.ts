import { createClient } from '@supabase/supabase-js';

const getCleanUrl = (): string => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) return 'https://imbttolfecefskvitqzb.supabase.co';
  
  // Clean surrounding quotes and whitespace
  let clean = rawUrl.replace(/^["']|["']$/g, '').trim();
  
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'https://' + clean;
  }
  
  try {
    new URL(clean);
    return clean;
  } catch {
    return 'https://imbttolfecefskvitqzb.supabase.co';
  }
};

const getCleanKey = (): string => {
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawKey) return 'sb_publishable_cJmp_jFwtKH2i7It3cS8ig_UmPtLYNP';
  return rawKey.replace(/^["']|["']$/g, '').trim();
};

export const supabase = createClient(getCleanUrl(), getCleanKey());
