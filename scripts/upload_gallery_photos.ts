import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_IMAGE_DIR = path.resolve(process.cwd(), 'public/Media/Images/uyayi website assets');
const BUCKET_NAME = 'gallery';

async function uploadPhotos() {
  console.log('Starting photo upload...');

  if (!fs.existsSync(LOCAL_IMAGE_DIR)) {
    console.error(`Directory not found: ${LOCAL_IMAGE_DIR}`);
    return;
  }

  const files = fs.readdirSync(LOCAL_IMAGE_DIR).filter(file => 
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
  );

  console.log(`Found ${files.length} images to upload.`);

  // Note: Anon key might not be able to list/create buckets.
  // We'll try to just upload and see if it works.
  
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const filePath = path.join(LOCAL_IMAGE_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${Date.now()}_${file.replace(/\s+/g, '_')}`;

    console.log(`Uploading ${file}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${file}:`, error.message);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    uploadedUrls.push(publicUrl);
    console.log(`Uploaded ${file} -> ${publicUrl}`);
  }

  if (uploadedUrls.length > 0) {
    console.log('Clearing old gallery images...');
    const { error: deleteErr } = await supabase
      .from('gallery_images')
      .delete()
      .neq('id', 0); // Delete all

    if (deleteErr) {
      console.error('Error clearing gallery_images:', deleteErr.message);
    }

    console.log(`Inserting ${uploadedUrls.length} new images...`);
    const insertData = uploadedUrls.map((url, index) => ({
      image_url: url,
      alt_text: `Gallery Image ${index + 1}`,
      display_order: index,
      category: 'Resort' // Default
    }));

    const { error: insertErr } = await supabase
      .from('gallery_images')
      .insert(insertData);

    if (insertErr) {
      console.error('Error inserting images into database:', insertErr.message);
    } else {
      console.log('Successfully updated database with new gallery images.');
    }
  }

  console.log('Upload process completed.');
}

uploadPhotos();
