import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    // Comprehensive database setup
    const setupSql = `
-- 1. Create profiles table if not exists (Basic schema)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create offer_settings table
CREATE TABLE IF NOT EXISTS public.offer_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    is_active BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    original_price NUMERIC DEFAULT 501,
    offer_price NUMERIC DEFAULT 501,
    title TEXT DEFAULT '🎉 Special Festival Offer',
    urgency_text TEXT DEFAULT 'Only Few Slots Left',
    popup_text TEXT DEFAULT '🎉 Special Festival Offer – Book Now at ₹501 Only!',
    max_slots INTEGER DEFAULT 50,
    used_slots INTEGER DEFAULT 0,
    payment_link TEXT DEFAULT 'https://urpy.link/D9kGay',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 3. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create function to increment offer slots
CREATE OR REPLACE FUNCTION public.increment_offer_slot()
RETURNS void AS $$
BEGIN
    UPDATE public.offer_settings
    SET used_slots = used_slots + 1
    WHERE id = 1 AND used_slots < max_slots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Set up RLS
ALTER TABLE public.offer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Reviews
DROP POLICY IF EXISTS "Allow public read-only access to approved reviews" ON public.reviews;
CREATE POLICY "Allow public read-only access to approved reviews" ON public.reviews
    FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Allow public to insert reviews" ON public.reviews;
CREATE POLICY "Allow public to insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- 7. Insert default offer if not exists
INSERT INTO public.offer_settings (
    id, is_active, title, max_slots, used_slots, offer_price, original_price, start_date, end_date, urgency_text, popup_text
) VALUES (
    1, true, 'First 50 Users Special Offer', 50, 0, 501, 501, NOW(), NOW() + INTERVAL '6 months', 'Only 50 Slots Available', '🎉 First 50 Users Offer – Book Now at ₹501 Only!'
) ON CONFLICT (id) DO NOTHING;
    `;

    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: setupSql
    });

    if (error) {
      // If RPC fails (which it might if not set up), provide clear instructions
      console.error("Migration error:", error);
      return NextResponse.json({ 
        success: false, 
        error: `Migration failed: ${error.message}. 
        
Please ensure you have created the 'exec_sql' RPC in your Supabase SQL editor:

CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
      });
    }

    return NextResponse.json({ success: true, message: "Database tables created and initialized successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

