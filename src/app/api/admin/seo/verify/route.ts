import { NextResponse } from "next/server";

const SITE_URL = "https://www.katyaayaniastrologer.com";

export async function GET() {
  try {
    const res = await fetch(SITE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KatyaayaniSEOChecker/1.0)" },
      next: { revalidate: 0 },
    });

    const html = await res.text();

    // Check Google verification tags
    const googleMatches = [...html.matchAll(/<meta[^>]+name=["']google-site-verification["'][^>]+content=["']([^"']+)["'][^>]*>/gi)];
    const googleCodes = googleMatches.map(m => m[1]);

    // Check Bing msvalidate
    const bingMatch = html.match(/<meta[^>]+name=["']msvalidate\.01["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    const bingCode = bingMatch ? bingMatch[1] : null;

    // Check BingSiteAuth.xml
    let bingXmlOk = false;
    try {
      const xmlRes = await fetch(`${SITE_URL}/BingSiteAuth.xml`);
      bingXmlOk = xmlRes.ok;
    } catch { bingXmlOk = false; }

    // Check sitemap
    let sitemapOk = false;
    let sitemapCount = 0;
    try {
      const smRes = await fetch(`${SITE_URL}/sitemap.xml`);
      if (smRes.ok) {
        const smText = await smRes.text();
        const urlMatches = smText.match(/<loc>/g) || [];
        sitemapCount = urlMatches.length;
        sitemapOk = true;
      }
    } catch { sitemapOk = false; }

    // Check robots.txt
    let robotsOk = false;
    let robotsAllowsGoogle = false;
    let robotsAllowsBing = false;
    try {
      const rRes = await fetch(`${SITE_URL}/robots.txt`);
      if (rRes.ok) {
        const rText = await rRes.text();
        robotsOk = true;
        const rLower = rText.toLowerCase();
        robotsAllowsGoogle = rLower.includes("googlebot") || rLower.includes("user-agent: *");
        robotsAllowsBing = rLower.includes("bingbot") || rLower.includes("msnbot") || rLower.includes("user-agent: *");
      }
    } catch { robotsOk = false; }

    return NextResponse.json({
      success: true,
      siteUrl: SITE_URL,
      google: {
        metaTagFound: googleCodes.length > 0,
        codes: googleCodes,
        count: googleCodes.length,
      },
      bing: {
        metaTagFound: !!bingCode,
        code: bingCode,
        xmlFileFound: bingXmlOk,
      },
      sitemap: {
        accessible: sitemapOk,
        urlCount: sitemapCount,
      },
      robots: {
        accessible: robotsOk,
        allowsGooglebot: robotsAllowsGoogle,
        allowsBingbot: robotsAllowsBing,
      },
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
