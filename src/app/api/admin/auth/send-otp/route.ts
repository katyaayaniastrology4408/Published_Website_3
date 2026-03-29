import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import { sendEmail } from "@/lib/email.config";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
      const { email, password, type } = body || {};
      let adminEmail = process.env.ADMIN_EMAIL;

      // Also check DB (in case env is stale or not loaded)
      const { data: emailSetting } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_email')
        .single();
      const dbEmail = emailSetting?.value;

      // Accept if email matches env OR DB
      const emailLower = (email || "").trim().toLowerCase();
      const emailMatches =
        (adminEmail && emailLower === adminEmail.trim().toLowerCase()) ||
        (dbEmail && emailLower === dbEmail.trim().toLowerCase());

      if (!emailMatches) {
        return NextResponse.json({ error: "Invalid email" }, { status: 401 });
      }

      // Use resolved email for rest of checks
      if (!adminEmail) adminEmail = dbEmail;

    // If login, verify password first
    if (type === "login" || type === "password_change" || type === "settings_update") {
      const { data: adminSettings } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_password')
        .single();

      const envPassword = process.env.ADMIN_PASSWORD;
      const dbPassword = adminSettings?.value;

      // Accept if password matches env OR DB
      const passwordMatches =
        (envPassword && password === envPassword) ||
        (dbPassword && password === dbPassword);

      if (!password || !passwordMatches) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store OTP in admin_settings
    await supabase.from('admin_settings').upsert({ key: 'admin_login_otp', value: otp }, { onConflict: 'key' });
    await supabase.from('admin_settings').upsert({ key: 'admin_login_otp_expiry', value: expiry }, { onConflict: 'key' });

    // Fetch Telegram Settings
    const { data: telegramSettings } = await supabase
      .from('admin_settings')
      .select('*')
      .in('key', ['telegram_bot_token', 'telegram_chat_id']);
    
const tgMap = (telegramSettings || []).reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

    const botToken = process.env.TELEGRAM_BOT_TOKEN || tgMap['telegram_bot_token'];
    const chatId = process.env.TELEGRAM_CHAT_ID || tgMap['telegram_chat_id'];

    // Send Telegram OTP
    let telegramSent = false;
    let telegramError = "";
    if (botToken && chatId) {
      const tgResult = await sendTelegramMessage(
        botToken,
        chatId,
        `<b>Verification Code</b>\n\nYour verification code for admin access (${type}) is:\n\n<code>${otp}</code>\n\nThis code will expire in 10 minutes.`
      );
      telegramSent = tgResult.success;
      if (!tgResult.success) telegramError = tgResult.error || "Unknown error";
    }

    if (type === "login" && !telegramSent) {
      return NextResponse.json({ 
        error: "Failed to send OTP to Telegram. Please ensure Telegram Bot is configured correctly. " + telegramError 
      }, { status: 500 });
    }

    // Always log OTP to console for debugging/development
    console.log(`[AUTH] OTP for ${email}: ${otp}`);

    // Send Email as backup
    try {
      await sendEmail({
        to: email,
        subject: 'Admin Verification Code',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #4a3f35; background-color: #fdfbf7; border: 2px solid #ff6b35; border-radius: 12px; text-align: center;">
            <h2 style="color: #ff6b35;">Verification Code</h2>
            <p>Your verification code for admin access is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff6b35; margin: 20px 0;">${otp}</div>
            <p style="font-size: 12px; color: #8a7b6a;">This code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("Email service failed with error. OTP sent to Telegram and logged to console.");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
