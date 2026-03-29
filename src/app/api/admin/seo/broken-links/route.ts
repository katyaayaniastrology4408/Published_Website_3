import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.katyaayaniastrologer.com";

const ALL_PAGES = [
  "/", "/about", "/services", "/booking", "/blog", "/horoscope",
  "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting",
  "/feedback", "/privacy", "/terms", "/disclaimer", "/refund-policy",
];

async function extractLinks(html: string, pageUrl: string): Promise<string[]> {
  const linkRegex = /href=["'](.*?)["']/gi;
  const links: string[] = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("/")) href = SITE_URL + href;
    else if (!href.startsWith("http")) continue;
    links.push(href);
  }
  return [...new Set(links)];
}

async function checkLink(url: string): Promise<{ url: string; status: number; ok: boolean; redirected: boolean }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "KatyaayaniLinkChecker/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return { url, status: res.status, ok: res.ok, redirected: res.redirected };
  } catch {
    return { url, status: 0, ok: false, redirected: false };
  }
}

export async function GET() {
  try {
    const brokenLinks: { page: string; link: string; status: number }[] = [];
    const redirectedLinks: { page: string; link: string; status: number }[] = [];
    let totalLinksChecked = 0;

    for (const path of ALL_PAGES) {
      try {
        const res = await fetch(`${SITE_URL}${path}`, {
          headers: { "User-Agent": "KatyaayaniLinkChecker/1.0" },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) continue;
        const html = await res.text();
        const links = await extractLinks(html, `${SITE_URL}${path}`);
        
        // Check max 20 links per page to avoid timeout
        const linksToCheck = links.slice(0, 20);
        const results = await Promise.all(linksToCheck.map(checkLink));
        totalLinksChecked += results.length;

        for (const result of results) {
          if (!result.ok) {
            brokenLinks.push({ page: path, link: result.url, status: result.status });
          } else if (result.redirected) {
            redirectedLinks.push({ page: path, link: result.url, status: result.status });
          }
        }
      } catch { /* skip page errors */ }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalLinksChecked,
        brokenLinks,
        redirectedLinks,
        brokenCount: brokenLinks.length,
        redirectCount: redirectedLinks.length,
        scannedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
