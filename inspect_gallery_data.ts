import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Key:', supabaseAnonKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('--- Categories ---');
  const { data: cats, error: catErr } = await supabase.from('gallery_categories').select('*');
  if (catErr) console.error('Cat Error:', catErr);
  console.log(JSON.stringify(cats, null, 2));

  console.log('--- Images Sample ---');
  const { data: imgs, error: imgErr } = await supabase.from('gallery_images').select('*').limit(30);
  if (imgErr) console.error('Img Error:', imgErr);
  console.log(JSON.stringify(imgs, null, 2));

  console.log('--- Activities (Water Sports) ---');
  const { data: acts, error: actErr } = await supabase.from('activities').select('*').ilike('category', '%water%');
  if (actErr) console.error('Act Error:', actErr);
  console.log(JSON.stringify(acts, null, 2));
}

check();
