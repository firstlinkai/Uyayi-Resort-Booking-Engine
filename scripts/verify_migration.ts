import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  const { count, error } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting rows:', error.message);
  } else {
    console.log(`Total rows in gallery_images: ${count}`);
  }

  const { data: samples } = await supabase
    .from('gallery_images')
    .select('*')
    .limit(5);
  
  console.log('Sample data:', JSON.stringify(samples, null, 2));

  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Buckets:', JSON.stringify(buckets?.map(b => b.name)));
  
  if (buckets?.some(b => b.name === 'gallery')) {
     const { data: files } = await supabase.storage.from('gallery').list();
     console.log(`Files in gallery bucket: ${files?.length}`);
  }
}

verify();
