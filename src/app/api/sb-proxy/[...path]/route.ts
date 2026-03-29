import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, params);
}

async function handleProxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  try {
    const { path } = await paramsPromise;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eochjxjoyibtjawzgauk.supabase.co";
    
    // Construct the target URL
    const targetPath = path.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${supabaseUrl}/${targetPath}${searchParams ? `?${searchParams}` : ""}`;

    // Prepare headers - forward necessary ones
    const headers = new Headers();
    const headersToForward = ["authorization", "apikey", "content-type", "prefer", "range"];
    
    req.headers.forEach((value, key) => {
      if (headersToForward.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // Special handling for the X-Client-Info header if needed
    headers.set("x-client-info", "nextjs-supabase-proxy");

    // Get body if applicable
    let body = null;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      try {
        body = await req.arrayBuffer();
      } catch (e) {
        // No body or error reading body
      }
    }

    // Perform the cross-origin request from the server (which is not blocked in India)
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    // Get the response body
    const responseData = await response.arrayBuffer();

    // Copy response headers back
    const responseHeaders = new Headers();
    const headersToCopyBack = [
      "content-type", 
      "content-range", 
      "preference-applied", 
      "location", 
      "set-cookie"
    ];
    
    response.headers.forEach((value, key) => {
      if (headersToCopyBack.includes(key.toLowerCase())) {
        let val = value;
        // CRITICAL: Rewrite Location header if it points to Supabase directly
        if (key.toLowerCase() === 'location' && val.startsWith(supabaseUrl)) {
          const appUrl = req.nextUrl.origin;
          // Ensure we don't have double slashes
          const proxyBase = appUrl.endsWith('/') ? `${appUrl}api/sb-proxy` : `${appUrl}/api/sb-proxy`;
          val = val.replace(supabaseUrl, proxyBase);
        }
        responseHeaders.set(key, val);
      }
    });

    // Add CORS headers for the proxy itself
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Supabase Proxy Error:", error);
    return NextResponse.json(
      { error: "Proxy Request Failed", details: error.message },
      { status: 500 }
    );
  }
}
