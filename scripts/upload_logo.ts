import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadLogo() {
  const filePath = path.resolve(process.cwd(), 'public/uyayi-logo.jpeg');
  const fileBuffer = fs.readFileSync(filePath);
  
  console.log('Attempting to upload logo to bucket "assets"...');
  const { data, error } = await supabase.storage
    .from('assets')
    .upload('uyayi-logo.jpeg', fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('Error uploading logo:', error.message);
    
    // Try "public" bucket
    console.log('Attempting to upload to bucket "public"...');
    const { data: data2, error: error2 } = await supabase.storage
      .from('public')
      .upload('uyayi-logo.jpeg', fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
    if (error2) {
      console.error('Error uploading to public:', error2.message);
    } else {
      console.log('Success! Logo uploaded to public bucket:', data2);
    }
  } else {
    console.log('Success! Logo uploaded to assets bucket:', data);
  }
}

uploadLogo();
