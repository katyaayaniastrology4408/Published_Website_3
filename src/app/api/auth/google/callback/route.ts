import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWelcomeBackEmail } from "@/lib/email";
import { syncToSubscribers } from "@/lib/subscribers";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

    // Use X-Forwarded headers if behind a proxy, otherwise use Host header
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const host = forwardedHost || req.headers.get("host") || "www.katyaayaniastrologer.com";
    
    // Robust local detection - explicitly check if it's a localhost/internal IP
    const isLocalHost = host.includes("localhost") || host.includes("127.0.0.1");
    const isLocalIP = host.startsWith("192.168.") || host.startsWith("10.") || host.startsWith("172.");
    const isLocal = isLocalHost || isLocalIP;
    
    // Explicitly check for production domain to avoid any confusion
    const isProductionDomain = host.includes("katyaayaniastrologer.com");

    // Determine the base URL for redirects
    let appUrl: string;
    
    if (isProductionDomain) {
      appUrl = "https://www.katyaayaniastrologer.com";
    } else if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost") && !isLocal) {
      appUrl = process.env.NEXT_PUBLIC_APP_URL;
    } else {
      // Fallback for local development or orchids preview
      appUrl = `${isLocal ? "http" : forwardedProto}://${host}`;
    }

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent(error || "Google login cancelled")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent("Google OAuth not configured")}`);
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${appUrl}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.access_token) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent("Failed to get Google tokens")}`);
    }

    // Get user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent("Could not get email from Google")}`);
    }

    // Check if email already exists in profiles table (existing user check)
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, name, dob, pob, phone, gender, address")
      .eq("email", googleUser.email)
      .maybeSingle();

    // Find or create user in Supabase Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingUsers?.users?.find((u: any) => u.email === googleUser.email);

    let supabaseUserId: string;
    let isNew = false;

    if (existingAuthUser) {
      // Existing user — use their existing ID, do NOT create new account
      supabaseUserId = existingAuthUser.id;
      isNew = false;
    } else if (existingProfile) {
      // Profile exists in DB but no auth user — find by profile ID
      supabaseUserId = existingProfile.id;
      isNew = false;
    } else {
      // Truly new user — create account
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: googleUser.email,
        email_confirm: true,
        user_metadata: {
          full_name: googleUser.name || "",
          avatar_url: googleUser.picture || "",
          provider: "google",
        },
      });
      if (createError || !newUser?.user) {
        console.error("Create user failed:", createError);
        return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent("Failed to create account")}`);
      }
      supabaseUserId = newUser.user.id;
      isNew = true;
    }

    // Upsert profile — preserve existing data, only update name/avatar/email_verified if missing
    const profileUpdate: Record<string, any> = {
      id: supabaseUserId,
      email: googleUser.email,
      email_verified: true,
    };
    // Only update name if not already set (don't overwrite user's manual edits)
    if (!existingProfile?.name) {
      profileUpdate.name = googleUser.name || googleUser.email.split("@")[0];
    }
    if (googleUser.picture) {
      profileUpdate.avatar_url = googleUser.picture;
    }

    await supabaseAdmin.from("profiles").upsert(profileUpdate, { onConflict: "id" });

    // Sync to newsletter subscribers - only name and email
    await syncToSubscribers(googleUser.email, googleUser.name || "", "google_signup", false).catch(() => {});

    // For Google users, we always go to home now. They can update profile later.
    const redirectTarget = "home";

    // Create a magic link session for the user so Supabase client picks up the session
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: googleUser.email,
      options: {
        redirectTo: `${appUrl}/auth/google-complete?uid=${supabaseUserId}&isNew=${isNew}&target=${redirectTarget}`
      }
    });

    if (sessionError || !sessionData?.properties?.hashed_token) {
      console.error("Session link error:", sessionError);
      return NextResponse.redirect(`${appUrl}/auth/google-complete?uid=${supabaseUserId}&isNew=${isNew}&target=${redirectTarget}`);
    }

    // Redirect to the magic link to establish session
    let actionLink = sessionData.properties.action_link;
    if (actionLink) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      // CRITICAL: Route via proxy if in India context to avoid hang on .supabase.co
      if (supabaseUrl && actionLink.startsWith(supabaseUrl)) {
        const proxyBase = appUrl.endsWith('/') ? `${appUrl}api/sb-proxy` : `${appUrl}/api/sb-proxy`;
        actionLink = actionLink.replace(supabaseUrl, proxyBase);
      }
      return NextResponse.redirect(actionLink);
    }

    return NextResponse.redirect(`${appUrl}/auth/google-complete?uid=${supabaseUserId}&isNew=${isNew}&target=${redirectTarget}`);

  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/signin?error=${encodeURIComponent(err.message || "Google login failed")}`);
  }
}
