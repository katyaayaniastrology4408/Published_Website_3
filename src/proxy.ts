import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// --- Rate Limiting (in-memory, per IP) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_API = 60; // 60 requests/min for API
const RATE_LIMIT_MAX_PAGE = 120; // 120 requests/min for pages

// Strict auth rate limits
const AUTH_RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/admin/auth/send-otp":   { max: 10, windowMs: 10 * 60 * 1000 }, // Increased to 10 per 10 min
  "/api/admin/auth/verify-otp": { max: 20, windowMs: 10 * 60 * 1000 }, // Increased to 20 per 10 min
  "/api/auth/signup-otp":       { max: 20, windowMs: 60 * 60 * 1000 }, // Specific for signup-otp, 20 per hour
  "/api/auth/signup":           { max: 20, windowMs: 60 * 60 * 1000 }, // Increased to 20 per hour
  "/api/auth/send-otp":         { max: 20, windowMs: 60 * 60 * 1000 }, // Increased to 20 per hour
  "/api/auth/verify-otp":       { max: 50, windowMs: 60 * 60 * 1000 }, // Increased to 50 per hour
  "/api/auth/reset-password":   { max: 10, windowMs: 60 * 60 * 1000 }, // Increased to 10 per hour
};

function checkRateLimit(ip: string, max: number, windowMs: number = RATE_LIMIT_WINDOW): boolean {
  const now = Date.now();
  const key = `${ip}:${windowMs}`;
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

let cleanupCounter = 0;
function maybeCleanup() {
  cleanupCounter++;
  if (cleanupCounter % 100 === 0) {
    const now = Date.now();
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }
}

// --- JWT Verification (Edge-compatible) ---
async function verifyAdminJWT(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "katyaayani-admin-jwt-secret-2026-xK9pQmRz7nVwYeHsLdBcFgJtNuAiOv"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// --- Security Headers (including CSP) ---
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.supabase.co https://consent.cookiebot.com https://consentcdn.cookiebot.com https://translate.googleapis.com https://translate.google.com https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https: https://www.google.com https://www.gstatic.com https://translate.google.com",
          "connect-src 'self' https://*.supabase.co https://api.resend.com https://api.telegram.org https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://region1.google-analytics.com https://consentcdn.cookiebot.com https://consent.cookiebot.com https://www.google.com https://googleads.g.doubleclick.net https://oauth2.googleapis.com https://www.googleapis.com https://accounts.google.com https://translate.googleapis.com",
        "frame-src 'self' https://www.googletagmanager.com https://consent.cookiebot.com https://consentcdn.cookiebot.com https://accounts.google.com",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  return response;
}

// --- CSRF check for public-facing POST endpoints ---
function checkCsrf(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  if (!origin && !referer) return false; // block requests with no origin at all
  const allowed = [
    `https://${host}`,
    `http://${host}`,
    "https://www.katyaayaniastrologer.com",
    "https://katyaayaniastrologer.com",
    "http://localhost:3000",
  ];
  const source = origin || referer || "";
  return allowed.some((a) => source.startsWith(a));
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  maybeCleanup();

  // Skip middleware for static files and _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // --- Admin page protection (non-API) ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/signin")) {
    const jwtCookie = req.cookies.get("admin-jwt")?.value;
    if (!jwtCookie || !(await verifyAdminJWT(jwtCookie))) {
      const signinUrl = new URL("/admin/signin", req.url);
      return NextResponse.redirect(signinUrl);
    }
  }

  // --- Rate limiting for API routes ---
  if (pathname.startsWith("/api")) {
    // CSRF check for public POST endpoints (enquiry, newsletter, booking, auth)
    const csrfProtectedPosts = [
      "/api/enquiry",
      "/api/newsletter/subscribe",
      "/api/bookings",
      "/api/auth/signup",
      "/api/auth/signup-otp",
      "/api/auth/login",
      "/api/auth/send-otp",
      "/api/auth/verify-otp",
      "/api/auth/reset-password",
    ];
    if (req.method === "POST" && csrfProtectedPosts.includes(pathname)) {
      if (!checkCsrf(req)) {
        console.warn(`CSRF blocked: ${pathname} from ${req.headers.get("origin") || req.headers.get("referer") || "unknown"}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Strict per-route auth rate limits
    const authLimit = AUTH_RATE_LIMITS[pathname];
    if (authLimit) {
      if (!checkRateLimit(`auth:${ip}:${pathname}`, authLimit.max, authLimit.windowMs)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": String(authLimit.windowMs / 1000) } }
        );
      }
    } else if (!checkRateLimit(`api:${ip}:${RATE_LIMIT_WINDOW}`, RATE_LIMIT_MAX_API)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Admin API protection
    if (pathname.startsWith("/api/admin")) {
      // Always allow these without JWT (they are part of the login flow)
      const publicAdminRoutes = [
          "/api/admin/health-check",
          "/api/admin/auth/send-otp",
          "/api/admin/auth/verify-otp",
          "/api/admin/auth/forgot-password",
          "/api/admin/auth/logout",
          "/api/admin/auth",
        ];

        // Public GET routes (read-only data used by frontend pages)
        const isPublicGet = req.method === "GET" && (
          pathname === "/api/admin/seo" ||
          pathname === "/api/admin/site-settings" ||
          pathname === "/api/admin/pricing" ||
          pathname === "/api/admin/branding"
        );

        // Public POST routes (data written by frontend for all visitors)
        const isPublicPost = req.method === "POST" && pathname === "/api/admin/analytics";
      if (!publicAdminRoutes.includes(pathname) && !isPublicGet && !isPublicPost) {
        const jwtCookie = req.cookies.get("admin-jwt")?.value;
        const isValid = jwtCookie ? await verifyAdminJWT(jwtCookie) : false;

        if (!isValid) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }
    }

    return addSecurityHeaders(NextResponse.next());
  }

  // --- Rate limiting for pages ---
  if (!checkRateLimit(`page:${ip}`, RATE_LIMIT_MAX_PAGE)) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  // --- Redirect handling ---
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return addSecurityHeaders(NextResponse.next());
    }

    // Dynamically import to avoid Edge runtime issues
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: redirect } = await supabase
      .from("redirects")
      .select("destination_path, status_code, id, hit_count")
      .eq("source_path", pathname)
      .eq("is_active", true)
      .single();

    if (redirect) {
      supabase
        .from("redirects")
        .update({
          hit_count: (redirect.hit_count || 0) + 1,
          last_hit_at: new Date().toISOString(),
        })
        .eq("id", redirect.id)
        .then();

      const destinationUrl = redirect.destination_path.startsWith("http")
        ? redirect.destination_path
        : new URL(redirect.destination_path, req.url).toString();

      return NextResponse.redirect(destinationUrl, redirect.status_code || 301);
    }
  } catch {
    // If redirect check fails, continue normally
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
