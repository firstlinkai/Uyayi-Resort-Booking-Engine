import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function inspectData() {
  console.log('=== ROOMS DATA ===');
  const { data: rooms } = await supabase.from('rooms').select('name, thumbnail_url');
  console.log(JSON.stringify(rooms, null, 2));

  console.log('\n=== ACTIVITIES DATA ===');
  const { data: activities } = await supabase.from('activities').select('name, thumbnail_url, category');
  console.log(JSON.stringify(activities, null, 2));

  console.log('\n=== DINING DATA ===');
  const { data: dining } = await supabase.from('dining_options').select('name, cover_image');
  console.log(JSON.stringify(dining, null, 2));
}

inspectData().catch(console.error);
