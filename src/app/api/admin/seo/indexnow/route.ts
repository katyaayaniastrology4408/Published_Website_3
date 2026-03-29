import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

const supabase = createClient(supabaseUrl, supabaseKey);

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || "a889b4f2a770404297f5fe6867c814f5";
const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.katyaayaniastrologer.com").replace(/\/$/, "");
const HOST = new URL(SITE_URL).hostname;
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// ─── Google Indexing API via Service Account JWT ─────────────────────────────
// Reads GOOGLE_SERVICE_ACCOUNT_JSON env var (the full JSON key file content)
async function getGoogleAccessToken(): Promise<string | null> {
  try {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;

    const sa = JSON.parse(raw);
    const now = Math.floor(Date.now() / 1000);

    // Build JWT header + payload
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const b64 = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString("base64url");

    const signingInput = `${b64(header)}.${b64(payload)}`;

    // Import private key
    const privateKeyPem = sa.private_key as string;
    const pemBody = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\n/g, "");
    const keyData = Buffer.from(pemBody, "base64");

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      keyData,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      encoder.encode(signingInput)
    );

    const jwt = `${signingInput}.${Buffer.from(signature).toString("base64url")}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch {
    return null;
  }
}

async function submitToGoogle(urlList: string[]): Promise<{ target: string; status: string; statusCode?: number; body?: string }> {
  const token = await getGoogleAccessToken();
  if (!token) {
    return {
      target: "Google",
      status: "not_configured",
      body: "Google service account not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON env var.",
    };
  }

  // Google Indexing API allows max 100 URLs per batch request
  const batch = urlList.slice(0, 100);
  let successCount = 0;
  let lastError = "";

  for (const url of batch) {
    try {
      const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      });
        if (res.ok) {
          successCount++;
        } else {
          const err = await res.text().catch(() => "");
          if (res.status === 403) {
            lastError = `403 Forbidden — Add service account as Owner in Google Search Console: indexing-bot@katyaayani-astrologer.iam.gserviceaccount.com`;
          } else {
            lastError = `HTTP ${res.status}: ${err.substring(0, 100)}`;
          }
        }
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Unknown error";
    }
  }

  if (successCount === batch.length) {
    return { target: "Google", status: "success", body: `${successCount}/${batch.length} URLs submitted` };
  } else if (successCount > 0) {
    return { target: "Google", status: "partial", body: `${successCount}/${batch.length} succeeded. Last error: ${lastError}` };
  } else {
    return { target: "Google", status: "failed", body: lastError || "All submissions failed" };
  }
}

// ─── IndexNow (Bing + partners) ───────────────────────────────────────────────
async function submitIndexNow(urlList: string[]): Promise<{ target: string; status: string; statusCode?: number; body?: string }[]> {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const headers = { "Content-Type": "application/json; charset=utf-8" };
  const body = JSON.stringify(payload);

  const endpoints = [
    { label: "Bing (IndexNow)", url: "https://www.bing.com/IndexNow" },
    { label: "IndexNow API", url: "https://api.indexnow.org/IndexNow" },
  ];

  const results = [];

  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(ep.url, { method: "POST", headers, body, signal: controller.signal });
      clearTimeout(timeout);
      const responseBody = await res.text().catch(() => "");
      // 200 = OK, 202 = Accepted (both are success)
      const status = res.status === 200 || res.status === 202 ? "success" : "failed";
      results.push({ target: ep.label, status, statusCode: res.status, body: responseBody || `HTTP ${res.status}` });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      results.push({ target: ep.label, status: "error", body: msg });
    }
  }

  return results;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls, action, engines } = body;

    // engines can be "bing", "google", or "all" (default: "all")
    const targetEngines = engines || "all";
    const doBing = targetEngines === "all" || targetEngines === "bing";
    const doGoogle = targetEngines === "all" || targetEngines === "google";

    // ─── Ping / Submit action ────────────────────────────────────────────────
    if (action === "ping-sitemap") {
      // Treat as submitting the homepage + sitemap URL
      const urlsToSubmit = [`${SITE_URL}/`];
      const allResults: { target: string; status: string; statusCode?: number; body?: string }[] = [];

      if (doBing) {
        const bingResults = await submitIndexNow(urlsToSubmit);
        allResults.push(...bingResults);
      }
      if (doGoogle) {
        const googleResult = await submitToGoogle(urlsToSubmit);
        allResults.push(googleResult);
      }

      for (const r of allResults) {
        try {
          await supabase.from("ping_logs").insert({
            target: r.target,
            sitemap_url: `${SITE_URL}/sitemap.xml`,
            status: r.status,
            response_code: r.statusCode ?? null,
            error_message: r.status !== "success" ? (r.body?.substring(0, 200) || null) : null,
          });
        } catch {}
      }

      return NextResponse.json({ success: true, results: allResults });
    }

    // ─── URL list submission ─────────────────────────────────────────────────
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ success: false, message: "No URLs provided" }, { status: 400 });
    }

    // Only keep URLs from our domain
    const urlList: string[] = urls
      .map((u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`))
      .filter((u: string) => {
        try { return new URL(u).hostname === HOST; } catch { return false; }
      });

    if (urlList.length === 0) {
      return NextResponse.json({ success: false, message: "No valid URLs for this host" }, { status: 400 });
    }

    const allResults: { target: string; status: string; statusCode?: number; body?: string }[] = [];

    if (doBing) {
      const bingResults = await submitIndexNow(urlList);
      allResults.push(...bingResults);
    }
    if (doGoogle) {
      const googleResult = await submitToGoogle(urlList);
      allResults.push(googleResult);
    }

      // Save to DB
      const urlSummary = urlList.slice(0, 3).join(", ") + (urlList.length > 3 ? ` +${urlList.length - 3} more` : "");
      for (const r of allResults) {
        try {
          await supabase.from("ping_logs").insert({
            target: r.target,
            sitemap_url: urlSummary,
            status: r.status,
            response_code: r.statusCode ?? null,
            response_body: `${urlList.length} URLs submitted`,
            error_message: r.status !== "success"
              ? (r.body?.substring(0, 200) || null)
              : null,
          });
        } catch {}
      }

    return NextResponse.json({ success: true, results: allResults, urlCount: urlList.length });
  } catch (error: unknown) {
    console.error("Indexing API error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ─── GET: fetch recent ping logs + google config status ───────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // ?check=google — just verify if service account is configured, no submission
  if (searchParams.get("check") === "google") {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) return NextResponse.json({ configured: false });
    try {
      const sa = JSON.parse(raw);
      const configured = !!(sa.client_email && sa.private_key);
      return NextResponse.json({ configured });
    } catch {
      return NextResponse.json({ configured: false });
    }
  }

  try {
    const { data, error } = await supabase
      .from("ping_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ success: true, logs: data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
