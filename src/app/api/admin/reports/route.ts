import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SITE_URL = "https://www.katyaayaniastrologer.com";

// GET: Full SEO + traffic report
export async function GET(req: NextRequest) {
  try {
    const format = req.nextUrl.searchParams.get("format") || "json";

    // --- Traffic Analytics ---
    const now = new Date();
    const periods = {
      today: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(),
      week: new Date(now.getTime() - 7 * 86400000).toISOString(),
      month: new Date(now.getTime() - 30 * 86400000).toISOString(),
      quarter: new Date(now.getTime() - 90 * 86400000).toISOString(),
    };

    // Users
    const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: weeklyUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", periods.week);
    const { count: monthlyUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", periods.month);

    // Bookings
    const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true });
    const { count: weeklyBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", periods.week);
    const { count: monthlyBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", periods.month);
    const { data: recentBookings } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(20);

    // Enquiries
    const { count: totalEnquiries } = await supabase.from("enquiries").select("*", { count: "exact", head: true });
    const { count: weeklyEnquiries } = await supabase.from("enquiries").select("*", { count: "exact", head: true }).gte("created_at", periods.week);
    const { count: monthlyEnquiries } = await supabase.from("enquiries").select("*", { count: "exact", head: true }).gte("created_at", periods.month);

    // Blog
    const { count: totalBlogs } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
    const { data: blogPosts } = await supabase.from("blog_posts").select("title, slug, views, created_at, is_published").order("views", { ascending: false }).limit(10);

    // Feedback
    const { count: totalFeedback } = await supabase.from("feedback").select("*", { count: "exact", head: true });
    const { data: recentFeedback } = await supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(10);

    // --- SEO Health Check ---
    const pages = ["/", "/about", "/services", "/booking", "/blog", "/horoscope", "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting"];
    const seoResults: { page: string; status: number; hasTitle: boolean; hasDesc: boolean; hasOG: boolean; hasCanonical: boolean; hasSchema: boolean }[] = [];

    for (const path of pages) {
      try {
        const res = await fetch(`${SITE_URL}${path}`, {
          headers: { "User-Agent": "KatyaayaniReporter/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
          seoResults.push({ page: path, status: res.status, hasTitle: false, hasDesc: false, hasOG: false, hasCanonical: false, hasSchema: false });
          continue;
        }
        const html = await res.text();
        seoResults.push({
          page: path,
          status: res.status,
          hasTitle: !!html.match(/<title[^>]*>.+<\/title>/i),
          hasDesc: !!html.match(/<meta[^>]*name=["']description["'][^>]*>/i),
          hasOG: !!html.match(/<meta[^>]*property=["']og:title["'][^>]*>/i),
          hasCanonical: !!html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i),
          hasSchema: !!html.match(/<script[^>]*type=["']application\/ld\+json["']/i),
        });
      } catch {
        seoResults.push({ page: path, status: 0, hasTitle: false, hasDesc: false, hasOG: false, hasCanonical: false, hasSchema: false });
      }
    }

    const seoScore = Math.round(
      seoResults.reduce((sum, r) => {
        let s = 0;
        if (r.status === 200) s += 20;
        if (r.hasTitle) s += 20;
        if (r.hasDesc) s += 20;
        if (r.hasOG) s += 15;
        if (r.hasCanonical) s += 15;
        if (r.hasSchema) s += 10;
        return sum + s;
      }, 0) / seoResults.length
    );

    const report = {
      generatedAt: new Date().toISOString(),
      seo: { score: seoScore, pages: seoResults },
      traffic: {
        users: { total: totalUsers || 0, weekly: weeklyUsers || 0, monthly: monthlyUsers || 0 },
        bookings: { total: totalBookings || 0, weekly: weeklyBookings || 0, monthly: monthlyBookings || 0, recent: recentBookings || [] },
        enquiries: { total: totalEnquiries || 0, weekly: weeklyEnquiries || 0, monthly: monthlyEnquiries || 0 },
        blogs: { total: totalBlogs || 0, topPosts: blogPosts || [] },
        feedback: { total: totalFeedback || 0, recent: recentFeedback || [] },
      },
    };

    // CSV Export
    if (format === "csv") {
      const csvLines = [
        "Section,Metric,Value",
        `SEO,Overall Score,${seoScore}`,
        ...seoResults.map(r => `SEO Page,${r.page},Status ${r.status} | Title:${r.hasTitle} | Desc:${r.hasDesc} | OG:${r.hasOG} | Canonical:${r.hasCanonical} | Schema:${r.hasSchema}`),
        `Users,Total,${totalUsers || 0}`,
        `Users,Weekly,${weeklyUsers || 0}`,
        `Users,Monthly,${monthlyUsers || 0}`,
        `Bookings,Total,${totalBookings || 0}`,
        `Bookings,Weekly,${weeklyBookings || 0}`,
        `Bookings,Monthly,${monthlyBookings || 0}`,
        `Enquiries,Total,${totalEnquiries || 0}`,
        `Enquiries,Weekly,${weeklyEnquiries || 0}`,
        `Enquiries,Monthly,${monthlyEnquiries || 0}`,
        `Blogs,Total,${totalBlogs || 0}`,
        `Feedback,Total,${totalFeedback || 0}`,
        ...(blogPosts || []).map(b => `Blog Post,"${b.title}",Views: ${b.views || 0} | Published: ${b.is_published}`),
        ...(recentBookings || []).map(b => `Booking,"${b.name || 'N/A'}","${b.service_type || 'N/A'} | ${b.status || 'pending'} | ${b.created_at}"`),
      ];

      return new NextResponse(csvLines.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="katyaayani-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, data: report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
