import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";
const SITE_URL = "https://www.katyaayaniastrologer.com";
const SITE_NAME = "Katyaayani Astrologer";
// Logo for Google/Bing search result thumbnail (right side image in search results)
const LOGO_IMAGE = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=256&height=256&resize=contain";

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }) },
  });
}

// ─── Auto Slug Generator ───
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Brand description used across SEO
const BRAND_DESC = "Katyaayani Astrologer connects modern times with ancient astrology, blending ancient wisdom with today's technology to provide accurate guidance, practical solutions, and personalized remedies — creating a perfect balance between tradition and contemporary life.";

// ─── Default Meta Fallbacks Per Page ───
const PAGE_DEFAULTS: Record<string, { title: string; description: string; keywords: string }> = {
  "/": {
    title: "Katyaayani Astrologer - Best Ancient Astrologer | Kundali, Horoscope & Jyotish Consultation",
    description: `${BRAND_DESC} Expert ancient astrology consultations, kundali analysis, horoscope readings, vastu shastra & personalized remedies since 2007. Book online or home consultation today.`,
    keywords: "katyaayani astrologer, katyaayani jyotish, ancient astrologer, best astrologer, kundali analysis, horoscope reading, jyotish consultation, astrology online, vastu shastra, rudram joshi astrologer, indian astrology, birth chart analysis, rashifal, panchang, hindu calendar, astrology consultation online, best ancient astrologer india, kundali matching, marriage astrology, career astrology, health astrology, astrology remedies, ancient astrology modern times, ancient wisdom technology, કાત્યાયની જ્યોતિષ, कात्यायनी ज्योतिष",
  },
    "/about": {
      title: "About Katyaayani Astrologer (Rudram Joshi) - Trusted Ancient Astrologer Since 2007",
      description: `${BRAND_DESC} Learn about Rudram Joshi - a trusted ancient astrology expert with 17+ years experience offering kundali analysis, horoscope readings, vastu consultation & spiritual guidance.`,
      keywords: "about katyaayani astrologer, rudram joshi astrologer, ancient astrologer experience, trusted astrologer india, katyaayani jyotish about, ancient wisdom modern astrology",
    },
  "/services": {
    title: "Astrology Services - Kundali, Horoscope, Vastu & Marriage Matching | Katyaayani",
    description: `Explore Katyaayani Astrologer's services: kundali analysis, horoscope reading, kundali matching for marriage, vastu shastra, career astrology, health astrology & personalized ancient remedies. ${BRAND_DESC}`,
    keywords: "astrology services, kundali matching, horoscope analysis, vastu shastra consultation, marriage astrology, career astrology, gemstone recommendation, ancient remedies, katyaayani services, personalized astrology solutions",
  },
  "/booking": {
    title: "Book Astrology Consultation Online | Katyaayani Astrologer",
    description: `Book your personalized ancient astrology consultation with Katyaayani Astrologer. Choose online video call or in-person home visit sessions. ${BRAND_DESC}`,
    keywords: "book astrology appointment, online astrology consultation, astrology booking, katyaayani booking, ancient consultation appointment, astrologer near me, book astrologer online",
  },
  "/blog": {
    title: "Astrology Blog - Ancient Insights, Horoscope Updates & Spiritual Wisdom | Katyaayani",
    description: `Read the latest astrology articles, ancient insights, horoscope updates, rashifal predictions, panchang information & spiritual wisdom. ${BRAND_DESC}`,
    keywords: "astrology blog, ancient knowledge, horoscope updates, spiritual articles, astrology tips, katyaayani blog, jyotish articles, ancient wisdom blog",
  },
  "/horoscope": {
    title: "Daily Horoscope & Yearly Predictions - Zodiac Forecasts | Katyaayani Astrologer",
    description: `Get accurate daily horoscope and yearly predictions for all 12 zodiac signs by Katyaayani Astrologer. Personalized ancient astrology forecasts for love, career, health & finance. ${BRAND_DESC}`,
    keywords: "daily horoscope, yearly horoscope, zodiac predictions, today horoscope, astrology forecast, rashi, horoscope today, katyaayani horoscope, zodiac signs daily, yearly predictions 2026",
  },
  "/rashifal": {
    title: "Rashifal - Daily & Weekly Rashi Predictions in Hindi & Gujarati | Katyaayani Astrologer",
    description: `Read your daily and weekly rashifal predictions by Katyaayani Astrologer. Accurate ancient astrology forecasts in Hindi & Gujarati for all 12 zodiac signs. ${BRAND_DESC}`,
    keywords: "rashifal, daily rashifal, weekly rashifal, aaj ka rashifal, rashi bhavishya, ancient astrology hindi, rashifal today, katyaayani rashifal, રાશિફળ, साप्ताहिक राशिफल, દૈનિક રાશિફળ",
  },
  "/hindu-calendar": {
    title: "Hindu Calendar 2026 - Panchang, Tithi & Nakshatra | Katyaayani Astrologer",
    description: `Check the Hindu calendar with daily panchang, tithi, nakshatra, yoga, karana & auspicious muhurat timings. Plan your rituals and ceremonies. ${BRAND_DESC}`,
    keywords: "hindu calendar 2026, panchang today, tithi today, nakshatra, muhurat, hindu panchang, katyaayani panchang, vikram samvat, હિંદુ કેલેન્ડર, हिन्दू कैलेंडर 2026",
  },
  "/important-days": {
    title: "Important Hindu Festivals & Vrat Days 2026 | Katyaayani Astrologer",
    description: `Discover important Hindu festivals, vrat dates, ekadashi, purnima, amavasya & auspicious days with detailed panchang information. ${BRAND_DESC}`,
    keywords: "hindu festivals 2026, vrat dates, important hindu days, ekadashi dates, purnima dates, amavasya dates, katyaayani festivals, તહેવારો 2026, त्योहार 2026",
  },
  "/online-consulting": {
    title: "Online Astrology Consultation - Video Call Sessions Worldwide | Katyaayani",
    description: `Get expert ancient astrology consultation online via video call with Katyaayani Astrologer. Available worldwide. Convenient, personalized & accurate kundali and horoscope sessions. ${BRAND_DESC}`,
    keywords: "online astrology consultation, virtual astrology session, video call astrology, online kundali reading, astrologer online, katyaayani online consultation, worldwide astrology, astrology from home",
  },
  "/feedback": {
    title: "Client Reviews & Testimonials | Katyaayani Astrologer",
    description: `Read genuine testimonials and reviews from satisfied clients of Katyaayani Astrologer. Trusted by hundreds of clients for ancient astrology consultations since 2007. ${BRAND_DESC}`,
    keywords: "katyaayani astrologer reviews, astrology testimonials, client feedback, astrologer reviews, trusted astrologer reviews, client experiences",
  },
  "/privacy": {
    title: "Privacy Policy | Katyaayani Astrologer",
    description: "Read the privacy policy of Katyaayani Astrologer. Learn how we collect, use, and protect your personal information during astrology consultations and website usage.",
    keywords: "privacy policy, katyaayani astrologer privacy, data protection, personal information policy",
  },
  "/terms": {
    title: "Terms & Conditions | Katyaayani Astrologer",
    description: "Read the terms and conditions for using Katyaayani Astrologer's services. Understand our service policies, booking terms, and user responsibilities.",
    keywords: "terms and conditions, katyaayani astrologer terms, service agreement, booking terms, astrology consultation terms",
  },
  "/refund-policy": {
    title: "Refund & Cancellation Policy | Katyaayani Astrologer",
    description: "Review the refund and cancellation policy for Katyaayani Astrologer's astrology consultation services. Understand our booking cancellation and refund procedures.",
    keywords: "refund policy, cancellation policy, katyaayani refund, booking cancellation, astrology consultation refund",
  },
  "/disclaimer": {
    title: "Disclaimer | Katyaayani Astrologer",
    description: "Read the disclaimer for Katyaayani Astrologer's services. Understand the nature of astrological guidance and the limitations of our predictions and remedies.",
    keywords: "disclaimer, katyaayani astrologer disclaimer, astrology disclaimer, ancient astrology guidance",
  },
  "/contact": {
    title: "Contact Katyaayani Astrologer | Ancient Astrology Consultation Enquiry",
    description: "Contact Katyaayani Astrologer (Rudram Joshi) for ancient astrology consultations, kundali analysis, horoscope readings & enquiries. Located in Vastral, Ahmedabad. Available online worldwide.",
    keywords: "contact katyaayani astrologer, astrologer contact, rudram joshi contact, astrology enquiry, book astrologer, katyaayani contact ahmedabad",
  },
  "/kundli": {
    title: "Kundali Analysis - Janam Kundali, Kundali Matching & Birth Chart | Katyaayani Astrologer",
    description: "Get expert ancient Kundali (birth chart) analysis by Katyaayani Astrologer. Services include Janam Kundali reading, Kundali Matching for marriage, Dasha analysis & personalized remedies since 2007.",
    keywords: "kundali analysis, janam kundali, kundali matching, birth chart reading, ancient kundali, kundali milan, kundali online, katyaayani kundali, horoscope chart, dasha analysis, કુંડળી, कुंडली विश्लेषण",
  },
  "/signin": {
    title: "Sign In to Your Account | Katyaayani Astrologer",
    description: "Sign in to your Katyaayani Astrologer account to access personalized horoscope readings, booking history, and exclusive astrology consultations.",
    keywords: "sign in, login, katyaayani astrologer login, astrology account",
  },
  "/signup": {
    title: "Create Your Account | Katyaayani Astrologer",
    description: "Create your free account on Katyaayani Astrologer to get personalized horoscope readings, book consultations, and receive daily rashifal predictions.",
    keywords: "sign up, register, create account, katyaayani astrologer account, free astrology account",
  },
    "/profile": {
      title: "My Profile | Katyaayani Astrologer",
      description: "Manage your Katyaayani Astrologer profile, view booking history, check horoscope readings, and update your personal information.",
      keywords: "my profile, account settings, katyaayani profile, booking history, astrology dashboard",
    },
    "/gallery": {
      title: "Pictures Gallery - Sacred Vedic & Spiritual Images | Katyaayani Astrologer",
      description: "Explore our collection of sacred Vedic, spiritual, and astrological pictures. High-quality images of temples, rituals, and celestial events by Katyaayani Astrologer.",
      keywords: "astrology pictures, vedic gallery, spiritual images, katyaayani gallery, hindu ritual photos, astrology images google",
    },
    "/reviews": {
      title: "Client Reviews & Feedback | Katyaayani Astrologer",
      description: "Read genuine feedback and experiences from our clients worldwide. Hundreds of satisfied clients for astrology consultations, kundali analysis & more. Share your experience with us.",
      keywords: "astrology reviews, client feedback, katyaayani reviews, rudram joshi reviews, best astrologer testimonials, astrology consultation feedback",
    },
  };

