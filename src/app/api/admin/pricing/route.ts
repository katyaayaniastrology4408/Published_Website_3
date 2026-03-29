import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// Public GET — used by booking and services pages
export async function GET() {
  const { data, error } = await supabase
    .from("service_prices")
    .select("*")
    .order("price", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prices: data });
}

// Admin PUT — update a service price
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, price, price_display, duration, description, title } = body;

  if (!id || price === undefined) {
    return NextResponse.json({ error: "id and price required" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (price !== undefined) updateData.price = price;
  if (price_display) updateData.price_display = price_display;
  if (duration) updateData.duration = duration;
  if (description) updateData.description = description;
  if (title) updateData.title = title;

  const { data, error } = await supabase
    .from("service_prices")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, price: data });
}
