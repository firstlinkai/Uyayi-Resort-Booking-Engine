import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function debugSchema() {
  const tables = ['rooms', 'activities', 'dining_options', 'team_members'];
  for (const table of tables) {
    console.log(`\n\n=== Table: ${table} ===`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`Sample row keys for ${table}:`, Object.keys(data[0]).join(', '));
      // Log some specifics for common fields
      const row = data[0];
      if ('price' in row) console.log(`- has 'price'`);
      if ('base_price' in row) console.log(`- has 'base_price'`);
      if ('rate' in row) console.log(`- has 'rate'`);
      if ('photo_url' in row) console.log(`- has 'photo_url'`);
      if ('thumbnail_url' in row) console.log(`- has 'thumbnail_url'`);
      if ('image_url' in row) console.log(`- has 'image_url'`);
      if ('image' in row) console.log(`- has 'image'`);
    } else {
      console.log(`Table ${table} is empty or not found.`);
    }
  }
}

debugSchema().catch(console.error);
