import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// Ensure table exists - called lazily on first payment save
async function ensurePaymentsTable() {
  // Try a lightweight query; if it fails the table doesn't exist
  const { error } = await supabase.from("payments").select("id").limit(1);
  if (!error) return true;

  // Table doesn't exist – log the SQL for manual creation
  console.error(
    "payments table missing. Run this SQL in your Supabase dashboard:\n" +
      CREATE_TABLE_SQL
  );
  return false;
}

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS public.payments (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT,
  email       TEXT,
  mobile      TEXT,
  amount      NUMERIC(10, 2),
  transaction_id  TEXT,
  payment_status  TEXT DEFAULT 'pending',
  payment_date    TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_txn  ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
`;

/** POST /api/payments – save a payment record */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, amount, transaction_id, payment_status, reference_number } = body;

    await ensurePaymentsTable();

    const { data, error } = await supabase
      .from("payments")
      .insert({
        name: name || null,
        email: email || null,
        mobile: mobile || null,
        amount: parseFloat(amount) || 0,
        transaction_id: transaction_id || null,
        payment_status: payment_status || "pending",
        payment_date: new Date().toISOString(),
        reference_number: reference_number || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Payment insert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment: data });
  } catch (err: any) {
    console.error("Payment save error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/** GET /api/payments – list payments (admin use) */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
