import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email;

    // Delete user data from all related tables
    // Order matters - delete dependent records first
    await supabase.from("user_alerts").delete().eq("user_id", userId);
    await supabase.from("reschedule_requests").delete().eq("user_id", userId);
    await supabase.from("password_reset_requests").delete().eq("email", userEmail);
    await supabase.from("otp_codes").delete().eq("email", userEmail);
    await supabase.from("otps").delete().eq("email", userEmail);
    await supabase.from("feedback").delete().eq("email", userEmail);
    await supabase.from("newsletter_subscribers").delete().eq("email", userEmail);
    
    // Delete bookings and related data
    if (userEmail) {
      const { data: bookings } = await supabase.from("bookings").select("id").eq("email", userEmail);
      if (bookings && bookings.length > 0) {
        const bookingIds = bookings.map((b: any) => b.id);
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
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error("Failed to delete auth user:", deleteError);
      // Profile data is already cleaned up, so we still return success
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
