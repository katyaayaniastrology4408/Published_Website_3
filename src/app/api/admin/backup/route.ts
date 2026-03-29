import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TABLES = ["profiles", "bookings", "enquiries", "feedback", "blog_posts", "blocked_dates", "admin_settings", "seo_settings", "meeting_codes", "password_reset_requests"];

export async function GET() {
  try {
    const backup: Record<string, any> = {};
    const stats: Record<string, number> = {};

    for (const table of TABLES) {
      try {
        const { data, error } = await supabase.from(table).select("*");
        if (!error && data) {
          backup[table] = data;
          stats[table] = data.length;
        } else {
          backup[table] = [];
          stats[table] = 0;
        }
      } catch {
        backup[table] = [];
        stats[table] = 0;
      }
    }

    const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      data: {
        backup,
        stats,
        totalRecords,
        tables: TABLES.length,
        exportedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
