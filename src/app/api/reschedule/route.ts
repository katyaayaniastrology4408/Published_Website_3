import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// POST - User requests reschedule
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, reason, requested_date, requested_time } = body;

    if (!booking_id) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Create reschedule request
    const { data, error } = await supabase.from("reschedule_requests").insert({
      booking_id,
      user_email: booking.email,
      user_name: booking.full_name,
      original_date: booking.booking_date,
      original_time: booking.booking_time,
      requested_date: requested_date || null,
      requested_time: requested_time || null,
      reason: reason || "",
      status: "pending",
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification to admin
    try {
      const emailHtml = `
        <h2>Reschedule Request</h2>
        <p><strong>User:</strong> ${booking.full_name} (${booking.email})</p>
        <p><strong>Service:</strong> ${booking.service_type}</p>
        <p><strong>Original Date:</strong> ${booking.booking_date} at ${booking.booking_time}</p>
        ${requested_date ? `<p><strong>Requested Date:</strong> ${requested_date} at ${requested_time || 'Any time'}</p>` : ''}
        <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
        <p>Please review this request in the admin panel.</p>
      `;

      const host = req.headers.get("host") || "www.katyaayaniastrologer.com";
      const protocol = host.includes("localhost") ? "http" : "https";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

      await fetch(`${appUrl}/api/test-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL || "katyaayaniastrologer01@gmail.com",
          subject: `Reschedule Request from ${booking.full_name}`,
          html: emailHtml,
        }),
      });
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }

    // Send Telegram notification
    try {
      const telegramMsg = `📅 *Reschedule Request*\n\n👤 ${booking.full_name}\n📧 ${booking.email}\n📌 ${booking.service_type}\n📆 Original: ${booking.booking_date} ${booking.booking_time}\n${requested_date ? `🔄 Requested: ${requested_date} ${requested_time || 'Any'}` : ''}\n💬 ${reason || 'No reason'}`;
      
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMsg,
          parse_mode: "Markdown",
        }),
      });
    } catch (tgErr) {
      console.error("Telegram notification failed:", tgErr);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET - Get user's reschedule requests
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reschedule_requests")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
