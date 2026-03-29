import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email.config';
import { forgotPasswordRequestTemplate } from '@/lib/email-templates';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send confirmation email to user
    const emailResult = await sendEmail({
      to: email,
      subject: 'Password Reset Request Received - Katyaayani Astrologer',
      html: forgotPasswordRequestTemplate(name || 'Seeker', email),
    });

    if (!emailResult.success) {
      console.error('Failed to send forgot password notification:', emailResult.error);
      return NextResponse.json({ error: 'Failed to send notification email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notification sent successfully' });
  } catch (error: any) {
    console.error('Forgot password notification error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
