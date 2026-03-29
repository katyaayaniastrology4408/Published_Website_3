import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialize the main supabase client to avoid crashes if env vars are missing
let supabaseClient: any = null;

// Noop auth object so the app never crashes if credentials are absent
const noopAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
  signOut: async () => {},
  getUser: async () => ({ data: { user: null }, error: null }),
};

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!supabaseClient) {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Missing Supabase Public credentials – auth features disabled');
        // Return a safe noop so the app renders instead of crashing
        if (prop === 'auth') return noopAuth;
        return () => ({ data: null, error: new Error('Supabase not configured') });
      }

      // Use the proxy on the client side to bypass regional blocks (e.g. in India)
      const isClient = typeof window !== 'undefined';
      const effectiveUrl = isClient ? '/api/sb-proxy' : supabaseUrl;

      supabaseClient = createClient(effectiveUrl, supabaseAnonKey, {
        auth: {
          persistSession: isClient,
          autoRefreshToken: isClient,
        }
      });
    }
    const value = supabaseClient[prop];
    if (typeof value === 'function') {
      return value.bind(supabaseClient);
    }
    return value;
  }
});

// Helper for admin client - only call this from server-side code
export const getSupabaseAdmin = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
  }
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// For backward compatibility in server-side code - lazy initialize to avoid env var issues at build/module load
let adminClient: any = null;
export const supabaseAdmin = typeof window === 'undefined' 
  ? new Proxy({} as any, {
      get: (target, prop) => {
        if (!adminClient) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
          const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

          adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          });
        }
        const value = adminClient[prop];
        if (typeof value === 'function') {
          return value.bind(adminClient);
        }
        return value;
      }
    })
  : null as any;

export type Booking = {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  service_type: 'home' | 'office' | 'online';
  booking_date: string;
  booking_time: string;
  special_requests?: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_intent_id?: string;
  amount?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export type Availability = {
  id?: string;
  date: string;
  is_available: boolean;
  blocked_times?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type Feedback = {
  id?: string;
  created_at?: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  is_approved?: boolean;
};
