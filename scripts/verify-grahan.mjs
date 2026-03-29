import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://eochjxjoyibtjawzgauk.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc');
const {data} = await sb.from('blog_posts').select('title,title_hindi,title_gujarati,excerpt,excerpt_hindi,excerpt_gujarati').eq('slug','chandra-grahan-2026-kab-hai-samay-upay').single();
console.log(JSON.stringify(data,null,2));
