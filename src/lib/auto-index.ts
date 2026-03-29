/**
 * auto-index.ts
 * Call this whenever a new page is published/created.
 * Submits URL to Bing IndexNow + pings Google sitemap.
 * Fire-and-forget — never throws, just logs errors.
 */

const SITE_URL = "https://www.katyaayaniastrologer.com";
const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || "a889b4f2a770404297f5fe6867c814f5";
const HOST = "www.katyaayaniastrologer.com";

export async function autoIndexUrl(urlPath: string): Promise<void> {
  const fullUrl = urlPath.startsWith("http") ? urlPath : `${SITE_URL}${urlPath}`;

  // Submit to Bing IndexNow
  try {
    await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [fullUrl],
      }),
    });
  } catch (e) {
    console.error("[auto-index] IndexNow error:", e);
  }

  // Ping Google sitemap
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  } catch (e) {
    console.error("[auto-index] Google ping error:", e);
  }
}

export async function autoIndexUrls(urlPaths: string[]): Promise<void> {
  const urlList = urlPaths.map((p) =>
    p.startsWith("http") ? p : `${SITE_URL}${p}`
  );

  // Submit batch to Bing IndexNow
  try {
    await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch (e) {
    console.error("[auto-index] IndexNow batch error:", e);
  }

  // Ping Google sitemap
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  } catch (e) {
    console.error("[auto-index] Google ping error:", e);
  }
}
