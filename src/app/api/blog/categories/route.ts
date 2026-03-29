import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// GET - fetch all categories
export async function GET() {
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// POST - add new category
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { value, label_en, label_gu, label_hi, icon } = body;

  if (!value || !label_en) {
    return NextResponse.json({ success: false, error: "value and label_en are required" }, { status: 400 });
  }

  // slug-ify the value
  const safeValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").trim();

  // get max sort_order
  const { data: existing } = await supabase
    .from("blog_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? (existing[0].sort_order + 1) : 1;

  const { data, error } = await supabase.from("blog_categories").insert({
    value: safeValue,
    label_en,
    label_gu: label_gu || label_en,
    label_hi: label_hi || label_en,
    icon: icon || "📝",
    sort_order: nextOrder,
  }).select().single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// DELETE - delete category by id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
