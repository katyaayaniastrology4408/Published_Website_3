import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = 'force-dynamic' ; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const pagePath = searchParams.get("page_path");

    if (pagePath) {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .eq("page_path", pagePath)
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("page_path", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { page_path, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url, robots, schema_markup, bing_keywords, bing_meta_title, bing_meta_description } = body;

    if (!page_path) {
      return NextResponse.json({ success: false, error: "page_path is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("seo_settings")
      .upsert(
        {
          page_path,
          meta_title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          canonical_url,
          robots,
          schema_markup,
          bing_keywords: bing_keywords || null,
          bing_meta_title: bing_meta_title || null,
          bing_meta_description: bing_meta_description || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_path" }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("seo_settings").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
