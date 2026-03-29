import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw error;

    const settings: Record<string, string> = {};
    data?.forEach((row: { key: string; value: string }) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Support bulk update: { settings: { key1: val1, key2: val2 } }
    if (body.settings && typeof body.settings === 'object') {
      const entries = Object.entries(body.settings);
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
        if (error) throw error;
      }
      return NextResponse.json({ success: true, updated: entries.length });
    }

    // Support single update: { key, value }
    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ success: false, error: "Missing key" }, { status: 400 });
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
