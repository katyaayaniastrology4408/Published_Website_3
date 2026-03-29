import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// GET — fetch email template config (public, used by email-templates.ts)
export async function GET() {
  const { data, error } = await supabase
    .from("email_template_config")
    .select("*")
    .eq("id", "global")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ config: data });
}

// PUT — update email template config (admin only)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { footer_tagline, brand_color, logo_url, contact_phone, contact_email, whatsapp_number, preheader } = body;

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (footer_tagline !== undefined) updateData.footer_tagline = footer_tagline;
  if (brand_color !== undefined) updateData.brand_color = brand_color;
  if (logo_url !== undefined) updateData.logo_url = logo_url;
  if (contact_phone !== undefined) updateData.contact_phone = contact_phone;
  if (contact_email !== undefined) updateData.contact_email = contact_email;
  if (whatsapp_number !== undefined) updateData.whatsapp_number = whatsapp_number;
  if (preheader !== undefined) updateData.preheader = preheader;

  const { data, error } = await supabase
    .from("email_template_config")
    .update(updateData)
    .eq("id", "global")
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, config: data });
}
