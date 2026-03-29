import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.katyaayaniastrologer.com";

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
    return true;
  } catch { return false; }
}

export async function GET() {
  try {
    const pages = [
      "/", "/about", "/services", "/booking", "/blog", "/horoscope",
      "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting",
    ];

    const errors: string[] = [];
    const results: { page: string; status: number; ok: boolean; responseTime: number }[] = [];

    for (const path of pages) {
      const start = Date.now();
      try {
        const res = await fetch(`${SITE_URL}${path}`, {
          method: "HEAD",
          headers: { "User-Agent": "KatyaayaniHealthCheck/1.0" },
          signal: AbortSignal.timeout(10000),
        });
        const responseTime = Date.now() - start;
        results.push({ page: path, status: res.status, ok: res.ok, responseTime });
        
        if (!res.ok) errors.push(`${path}: HTTP ${res.status}`);
        if (responseTime > 5000) errors.push(`${path}: Slow response (${responseTime}ms)`);
      } catch (err: any) {
        const responseTime = Date.now() - start;
        results.push({ page: path, status: 0, ok: false, responseTime });
        errors.push(`${path}: ${err.message}`);
      }
    }

    // Check sitemap
    try {
      const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) errors.push(`Sitemap: HTTP ${res.status}`);
    } catch { errors.push("Sitemap: Unreachable"); }

    // Check robots.txt
    try {
      const res = await fetch(`${SITE_URL}/robots.txt`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) errors.push(`Robots.txt: HTTP ${res.status}`);
    } catch { errors.push("Robots.txt: Unreachable"); }

    // Send Telegram alert if errors found
    let alertSent = false;
    if (errors.length > 0) {
      const message = `<b>Katyaayani Site Alert</b>\n\n<b>${errors.length} issues found:</b>\n${errors.map(e => `- ${e}`).join("\n")}\n\n<i>Checked: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</i>`;
      alertSent = await sendTelegramAlert(message);
    }

    const avgResponseTime = Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length);

    return NextResponse.json({
      success: true,
      data: {
        healthy: errors.length === 0,
        totalChecked: results.length,
        errors,
        errorCount: errors.length,
        results,
        avgResponseTime,
        alertSent,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
