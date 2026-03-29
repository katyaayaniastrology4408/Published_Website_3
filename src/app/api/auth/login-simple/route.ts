import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize';
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

    // Find user by email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 404 });
    }

    // Verify name and DOB match the profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('name, dob')
      .eq('id', existingUser.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found. Please sign up again.' }, { status: 404 });
    }

    // Case-insensitive name match and exact DOB match
    const nameMatch = profile.name?.toLowerCase().trim() === fullName.toLowerCase().trim();
    const dobMatch = profile.dob === dob;

    if (!nameMatch || !dobMatch) {
      return NextResponse.json({ error: 'Name or date of birth does not match our records.' }, { status: 401 });
    }

    // Reconstruct system password
    const systemPassword = `KA_${dob.replace(/-/g, '')}_${Buffer.from(email).toString('base64').slice(0, 12)}!Zx`;

    // Sign in with system password
    const { data: signInData, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: systemPassword,
    });

    if (signInErr) {
      console.error('[LoginSimple] SignIn error:', signInErr);
      return NextResponse.json({ error: 'Unable to sign in. If you signed up with Google, please use Google Sign In.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: signInData.session,
      user: signInData.user,
    });
  } catch (error: any) {
    console.error('[LoginSimple] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
