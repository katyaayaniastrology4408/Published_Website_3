import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.katyaayaniastrologer.com";

const ALL_PAGES = [
  "/", "/about", "/services", "/booking", "/blog", "/horoscope",
  "/rashifal", "/hindu-calendar", "/important-days", "/online-consulting",
  "/feedback", "/privacy", "/terms", "/disclaimer", "/refund-policy",
  "/signin", "/signup",
];

async function validatePage(path: string) {
  const url = `${SITE_URL}${path}`;
  const issues: { type: string; message: string }[] = [];
  let score = 100;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "KatyaayaniSEOBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      issues.push({ type: "error", message: `HTTP ${res.status} response` });
      return { path, url, status: res.status, score: 0, issues };
    }

    const html = await res.text();

    // Title check
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!titleMatch || !titleMatch[1]) {
      issues.push({ type: "error", message: "Missing <title> tag" });
      score -= 20;
    } else if (titleMatch[1].length < 30) {
      issues.push({ type: "warning", message: `Title too short: ${titleMatch[1].length} chars (min 30)` });
      score -= 5;
    } else if (titleMatch[1].length > 70) {
      issues.push({ type: "warning", message: `Title too long: ${titleMatch[1].length} chars (max 70)` });
      score -= 5;
    }

    // Meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
    if (!descMatch || !descMatch[1]) {
      issues.push({ type: "error", message: "Missing meta description" });
      score -= 20;
    } else if (descMatch[1].length < 70) {
      issues.push({ type: "warning", message: `Description too short: ${descMatch[1].length} chars (min 70)` });
      score -= 5;
    } else if (descMatch[1].length > 160) {
      issues.push({ type: "warning", message: `Description too long: ${descMatch[1].length} chars (max 160)` });
      score -= 5;
    }

    // OG tags
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["']/i);
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["']/i);
    const ogImage = html.match(/<meta[^>]*property=["']og:image["']/i);
    const ogUrl = html.match(/<meta[^>]*property=["']og:url["']/i);

    if (!ogTitle) { issues.push({ type: "warning", message: "Missing og:title" }); score -= 5; }
    if (!ogDesc) { issues.push({ type: "warning", message: "Missing og:description" }); score -= 5; }
    if (!ogImage) { issues.push({ type: "warning", message: "Missing og:image" }); score -= 5; }
    if (!ogUrl) { issues.push({ type: "info", message: "Missing og:url" }); score -= 2; }

    // Twitter card
    const twitterCard = html.match(/<meta[^>]*name=["']twitter:card["']/i);
    if (!twitterCard) { issues.push({ type: "warning", message: "Missing twitter:card" }); score -= 5; }

    // Canonical
    const canonical = html.match(/<link[^>]*rel=["']canonical["']/i);
    if (!canonical) { issues.push({ type: "warning", message: "Missing canonical URL" }); score -= 5; }

    // H1 tag
    const h1Match = html.match(/<h1[^>]*>/i);
    if (!h1Match) { issues.push({ type: "info", message: "No H1 tag found (may be client-rendered)" }); }

    // Viewport
    const viewport = html.match(/<meta[^>]*name=["']viewport["']/i);
    if (!viewport) { issues.push({ type: "error", message: "Missing viewport meta tag" }); score -= 10; }

    // Robots
    const robotsMeta = html.match(/<meta[^>]*name=["']robots["']/i);
    if (!robotsMeta) { issues.push({ type: "info", message: "No robots meta tag (defaults to index,follow)" }); }

    // Schema/JSON-LD
    const jsonLd = html.match(/<script[^>]*type=["']application\/ld\+json["']/i);
    if (!jsonLd) { issues.push({ type: "info", message: "No JSON-LD structured data" }); score -= 3; }

    // Image alt tags
    const images = html.match(/<img[^>]+>/gi) || [];
    const imagesWithoutAlt = images.filter(img => !img.match(/alt=["'][^"']+["']/i));
    if (imagesWithoutAlt.length > 0) {
      issues.push({ type: "warning", message: `${imagesWithoutAlt.length} images without alt text` });
      score -= Math.min(imagesWithoutAlt.length * 2, 10);
    }

    // lang attribute
    const langAttr = html.match(/<html[^>]*lang=["'][^"']+["']/i);
    if (!langAttr) { issues.push({ type: "warning", message: "Missing lang attribute on <html>" }); score -= 3; }

    return { path, url, status: res.status, score: Math.max(score, 0), issues, title: titleMatch?.[1] || null, description: descMatch?.[1] || null };
  } catch (err: any) {
    return { path, url, status: 0, score: 0, issues: [{ type: "error", message: `Fetch failed: ${err.message}` }] };
  }
}

export async function GET() {
  try {
    const results = await Promise.all(ALL_PAGES.map(validatePage));
    const overallScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
    const totalErrors = results.flatMap(r => r.issues).filter(i => i.type === "error").length;
    const totalWarnings = results.flatMap(r => r.issues).filter(i => i.type === "warning").length;

    return NextResponse.json({
      success: true,
      data: {
        overallScore,
        totalPages: results.length,
        totalErrors,
        totalWarnings,
        results,
        testedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Validate a single URL
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, error: "URL required" }, { status: 400 });
    const path = url.replace(SITE_URL, "") || "/";
    const result = await validatePage(path);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
