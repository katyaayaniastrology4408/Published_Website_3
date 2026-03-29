import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Admin Users fetch error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
