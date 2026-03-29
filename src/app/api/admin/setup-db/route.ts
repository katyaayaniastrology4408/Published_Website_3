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
-- 1. Create offer_settings table
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

-- 2. Create reviews table
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

-- 3. Create function to increment offer slots
CREATE OR REPLACE FUNCTION public.increment_offer_slot()
RETURNS void AS $$
BEGIN
    UPDATE public.offer_settings
    SET used_slots = used_slots + 1
    WHERE id = 1 AND used_slots < max_slots;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Set up RLS
ALTER TABLE public.offer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Insert default offer (₹501, 6 months)
INSERT INTO public.offer_settings (
    id, is_active, title, max_slots, used_slots, offer_price, original_price, start_date, end_date, urgency_text, popup_text
) VALUES (
    1, true, 'First 50 Users Special Offer', 50, 0, 501, 501, NOW(), NOW() + INTERVAL '6 months', 'Only 50 Slots Available', '🎉 First 50 Users Offer – Book Now at ₹501 Only!'
) ON CONFLICT (id) DO UPDATE SET
    is_active = true,
    title = 'First 50 Users Special Offer',
    max_slots = 50,
    used_slots = 0,
    offer_price = 501,
    original_price = 501,
    start_date = NOW(),
    end_date = NOW() + INTERVAL '6 months',
    urgency_text = 'Only 50 Slots Available',
    popup_text = '🎉 First 50 Users Offer – Book Now at ₹501 Only!';
    `;

    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: setupSql
    });

    if (error) {
      // If RPC fails (which it might if not set up), try a direct query if possible
      console.error("Migration error:", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, message: "Database reset and ₹501 offer activated for fresh start!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
