import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
  console.log('Starting sync of profiles to newsletter_subscribers...');
  
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('email, name')
    .not('email', 'is', null);
    
  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    return;
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found to sync.');
    return;
  }
  
  console.log(`Found ${profiles.length} profiles. Upserting to newsletter_subscribers...`);
  
  const syncData = profiles.map(p => ({
    email: p.email.toLowerCase(),
    first_name: p.name || null,
    source: 'profile_sync_manual',
    is_active: true,
    is_newsletter_subscriber: false // Keep as false unless already true in the table
  }));
  
  // Batch upsert (Supabase handles 1000s well, but let's do chunks if needed)
  const CHUNK_SIZE = 100;
  for (let i = 0; i < syncData.length; i += CHUNK_SIZE) {
    const chunk = syncData.slice(i, i + CHUNK_SIZE);
    const { error: upsertError } = await supabase
      .from('newsletter_subscribers')
      .upsert(chunk, { onConflict: 'email', ignoreDuplicates: false });
      
    if (upsertError) {
      console.error(`Error upserting chunk ${i / CHUNK_SIZE}:`, upsertError);
    } else {
      console.log(`Synced chunk ${i / CHUNK_SIZE + 1}`);
    }
  }
  
  console.log('Sync completed.');
}

sync();
