import type { Metadata } from "next";
import { Inter, Cinzel, Geist } from "next/font/google";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import VisualEditsMessengerClient from "@/components/VisualEditsMessengerClient";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import UnifiedLoginPopup from "@/components/auth/UnifiedLoginPopup";
import EnquiryPopup from "@/components/EnquiryPopup";
import FloatingEnquiry from "@/components/FloatingEnquiry";
import UserAlertsPopup from "@/components/UserAlertsPopup";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PageViewTracker from "@/components/PageViewTracker";
import NewsletterPopup from "@/components/NewsletterPopup";
import SchemaMarkup from "@/components/SchemaMarkup";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-cinzel",
});

const ICON_BASE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png';

const SITE_URL = "https://www.katyaayaniastrologer.com";
const OG_IMAGE = "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
    title: {
      default: "Katyaayani Astrologer - Best Ancient Astrologer | Kundali, Horoscope & Jyotish",
      template: "%s | Katyaayani Astrologer",
    },
    description: "Katyaayani Astrologer connects modern times with ancient astrology, blending ancient wisdom with today's technology to provide accurate guidance, practical solutions, and personalized remedies. Expert ancient astrology consultations, kundali analysis, horoscope readings, vastu shastra since 2007. Book online consultation today.",
  keywords: [
    // English primary
    "katyaayani astrologer", "katyaayani jyotish", "vedic astrologer", "best astrologer india",
    "best astrologer near me", "top astrologer india", "famous astrologer india",
    "kundali", "kundali analysis", "kundali matching", "kundali milan",
    "horoscope", "horoscope today", "daily horoscope", "weekly horoscope", "yearly horoscope 2026",
    "jyotish", "jyotish consultation", "jyotish shastra",
    "astrology consultation", "astrology consultation online", "online astrology",
    "vastu shastra", "vastu consultant", "vastu tips",
    "rashifal", "aaj ka rashifal", "daily rashifal", "weekly rashifal",
    "marriage astrology", "love astrology", "career astrology", "health astrology",
    "birth chart analysis", "natal chart reading", "zodiac predictions",
    "gemstone recommendation", "vedic remedies", "astrology remedies",
    "panchang", "hindu calendar", "tithi today", "nakshatra today",
    "rudram joshi astrologer", "indian astrology", "hindu astrology",
    // Gujarati
    "કાત્યાયની જ્યોતિષ", "જ્યોતિષ પરામર્શ", "કુંડળી", "રાશિફળ", "વાસ્તુ શાસ્ત્ર",
    "શ્રેષ્ઠ જ્યોતિષ", "દૈનિક રાશિફળ", "સાપ્તાહિક રાશિફળ",
    // Hindi
    "कात्यायनी ज्योतिष", "ज्योतिष परामर्श", "कुंडली", "राशिफल", "वास्तु शास्त्र",
    "सर्वश्रेष्ठ ज्योतिषी", "दैनिक राशिफल", "साप्ताहिक राशिफल", "कुंडली मिलान",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Katyaayani Astrologer",
    url: SITE_URL,
    locale: "en_IN",
    alternateLocale: ["hi_IN", "gu_IN"],
      title: "A Journey Within - Katyayani Ancient Astrology",
      description: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom. Expert kundali analysis, horoscope readings, vastu consultation & personalized remedies since 2007.",
      images: [
          {
        url: OG_IMAGE,
              width: 1200,
              height: 630,
                alt: "Katyaayani Astrologer - Best Ancient Astrologer",
              type: "image/png",
          },
        ],
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Journey Within - Katyayani Ancient Astrology",
    description: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom.",
    images: [{ url: OG_IMAGE, alt: "Katyaayani Astrologer - Best Ancient Astrologer" }],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "hi-IN": SITE_URL,
      "gu-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  icons: {
      icon: [
        { url: `${ICON_BASE}?width=32&height=32&resize=contain`, type: 'image/png', sizes: '32x32' },
        { url: `${ICON_BASE}?width=16&height=16&resize=contain`, type: 'image/png', sizes: '16x16' },
      ],
      apple: [
        { url: `${ICON_BASE}?width=180&height=180&resize=contain`, type: 'image/png', sizes: '180x180' },
      ],
      shortcut: `${ICON_BASE}?width=64&height=64&resize=contain`,
    },
  other: {
    // Geo & Location (helps Bing, Yandex, DuckDuckGo local search)
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "23.0225;72.5714",
    "ICBM": "23.0225, 72.5714",
    "place:location:latitude": "23.0225",
    "place:location:longitude": "72.5714",

    // Browser & App meta
    "revisit-after": "3 days",
    "rating": "general",
    "language": "English, Hindi, Gujarati",
    "content-language": "en, hi, gu",
    "msapplication-TileColor": "#FF6B00",
    "msapplication-TileImage": `${ICON_BASE}?width=144&height=144&resize=contain`,
    "msapplication-config": "/browserconfig.xml",
    "msapplication-navbutton-color": "#FF6B00",
    "msapplication-starturl": "https://www.katyaayaniastrologer.com",
    "msapplication-tooltip": "Katyaayani Astrologer - Best Ancient Astrologer",
    "msapplication-task": "name=Home;action-uri=https://www.katyaayaniastrologer.com;icon-uri=https://www.katyaayaniastrologer.com/favicon.ico",

    // Apple / Safari
    "apple-mobile-web-app-title": "Katyaayani Astrologer",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",

    // General app
    "application-name": "Katyaayani Astrologer",
    "theme-color": "#FF6B00",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",

    // Crawl & classification
    "distribution": "global",
    "target": "all",
    "audience": "all",
    "coverage": "Worldwide",
    "classification": "Astrology, Jyotish, Ancient Astrology, Spiritual Services",
    "subject": "Ancient Astrology Consultation & Services by Katyaayani Astrologer",
    "abstract": "Katyaayani Astrologer offers expert ancient astrology consultations including kundali analysis, horoscope readings, rashifal predictions, vastu shastra, and personalized remedies since 2007.",
    "topic": "Ancient Astrology, Kundali, Horoscope, Rashifal, Vastu Shastra",
    "summary": "Best Ancient Astrologer in India offering online and in-person astrology consultations, kundali matching, horoscope readings, and personalized remedies.",
    "copyright": "Katyaayani Astrologer",
    "author": "Rudram Joshi - Katyaayani Astrologer",
    "designer": "Katyaayani Astrologer",
    "reply-to": "katyaayaniastrologer01@gmail.com",
    "owner": "Katyaayani Astrologer",
    "url": "https://www.katyaayaniastrologer.com",
    "identifier-URL": "https://www.katyaayaniastrologer.com",
    "directory": "submission",
    "pagename": "Katyaayani Astrologer - Best Ancient Astrologer",
    "category": "Astrology",
    "HandheldFriendly": "True",
    "MobileOptimized": "320",

    // DuckDuckGo / Brave / Opera respect these
    "dc.title": "Katyaayani Astrologer - Best Ancient Astrologer",
    "dc.creator": "Rudram Joshi",
    "dc.subject": "Ancient Astrology, Kundali, Horoscope, Rashifal, Vastu",
    "dc.description": "Expert ancient astrology consultations, kundali analysis, horoscope readings, vastu shastra & personalized remedies since 2007.",
    "dc.publisher": "Katyaayani Astrologer",
    "dc.language": "en-IN",
    "dc.coverage": "India, Worldwide",
    "dc.rights": "Copyright Katyaayani Astrologer. All rights reserved.",

    // Bing specific
    "bingbot": "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

    // Search engine discovery
    "search_type": "Astrology",
    "og:locality": "Ahmedabad",
    "og:region": "Gujarat",
    "og:country-name": "India",
    "og:email": "katyaayaniastrologer01@gmail.com",
  },
  verification: {
    google: ["2Edo_sTI7Jp85F7z7xr0yG6MTSrSsm5WO0jY4HsAqmM", "JC618JFaR6PWY6n1KlEKLwBnTB2Qekmi-2rjnke5S5M"],
    yandex: "yandex-verification-code",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "a889b4f2a770404297f5fe6867c814f5",
    },
  },
  manifest: "/manifest.json",
  category: "astrology",
  creator: "Rudram Joshi - Katyaayani Astrologer",
  publisher: "Katyaayani Astrologer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${geist.variable} ${cinzel.variable}`} suppressHydrationWarning>
        <head>
          {/* Preload logo for LCP - Standardized fetchPriority for React 19 / Next.js 15+ */}
          <link rel="preload" href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=112&height=112&resize=contain" as="image" fetchPriority="high" />
        </head>
          <body className="antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) - GTM-MQDMP2SL */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQDMP2SL"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Google Tag Manager (noscript) - GTM-PG9WBFK9 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PG9WBFK9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
          {/* Google Tag Manager - GTM-MQDMP2SL */}
          <Script id="gtm-mqdmp2sl" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MQDMP2SL');`}
          </Script>
          {/* Google Tag Manager - GTM-PG9WBFK9 */}
          <Script id="gtm-pg9wbfk9" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PG9WBFK9');`}
          </Script>
          {/* Google Analytics GA4 - G-ZB6X0EHGE0 */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-ZB6X0EHGE0"
            strategy="afterInteractive"
          />
          <Script id="ga4-old" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZB6X0EHGE0');`}
          </Script>
          {/* Google Analytics GA4 - G-D13ED7NS0T */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-D13ED7NS0T"
            strategy="afterInteractive"
          />
          <Script id="ga4-new" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-D13ED7NS0T');`}
          </Script>
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="feddd196-43f2-42e9-baf7-609957a7854f"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
            <Providers>
                        {children}
                        <UnifiedLoginPopup />
                        <EnquiryPopup />
                          <FloatingEnquiry />
            <FloatingWhatsApp />
                            <UserAlertsPopup />
                        <PageViewTracker />
                        <NewsletterPopup />
                          <SchemaMarkup />
                        </Providers>
            <Analytics />
            <SpeedInsights />
            <VisualEditsMessengerClient />
      </body>
    </html>
  );
}
