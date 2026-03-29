import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      full_name, 
      email, 
      phone, 
      service_type, 
      booking_date, 
      booking_time, 
      payment_status, 
      amount,
      city,
      address,
      birth_details,
      special_requests
    } = body;

    // Fetch Telegram Settings from admin_settings using admin client to bypass RLS
    const { data: telegramSettings } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .in('key', ['telegram_bot_token', 'telegram_chat_id']);
    
const tgMap = (telegramSettings || []).reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

    const botToken = process.env.TELEGRAM_BOT_TOKEN || tgMap['telegram_bot_token'];
    const chatId = process.env.TELEGRAM_CHAT_ID || tgMap['telegram_chat_id'];

    if (!botToken || !chatId) {
      console.error("Telegram configuration missing for booking notification");
      return NextResponse.json({ error: "Telegram configuration missing" }, { status: 500 });
    }

    const message = `
<b>${payment_status === 'success' ? '✅ Booking Confirmed! (બુકિંગ કન્ફર્મ થયું છે!)' : '🆕 New Booking Request! (નવી બુકિંગ વિનંતી!)'}</b>
━━━━━━━━━━━━━━━━━━━━━━━━
<b>👤 Customer Details (ગ્રાહકની વિગતો):</b>
• <b>Name:</b> ${full_name}
• <b>Email:</b> ${email}
• <b>Phone:</b> ${phone}
• <b>City:</b> ${city || 'N/A'}
${address ? `• <b>Address:</b> ${address}` : ''}

<b>🔮 Consultation Details (પરામર્શની વિગતો):</b>
• <b>Service:</b> ${service_type}
• <b>Date:</b> ${booking_date}
• <b>Time:</b> ${booking_time}
• <b>Birth Info:</b> ${birth_details || 'N/A'}
${special_requests ? `• <b>Special Questions:</b> ${special_requests}` : ''}

<b>💰 Payment Information (ચુકવણીની માહિતી):</b>
• <b>Amount:</b> ₹${amount}
• <b>Status:</b> ${payment_status === 'success' ? '✅ COMPLETE (ચુકવણી સફળ)' : '⏳ PENDING (ચુકવણી બાકી છે)'}
━━━━━━━━━━━━━━━━━━━━━━━━
<i>Katyaayani Astrologer - Appointment System</i>
    `.trim();

    const result = await sendTelegramMessage(botToken, chatId, message);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Telegram notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
