import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "Katyaayani Astrologer - Best Ancient Astrologer in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const DEFAULT_COVER =
  "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";

async function getCoverImageUrl(): Promise<string> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "search_thumbnail_image")
      .maybeSingle();
    return data?.value || DEFAULT_COVER;
  } catch {
    return DEFAULT_COVER;
  }
}

export default async function Image() {
  const coverUrl = await getCoverImageUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Cover image as full background */}
        <img
          src={coverUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt=""
        />

        {/* Dark overlay at bottom for text readability */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.80) 0%, transparent 100%)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 40px 18px",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 16,
              letterSpacing: "1px",
            }}
          >
            www.katyaayaniastrologer.com
          </span>
          <span
            style={{
              color: "#ff8c42",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
              Best Ancient Astrologer Since 2007
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
