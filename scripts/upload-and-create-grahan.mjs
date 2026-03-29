import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import fs from 'fs';

const SUPABASE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const get = url.startsWith('https') ? https : http;
    get.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadImage(url, filename) {
  console.log(`Downloading ${filename}...`);
  const buf = await download(url);
  console.log(`Downloaded ${buf.length} bytes`);
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(filename, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error('Upload failed: ' + error.message);
  const { data: pub } = supabase.storage.from('blog-images').getPublicUrl(filename);
  console.log(`✓ Uploaded: ${pub.publicUrl}`);
  return pub.publicUrl;
}

async function main() {
  // 1) Upload new Holika Dahan image
  const holidahanUrl = await uploadImage(
    'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/holidahan-1772513006206.png',
    `holika-dahan-${Date.now()}.jpg`
  );

  // 2) Update Holika Dahan blog post
  const { error: updateErr } = await supabase
    .from('blog_posts')
    .update({ featured_image: holidahanUrl })
    .eq('slug', 'holika-dahan-2026-shubh-muhurat-katha');
  if (updateErr) throw updateErr;
  console.log('✓ Holika Dahan image updated in DB');

  // 3) Upload Chandra Grahan image
  const grahanUrl = await uploadImage(
    'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/image-1772513422572.png',
    `chandra-grahan-${Date.now()}.jpg`
  );

  // 4) Create Chandra Grahan blog post
  const content = `
<p style="font-size:1.15rem;line-height:1.9;color:#1a1a2e;">
<strong>ચંદ્ર ગ્રહણ 2026</strong> — આ એક અત્યંત મહત્વપૂર્ણ ખગોળીય અને ધાર્મિક ઘટના છે. 
ભારતીય જ્યોતિષ અને વૈદિક ગ્રંથો અનુસાર, ચંદ્ર ગ્રહણ એ ગ્રહ-નક્ષત્રોના પ્રભાવ અને 
આત્મ-શુદ્ધિ માટેનો સ્વર્ણ અવસર છે.
</p>

<h2>🌑 ચંદ્ર ગ્રહણ 2026 — ક્યારે?</h2>
<p>
2026 માં <strong>ખંડ ચંદ્ર ગ્રહણ (Partial Lunar Eclipse)</strong> થઈ રહ્યું છે. 
આ ગ્રહણ ભારત, ગુજરાત અને સૌ ભારતીય ભક્તો માટે ખૂબ જ ખાસ છે.
</p>

<ul>
  <li><strong>ગ્રહણ પ્રકાર:</strong> ખંડ ચંદ્ર ગ્રહણ (Partial Lunar Eclipse)</li>
  <li><strong>દ્રષ્ટ:</strong> ભારત, એશિયા, આફ્રિકા, ઓસ્ટ્રેલિયા</li>
  <li><strong>ગ્રહણ કાળ:</strong> સૂર્ય ઉદય બાદ જ સ્પર્ષ</li>
</ul>

<h2>📿 ગ્રહણ કાળ — શું કરવું, શું ન કરવું?</h2>

<h3>✅ કરવા યોગ્ય:</h3>
<ul>
  <li>ભગવાન વિષ્ણુ અને ચંદ્ર દેવ ની પૂજા-અર્ચના</li>
  <li>ગ્રહણ દરમ્યાન <strong>ૐ નમો ભગવતે વાસુદેવાય</strong> નો જાપ</li>
  <li>ગ્રહણ પૂર્ણ થયા પછી સ્નાન અને દાન</li>
  <li>ગ્રહણ ના <strong>સૂતક</strong> (9 કલાક પૂર્વ) થી ધ્યાન અને મૌન</li>
  <li>ગ્રહણ મોક્ષ બાદ ગૌ-ગ્રાસ, દીપ-દાન અને અન્ન-દાન</li>
</ul>

<h3>❌ ન કરવા યોગ્ય:</h3>
<ul>
  <li>ગ્રહણ દરમ્યાન ભોજન ગ્રહણ</li>
  <li>નવા કાર્ય, ગૃહ-પ્રવેશ, શુભ-કાર્ય</li>
  <li>ગ્રહણ ખુલ્લી આંખે જોવું</li>
  <li>ઘરની બહાર ફળ-શાક, ખાદ્ય-સામગ્રી ઢૂકવા</li>
</ul>

<h2>🪬 ગ્રહણ ના ફળ — 12 રાશિ પ્રભાવ</h2>
<p>
ચંદ્ર ગ્રહણ દરમ્યાન ચંદ્ર <strong>સિંહ રાશિ</strong> માં હોય ત્યારે — 
<strong>સિંહ, મકર, કુંભ</strong> ને વિશેષ સાવધાની. 
<strong>મેષ, ધન, મીન</strong> ને ચંદ્ર ગ્રહણ લાભ-દાયી.
</p>
<p>
<em>વ્યક્તિગત ગ્રહ-ગ્રહણ ફળ જાણવા માટે કાત્યાયની જ્યોતિષ ટીમ સાથે સંપર્ક કરો.</em>
</p>

<h2>🌕 ચંદ્ર ગ્રહણ — ગ્રંથ અને પૌરાણિક મહત્ત્વ</h2>
<p>
<strong>ભાગવત પુરાણ</strong> અને <strong>સ્કંદ પુરાણ</strong> અનુસાર —  
ચંદ્ર ગ્રહણ સ્નાન, દાન અને ઉપવાસ ૧,૦૦,૦૦૦ ગ્રહ-કુપ-નિવારણ નો ફળ આપે છે.
</p>
<p>
ગ્રહણ એ ફક્ત ખગોળ-ઘટના નથી — <strong>આ ભગવાનનો સંદેશ</strong> છે:  
"ઊઠ, ધ્યાન ધર, ભક્તિ કર — ઈ ક્ષણ ફળ-દ્વિગુણ છે."
</p>

<h2>🙏 ચંદ્ર ગ્રહણ — વ્યક્તિગત ઉપાય</h2>
<p>
ગ્રહણ ના દિવસ <strong>ચંદ્ર-યંત્ર</strong> ની સ્થાપના, 
<strong>ચાંદીનો ચંદ્ર</strong> ભગવાન શિવ ને ચઢાવો,  
<strong>ધોળા ફૂળ</strong> ચઢાવો — ચંદ્ર ગ્રહ-દોષ શાંત થાય.
</p>

<div class="muhurat-box" style="background:linear-gradient(135deg,#0a0612,#1a0a2e);border:2px solid #f97316;border-radius:16px;padding:24px;margin:28px 0;color:#fff;">
  <p style="text-align:center;font-size:1.1rem;font-weight:700;color:#fcd34d;margin:0 0 16px;">📞 વ્યક્તિગત ગ્રહણ-ફળ & ઉપાય જાણવા</p>
  <p style="text-align:center;margin:0;font-size:0.95rem;color:#d1d5db;">
    કાત્યાયની જ્યોતિષ ટીમ — <strong style="color:#f97316;">રોજ સવારે 9 થી 8 વાગ્યા સુધી</strong><br/>
    WhatsApp / Call: <strong style="color:#fcd34d;">+91 98765 XXXXX</strong>
  </p>
</div>
`;

  const slug = 'chandra-grahan-2026-kab-hai-samay-upay';
  const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).single();
  if (existing) {
    await supabase.from('blog_posts').update({
      featured_image: grahanUrl,
      content,
    }).eq('slug', slug);
    console.log('✓ Chandra Grahan post updated');
  } else {
    const { error: insertErr } = await supabase.from('blog_posts').insert({
      title: 'ચંદ્ર ગ્રહણ 2026 — સૂતક, સ્નાન, ઉપાય અને 12 રાશિ ફળ',
      slug,
      excerpt: 'ચંદ્ર ગ્રહણ 2026 ક્યારે? ગ્રહણ કાળ, સૂતક સમય, શું કરવું - ન કરવું, 12 રાશિ ફળ અને શ્રેષ્ઠ ઉપાય — બધ્ધું અહીં.',
      content,
      featured_image: grahanUrl,
      category: 'festivals',
      tags: ['chandra-grahan', 'lunar-eclipse', 'grahan-2026', 'jyotish', 'upay', 'rashifal'],
      is_published: true,
      published_at: new Date().toISOString(),
      meta_title: 'ચંદ્ર ગ્રહણ 2026 — સૂતક, ઉપાય, 12 રાશિ ફળ | Katyaayani Astrologer',
      meta_description: 'ચંદ્ર ગ્રહણ 2026 ક્યારે? ગ્રહણ કાળ, સૂતક, શું કરવું - ન કરવું, 12 રાશિ ફળ. Katyaayani Astrologer.',
    });
    if (insertErr) throw insertErr;
    console.log('✓ Chandra Grahan post created, slug:', slug);
  }

  console.log('\n========================================');
  console.log('Blog Image URL:', grahanUrl);
  console.log('Slug:', slug);
  console.log('========================================');
}

main().catch(e => { console.error(e); process.exit(1); });
