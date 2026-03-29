import { NextResponse } from "next/server";

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.katyaayaniastrologer.com";

    // Fetch the homepage HTML
    const res = await fetch(siteUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SocialPreviewBot/1.0)" },
      next: { revalidate: 0 },
    });
    const html = await res.text();

    const extract = (pattern: RegExp): string => {
      const m = html.match(pattern);
      return m ? m[1] : "";
    };

    const data: Record<string, string> = {
      "og:title": extract(/property="og:title"\s+content="([^"]+)"/),
      "og:description": extract(/property="og:description"\s+content="([^"]+)"/),
      "og:image": extract(/property="og:image"\s+content="([^"]+)"/),
      "og:url": extract(/property="og:url"\s+content="([^"]+)"/),
      "og:type": extract(/property="og:type"\s+content="([^"]+)"/),
      "twitter:card": extract(/name="twitter:card"\s+content="([^"]+)"/),
      "twitter:title": extract(/name="twitter:title"\s+content="([^"]+)"/),
      "twitter:description": extract(/name="twitter:description"\s+content="([^"]+)"/),
      "twitter:image": extract(/name="twitter:image"\s+content="([^"]+)"/),
      "schema:present": html.includes("application/ld+json") ? "Yes" : "No",
    };

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
