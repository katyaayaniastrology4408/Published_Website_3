import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { action, email, otp, newPassword } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (email !== adminEmail) {
      return NextResponse.json({ error: "Invalid admin email" }, { status: 401 });
    }

    if (action === "test-bot") {
        const { data: botTokenData } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'telegram_bot_token')
          .single();
        
        const botToken = botTokenData?.value || process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_ENQUIRY_BOT_TOKEN;
        
        if (!botToken) {
          return NextResponse.json({ success: false, error: "Bot token not configured" }, { status: 400 });
        }

        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        if (!telegramRes.ok) {
          const errorData = await telegramRes.json();
          return NextResponse.json({ success: false, error: errorData.description || "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ success: true });
      }

      if (action === "send-otp") {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in admin_settings
        const { error: upsertError } = await supabase
          .from('admin_settings')
          .upsert({ key: 'admin_reset_otp', value: generatedOtp }, { onConflict: 'key' });

        if (upsertError) {
          console.error("Error storing OTP:", upsertError);
          return NextResponse.json({ error: "Failed to store OTP" }, { status: 500 });
        }

        // Get Telegram Config from DB
        const { data: settings } = await supabase
          .from('admin_settings')
          .select('key, value')
          .in('key', ['telegram_bot_token', 'telegram_chat_id']);
        
        const botToken = settings?.find((s: { key: string; value: string }) => s.key === 'telegram_bot_token')?.value || process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_ENQUIRY_BOT_TOKEN;
        const chatId = settings?.find((s: { key: string; value: string }) => s.key === 'telegram_chat_id')?.value || process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ENQUIRY_CHAT_ID;
        
        if (!botToken || !chatId) {
          return NextResponse.json({ error: "Telegram Bot not configured in Settings" }, { status: 400 });
        }

        const message = `🔐 *Admin Password Reset OTP*\n\nYour OTP is: *${generatedOtp}*\n\nThis OTP is for resetting the admin password for ${email}.`;
        
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
        });

      if (!telegramRes.ok) {
        console.error("Telegram error:", await telegramRes.text());
        return NextResponse.json({ error: "Failed to send OTP to Telegram" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "OTP sent to Telegram" });
    }

    if (action === "verify-otp") {
      const { data: storedOtpData, error: otpError } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'admin_reset_otp')
        .single();

      if (otpError || !storedOtpData || storedOtpData.value !== otp) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
      }

      // Update password
      const { error: updateError } = await supabase
        .from('admin_settings')
        .upsert({ key: 'admin_password', value: newPassword }, { onConflict: 'key' });

      if (updateError) {
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
      }

      // Clear OTP
      await supabase.from('admin_settings').delete().eq('key', 'admin_reset_otp');

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
