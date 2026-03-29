import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function GET(request: NextRequest) {
  const transactionId = request.nextUrl.searchParams.get("transaction_id");
  const referenceNumber = request.nextUrl.searchParams.get("reference_number");

  if (!transactionId && !referenceNumber) {
    return NextResponse.json({ success: false, message: "Missing identifiers" }, { status: 400 });
  }

  try {
    let query = supabase.from("payments").select("*");

    if (transactionId) {
      query = query.eq("transaction_id", transactionId);
    } else if (referenceNumber) {
      query = query.eq("reference_number", referenceNumber);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
