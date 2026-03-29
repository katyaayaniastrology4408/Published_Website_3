import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auditSeoEntry, generateSchemaMarkup } from "@/lib/seo";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ALL_PAGES = [
  "/", "/about", "/services", "/booking", "/blog", "/horoscope",
  "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting",
  "/feedback", "/privacy", "/terms", "/disclaimer", "/refund-policy",
];

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: seoEntries, error } = await supabase
      .from("seo_settings")
      .select("*")
      .order("page_path", { ascending: true });

    if (error) throw error;

    const configuredPaths = new Set((seoEntries || []).map((e) => e.page_path));
    const missingPages = ALL_PAGES.filter((p) => !configuredPaths.has(p));

    // Audit each configured entry
    const audits = (seoEntries || []).map((entry) => auditSeoEntry(entry));

    // Overall score
    const totalScore = audits.length > 0
      ? Math.round(audits.reduce((sum, a) => sum + a.score, 0) / audits.length)
      : 0;

    // Count issues by type
    const allIssues = audits.flatMap((a) => a.issues);
    const errorCount = allIssues.filter((i) => i.type === "error").length;
    const warningCount = allIssues.filter((i) => i.type === "warning").length;
    const infoCount = allIssues.filter((i) => i.type === "info").length;

    return NextResponse.json({
      success: true,
      data: {
        overallScore: totalScore,
        totalPages: ALL_PAGES.length,
        configuredPages: seoEntries?.length || 0,
        missingPages,
        errorCount,
        warningCount,
        infoCount,
        audits,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Auto-generate schema markup for a page
export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const { page_path } = await req.json();

    if (!page_path) {
      return NextResponse.json({ success: false, error: "page_path is required" }, { status: 400 });
    }

    // Get existing SEO data
    const { data: existing } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_path", page_path)
      .maybeSingle();

    const schema = generateSchemaMarkup(page_path, existing || undefined);

    // Upsert with generated schema
    const { data, error } = await supabase
      .from("seo_settings")
      .upsert(
        {
          page_path,
          schema_markup: schema,
          updated_at: new Date().toISOString(),
          ...(existing ? {} : {
            meta_title: existing?.meta_title,
            meta_description: existing?.meta_description,
          }),
        },
        { onConflict: "page_path" }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data, schema });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
