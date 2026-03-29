import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET: return current search thumbnail image
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "search_thumbnail_image")
      .maybeSingle();
    return NextResponse.json({ success: true, url: data?.value || null });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: apply og_image to all seo_settings pages AND save as search_thumbnail_image in admin_settings
export async function POST(req: NextRequest) {
  try {
    const { og_image } = await req.json();
    if (!og_image) {
      return NextResponse.json({ success: false, error: "og_image is required" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Update all SEO settings pages
    const { data, error } = await supabase
      .from("seo_settings")
      .update({ og_image })
      .neq("page_path", "__dummy__")
      .select("page_path");

    if (error) throw error;

    // Also save as the global search thumbnail (used by /opengraph-image route)
    await supabase
      .from("admin_settings")
      .upsert({ key: "search_thumbnail_image", value: og_image }, { onConflict: "key" });

    return NextResponse.json({ success: true, updated: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
