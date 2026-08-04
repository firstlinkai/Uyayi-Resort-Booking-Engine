import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function checkDining() {
  console.log(`\n\n=== Data Table: dining_options ===`);
  const { data, error } = await supabase.from('dining_options').select('name, opening_hours').limit(5);
  if (error) {
    console.error(`Error:`, error.message);
  } else {
    console.log(`Data:`, JSON.stringify(data, null, 2));
  }
}

checkDining();
