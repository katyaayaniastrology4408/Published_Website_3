import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email.config";
import { passwordChangedNotificationTemplate } from "@/lib/email-templates";
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic' ; 

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    // 1. Get user ID and current password hash by email
      const { data: userData, error: userError } = await supabaseAdmin
        .from("profiles")
        .select("id, name, password")
        .eq("email", email)
        .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the new password is the same as the old one
    if (userData.password) {
      const isSamePassword = await bcrypt.compare(newPassword, userData.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "You cannot use your previous password. Please choose a new one." },
          { status: 400 }
        );
      }
    }

      // 2. Update password via Auth Admin API
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
        userData.id,
        { password: newPassword }
      );

      if (resetError) {
        throw resetError;
      }

      // 3. Update hashed password in profiles
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await supabaseAdmin
        .from("profiles")
        .update({ 
          password: hashedPassword
        })
        .eq("id", userData.id);

        // 4. Clean up any used OTPs for this email
        await supabaseAdmin
          .from("otps")
          .delete()
          .eq("email", email)
          .eq("type", "forgot_password");

        // 5. Send password changed notification email
        await sendEmail({
          to: email,
          subject: 'Security Alert: Your Password Has Been Changed - Katyaayani Astrologer',
          html: passwordChangedNotificationTemplate(userData.name || 'Seeker'),
        });

        return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
