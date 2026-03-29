import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendEmail } from '@/lib/email.config';
import { otpEmailTemplate } from '@/lib/email-templates';
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email, name, type = 'signup' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // If type is login, verify user exists first
    if (type === 'login' || type === 'forgot_password') {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (!profile) {
        return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the OTP before saving to DB
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save to DB (upsert if email and type combination exists)
    const { error: dbError } = await supabaseAdmin
      .from('otps')
      .upsert(
        { 
          email, 
          code: hashedOtp, 
          expires_at: expiresAt.toISOString(), 
          type 
        },
        { onConflict: 'email,type' }
      );

    if (dbError) {
      console.error('Database error saving OTP:', dbError);
      return NextResponse.json({ error: 'Failed to save verification code' }, { status: 500 });
    }

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Verify Your Account - Katyaayani Astrologer',
      html: otpEmailTemplate(otp, name),
    });

    if (!emailResult.success) {
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
