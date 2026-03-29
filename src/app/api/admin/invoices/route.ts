import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// GET - List all invoices or single invoice
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const booking_id = req.nextUrl.searchParams.get("booking_id");

    if (id) {
      const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data });
    }

    if (booking_id) {
      const { data, error } = await supabase.from("invoices").select("*").eq("booking_id", booking_id).single();
      if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data: data || null });
    }

    const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create invoice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, user_name, user_email, user_phone, user_address, service_type, service_description, amount, tax_amount, total_amount, notes, disclaimer } = body;

    // Generate invoice number
    const now = new Date();
    const invoiceNumber = `KA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data, error } = await supabase.from("invoices").insert({
      invoice_number: invoiceNumber,
      booking_id: booking_id || null,
      user_name,
      user_email,
      user_phone: user_phone || "",
      user_address: user_address || "",
      service_type,
      service_description: service_description || "",
      amount: amount || 0,
      tax_amount: tax_amount || 0,
      total_amount: total_amount || amount || 0,
      notes: notes || "",
      disclaimer: disclaimer || "This is a computer-generated invoice. All consultations are subject to our terms and conditions. No refunds after the consultation has been completed.",
      status: "draft",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update booking with invoice number if booking_id provided
    if (booking_id) {
      await supabase.from("bookings").update({ invoice_number: invoiceNumber }).eq("id", booking_id);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update invoice
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });

    const { data, error } = await supabase.from("invoices").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - Delete invoice
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });

    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
