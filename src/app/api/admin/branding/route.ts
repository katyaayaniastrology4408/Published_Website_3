import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function GET() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, updated_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { settings } = body as { settings: Record<string, string> };

  if (!settings || typeof settings !== "object") {
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }

  const errors: string[] = [];
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) errors.push(`${key}: ${error.message}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Settings updated" });
}
