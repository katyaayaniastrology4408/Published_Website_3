import { NextResponse } from "next/server";

// Redirects browser to Google's OAuth consent screen directly
// No supabase.co involved — pure Google OAuth PKCE flow
export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth not configured. Please add GOOGLE_CLIENT_ID to environment variables." }, { status: 500 });
  }

  const origin = req.headers.get("origin") || req.headers.get("referer");
  
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
    
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  // Store a random state in the redirect URL for CSRF protection
  const state = Math.random().toString(36).substring(2, 18);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

  // Store state in cookie for verification
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
