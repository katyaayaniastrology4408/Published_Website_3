import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

/**
 * Uropay payment callback / webhook handler for the ₹501 button.
 * Saves payment data to the `payments` table and redirects to success/failed pages.
 *
 * Uropay can call this as:
 *  - POST webhook with JSON body
 *  - GET redirect with query params
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  return handlePayment(params, request);
}

export async function POST(request: NextRequest) {
  let params: Record<string, string> = {};
  try {
    const body = await request.json();
    params = body as Record<string, string>;
  } catch {
    // fallback: try form data
    try {
      const form = await request.formData();
      form.forEach((val, key) => { params[key] = String(val); });
    } catch {
      params = Object.fromEntries(request.nextUrl.searchParams.entries());
    }
  }
  return handlePayment(params, request);
}

async function handlePayment(params: Record<string, string>, request: NextRequest) {
  const host = request.headers.get("host") || "www.katyaayaniastrologer.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const status = (params.status || params.payment_status || "").toLowerCase();
  const transactionId = params.transaction_id || params.uropay_order_id || params.txn_id || "";
  const referenceNumber = params.order_id || params.client_order_id || params.reference_number || "";
  const name = params.customer_name || params.name || "";
  const email = params.customer_email || params.email || "";
  const mobile = params.customer_mobile || params.mobile || params.phone || "";
  const amount = params.amount || "501";
  const errorMessage = params.error_message || params.message || params.description || "";

  const isSuccess =
    status === "success" ||
    status === "paid" ||
    status === "confirmed" ||
    status === "captured";

  const paymentStatus = isSuccess ? "success" : "failed";

  // Save to payments table
  try {
    await supabase.from("payments").insert({
      name: name || null,
      email: email || null,
      mobile: mobile || null,
      amount: parseFloat(amount) || 501,
      transaction_id: transactionId || null,
      payment_status: paymentStatus,
      payment_date: new Date().toISOString(),
      reference_number: referenceNumber || null,
    });
  } catch (dbErr) {
    console.error("Failed to save payment record:", dbErr);
    // Don't block redirect on DB error
  }

  if (isSuccess) {
    const successUrl = new URL("/payment-success", origin);
    if (name) successUrl.searchParams.set("name", name);
    if (email) successUrl.searchParams.set("email", email);
    if (mobile) successUrl.searchParams.set("mobile", mobile);
    successUrl.searchParams.set("amount", amount);
    if (transactionId) successUrl.searchParams.set("transaction_id", transactionId);
    if (referenceNumber) successUrl.searchParams.set("reference_number", referenceNumber);
    return NextResponse.redirect(successUrl.toString());
  } else {
    const failedUrl = new URL("/payment-failed", origin);
    if (errorMessage) failedUrl.searchParams.set("error_message", errorMessage);
    if (params.error_code || params["error[code]"]) {
      failedUrl.searchParams.set("error_code", params.error_code || params["error[code]"]);
    }
    return NextResponse.redirect(failedUrl.toString());
  }
}
