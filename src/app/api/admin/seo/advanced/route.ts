import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.katyaayaniastrologer.com";

// All pages with their multi-language metadata
const PAGES_SEO: Record<string, { en: { title: string; desc: string }; hi: { title: string; desc: string }; gu: { title: string; desc: string } }> = {
  "/": {
    en: { title: "Katyaayani Astrologer | Expert Vedic Astrology & Kundali", desc: "Expert Vedic astrology consultations, kundali reading, horoscope analysis, and spiritual guidance by Katyaayani Astrologer." },
    hi: { title: "कात्यायनी ज्योतिषी | विशेषज्ञ वैदिक ज्योतिष और कुंडली", desc: "कात्यायनी ज्योतिषी द्वारा विशेषज्ञ वैदिक ज्योतिष परामर्श, कुंडली पठन, राशिफल विश्लेषण और आध्यात्मिक मार्गदर्शन।" },
    gu: { title: "કાત્યાયની જ્યોતિષી | નિષ્ણાત વૈદિક જ્યોતિષ અને કુંડળી", desc: "કાત્યાયની જ્યોતિષી દ્વારા નિષ્ણાત વૈદિક જ્યોતિષ પરામર્શ, કુંડળી વાંચન, રાશિફળ વિશ્લેષણ અને આધ્યાત્મિક માર્ગદર્શન." },
  },
  "/services": {
    en: { title: "Astrology Services | Kundali, Horoscope & Vastu", desc: "Professional astrology services including kundali making, horoscope matching, vastu consultation, gemstone advice, and more." },
    hi: { title: "ज्योतिष सेवाएं | कुंडली, राशिफल और वास्तु", desc: "कुंडली निर्माण, राशिफल मिलान, वास्तु परामर्श, रत्न सलाह सहित पेशेवर ज्योतिष सेवाएं।" },
    gu: { title: "જ્યોતિષ સેવાઓ | કુંડળી, રાશિફળ અને વાસ્તુ", desc: "કુંડળી બનાવવી, રાશિફળ મેચિંગ, વાસ્તુ પરામર્શ, રત્ન સલાહ સહિત વ્યાવસાયિક જ્યોતિષ સેવાઓ." },
  },
  "/booking": {
    en: { title: "Book Astrology Consultation | Online & In-Person", desc: "Book your personalized astrology consultation with Katyaayani Astrologer. Available online and in-person." },
    hi: { title: "ज्योतिष परामर्श बुक करें | ऑनलाइन और व्यक्तिगत", desc: "कात्यायनी ज्योतिषी के साथ अपना व्यक्तिगत ज्योतिष परामर्श बुक करें। ऑनलाइन और व्यक्तिगत रूप से उपलब्ध।" },
    gu: { title: "જ્યોતિષ પરામર્શ બુક કરો | ઓનલાઈન અને રૂબરૂ", desc: "કાત્યાયની જ્યોતિષી સાથે તમારું વ્યક્તિગત જ્યોતિષ પરામર્શ બુક કરો. ઓનલાઈન અને રૂબરૂ ઉપલબ્ધ." },
  },
  "/blog": {
    en: { title: "Astrology Blog | Tips, Insights & Spiritual Guidance", desc: "Read latest astrology articles, tips, insights, and spiritual guidance on our blog." },
    hi: { title: "ज्योतिष ब्लॉग | टिप्स, अंतर्दृष्टि और आध्यात्मिक मार्गदर्शन", desc: "हमारे ब्लॉग पर नवीनतम ज्योतिष लेख, टिप्स, अंतर्दृष्टि और आध्यात्मिक मार्गदर्शन पढ़ें।" },
    gu: { title: "જ્યોતિષ બ્લોગ | ટિપ્સ, આંતરદૃષ્ટિ અને આધ્યાત્મિક માર્ગદર્શન", desc: "અમારા બ્લોગ પર નવીનતમ જ્યોતિષ લેખો, ટિપ્સ, આંતરદૃષ્ટિ અને આધ્યાત્મિક માર્ગદર્શન વાંચો." },
  },
  "/rashifal": {
    en: { title: "Daily Rashifal | Today's Horoscope for All Zodiac Signs", desc: "Get your daily rashifal and horoscope predictions for all 12 zodiac signs. Updated daily." },
    hi: { title: "दैनिक राशिफल | आज का राशिफल सभी राशियों के लिए", desc: "सभी 12 राशियों के लिए अपना दैनिक राशिफल और भविष्यवाणी प्राप्त करें। प्रतिदिन अपडेट।" },
    gu: { title: "દૈનિક રાશિફળ | આજનું રાશિફળ બધી રાશિઓ માટે", desc: "બધી 12 રાશિઓ માટે તમારું દૈનિક રાશિફળ અને ભવિષ્યવાણી મેળવો. દરરોજ અપડેટ." },
  },
  "/horoscope": {
    en: { title: "Horoscope | Weekly & Monthly Predictions", desc: "Detailed weekly and monthly horoscope predictions for all zodiac signs by expert astrologer." },
    hi: { title: "राशिफल | साप्ताहिक और मासिक भविष्यवाणी", desc: "विशेषज्ञ ज्योतिषी द्वारा सभी राशियों के लिए विस्तृत साप्ताहिक और मासिक राशिफल भविष्यवाणी।" },
    gu: { title: "રાશિફળ | સાપ્તાહિક અને માસિક ભવિષ્યવાણી", desc: "નિષ્ણાત જ્યોતિષી દ્વારા બધી રાશિઓ માટે વિગતવાર સાપ્તાહિક અને માસિક રાશિફળ ભવિષ્યવાણી." },
  },
  "/about": {
    en: { title: "About Katyaayani Astrologer | Experienced Vedic Astrologer", desc: "Learn about Katyaayani Astrologer's journey, experience, and expertise in Vedic astrology." },
    hi: { title: "कात्यायनी ज्योतिषी के बारे में | अनुभवी वैदिक ज्योतिषी", desc: "कात्यायनी ज्योतिषी की यात्रा, अनुभव और वैदिक ज्योतिष में विशेषज्ञता के बारे में जानें।" },
    gu: { title: "કાત્યાયની જ્યોતિષી વિશે | અનુભવી વૈદિક જ્યોતિષી", desc: "કાત્યાયની જ્યોતિષીની સફર, અનુભવ અને વૈદિક જ્યોતિષમાં નિપુણતા વિશે જાણો." },
  },
  "/hindu-calendar": {
    en: { title: "Hindu Calendar 2025 | Panchang, Tithi & Festivals", desc: "Complete Hindu calendar with panchang, tithi, muhurat, festivals, and auspicious dates." },
    hi: { title: "हिंदू कैलेंडर 2025 | पंचांग, तिथि और त्योहार", desc: "पंचांग, तिथि, मुहूर्त, त्योहार और शुभ तिथियों के साथ पूर्ण हिंदू कैलेंडर।" },
    gu: { title: "હિંદુ કેલેન્ડર 2025 | પંચાંગ, તિથિ અને તહેવારો", desc: "પંચાંગ, તિથિ, મુહૂર્ત, તહેવારો અને શુભ તારીખો સાથે સંપૂર્ણ હિંદુ કેલેન્ડર." },
  },
  "/important-days": {
    en: { title: "Important Hindu Days & Festivals | Spiritual Calendar", desc: "Complete list of important Hindu days, festivals, vrats, and spiritual observances." },
    hi: { title: "महत्वपूर्ण हिंदू दिवस और त्योहार | आध्यात्मिक कैलेंडर", desc: "महत्वपूर्ण हिंदू दिवसों, त्योहारों, व्रतों और आध्यात्मिक पर्वों की पूरी सूची।" },
    gu: { title: "મહત્વપૂર્ણ હિંદુ દિવસો અને તહેવારો | આધ્યાત્મિક કેલેન્ડર", desc: "મહત્વપૂર્ણ હિંદુ દિવસો, તહેવારો, વ્રતો અને આધ્યાત્મિક પર્વોની સંપૂર્ણ સૂચિ." },
  },
  "/online-consulting": {
    en: { title: "Online Astrology Consulting | Video Call Consultation", desc: "Get expert astrology consultation online via video call. Convenient and personalized." },
    hi: { title: "ऑनलाइन ज्योतिष परामर्श | वीडियो कॉल परामर्श", desc: "वीडियो कॉल के माध्यम से ऑनलाइन विशेषज्ञ ज्योतिष परामर्श प्राप्त करें। सुविधाजनक और व्यक्तिगत।" },
    gu: { title: "ઓનલાઈન જ્યોતિષ પરામર્શ | વિડિયો કોલ પરામર્શ", desc: "વિડિયો કોલ દ્વારા ઓનલાઈન નિષ્ણાત જ્યોતિષ પરામર્શ મેળવો. અનુકૂળ અને વ્યક્તિગત." },
  },
};

