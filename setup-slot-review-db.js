const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log("Setting up database for Slot-Based Offer and Reviews...");

  try {
    // 1. Alter offer_settings table to add slots
    console.log("Adding max_slots and used_slots to offer_settings...");
    // Using an RPC call or execute raw SQL if possible. Supabase JS API doesn't support raw DDL directly via REST.
    // Instead we will use a raw query if the role allows, or we will just warn the user.
    // However, we can create an RPC command or use the REST endpoint to create the reviews table if we use the backend API.
    
    // We will create the tables by inserting and capturing errors, or via RPC.
    // Since we need to run schema migrations (ALTER TABLE, CREATE TABLE, CREATE FUNCTION) which the Javascript client cannot do,
    // we need to run these queries.
    
    console.log(`
IMPORTANT: Please run the following SQL script in your Supabase SQL Editor:

-- 1. Add slots to offer_settings
ALTER TABLE offer_settings 
ADD COLUMN IF NOT EXISTS max_slots integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS used_slots integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_link text;

-- 2. Create the increment_offer_slot function
CREATE OR REPLACE FUNCTION increment_offer_slot()
RETURNS boolean AS $$
DECLARE
  current_used integer;
  current_max integer;
BEGIN
  SELECT used_slots, max_slots INTO current_used, current_max 
  FROM offer_settings WHERE id = 1 FOR UPDATE;
  
  IF current_used < current_max THEN
    UPDATE offer_settings SET used_slots = used_slots + 1 WHERE id = 1;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  rating integer CHECK (rating IN (3, 4, 5)),
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved reviews
CREATE POLICY "Enable public read access for approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Allow anon to insert (pending by default)
CREATE POLICY "Enable insert access for all users" ON reviews
  FOR INSERT WITH CHECK (true);
    `);
    
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

setupDatabase();
