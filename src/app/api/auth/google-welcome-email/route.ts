import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email.config";
import { welcomeEmailTemplate } from "@/lib/email-templates";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const displayName = name || "Seeker";

    await sendEmail({
      to: email,
      subject: "Welcome to Katyaayani Astrologer ✨",
      html: welcomeEmailTemplate(displayName, email),
    });

    // Also send to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: `New Google Signup: ${displayName} (${email})`,
      html: `<p>New user signed up via Google:</p><ul><li><b>Name:</b> ${displayName}</li><li><b>Email:</b> ${email}</li></ul>`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Google welcome email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
