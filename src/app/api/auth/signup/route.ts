import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import bcrypt from 'bcryptjs';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/sanitize';
import { syncToSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email    = sanitizeEmail(body.email);
    const password = typeof body.password === 'string' ? body.password.slice(0, 128) : '';
    const fullName = sanitizeString(body.fullName, 100);
    const phone    = sanitizePhone(body.phone);
    const gender   = sanitizeString(body.gender, 20);
    const dob      = sanitizeString(body.dob, 20);
    const tob      = sanitizeString(body.tob, 20);
    const pob      = sanitizeString(body.pob, 200);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 2. Create user with email_confirm: true
    const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone_number: phone,
        gender,
        dob,
        tob,
        pob
      }
    });

    if (signUpError) throw signUpError;

    if (user) {
      // Hash the password for the profiles table
      const hashedPassword = await bcrypt.hash(password, 10);

          // 3. Update the profiles table
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: user.id,
              name: fullName,
              email,
              phone,
              gender,
              dob,
              tob,
              pob,
              password: hashedPassword, // Save hashed password
              email_verified: true
            });


          if (profileError) console.error("Error updating profile:", profileError);

            // Sync to newsletter_subscribers for unified mailing list (but not for newsletter specifically)
            await syncToSubscribers(email, fullName, 'profile_signup', false);

              // 5. Send Welcome Email
              try {
                await sendWelcomeEmail({ email, name: fullName });
              } catch (e) {
                console.error("Error sending welcome email:", e);
              }

        }

      return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