// AI-powered SEO suggestions based on current page analysis
function generateSeoSuggestions(path: string, html: string): { category: string; suggestion: string; priority: string }[] {
  const suggestions: { category: string; suggestion: string; priority: string }[] = [];

  // Title analysis
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch?.[1] || "";
  if (!title) {
    suggestions.push({ category: "Title", suggestion: "Add a <title> tag - this is critical for SEO", priority: "high" });
  } else {
    if (title.length < 30) suggestions.push({ category: "Title", suggestion: `Title is too short (${title.length} chars). Aim for 50-60 characters for optimal SEO.`, priority: "medium" });
    if (title.length > 65) suggestions.push({ category: "Title", suggestion: `Title is too long (${title.length} chars). Google truncates after ~60 characters.`, priority: "medium" });
    if (!title.toLowerCase().includes("katyaayani")) suggestions.push({ category: "Title", suggestion: "Include brand name 'Katyaayani' in title for brand recognition.", priority: "low" });
    if (!title.match(/astrol|jyotish|kundali|horoscope|rashifal/i)) suggestions.push({ category: "Title", suggestion: "Include primary keyword (astrology/jyotish/kundali) in title.", priority: "medium" });
  }

  // Description analysis
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
  const desc = descMatch?.[1] || "";
  if (!desc) {
    suggestions.push({ category: "Description", suggestion: "Add meta description - essential for search result snippets", priority: "high" });
  } else {
    if (desc.length < 100) suggestions.push({ category: "Description", suggestion: `Description too short (${desc.length} chars). Aim for 150-160 characters.`, priority: "medium" });
    if (desc.length > 160) suggestions.push({ category: "Description", suggestion: `Description too long (${desc.length} chars). Will be truncated in search results.`, priority: "low" });
    if (!desc.match(/consult|book|free|expert|best/i)) suggestions.push({ category: "Description", suggestion: "Include a call-to-action word (consult, book, expert) in description.", priority: "low" });
  }

  // Heading analysis
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) suggestions.push({ category: "Headings", suggestion: "Add an H1 tag - every page should have exactly one H1.", priority: "high" });
  if (h1Count > 1) suggestions.push({ category: "Headings", suggestion: `Multiple H1 tags found (${h1Count}). Use only one H1 per page.`, priority: "medium" });

  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  if (h2Count === 0) suggestions.push({ category: "Headings", suggestion: "Add H2 subheadings to structure content and improve readability.", priority: "low" });

  // Image analysis
  const images = html.match(/<img[^>]+>/gi) || [];
  const noAlt = images.filter(img => !img.match(/alt=["'][^"']+["']/i));
  if (noAlt.length > 0) suggestions.push({ category: "Images", suggestion: `${noAlt.length} images missing alt text. Add descriptive alt tags for accessibility and SEO.`, priority: "medium" });

  const noLazy = images.filter(img => !img.match(/loading=["']lazy["']/i) && !img.match(/priority/i));
  if (noLazy.length > 3) suggestions.push({ category: "Images", suggestion: `${noLazy.length} images without lazy loading. Add loading="lazy" to below-fold images.`, priority: "low" });

  // Link analysis
  const internalLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  const externalLinks = (html.match(/href=["']https?:\/\/(?!www\.katyaayaniastrologer\.com)[^"']*["']/gi) || []).length;
  if (internalLinks < 3) suggestions.push({ category: "Links", suggestion: "Add more internal links to improve site navigation and link juice distribution.", priority: "medium" });
  if (externalLinks > 0) {
    const nofollow = (html.match(/href=["']https?:\/\/[^"']*["'][^>]*rel=["'][^"']*nofollow/gi) || []).length;
    if (nofollow < externalLinks) suggestions.push({ category: "Links", suggestion: `${externalLinks - nofollow} external links without rel="nofollow". Consider adding nofollow to non-essential external links.`, priority: "low" });
  }

  // Schema/JSON-LD
  if (!html.match(/<script[^>]*type=["']application\/ld\+json["']/i)) {
    suggestions.push({ category: "Schema", suggestion: "Add JSON-LD structured data for rich snippets in search results.", priority: "high" });
  }

  // OG tags
  if (!html.match(/property=["']og:image["']/i)) suggestions.push({ category: "Social", suggestion: "Add og:image meta tag for better social media sharing.", priority: "medium" });
  if (!html.match(/name=["']twitter:card["']/i)) suggestions.push({ category: "Social", suggestion: "Add Twitter Card meta tags for better X/Twitter sharing.", priority: "low" });

  // Canonical
  if (!html.match(/rel=["']canonical["']/i)) suggestions.push({ category: "Technical", suggestion: "Add canonical URL to prevent duplicate content issues.", priority: "high" });

  // Content length check
  const textContent = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textContent.split(" ").length;
  if (wordCount < 300) suggestions.push({ category: "Content", suggestion: `Page has only ~${wordCount} words. Aim for 500+ words for better ranking.`, priority: "medium" });

  // Keyword density suggestions
  const keywords = ["astrology", "jyotish", "kundali", "horoscope", "rashifal", "vedic", "consultation"];
  const foundKeywords = keywords.filter(k => textContent.toLowerCase().includes(k));
  if (foundKeywords.length < 2) suggestions.push({ category: "Keywords", suggestion: `Only ${foundKeywords.length} target keywords found in content. Include more relevant keywords naturally.`, priority: "medium" });

  // Performance suggestions
  if (html.length > 500000) suggestions.push({ category: "Performance", suggestion: "Page HTML is very large. Consider code splitting and lazy loading components.", priority: "medium" });

  return suggestions;
}

// GET: Multi-lang hreflang data for all pages
export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "hreflang";

  if (action === "hreflang") {
    // Generate hreflang tags for all pages
    const hreflangData = Object.entries(PAGES_SEO).map(([path, langs]) => ({
      path,
      url: `${SITE_URL}${path}`,
      languages: {
        "en-IN": { url: `${SITE_URL}${path}`, ...langs.en },
        "hi-IN": { url: `${SITE_URL}/hi${path}`, ...langs.hi },
        "gu-IN": { url: `${SITE_URL}/gu${path}`, ...langs.gu },
        "x-default": { url: `${SITE_URL}${path}`, ...langs.en },
      },
      hreflangTags: [
        `<link rel="alternate" hreflang="en-IN" href="${SITE_URL}${path}" />`,
        `<link rel="alternate" hreflang="hi-IN" href="${SITE_URL}/hi${path}" />`,
        `<link rel="alternate" hreflang="gu-IN" href="${SITE_URL}/gu${path}" />`,
        `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}" />`,
      ],
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalPages: hreflangData.length,
        supportedLanguages: ["en-IN", "hi-IN", "gu-IN"],
        pages: hreflangData,
      },
    });
  }

  if (action === "suggestions") {
    // AI SEO suggestions for all pages
    const url = req.nextUrl.searchParams.get("url") || SITE_URL;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "KatyaayaniSEOBot/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) return NextResponse.json({ success: false, error: `Page returned ${res.status}` }, { status: 400 });
      const html = await res.text();
      const suggestions = generateSeoSuggestions(url.replace(SITE_URL, "") || "/", html);

      const highPriority = suggestions.filter(s => s.priority === "high");
      const mediumPriority = suggestions.filter(s => s.priority === "medium");
      const lowPriority = suggestions.filter(s => s.priority === "low");

      return NextResponse.json({
        success: true,
        data: {
          url,
          totalSuggestions: suggestions.length,
          highPriority: highPriority.length,
          mediumPriority: mediumPriority.length,
          lowPriority: lowPriority.length,
          suggestions,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // Action: all-suggestions - analyze all pages
  if (action === "all-suggestions") {
    const allResults: { page: string; suggestions: ReturnType<typeof generateSeoSuggestions>; score: number }[] = [];

    for (const path of Object.keys(PAGES_SEO)) {
      try {
        const res = await fetch(`${SITE_URL}${path}`, {
          headers: { "User-Agent": "KatyaayaniSEOBot/1.0" },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) continue;
        const html = await res.text();
        const suggestions = generateSeoSuggestions(path, html);
        const score = Math.max(0, 100 - suggestions.reduce((s, sg) => s + (sg.priority === "high" ? 15 : sg.priority === "medium" ? 8 : 3), 0));
        allResults.push({ page: path, suggestions, score });
      } catch { /* skip */ }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalPages: allResults.length,
        averageScore: Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length),
        results: allResults,
        analyzedAt: new Date().toISOString(),
      },
    });
  }

  return NextResponse.json({ success: false, error: "Invalid action. Use: hreflang, suggestions, all-suggestions" }, { status: 400 });
}
