import { NextRequest, NextResponse } from 'next/server';
import { testSmtpConnection, sendSmtpEmail } from '@/lib/smtp';
import { Resend } from 'resend';
export const dynamic = 'force-dynamic';

export async function GET() {
  // Test both SMTP and Resend status
  const smtpResult = await testSmtpConnection();
  
  let resendStatus = false;
  let resendError = '';
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.domains.list();
    resendStatus = !error;
    if (error) resendError = String(error);
  } catch (e: any) {
    resendError = e.message;
  }

  return NextResponse.json({
    smtp: {
      status: smtpResult.success ? 'connected' : 'error',
      error: smtpResult.error,
      config: {
        user: process.env.GMAIL_USER,
        service: 'Gmail',
      }
    },
    resend: {
      status: resendStatus ? 'connected' : 'error',
      error: resendError,
      fromEmail: process.env.RESEND_FROM_EMAIL,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { type, testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address required' }, { status: 400 });
    }

    if (type === 'smtp') {
      const result = await sendSmtpEmail({
        to: testEmail,
        subject: 'SMTP Test - Katyaayani Astrologer Admin',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
            <h2 style="color: #ff6b35;">SMTP Test Successful</h2>
            <p>This is a test email sent via <strong>Gmail SMTP</strong> from Katyaayani Astrologer Admin Panel.</p>
            <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
      return NextResponse.json(result);
    }

    if (type === 'resend') {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: testEmail,
        subject: 'Resend Test - Katyaayani Astrologer Admin',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
            <h2 style="color: #ff6b35;">Resend Test Successful</h2>
            <p>This is a test email sent via <strong>Resend</strong> from Katyaayani Astrologer Admin Panel.</p>
            <p>Used for: Newsletter, Blog updates, Daily Rashifal</p>
            <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
      if (error) return NextResponse.json({ success: false, error: String(error) });
      return NextResponse.json({ success: true, messageId: data?.id });
    }

    return NextResponse.json({ error: 'Invalid type. Use smtp or resend' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
