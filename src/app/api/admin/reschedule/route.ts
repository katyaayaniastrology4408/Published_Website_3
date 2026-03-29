import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// GET - All reschedule requests
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reschedule_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Approve or cancel reschedule request
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, admin_note, new_date, new_time } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status required" }, { status: 400 });
    }

    // Get the request
    const { data: request, error: reqError } = await supabase
      .from("reschedule_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (reqError || !request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update request status
    const { error: updateError } = await supabase
      .from("reschedule_requests")
      .update({ status, admin_note, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // If approved, update booking with new date/time
    if (status === "approved" && (new_date || new_time)) {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (new_date) updateData.booking_date = new_date;
      if (new_time) updateData.booking_time = new_time;

      await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", request.booking_id);
    }

    // Send email to user
    try {
      const statusText = status === "approved" ? "Approved" : "Cancelled";
      const emailHtml = `
        <h2>Reschedule Request ${statusText}</h2>
        <p>Dear ${request.user_name},</p>
        <p>Your reschedule request has been <strong>${statusText.toLowerCase()}</strong>.</p>
        ${status === "approved" && new_date ? `<p><strong>New Date:</strong> ${new_date} at ${new_time || request.original_time}</p>` : ''}
        ${admin_note ? `<p><strong>Note from Admin:</strong> ${admin_note}</p>` : ''}
        <p>Thank you for your patience.</p>
        <p>- Katyaayani Astrologer</p>
      `;

        const host = req.headers.get("host") || "www.katyaayaniastrologer.com";
        const protocol = host.includes("localhost") ? "http" : "https";
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

        await fetch(`${appUrl}/api/test-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: request.user_email,
          subject: `Reschedule Request ${statusText} - Katyaayani Astrologer`,
          html: emailHtml,
        }),
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
