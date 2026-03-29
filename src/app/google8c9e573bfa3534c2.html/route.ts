export async function GET() {
  return new Response("google-site-verification: google8c9e573bfa3534c2.html", {
    headers: { "Content-Type": "text/html" },
  });
}