// ─── Schema.org Generator ───
export function generateSchemaMarkup(
  pagePath: string, 
  seoData?: { meta_title?: string; meta_description?: string; og_image?: string },
  additionalData?: { galleryImages?: { image_url: string; title: string; description: string }[] }
): Record<string, unknown> {
  const title = seoData?.meta_title || PAGE_DEFAULTS[pagePath]?.title || SITE_NAME;
  const description = seoData?.meta_description || PAGE_DEFAULTS[pagePath]?.description || "";
  const image = seoData?.og_image || "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";
  const url = `${SITE_URL}${pagePath === "/" ? "" : pagePath}`;

  // Base Organization schema (always included)
  const organization = {
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["Katyaayani Jyotish", "કાત્યાયની જ્યોતિષ", "कात्यायनी ज्योतिष"],
    url: SITE_URL,
    logo: LOGO_IMAGE,
    image: LOGO_IMAGE,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  };

  if (pagePath === "/") {
    const graph: any[] = [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        alternateName: ["Katyaayani Jyotish", "કાત્યાયની જ્યોતિષ", "कात्यायनी ज्योतिष"],
        url: SITE_URL,
        description,
        inLanguage: ["en", "hi", "gu"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      organization,
      {
        "@type": "ProfessionalService",
          name: SITE_NAME,
          alternateName: "Katyaayani Jyotish",
          description,
          url: SITE_URL,
          image: LOGO_IMAGE,
        priceRange: "$$",
        serviceType: ["Ancient Astrology Consultation", "Kundali Analysis", "Horoscope Reading", "Vastu Shastra", "Marriage Matching"],
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Astrology Services",
          itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ancient Kundali Analysis" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Horoscope & Rashifal Reading" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kundali Matching for Marriage" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vastu Shastra Consultation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Online Video Call Consultation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Visit Astrology Session" } },
          ],
        },
      },
      {
        "@type": "Person",
        name: "Rudram Joshi",
        alternateName: "Katyaayani Astrologer",
        jobTitle: "Ancient Astrologer",
        url: SITE_URL,
        image: LOGO_IMAGE,
        knowsAbout: ["Ancient Astrology", "Jyotish Shastra", "Kundali Analysis", "Vastu Shastra", "Horoscope Reading"],
        worksFor: organization,
      },
    ];

    // Add ImageGallery if images exist
    if (additionalData?.galleryImages && additionalData.galleryImages.length > 0) {
      graph.push({
        "@type": "ImageGallery",
        "name": "Katyaayani Astrologer Sacred Gallery",
        "description": "Collection of sacred Vedic, spiritual, and astrological pictures curated by Katyaayani Astrologer.",
        "image": additionalData.galleryImages.map(img => ({
          "@type": "ImageObject",
          "contentUrl": img.image_url,
          "name": img.title,
          "description": img.description,
          "author": "Katyaayani Astrologer"
        }))
      });
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    };
  }

  if (pagePath === "/about") {
    return {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: title,
      description,
      url,
        mainEntity: {
          "@type": "Person",
          name: "Katyaayani",
          jobTitle: "Ancient Astrologer",
          url: SITE_URL,
          image: LOGO_IMAGE,
      },
    };
  }

  if (pagePath === "/services") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      url,
      provider: organization,
        serviceType: "Ancient Astrology Services",
    };
  }

  if (pagePath === "/booking") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      potentialAction: {
        "@type": "ReserveAction",
        target: url,
        name: "Book Consultation",
      },
    };
  }

  if (pagePath === "/blog") {
    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: title,
      description,
      url,
      publisher: organization,
    };
  }

  if (pagePath === "/feedback") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
    };
  }

  // Default WebPage schema
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

