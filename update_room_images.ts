import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const updates = [
  { name: 'Beachfront Villa', url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Beachfront%20Villa.jpeg' },
  { name: 'Family Villa', url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Family%20Villa.jpeg' },
  { name: 'Garden Deluxe Room', url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Garden%20Deluxe%20Room.jpeg' },
  { name: 'Ocean Suite', url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Ocean%20Suite.jpeg' },
  { name: 'Pool Suite', url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Pool%20Suite.jpeg' }
];

async function updateRooms() {
  for (const update of updates) {
    const { data, error } = await supabase
      .from('rooms')
      .update({ thumbnail_url: update.url })
      .eq('name', update.name);
    
    if (error) {
      console.error(`Error updating ${update.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${update.name}`);
    }
  }
}

updateRooms();
