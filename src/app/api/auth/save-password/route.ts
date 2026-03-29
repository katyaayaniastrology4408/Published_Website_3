import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    // clear_password cleanup is no longer needed as the column has been removed for security
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