// ─── SEO Audit Checker ───
export interface SeoAuditIssue {
  type: "error" | "warning" | "info";
  field: string;
  message: string;
}

export interface SeoAuditResult {
  page_path: string;
  score: number;
  issues: SeoAuditIssue[];
  hasTitle: boolean;
  hasDescription: boolean;
  hasKeywords: boolean;
  hasOgTags: boolean;
  hasCanonical: boolean;
  hasSchema: boolean;
}

export function auditSeoEntry(entry: Record<string, any>): SeoAuditResult {
  const issues: SeoAuditIssue[] = [];
  let score = 100;

  const hasTitle = !!entry.meta_title;
  const hasDescription = !!entry.meta_description;
  const hasKeywords = !!entry.meta_keywords;
  const hasOgTitle = !!entry.og_title;
  const hasOgDescription = !!entry.og_description;
  const hasOgImage = !!entry.og_image;
  const hasCanonical = !!entry.canonical_url;
  const hasSchema = !!entry.schema_markup;

  // Title checks
  if (!hasTitle) {
    issues.push({ type: "error", field: "meta_title", message: "Missing meta title" });
    score -= 15;
  } else {
    if (entry.meta_title.length < 30) {
      issues.push({ type: "warning", field: "meta_title", message: `Title too short (${entry.meta_title.length}/30 min)` });
      score -= 5;
    }
    if (entry.meta_title.length > 60) {
      issues.push({ type: "warning", field: "meta_title", message: `Title too long (${entry.meta_title.length}/60 max)` });
      score -= 5;
    }
  }

  // Description checks
  if (!hasDescription) {
    issues.push({ type: "error", field: "meta_description", message: "Missing meta description" });
    score -= 15;
  } else {
    if (entry.meta_description.length < 70) {
      issues.push({ type: "warning", field: "meta_description", message: `Description too short (${entry.meta_description.length}/70 min)` });
      score -= 5;
    }
    if (entry.meta_description.length > 160) {
      issues.push({ type: "warning", field: "meta_description", message: `Description too long (${entry.meta_description.length}/160 max)` });
      score -= 5;
    }
  }

  // Keywords
  if (!hasKeywords) {
    issues.push({ type: "warning", field: "meta_keywords", message: "No keywords set" });
    score -= 5;
  }

  // Open Graph
  if (!hasOgTitle) {
    issues.push({ type: "warning", field: "og_title", message: "Missing OG title" });
    score -= 5;
  }
  if (!hasOgDescription) {
    issues.push({ type: "warning", field: "og_description", message: "Missing OG description" });
    score -= 5;
  }
  if (!hasOgImage) {
    issues.push({ type: "warning", field: "og_image", message: "Missing OG image" });
    score -= 5;
  }

  // Canonical
  if (!hasCanonical) {
    issues.push({ type: "info", field: "canonical_url", message: "No canonical URL set" });
    score -= 5;
  }

  // Schema
  if (!hasSchema) {
    issues.push({ type: "warning", field: "schema_markup", message: "No schema markup (JSON-LD)" });
    score -= 10;
  }

  // Robots
  if (entry.robots === "noindex, nofollow") {
    issues.push({ type: "info", field: "robots", message: "Page set to noindex, nofollow" });
  }

  return {
    page_path: entry.page_path,
    score: Math.max(0, score),
    issues,
    hasTitle,
    hasDescription,
    hasKeywords,
    hasOgTags: hasOgTitle && hasOgDescription && hasOgImage,
    hasCanonical,
    hasSchema,
  };
}

