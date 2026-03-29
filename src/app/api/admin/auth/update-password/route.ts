import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword, isOtpVerified } = await req.json();

    if (!isOtpVerified) {
      // Verify current password from DB or env
      const { data: adminSettings, error: dbError } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();

      let actualPassword = process.env.ADMIN_PASSWORD;
      if (!dbError && adminSettings) {
        actualPassword = adminSettings.value;
      }

      if (currentPassword !== actualPassword) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }
    }

    // Update password in DB
    const { error: updateError } = await supabase
      .from('admin_settings')
      .upsert({ key: 'admin_password', value: newPassword }, { onConflict: 'key' });

    if (updateError) {
      throw updateError;
    }

    // Log the password change
    await supabase.from('admin_activities').insert({
      title: 'Admin Password Changed',
      description: 'The administrator panel password has been updated successfully.',
      type: 'admin_action',
      status: 'completed'
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
