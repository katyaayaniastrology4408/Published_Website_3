import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eochjxjoyibtjawzgauk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc'
);

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: 'Chandra Grahan 2026 — Date, Sutak Time, Remedies & All 12 Rashi Effects',
    excerpt: 'When is Chandra Grahan 2026? Full details on sutak time, grahan kaal, what to do and avoid, remedies, and effects on all 12 rashis — all in one place.',
    title_hindi: 'चंद्र ग्रहण 2026 — कब? सूतक, उपाय और 12 राशि फल',
    title_gujarati: 'ચંદ્ર ગ્રહણ 2026 — ક્યારે? સૂતક, ઉપાય અને 12 રાશિ ફળ',
    excerpt_hindi: 'चंद्र ग्रहण 2026 कब है? सूतक समय, ग्रहण काल, 12 राशि फल, क्या करें — क्या न करें और सर्वोत्तम उपाय — सब कुछ यहाँ।',
    excerpt_gujarati: 'ચંદ્ર ગ્રહણ 2026 ક્યારે છે? સૂતક સમય, ગ્રહણ કાળ, 12 રાશિ ફળ, શું કરવું — ન કરવું અને શ્રેષ્ઠ ઉપાય — બધ્ધું અહીં.',
  })
  .eq('slug', 'chandra-grahan-2026-kab-hai-samay-upay');

if (error) {
  console.error('Error:', error);
} else {
  console.log('✅ Fixed! All titles and excerpts updated cleanly.');
}
