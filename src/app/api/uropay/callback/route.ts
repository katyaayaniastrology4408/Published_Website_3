import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
};

/** Save a record to the payments table (best effort – never blocks response) */
async function saveToPaymentsTable(data: {
  name?: string;
  email?: string;
  mobile?: string;
  amount?: number | string;
  transaction_id?: string;
  payment_status: "success" | "failed" | "pending";
  reference_number?: string;
}) {
  try {
    await supabase.from("payments").insert({
      name: data.name || null,
      email: data.email || null,
      mobile: data.mobile || null,
      amount: parseFloat(String(data.amount || 0)) || null,
      transaction_id: data.transaction_id || null,
      payment_status: data.payment_status,
      payment_date: new Date().toISOString(),
      reference_number: data.reference_number || null,
    });
  } catch (err) {
    console.error("saveToPaymentsTable error:", err);
  }
}

/** Build the origin from the request host */
function getOrigin(request: NextRequest): string {
  const host = request.headers.get("host") || "www.katyaayaniastrologer.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  return process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
}

/**
 * POST  /api/uropay/callback  – webhook from Uropay (server-to-server JSON)
 * GET   /api/uropay/callback  – browser redirect from Uropay after checkout
 *
 * Both paths:
 *  1. Update booking in DB
 *  2. Save to payments table
 *  3. Send email / Telegram
 *  4. Redirect browser to /payment-success or /payment-failed
 *     (POST returns JSON for webhook; GET redirects)
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  return handleUropayCallback(params, request, "GET");
}

export async function POST(request: NextRequest) {
  let payload: Record<string, any> = {};
  try {
    payload = await request.json();
  } catch {
    try {
      const form = await request.formData();
      form.forEach((val, key) => { payload[key] = String(val); });
    } catch {
      payload = Object.fromEntries(request.nextUrl.searchParams.entries());
    }
  }
  console.log("UroPay Webhook Payload:", payload);
  return handleUropayCallback(payload, request, "POST");
}

async function handleUropayCallback(
  payload: Record<string, any>,
  request: NextRequest,
  method: "GET" | "POST"
) {
  const origin = getOrigin(request);

  const order_id = payload.order_id || payload.client_order_id;
  const rawStatus = String(payload.status || payload.payment_status || "").toLowerCase();
  const transactionId = payload.transaction_id || payload.uropay_order_id || "";
  const errorMessage = payload.error_message || payload.message || payload.description || "";
  const errorCode = payload.error_code || payload["error[code]"] || "";

  const isSuccess =
    rawStatus === "success" ||
    rawStatus === "paid" ||
    rawStatus === "confirmed" ||
    rawStatus === "captured" ||
    rawStatus === "paid";

  const paymentStatus = isSuccess ? "success" : "failed";

  // ── 1. Update booking (only if we have an order_id matching a booking) ──────
  let booking: any = null;
  if (order_id) {
    const { data: bookingData, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", order_id)
      .single();

    if (!fetchError && bookingData) {
      booking = bookingData;

      if (isSuccess) {
        await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "completed",
            payment_intent_id: transactionId || null,
          })
          .eq("id", order_id);

        // Update invoice to paid
        if (booking.invoice_number) {
          await supabase
            .from("invoices")
            .update({
              status: "paid",
              notes: transactionId
                ? `Payment Transaction ID: ${transactionId}. Thank you for choosing Katyaayani Astrologer.`
                : "Thank you for choosing Katyaayani Astrologer.",
            })
            .eq("invoice_number", booking.invoice_number);
        }

        // Increment offer slot if applicable
        try {
          const { data: offerData } = await supabase.from('offer_settings').select('is_active, offer_price').eq('id', 1).single();
          if (offerData && offerData.is_active && Number(booking.amount) === Number(offerData.offer_price)) {
            await supabase.rpc('increment_offer_slot');
          }
        } catch (slotErr) {
          console.error("Failed to increment offer slot:", slotErr);
        }

        // Telegram notification
        const botToken = process.env.TELEGRAM_BOOKING_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_BOOKING_CHAT_ID;
        if (botToken && chatId) {
          try {
            const text =
              `🕉️ *New Successful Consultation Booking*\n\n` +
              `🆔 *Booking ID:* \`${order_id}\`\n` +
              `👤 *Seeker Name:* ${booking.full_name}\n` +
              `📧 *Email:* ${booking.email}\n` +
              `📱 *Phone:* ${booking.phone}\n` +
              `🏙️ *City:* ${booking.city || "N/A"}\n\n` +
              `🔮 *Service:* ${booking.service_type}\n` +
              `📅 *Date:* ${booking.booking_date}\n` +
              `⏰ *Time:* ${booking.booking_time}\n` +
              `💵 *Amount Paid:* ₹${formatCurrency(booking.amount)}\n\n` +
              `📜 *Birth Details:*\n` +
              `📅 Date: ${booking.date_of_birth}\n` +
              `⏰ Time: ${booking.time_of_birth}\n` +
              `📍 Place: ${booking.place_of_birth}\n\n` +
              `💬 *Special Questions:* \n${booking.special_requests || "None"}\n\n` +
              `💳 *Transaction ID:* \`${transactionId || "N/A"}\`\n` +
              `✅ *Status:* PAID & CONFIRMED`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
            });
          } catch (tgErr) {
            console.error("Telegram notification failed:", tgErr);
          }
        }

        // Email notification
        try {
          await sendBookingNotification(booking, "payment_success");
        } catch (emailErr) {
          console.error("Email notification failed:", emailErr);
        }
      } else {
        await supabase
          .from("bookings")
          .update({ payment_status: "failed", status: "pending" })
          .eq("id", order_id);

        try {
          await sendBookingNotification(booking, "payment_failed");
        } catch (emailErr) {
          console.error("Email notification failed:", emailErr);
        }
      }
    }
  }

  // ── 2. Save to payments table ─────────────────────────────────────────────
  await saveToPaymentsTable({
    name: payload.customer_name || payload.name || booking?.full_name || "",
    email: payload.customer_email || payload.email || booking?.email || "",
    mobile: payload.customer_mobile || payload.mobile || payload.phone || booking?.phone || "",
    amount: payload.amount || booking?.amount || 501,
    transaction_id: transactionId,
    payment_status: paymentStatus,
    reference_number: order_id || payload.reference_number || "",
  });

  // ── 3. Respond ────────────────────────────────────────────────────────────
  if (method === "POST") {
    // Server-to-server webhook → return JSON, no redirect
    return NextResponse.json({
      success: true,
      message: isSuccess ? "Payment success processed" : "Payment failure processed",
    });
  }

  // Browser redirect (GET) → send user to result page
  if (isSuccess) {
    const successUrl = new URL("/payment-success", origin);
    const name = payload.customer_name || payload.name || booking?.full_name || "";
    const email = payload.customer_email || payload.email || booking?.email || "";
    const mobile = payload.customer_mobile || payload.mobile || payload.phone || booking?.phone || "";
    const amount = String(payload.amount || booking?.amount || 501);
    if (name) successUrl.searchParams.set("name", name);
    if (email) successUrl.searchParams.set("email", email);
    if (mobile) successUrl.searchParams.set("mobile", mobile);
    successUrl.searchParams.set("amount", amount);
    if (transactionId) successUrl.searchParams.set("transaction_id", transactionId);
    if (order_id) successUrl.searchParams.set("reference_number", order_id);
    return NextResponse.redirect(successUrl.toString());
  } else {
    const failedUrl = new URL("/payment-failed", origin);
    if (errorMessage) failedUrl.searchParams.set("error_message", errorMessage);
    if (errorCode) failedUrl.searchParams.set("error_code", errorCode);
    if (order_id) failedUrl.searchParams.set("booking_id", order_id);
    return NextResponse.redirect(failedUrl.toString());
  }
}
