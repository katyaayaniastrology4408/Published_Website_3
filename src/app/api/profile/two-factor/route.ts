import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enabled } = await req.json();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ two_factor_enabled: enabled })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, enabled });
  } catch (error: any) {
    console.error("2FA Toggle Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
