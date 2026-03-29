import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get user profile to find email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    const userEmail = profile?.email;

    // Delete user data from all related tables
    await supabase.from("user_alerts").delete().eq("user_id", userId);
    await supabase.from("reschedule_requests").delete().eq("user_id", userId);

    if (userEmail) {
      await supabase.from("password_reset_requests").delete().eq("email", userEmail);
      await supabase.from("otp_codes").delete().eq("email", userEmail);
      await supabase.from("otps").delete().eq("email", userEmail);
      await supabase.from("feedback").delete().eq("email", userEmail);
      await supabase.from("newsletter_subscribers").delete().eq("email", userEmail);

      // Delete bookings and related data
      const { data: bookings } = await supabase.from("bookings").select("id").eq("email", userEmail);
      if (bookings && bookings.length > 0) {
        const bookingIds = bookings.map(b => b.id);
        await supabase.from("consultation_notes").delete().in("booking_id", bookingIds);
        await supabase.from("invoices").delete().in("booking_id", bookingIds);
        await supabase.from("meeting_codes").delete().in("booking_id", bookingIds);
      }
      await supabase.from("bookings").delete().eq("email", userEmail);
      await supabase.from("enquiries").delete().eq("email", userEmail);
    }

    // Delete profile
    await supabase.from("profiles").delete().eq("id", userId);

    // Delete auth user
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (e) {
      // Auth user may not exist if they signed up with custom auth
      console.error("Failed to delete auth user (may not exist):", e);
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
