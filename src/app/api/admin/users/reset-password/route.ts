import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email.config';
import { passwordResetCompleteTemplate } from '@/lib/email-templates';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    // 1. Generate a "real" looking temporary password
    const adjectives = ["Divine", "Astro", "Cosmic", "Ancient", "Star"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newPassword = `${randomAdjective}@${randomNum}`;

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Get the user ID and name from profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, name')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // 4. Update Supabase Auth password
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.id,
      { password: newPassword }
    );

    if (authError) {
      console.error("Auth update error:", authError);
      return NextResponse.json({ error: "Failed to update authentication record" }, { status: 500 });
    }

    // 5. Update profiles table with hashed password
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        password: hashedPassword
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json({ error: "Failed to update profile record" }, { status: 500 });
    }

    // 6. Mark pending reset requests as completed
    await supabaseAdmin
      .from('password_reset_requests')
      .update({ status: 'completed' })
      .eq('email', email)
      .eq('status', 'pending');

    // 7. Send email notification to user with new password
    await sendEmail({
      to: email,
      subject: 'Your Password Has Been Reset - Katyaayani Astrologer',
        html: passwordResetCompleteTemplate(profile.name || 'Seeker'),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successfully", 
      email, 
      password: newPassword 
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
