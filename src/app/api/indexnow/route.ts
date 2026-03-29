import { NextResponse } from "next/server";

const SITE_URL = "https://www.katyaayaniastrologer.com";
const INDEX_NOW_KEY = "katyaayani-astrologer-indexnow-key";

// All public pages to submit for indexing
const ALL_PAGES = [
  "/",
  "/about",
  "/services",
  "/booking",
  "/blog",
  "/horoscope",
  "/rashifal",
  "/hindu-calendar",
  "/important-days",
  "/online-consulting",
  "/kundli",
  "/contact",
  "/feedback",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/disclaimer",
  // Zodiac sign pages
  "/horoscope/aries",
  "/horoscope/taurus",
  "/horoscope/gemini",
  "/horoscope/cancer",
  "/horoscope/leo",
  "/horoscope/virgo",
  "/horoscope/libra",
  "/horoscope/scorpio",
  "/horoscope/sagittarius",
  "/horoscope/capricorn",
  "/horoscope/aquarius",
  "/horoscope/pisces",
];

export async function POST() {
  try {
    const urlList = ALL_PAGES.map((p) => `${SITE_URL}${p}`);

    // Submit to Bing IndexNow
    const bingResponse = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.katyaayaniastrologer.com",
        key: INDEX_NOW_KEY,
        keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
        urlList,
      }),
    });

    // Submit to Yandex IndexNow
    const yandexResponse = await fetch("https://yandex.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.katyaayaniastrologer.com",
        key: INDEX_NOW_KEY,
        keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
        urlList,
      }),
    });

    // Submit to Naver IndexNow
    const naverResponse = await fetch("https://searchadvisor.naver.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.katyaayaniastrologer.com",
        key: INDEX_NOW_KEY,
        keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "IndexNow submitted to Bing, Yandex & Naver",
      results: {
        bing: bingResponse.status,
        yandex: yandexResponse.status,
        naver: naverResponse.status,
      },
      urlCount: urlList.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Check IndexNow status
export async function GET() {
  return NextResponse.json({
    success: true,
    key: INDEX_NOW_KEY,
    keyUrl: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
    pages: ALL_PAGES.length,
    endpoints: [
      "https://api.indexnow.org/indexnow (Bing/Edge/DuckDuckGo)",
      "https://yandex.com/indexnow (Yandex)",
      "https://searchadvisor.naver.com/indexnow (Naver)",
    ],
  });
}
