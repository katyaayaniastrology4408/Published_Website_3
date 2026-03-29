import { Metadata } from "next";
import { getSeoMetadata, generateSchemaMarkup } from "@/lib/seo";
import HomePageClient from "@/components/homepage/HomePageClient";
import { supabaseAdmin } from "@/lib/supabase";

const SITE_URL = "https://www.katyaayaniastrologer.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoMetadata("/");
  
  return {
    title: (seo.title as string) || "Katyaayani Astrologer - Best Vedic Astrologer | Kundali, Horoscope & Jyotish Consultation",
    description: seo.description || "Katyaayani Astrologer connects modern times with ancient astrology, blending ancient wisdom with today's technology to provide accurate guidance, practical solutions, and personalized remedies. Expert Vedic astrology consultations, kundali analysis, horoscope readings, vastu shastra since 2007. Book online or home consultation today.",
    keywords: (seo.keywords as string[]) || [
      "katyaayani astrologer", "katyaayani jyotish", "vedic astrologer", "best astrologer",
      "kundali analysis", "horoscope reading", "jyotish consultation", "astrology online",
      "vastu shastra", "rudram joshi astrologer", "indian astrology", "birth chart analysis",
      "rashifal", "panchang", "hindu calendar", "astrology consultation online",
      "best vedic astrologer india", "kundali matching", "marriage astrology",
      "career astrology", "health astrology", "astrology remedies",
      "કાત્યાયની જ્યોતિષ", "જ્યોતિષ પરામર્શ", "कात्यायनी ज्योतिष"
    ],
    robots: seo.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      ...(seo.openGraph as Record<string, unknown>),
      type: "website",
      siteName: "Katyaayani Astrologer",
      url: SITE_URL,
      title: "A Journey Within - Katyayani Vedic Astrology",
      description: "Step into the timeless legacy of Katyayani Vedic Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom. Expert kundali analysis, horoscope readings, vastu consultation & personalized remedies since 2007.",
      locale: "en_IN",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
            alt: "Katyaayani Astrologer Logo - Best Vedic Astrologer",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "A Journey Within - Katyayani Vedic Astrology",
      description: "Step into the timeless legacy of Katyayani Vedic Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom.",
      images: [{ url: `${SITE_URL}/opengraph-image`, alt: "Katyaayani Astrologer Logo - Best Vedic Astrologer" }],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "en-IN": SITE_URL,
        "hi-IN": SITE_URL,
        "gu-IN": SITE_URL,
      },
    },
    other: {
      "geo.region": "IN",
      "geo.placename": "India",
      "revisit-after": "3 days",
      "rating": "general",
    },
  };
}

  export default async function HomePage() {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Fetch today's blogs first
    const { data: todayPosts } = await supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, created_at, category")
      .eq("is_published", true)
      .gte("created_at", `${todayStr}T00:00:00Z`)
      .lte("created_at", `${todayStr}T23:59:59Z`)
      .order("created_at", { ascending: false });

    // Fetch latest blogs as fallback or additional
    const { data: latestPosts } = await supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, created_at, category")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3);

      // If there are today's blogs, show them exclusively.
      // If no blogs for today, we can still show latest but maybe the user wants them to "go away".
      // To satisfy "biji date par jatu revu joi ae", we show today's posts if they exist,
      // otherwise we only show the very latest posts but marked clearly.
        const hasTodayPosts = todayPosts && todayPosts.length > 0;
        
        // Latest post overall for the notification banner (within 24 hours)
        const actualLatestPost = latestPosts && latestPosts.length > 0 ? latestPosts[0] : null;

        // Strictly show only today's posts if they exist. 
        // If no posts for today, we show nothing in the main blog section to satisfy "biji date par jatu revu joi ae"
        const displayPosts = todayPosts || [];
      
      const schema = generateSchemaMarkup("/", undefined, { 
        galleryImages: [] 
      });
      
      return (
        <>
          {/* Server-rendered structured data for SEO crawlers */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
      
          {/* Hidden SEO content visible to crawlers but not disruptive to users */}
          <div className="sr-only">
            <h1>Katyaayani Astrologer - Best Vedic Astrologer for Kundali, Horoscope & Jyotish Consultation</h1>
            <p>
                Katyaayani Astrologer connects modern times with ancient astrology, blending ancient wisdom with today&apos;s technology 
                to provide accurate guidance, practical solutions, and personalized remedies — creating a perfect balance between 
                tradition and contemporary life. Our services include kundali analysis, horoscope reading, rashifal predictions, 
                vastu shastra consultation, marriage and kundali matching, career astrology, health astrology, and personalized Vedic remedies.
              </p>
            <p>
              Book your astrology consultation online or at home. We serve clients worldwide through video call consultations 
              and in-person sessions. Get accurate birth chart analysis, daily horoscope predictions, Hindu panchang, 
              nakshatra analysis, and spiritual guidance from an experienced Vedic astrologer.
            </p>
            <h2>Our Astrology Services</h2>
            <ul>
              <li>Vedic Kundali Analysis &amp; Birth Chart Reading</li>
              <li>Horoscope &amp; Rashifal Predictions</li>
              <li>Kundali Matching for Marriage</li>
              <li>Vastu Shastra Consultation</li>
              <li>Career &amp; Business Astrology</li>
              <li>Health &amp; Wellness Astrology</li>
              <li>Gemstone &amp; Remedy Recommendations</li>
              <li>Daily Panchang &amp; Hindu Calendar</li>
              <li>Online Video Call Consultations</li>
              <li>Home Visit Astrology Sessions</li>
            </ul>
            <h2>કાત્યાયની જ્યોતિષ - વૈદિક જ્યોતિષ પરામર્શ</h2>
            <p>
              કાત્યાયની જ્યોતિષ (રુદ્રમ જોશી) 2007 થી વૈદિક જ્યોતિષ પરામર્શ, કુંડળી વિશ્લેષણ, 
              રાશિફળ, વાસ્તુ શાસ્ત્ર અને વ્યક્તિગત ઉપાયો પ્રદાન કરે છે.
            </p>
            <h2>कात्यायनी ज्योतिष - वैदिक ज्योतिष परामर्श</h2>
            <p>
              कात्यायनी ज्योतिष (रुद्रम जोशी) 2007 से वैदिक ज्योतिष परामर्श, कुंडली विश्लेषण, 
              राशिफल, वास्तु शास्त्र और व्यक्तिगत उपाय प्रदान करते हैं।
            </p>
          </div>
      
          {/* Interactive client-side homepage */}
          <HomePageClient 
            initialLatestPosts={displayPosts || []} 
            hasTodayPosts={hasTodayPosts}
            actualLatestPost={actualLatestPost}
          />
        </>
      );
  }

