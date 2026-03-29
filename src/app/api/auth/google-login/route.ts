import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email.config";
import { welcomeEmailTemplate, welcomeBackEmailTemplate } from "@/lib/email-templates";
import { syncToSubscribers } from "@/lib/subscribers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: Request) {
  try {
    const { id, email, name, avatar, isNew } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ success: false, error: "Missing user info" }, { status: 400 });
    }

    // Upsert profile in profiles table
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id,
        email,
        name: name || email.split("@")[0],
        email_verified: true,
      }, { onConflict: 'id' });

      if (upsertError) {
        console.error("Profile upsert error:", upsertError);
        // Don't throw, just log
      }

      // Sync to newsletter_subscribers for unified mailing list
      await syncToSubscribers(email, name || '', 'google_signup', false);

        // If new user or profile was just created — send welcome email
      // Note: We use isNew if provided, otherwise assume new if it was an insert
      if (isNew && email) {
        // We skip sending here because they will set a password in /complete-profile 
        // and receive a welcome email with credentials there.
      } else if (email) {
        // Send Welcome Back email for existing users
        try {
          await sendEmail({
            to: email,
            subject: "Welcome back to Katyaayani Astrologer ✨",
            html: welcomeBackEmailTemplate(name || "Seeker"),
          });
        } catch (emailErr) {
          console.error("Welcome back email failed:", emailErr);
        }
      }


    return NextResponse.json({ success: true, isNew });
  } catch (error: any) {
    console.error("Google login handler error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
