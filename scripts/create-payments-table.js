/**
 * Run this script once to create the payments table:
 *   node scripts/create-payments-table.js
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createPaymentsTable() {
  console.log("Creating payments table...");

  // Insert a dummy row to trigger table auto-creation isn't reliable.
  // Instead we try to select; if it errors with 'relation does not exist' we need to create it.
  const { error: checkError } = await supabase.from("payments").select("id").limit(1);

  if (!checkError) {
    console.log("payments table already exists.");
    return;
  }

  console.log("Table not found, creating via SQL...");
  // Try using exec_sql RPC (requires a custom function in Supabase)
  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS public.payments (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        mobile TEXT,
        amount NUMERIC(10,2),
        transaction_id TEXT,
        payment_status TEXT DEFAULT 'pending',
        payment_date TIMESTAMPTZ DEFAULT NOW(),
        reference_number TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
      CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
      ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
    `,
  });

  if (error) {
    console.error("Failed to create table:", error.message);
    console.log("\nPlease run this SQL in your Supabase SQL editor:");
    console.log(`
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  mobile TEXT,
  amount NUMERIC(10,2),
  transaction_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
    `);
  } else {
    console.log("payments table created successfully!");
  }
}

createPaymentsTable().catch(console.error);
