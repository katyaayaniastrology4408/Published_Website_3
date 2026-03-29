import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;

    if (email !== adminEmail) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { data: adminSettings, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (error || !adminSettings) {
      // Fallback to env password if DB entry is missing
      const envPassword = process.env.ADMIN_PASSWORD;
      if (password === envPassword) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (password === adminSettings.value) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
