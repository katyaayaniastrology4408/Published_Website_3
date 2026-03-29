import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: Request) {
  try {
    const { id, name, phone, address, city, gender, dob, tob, pob } = await req.json();
  
    if (!id) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }
  
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id,
        name: name || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        gender: gender || null,
          dob: dob || null,
          tob: tob || null,
          pob: pob || null,
          email_verified: true
        }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Complete profile error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
