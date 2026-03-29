import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "logo" | "favicon" | "og_image"

    if (!file || !type) {
      return NextResponse.json({ error: "File and type required" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/x-icon", "image/ico"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, WebP, SVG, ICO allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const fileName = `branding/${type}_${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("LOGO")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("LOGO").getPublicUrl(fileName);

    // Save to site_settings
    const settingKey = type === "logo" ? "logo_url" : type === "favicon" ? "favicon_url" : "og_image_url";
    await supabase
      .from("site_settings")
      .upsert({ key: settingKey, value: urlData.publicUrl, updated_at: new Date().toISOString() }, { onConflict: "key" });

    // Also update seo_settings og_image for all pages if it's an OG image
    if (type === "og_image") {
      await supabase
        .from("seo_settings")
        .update({ og_image: urlData.publicUrl })
        .neq("og_image", "");
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
