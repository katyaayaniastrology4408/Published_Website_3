import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic' ; 

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*');

    if (error) throw error;

const settings = data.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("Admin settings fetch error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();

    if (!key || !value) {
      return NextResponse.json({ success: false, message: "Missing key or value" }, { status: 400 });
    }

    const { error } = await supabase
      .from('admin_settings')
      .upsert({ 
        key, 
        value, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin settings error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
