import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const supabase = createClient(
  'https://eochjxjoyibtjawzgauk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc'
);

function download(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const IMAGE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/holidahan-1772513006206.png';

const SUPABASE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc';

async function main() {
  // 1. Try downloading from project-uploads bucket
  console.log('Downloading new image...');
  
  // Use the render URL from user's message
  const renderUrl = 'https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/render/image/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/holidahan-1772513006206.png?width=1200&height=630&resize=cover';
  
  // Try direct object URL first
  const directUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/holidahan-1772513006206.png';
  
  let imgData;
  try {
    imgData = await download(directUrl);
    console.log(`Downloaded ${imgData.buffer.length} bytes from slelguoygbfzlpylpxfs`);
  } catch (e) {
    console.log('Trying alternate URL...');
    imgData = await download(renderUrl);
    console.log(`Downloaded ${imgData.buffer.length} bytes`);
  }

  const fileName = `holika-dahan-2026-${Date.now()}.png`;

  // 2. Upload to blog-images bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(fileName, imgData.buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    process.exit(1);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName);

  console.log('✓ Image uploaded:', publicUrl);

  // 3. Update blog post featured_image AND og_image
  const { data: updated, error: updateError } = await supabase
    .from('blog_posts')
    .update({ 
      featured_image: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('slug', 'holika-dahan-2026-shubh-muhurat-katha')
    .select('id, title, featured_image');

  if (updateError) {
    console.error('Update error:', updateError);
    process.exit(1);
  }

  console.log('✓ Blog post updated:', updated[0].title);
  console.log('✓ New image URL:', updated[0].featured_image);
}

main().catch(console.error);
