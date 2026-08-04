import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function inspectEvents() {
  console.log('=== EVENT TYPES DATA ===');
  const { data: events, error: e1 } = await supabase.from('event_types').select('*');
  if (e1) console.error(e1.message); else console.log(JSON.stringify(events, null, 2));

  console.log('\n=== VENUES DATA ===');
  const { data: venues, error: e2 } = await supabase.from('venues').select('*');
  if (e2) console.error(e2.message); else console.log(JSON.stringify(venues, null, 2));
}

inspectEvents().catch(console.error);
