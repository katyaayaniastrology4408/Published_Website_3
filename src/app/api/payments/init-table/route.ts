import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST() {
  try {
    // Create the payments table using raw SQL via supabase rpc
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS payments (
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
        CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
        CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(email);
      `,
    });

    if (error) {
      // Table might already exist or exec_sql not available - try direct insert to check
      console.error("Table creation via rpc failed:", error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payments table created" });
  } catch (err: any) {
    console.error("Init table error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
