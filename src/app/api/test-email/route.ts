import { NextResponse } from 'next/server';
import { sendEmailViaSMTP } from '@/lib/nodemailer';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 });
    }

    const result = await sendEmailViaSMTP({
      to,
      subject: 'Test Email - Katyaayani Astrologer',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h1 style="color: #ff6b35;">Gmail SMTP Test Successful!</h1>
          <p>This is a test email from Katyaayani Astrologer.</p>
          <p>If you received this, Gmail SMTP is working correctly.</p>
          <p style="color: #888; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Test email sent!', messageId: result.messageId });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
