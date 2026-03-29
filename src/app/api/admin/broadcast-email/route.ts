import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ success: false, error: "Subject and message are required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
    );

    // Fetch all user IDs
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id');

    if (error) throw error;

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ success: false, error: "No users found" }, { status: 404 });
    }

    // Insert alerts for each user
    const alerts = profiles.map(u => ({
      user_id: u.id,
      title: subject,
      message: message,
      is_read: false
    }));
    
    const { error: alertError } = await supabaseAdmin.from('user_alerts').insert(alerts);
    if (alertError) throw alertError;

    return NextResponse.json({ 
      success: true, 
      message: `Broadcast message sent successfully to ${alerts.length} users.`,
      details: { 
        totalUsers: profiles.length, 
        alertsCreated: alerts.length
      }
    });

  } catch (error: any) {
    console.error("Broadcast Popup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
