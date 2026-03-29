import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic' ; 

export async function POST(request: NextRequest) {
  try {
    const { amount, name, email, phone, order_id } = await request.json();
    const apiKey = process.env.UROPAY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "UroPay API key not configured" },
        { status: 500 }
      );
    }

    // UroPay API endpoint (v1)
    const UROPAY_API_URL = "https://api.uropay.me/v1/order/create";

    const host = request.headers.get("host") || "www.katyaayaniastrologer.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const response = await fetch(UROPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        order_id: String(order_id),
        amount: String(amount),
        customer_name: name,
        customer_email: email,
        customer_mobile: phone,
        callback_url: `${origin}/booking?booking_id=${order_id}&payment_status=pending`,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("UroPay API error response:", errorText);
      return NextResponse.json(
        { success: false, message: `UroPay API returned an error (${response.status})` },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();

    if (data.status === "success" || data.success) {
      return NextResponse.json({
        success: true,
        payment_url: data.payment_url || data.url,
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create UroPay order" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("UroPay checkout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
