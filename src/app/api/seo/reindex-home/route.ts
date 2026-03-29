import { NextResponse } from "next/server";
import { autoIndexUrl } from "@/lib/auto-index";

export async function GET() {
  try {
    // Notify Bing and Google that the homepage has updated with new gallery content
    await autoIndexUrl("/");
    return NextResponse.json({ success: true, message: "Homepage re-indexing requested successfully" });
  } catch (error) {
    console.error("Re-indexing error:", error);
    return NextResponse.json({ success: false, error: "Failed to request re-indexing" }, { status: 500 });
  }
}
