import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';
import { syncToSubscribers } from '@/lib/subscribers';
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize';
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = sanitizeString(body.fullName, 100);
    const dob = sanitizeString(body.dob, 20);
    const email = sanitizeEmail(body.email);

    if (!fullName || !dob || !email) {
      return NextResponse.json({ error: 'Name, date of birth, and email are required.' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if email already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);

    if (userExists) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' }, { status: 400 });
    }

    // System-generated password (user never sees this)
    const systemPassword = `KA_${dob.replace(/-/g, '')}_${Buffer.from(email).toString('base64').slice(0, 12)}!Zx`;

    // Create user in Supabase Auth
    const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: systemPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        dob,
      }
    });

    if (signUpError) throw signUpError;

    if (user) {
      const hashedPassword = await bcrypt.hash(systemPassword, 10);

      // Insert profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          name: fullName,
          email,
          dob,
          password: hashedPassword,
          email_verified: true
        });

      if (profileError) console.error('[SignupSimple] Profile error:', profileError);

      // Sync subscriber
      try {
        await syncToSubscribers(email, fullName, 'profile_signup', false);
      } catch (err) {
        console.error('[SignupSimple] Subscriber sync error:', err);
      }

      // Send welcome email
      try {
        await sendWelcomeEmail({ email, name: fullName });
      } catch (e) {
        console.error('[SignupSimple] Welcome email error:', e);
      }
    }

    // Sign in to get session tokens
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: systemPassword,
    });

    if (signInErr) throw signInErr;

    return NextResponse.json({
      success: true,
      session: signInData.session,
      user: signInData.user,
    });
  } catch (error: any) {
    console.error('[SignupSimple] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
