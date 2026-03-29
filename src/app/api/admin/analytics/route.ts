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

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { page_path, page_title, referrer, session_id } = body;

    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Parse device type and browser from user agent
    let device_type = "desktop";
    if (/mobile/i.test(userAgent)) device_type = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) device_type = "tablet";

    let browser = "other";
    if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Safari";
    else if (/edge/i.test(userAgent)) browser = "Edge";

    const { error } = await supabase.from("page_views").insert({
      page_path,
      page_title,
      referrer,
      user_agent: userAgent,
      ip_address: ip,
      device_type,
      browser,
      session_id,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "7d";

    let startDate: string;
    const now = new Date();

    switch (period) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    // Get all page views for the period
    const { data: views, error } = await supabase
      .from("page_views")
      .select("*")
      .gte("created_at", startDate)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const allViews = views || [];
    const totalViews = allViews.length;
    const uniqueSessions = new Set(allViews.map((v) => v.session_id).filter(Boolean)).size;

    // Top pages
    const pageCounts: Record<string, number> = {};
    allViews.forEach((v) => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Devices breakdown
    const deviceCounts: Record<string, number> = {};
    allViews.forEach((v) => {
      const d = v.device_type || "unknown";
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    });

    // Browser breakdown
    const browserCounts: Record<string, number> = {};
    allViews.forEach((v) => {
      const b = v.browser || "other";
      browserCounts[b] = (browserCounts[b] || 0) + 1;
    });

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    allViews.forEach((v) => {
      if (v.referrer) {
        try {
          const host = new URL(v.referrer).hostname || v.referrer;
          referrerCounts[host] = (referrerCounts[host] || 0) + 1;
        } catch {
          referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1;
        }
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // Daily views for chart - fill all dates in range
    const dailyViews: Record<string, number> = {};
    allViews.forEach((v) => {
      const day = new Date(v.created_at).toISOString().split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    });

    // Fill in missing dates with 0
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setUTCHours(0, 0, 0, 0);
    const allDates: { date: string; count: number }[] = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      allDates.push({ date: key, count: dailyViews[key] || 0 });
    }
    const chartData = allDates;

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueSessions,
        topPages,
        devices: deviceCounts,
        browsers: browserCounts,
        topReferrers,
        chartData,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
