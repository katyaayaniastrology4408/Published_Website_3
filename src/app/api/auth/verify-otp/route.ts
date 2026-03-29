import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email, otp, type = 'signup' } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch the latest OTP record for this email and type
    const { data: otpData, error: fetchError } = await supabaseAdmin
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('type', type)
      .single();

    if (fetchError || !otpData) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Check expiration
    if (new Date() > new Date(otpData.expires_at)) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Compare provided OTP with hashed OTP in DB
    const isMatch = await bcrypt.compare(otp, otpData.code);

    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect verification code' }, { status: 400 });
    }

    // OTP is valid! Mark as verified
    await supabaseAdmin
      .from('otps')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', otpData.id);

    // Also update profile if it exists
    await supabaseAdmin
      .from('profiles')
      .update({ email_verified: true })
      .eq('email', email);

    return NextResponse.json({ success: true, message: 'Verification successful' });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
