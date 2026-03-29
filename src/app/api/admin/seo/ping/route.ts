import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.katyaayaniastrologer.com";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const PING_TARGETS = [
  { name: "Google", url: `https://www.google.com/ping?sitemap=${siteUrl}/sitemap.xml` },
  { name: "Bing", url: `https://www.bing.com/ping?sitemap=${siteUrl}/sitemap.xml` },
];

// POST - Ping search engines
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json().catch(() => ({}));
    const targetFilter = body.target; // optional: "Google" or "Bing"

    const results = [];

    for (const target of PING_TARGETS) {
      if (targetFilter && target.name !== targetFilter) continue;

      let status = "success";
      let responseCode = 0;
      let responseBody = "";
      let errorMessage = "";

      try {
        const res = await fetch(target.url, { method: "GET", signal: AbortSignal.timeout(10000) });
        responseCode = res.status;
        responseBody = await res.text().catch(() => "");
        if (!res.ok) {
          status = "failed";
          errorMessage = `HTTP ${res.status}`;
        }
      } catch (err: any) {
        status = "failed";
        errorMessage = err.message || "Unknown error";
      }

      // Log to DB
      await supabase.from("ping_logs").insert({
        target: target.name,
        sitemap_url: `${siteUrl}/sitemap.xml`,
        status,
        response_code: responseCode,
        response_body: responseBody.substring(0, 1000),
        error_message: errorMessage,
      });

      results.push({ target: target.name, status, responseCode, errorMessage });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET - Fetch ping logs
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const { data, error } = await supabase
      .from("ping_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
