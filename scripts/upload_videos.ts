import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const VIDEO_DIR = path.resolve(process.cwd(), 'public/Media/Videos');
const BUCKET_NAME = 'videos';

async function uploadVideos() {
  console.log('--- Starting Video Migration to Supabase ---');

  // 1. Try to ensure bucket exists (likely to fail with anon key)
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`Bucket "${BUCKET_NAME}" not found. Attempting to create...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true
    });
    if (createError) {
      console.error(`Could not create bucket: ${createError.message}`);
      console.log('NOTE: This is likely due to Row-Level Security (RLS) restrictions on your anon key.');
      console.log('Please create the "videos" bucket manually in your Supabase dashboard and set it to PUBLIC.');
    } else {
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    }
  }

  const videos = ['hero-home.mp4', 'hero-about.mp4'];

  for (const video of videos) {
    const filePath = path.join(VIDEO_DIR, video);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    console.log(`Uploading ${video}...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(video, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${video}: ${error.message}`);
    } else {
      console.log(`Successfully uploaded ${video}:`, data.path);
    }
  }

  console.log('--- Video Migration Process Completed ---');
}

uploadVideos().catch(console.error);
