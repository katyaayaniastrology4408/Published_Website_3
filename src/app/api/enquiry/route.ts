import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from '@/lib/email.config';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { verifyAdminJWT } from '@/lib/jwt';
import { syncToSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic' ; 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin-jwt")?.value;
  if (!token) return false;
  const payload = await verifyAdminJWT(token);
  return payload?.role === "admin";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name     = sanitizeString(body.name, 100);
    const email    = sanitizeEmail(body.email);
    const phone    = sanitizePhone(body.phone);
    const subject  = sanitizeString(body.subject, 200);
    const message  = sanitizeString(body.message, 2000);

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    // 1. Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('enquiries')
      .insert([{ name, email, phone, subject, message }])
      .select()
      .single();

      if (dbError) {
        console.error('Supabase error:', dbError);
        return NextResponse.json({ 
          success: false, 
          error: dbError.message,
          details: dbError
        }, { status: 500 });
      }

      // Sync to unified mailing list
      if (email) {
        await syncToSubscribers(email, name, 'enquiry');
      }

      // 2. Telegram Bot Notification
    const { data: tgSettings } = await supabase
      .from('admin_settings')
      .select('key, value')
      .in('key', ['telegram_bot_token', 'telegram_chat_id']);

    const botToken = tgSettings?.find(s => s.key === 'telegram_bot_token')?.value || process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_ENQUIRY_BOT_TOKEN;
    const chatId = tgSettings?.find(s => s.key === 'telegram_chat_id')?.value || process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ENQUIRY_CHAT_ID;

    console.log('Telegram config check:', { hasToken: !!botToken, hasChatId: !!chatId });

    if (botToken && chatId) {
      try {
        const text = `🌌 *New Enquiry on Katyaayani Astrologer*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📧 *Email:* ${email || 'N/A'}\n` +
          `📱 *Phone:* ${phone || 'N/A'}\n` +
          `📌 *Subject:* ${subject || 'General Enquiry'}\n` +
          `💬 *Message:* \n${message}\n\n` +
          `⏰ *Received:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgError) {
        console.error('Telegram notification failed:', tgError);
      }
    }

      // 3. Send Emails
      const adminEmail = process.env.ADMIN_EMAIL || 'katyaayaniastrologer01@gmail.com';
      
      // Send Confirmation Email to User
      if (email) {
      try {
        await sendEmail({
          to: email,
          subject: 'Confirmation: Your Cosmic Enquiry Received',
          html: `
            <div style="font-family: 'Cinzel', serif; padding: 20px; color: #4a3f35; background-color: #fdfbf7;">
              <h2 style="color: #ff6b35;">Namaste ${name},</h2>
              <p>Thank you for reaching out to Katyaayani Astrologer. We have received your cosmic enquiry regarding <strong>${subject || 'General Consultation'}</strong>.</p>
              <div style="padding: 15px; border-left: 4px solid #ff6b35; background: #fffdf9; margin: 20px 0;">
                <p><strong>Your Message:</strong></p>
                <p><em>${message}</em></p>
              </div>
              <p>Our astrologer will review your query and connect with you shortly through the alignment of stars.</p>
              <hr style="border: none; border-top: 1px solid #ff6b35/30; margin: 20px 0;">
              <p style="font-size: 0.9em;">With divine blessings,<br><strong>Katyaayani Astrologer</strong></p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('User email confirmation failed:', emailError);
      }
    }

    // Send Notification Email to Admin
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Cosmic Enquiry: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>New Enquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p>Time: ${new Date().toLocaleString()}</p>
          </div>
        `
      });
    } catch (adminEmailError) {
      console.error('Admin email notification failed:', adminEmailError);
    }

    return NextResponse.json({ 
      success: true, 
      data: dbData
    }, { status: 201 });

  } catch (error) {
    console.error('Enquiry API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Delete enquiry error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete enquiry' }, { status: 500 });
  }
}
