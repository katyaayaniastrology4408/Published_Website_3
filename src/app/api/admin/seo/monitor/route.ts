import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SITE_URL = "https://www.katyaayaniastrologer.com";

export async function GET() {
  try {
    // Crawl error check - test all important pages
    const pages = [
      "/", "/about", "/services", "/booking", "/blog", "/horoscope",
      "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting",
      "/feedback", "/privacy", "/terms", "/disclaimer", "/refund-policy",
    ];

    const crawlResults = await Promise.all(
      pages.map(async (path) => {
        try {
          const res = await fetch(`${SITE_URL}${path}`, {
            method: "HEAD",
            headers: { "User-Agent": "KatyaayaniMonitor/1.0" },
            signal: AbortSignal.timeout(8000),
          });
          return { path, status: res.status, ok: res.ok };
        } catch {
          return { path, status: 0, ok: false };
        }
      })
    );

    const crawlErrors = crawlResults.filter(r => !r.ok);
    const healthyPages = crawlResults.filter(r => r.ok);

    // Check sitemap accessibility
    let sitemapStatus = "unknown";
    try {
      const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      sitemapStatus = sitemapRes.ok ? "accessible" : `error_${sitemapRes.status}`;
    } catch { sitemapStatus = "unreachable"; }

    // Check robots.txt
    let robotsStatus = "unknown";
    try {
      const robotsRes = await fetch(`${SITE_URL}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      robotsStatus = robotsRes.ok ? "accessible" : `error_${robotsRes.status}`;
    } catch { robotsStatus = "unreachable"; }

    // Get DB stats
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true });
    const { count: totalBlogs } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
    const { count: totalEnquiries } = await supabase.from("enquiries").select("*", { count: "exact", head: true });

    // Get recent activity counts (last 7 days, 30 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: weeklyUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo);
    const { count: monthlyUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo);
    const { count: weeklyBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo);
    const { count: monthlyBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo);

    // Index status summary
    const indexStatus = {
      totalPages: pages.length,
      healthyPages: healthyPages.length,
      errorPages: crawlErrors.length,
      sitemapStatus,
      robotsStatus,
    };

    return NextResponse.json({
      success: true,
      data: {
        indexStatus,
        crawlErrors,
        crawlResults,
        traffic: {
          totalUsers: totalUsers || 0,
          totalBookings: totalBookings || 0,
          totalBlogs: totalBlogs || 0,
          totalEnquiries: totalEnquiries || 0,
          weeklyUsers: weeklyUsers || 0,
          monthlyUsers: monthlyUsers || 0,
          weeklyBookings: weeklyBookings || 0,
          monthlyBookings: monthlyBookings || 0,
        },
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