// ─── Meta Fallback System ───
export async function getSeoMetadata(pagePath: string): Promise<Metadata> {
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page_path", pagePath)
      .maybeSingle();

    const defaults = PAGE_DEFAULTS[pagePath];
    const baseUrl = SITE_URL;
    const canonicalUrl = `${baseUrl}${pagePath === "/" ? "" : pagePath}`;

    const metadata: Metadata = {};

    // Title: DB -> fallback
    const title = data?.meta_title || defaults?.title;
    if (title) metadata.title = title;

    // Description: DB -> fallback
    const description = data?.meta_description || defaults?.description;
    if (description) metadata.description = description;

    // Keywords: DB -> fallback
    const keywords = data?.meta_keywords || defaults?.keywords;
    if (keywords) {
      metadata.keywords = keywords.split(",").map((k: string) => k.trim());
    }

    // Robots: DB -> default index,follow
    metadata.robots = data?.robots || "index, follow";

    // Open Graph: DB -> auto from title/description
    const ogTitle = data?.og_title || title;
    const ogDescription = data?.og_description || description;
      const ogImage = data?.og_image || "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";

      const openGraph: Record<string, unknown> = {
        type: "website",
        siteName: SITE_NAME,
        url: canonicalUrl,
      };
      if (ogTitle) openGraph.title = ogTitle;
      if (ogDescription) openGraph.description = ogDescription;
      openGraph.images = [{ url: ogImage, width: 1200, height: 630, alt: ogTitle || SITE_NAME }];
    metadata.openGraph = openGraph as Metadata["openGraph"];

      // Twitter card
      metadata.twitter = {
        card: "summary_large_image",
        title: (ogTitle as string) || undefined,
        description: (ogDescription as string) || undefined,
        images: [{ url: ogImage, alt: ogTitle || SITE_NAME }],
      };

    // Canonical: DB -> auto-generate
    metadata.alternates = {
      canonical: data?.canonical_url || canonicalUrl,
    };

    return metadata;
  } catch {
    // Even on error, return safe fallbacks
    const defaults = PAGE_DEFAULTS[pagePath];
    if (defaults) {
      return {
        title: defaults.title,
        description: defaults.description,
        keywords: defaults.keywords.split(",").map((k) => k.trim()),
        robots: "index, follow",
      };
    }
    return {};
  }
}
