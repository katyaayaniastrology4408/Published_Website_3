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
  const startTime = Date.now();

  try {
    // 1. Server health
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    // 2. Database connectivity
    let dbStatus = "unknown";
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await supabase.from("profiles").select("id", { count: "exact", head: true });
      dbLatency = Date.now() - dbStart;
      dbStatus = dbLatency < 3000 ? "healthy" : "slow";
    } catch {
      dbStatus = "error";
    }

    // 3. Site accessibility
    const criticalPages = ["/", "/services", "/booking", "/blog", "/rashifal"];
    const pageChecks: { path: string; status: number; latency: number; healthy: boolean }[] = [];

    for (const path of criticalPages) {
      const pageStart = Date.now();
      try {
        const res = await fetch(`${SITE_URL}${path}`, {
          method: "HEAD",
          signal: AbortSignal.timeout(8000),
          headers: { "User-Agent": "KatyaayaniMonitor/1.0" },
        });
        const latency = Date.now() - pageStart;
        pageChecks.push({ path, status: res.status, latency, healthy: res.ok });
      } catch {
        pageChecks.push({ path, status: 0, latency: Date.now() - pageStart, healthy: false });
      }
    }

    // 4. Sitemap & robots
    let sitemapOk = false;
    let robotsOk = false;
    try {
      const s = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      sitemapOk = s.ok;
    } catch {}
    try {
      const r = await fetch(`${SITE_URL}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      robotsOk = r.ok;
    } catch {}

    // 5. SSL check
    let sslValid = false;
    try {
      const sslRes = await fetch(SITE_URL, { method: "HEAD", signal: AbortSignal.timeout(5000) });
      sslValid = sslRes.ok;
    } catch {}

    // 6. Environment check
    const envVars = [
      "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY",
      "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "ADMIN_EMAIL", "GMAIL_USER", "GMAIL_APP_PASSWORD",
      "NEXT_PUBLIC_GTM_ID", "RESEND_API_KEY",
    ];
    const envStatus = envVars.map(v => ({ name: v, set: !!process.env[v] }));
    const missingEnvs = envStatus.filter(e => !e.set).map(e => e.name);

    const totalLatency = Date.now() - startTime;
    const allPagesHealthy = pageChecks.every(p => p.healthy);
    const overallHealthy = allPagesHealthy && dbStatus === "healthy" && sitemapOk && robotsOk;

    return NextResponse.json({
      success: true,
      data: {
        status: overallHealthy ? "healthy" : "degraded",
        server: {
          uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m`,
          memory: {
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          },
          nodeVersion: process.version,
          platform: process.platform,
        },
        database: { status: dbStatus, latency: `${dbLatency}ms` },
        pages: pageChecks,
        seo: { sitemap: sitemapOk, robots: robotsOk, ssl: sslValid },
        environment: { total: envVars.length, configured: envVars.length - missingEnvs.length, missing: missingEnvs },
        checkDuration: `${totalLatency}ms`,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
