import { NextRequest, NextResponse } from "next/server";
import { autoIndexUrls } from "@/lib/auto-index";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ success: false, error: "URLs array is required" }, { status: 400 });
    }

    // Submit to Bing and ping Google sitemap
    await autoIndexUrls(urls);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully pinged ${urls.length} URLs to search engines.` 
    });
  } catch (err: any) {
    console.error("[api/admin/sitemap/ping] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
