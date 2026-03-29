import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export interface Subscriber {
  email: string;
  name: string;
}

/**
 * Fetches a unified list of unique subscribers from multiple tables to ensure all users get updates.
 */
export async function getUnifiedSubscribers(): Promise<Subscriber[]> {
  const [profilesRes, subscribersRes, enquiriesRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('email, name').not('email', 'is', null),
    supabase.from('newsletter_subscribers').select('email, first_name, last_name').eq('is_active', true),
    supabase.from('enquiries').select('email, name').not('email', 'is', null),
    supabase.from('bookings').select('email, full_name').not('email', 'is', null)
  ]);

  const userMap = new Map<string, string>();
  
  // 1. Add users from profiles
  profilesRes.data?.forEach(u => {
    if (u.email) userMap.set(u.email.toLowerCase(), u.name || 'Valued Seeker');
  });
  
  // 2. Add users from enquiries
  enquiriesRes.data?.forEach(u => {
    if (u.email && !userMap.has(u.email.toLowerCase())) {
      userMap.set(u.email.toLowerCase(), u.name || 'Valued Seeker');
    }
  });

  // 3. Add users from bookings
  bookingsRes.data?.forEach(u => {
    if (u.email && !userMap.has(u.email.toLowerCase())) {
      userMap.set(u.email.toLowerCase(), u.full_name || 'Valued Seeker');
    }
  });

  // 4. Add users from newsletter_subscribers (can override generic names)
  subscribersRes.data?.forEach(u => {
    if (u.email) {
      const email = u.email.toLowerCase();
      const currentName = userMap.get(email);
      const newName = [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Valued Seeker';
      
      if (!currentName || currentName === 'Valued Seeker') {
        userMap.set(email, newName);
      }
    }
  });

  return Array.from(userMap.entries()).map(([email, name]) => ({ email, name }));
}

/**
 * Syncs a user to the newsletter_subscribers table.
 * Avoids overwriting is_newsletter_subscriber if it's already true.
 */
export async function syncToSubscribers(email: string, name: string, source: string = 'system_sync', isNewsletterSubscriber: boolean = false) {
  if (!email) return;
  
  try {
    const lowercaseEmail = email.toLowerCase();
    
    // Check if they are already a newsletter subscriber if we're trying to set it to false
    if (!isNewsletterSubscriber) {
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('is_newsletter_subscriber')
        .eq('email', lowercaseEmail)
        .maybeSingle();
        
      if (existing?.is_newsletter_subscriber) {
        // Keep it as true if it was already true
        isNewsletterSubscriber = true;
      }
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: lowercaseEmail,
        first_name: name || email.split('@')[0],
        source,
        is_active: true,
        is_newsletter_subscriber: isNewsletterSubscriber
      }, { onConflict: 'email' });
      
    if (error) {
      console.error(`Error syncing ${email} to subscribers:`, error);
    }
  } catch (err) {
    console.error(`Exception syncing ${email} to subscribers:`, err);
  }
}
