import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { signAdminJWT } from "@/lib/jwt";
export const dynamic = 'force-dynamic';

// In-memory OTP attempt tracker (per IP)
const otpAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();

    // Check lockout
    const attempt = otpAttempts.get(ip);
    if (attempt && now < attempt.lockedUntil) {
      const waitMin = Math.ceil((attempt.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${waitMin} minute(s).` },
        { status: 429 }
      );
    }

    const { otp } = await req.json();

    const { data: storedOtpRecord } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_login_otp')
      .single();

    const { data: storedExpiryRecord } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_login_otp_expiry')
      .single();

    if (!storedOtpRecord || !storedExpiryRecord) {
      return NextResponse.json({ error: "No verification code sent" }, { status: 400 });
    }

    const storedOtp = storedOtpRecord.value;
    const expiry = new Date(storedExpiryRecord.value);

    if (new Date() > expiry) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    if (otp !== storedOtp) {
      // Track failed attempt
      const current = otpAttempts.get(ip) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= MAX_OTP_ATTEMPTS) {
        current.lockedUntil = now + LOCKOUT_MS;
        otpAttempts.set(ip, current);
        return NextResponse.json(
          { error: "Too many failed attempts. Account locked for 15 minutes." },
          { status: 429 }
        );
      }
      otpAttempts.set(ip, current);
      const remaining = MAX_OTP_ATTEMPTS - current.count;
      return NextResponse.json(
        { error: `Invalid verification code. ${remaining} attempt(s) remaining.` },
        { status: 400 }
      );
    }

    // Success - clear attempt counter and OTP
    otpAttempts.delete(ip);
    await supabase.from('admin_settings').delete().in('key', ['admin_login_otp', 'admin_login_otp_expiry']);

    // Issue JWT token
    const adminEmail = process.env.ADMIN_EMAIL || "admin";
    const token = await signAdminJWT(adminEmail);

    const response = NextResponse.json({ success: true, token });

    // Set as httpOnly cookie (8 hours expiry)
    response.cookies.set("admin-jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
