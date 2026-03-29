"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SITE_URL = "https://www.katyaayaniastrologer.com";
// Square logo - used for Bing/Google Knowledge Panel logo (must be publicly accessible, no transforms)
const LOGO_URL = "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";
const OG_IMAGE = "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png";

const ORG_SCHEMA = {
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: "Katyaayani Astrologer",
  alternateName: ["Katyaayani Jyotish", "Katyayani Ancient Astrology", "KVA", "Rudram Joshi Astrologer"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    width: 1200,
    height: 630,
    caption: "Katyaayani Astrologer",
  },
  image: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 1200,
    height: 630,
  },
  description: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom. Expert kundali analysis, horoscope readings & vastu shastra since 2007.",
  foundingDate: "2007",
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "Rudram Joshi",
    image: LOGO_URL,
    jobTitle: "Founder & Chief Ancient Astrologer",
    worksFor: { "@id": `${SITE_URL}/#organization` },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vastral",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "382418",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.0225,
    longitude: 72.5714,
  },
  telephone: "+91-0000000000",
  email: "katyaayaniastrologer01@gmail.com",
  priceRange: "$$",
  openingHours: "Mo-Su 09:00-21:00",
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "City", name: "Ahmedabad" },
    { "@type": "State", name: "Gujarat" },
  ],
  serviceType: ["Ancient Astrology", "Kundali Analysis", "Horoscope Reading", "Vastu Shastra", "Marriage Matching", "Online Consultation"],
  sameAs: [
    "https://www.katyaayaniastrologer.com",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "katyaayaniastrologer01@gmail.com",
    availableLanguage: ["English", "Hindi", "Gujarati"],
  },
};

const SCHEMA_DEFAULTS: Record<string, Record<string, unknown>> = {
  "/": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Katyaayani Astrologer",
        alternateName: ["Katyaayani Jyotish", "Katyayani Ancient Astrology", "KVA"],
        url: SITE_URL,
        description: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: ["en-IN", "hi-IN", "gu-IN"],
      },
      ORG_SCHEMA,
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: "Katyaayani Astrologer",
        url: SITE_URL,
        image: OG_IMAGE,
        logo: LOGO_URL,
        description: "Expert ancient astrology consultations — kundali analysis, horoscope readings, vastu shastra & personalized remedies since 2007.",
        serviceType: "Ancient Astrology Consultation",
        areaServed: { "@type": "Country", name: "India" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Astrology Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kundali Analysis" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Horoscope Reading" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vastu Consultation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marriage Matching" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Online Consultation" } },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Katyaayani Astrologer kon chhe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Katyaayani Astrologer (Rudram Joshi) ek trusted ancient astrologer chhe jo 2007 thi kundali analysis, horoscope reading, vastu shastra ane personalized remedies provide kare chhe. Ahmedabad, Gujarat ma based chhe ane worldwide online consultations offer kare chhe.",
            },
          },
          {
            "@type": "Question",
            name: "What services does Katyaayani Astrologer offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Katyaayani Astrologer offers kundali analysis, birth chart reading, kundali matching for marriage, daily horoscope, rashifal predictions, vastu shastra consultation, career astrology, health astrology, gemstone recommendations and online video call consultations.",
            },
          },
          {
            "@type": "Question",
            name: "How to book a consultation with Katyaayani Astrologer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can book an online or home visit astrology consultation directly at https://www.katyaayaniastrologer.com/booking. Sessions are available in English, Hindi and Gujarati.",
            },
          },
          {
            "@type": "Question",
            name: "Katyaayani Astrologer online consultation available chhe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Haa, Katyaayani Astrologer video call thi worldwide online astrology consultations offer kare chhe. https://www.katyaayaniastrologer.com/online-consulting par booking karo.",
            },
          },
          {
            "@type": "Question",
            name: "Is Katyaayani Astrologer reliable and experienced?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Rudram Joshi (Katyaayani Astrologer) has 18+ years of experience in ancient astrology since 2007, specializing in kundali analysis, vastu shastra and personalized Jyotish remedies.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        ],
      },
    ],
  },
  "/services": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Astrology Services by Katyaayani",
        url: `${SITE_URL}/services`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kundali Analysis", url: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 2, name: "Horoscope Reading", url: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Vastu Shastra", url: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 4, name: "Marriage Matching", url: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 5, name: "Online Consultation", url: `${SITE_URL}/online-consulting` },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        ],
      },
    ],
  },
  "/about": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "About Katyaayani Astrologer",
        url: `${SITE_URL}/about`,
        mainEntity: ORG_SCHEMA,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
        ],
      },
    ],
  },
  "/contact": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Contact Katyaayani Astrologer",
        url: `${SITE_URL}/contact`,
        mainEntity: ORG_SCHEMA,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
        ],
      },
    ],
  },
  "/blog": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: "Katyaayani Astrologer Blog",
        url: `${SITE_URL}/blog`,
        description: "Ancient astrology articles, horoscope insights, kundali tips & spiritual guidance.",
        publisher: ORG_SCHEMA,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
    ],
  },
  "/rashifal": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Daily Rashifal - Katyaayani Astrologer",
        url: `${SITE_URL}/rashifal`,
        description: "Daily rashifal (horoscope) for all 12 zodiac signs in Gujarati, Hindi & English.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Rashifal", item: `${SITE_URL}/rashifal` },
        ],
      },
    ],
  },
  "/horoscope": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Horoscope - Katyaayani Astrologer",
        url: `${SITE_URL}/horoscope`,
        description: "Daily, weekly & monthly horoscope predictions for all zodiac signs.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Horoscope", item: `${SITE_URL}/horoscope` },
        ],
      },
    ],
  },
  "/online-consulting": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Online Astrology Consultation",
        url: `${SITE_URL}/online-consulting`,
        provider: ORG_SCHEMA,
        serviceType: "Online Ancient Astrology Consultation",
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Online Consulting", item: `${SITE_URL}/online-consulting` },
        ],
      },
    ],
  },
  "/booking": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Book Appointment - Katyaayani Astrologer",
        url: `${SITE_URL}/booking`,
        description: "Book your astrology consultation appointment with Katyaayani Astrologer.",
        potentialAction: {
          "@type": "ReserveAction",
          target: `${SITE_URL}/booking`,
          name: "Book Consultation",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Book Appointment", item: `${SITE_URL}/booking` },
        ],
      },
    ],
  },
  "/hindu-calendar": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Hindu Calendar - Katyaayani Astrologer",
        url: `${SITE_URL}/hindu-calendar`,
        description: "Hindu Panchang calendar with tithi, nakshatra, muhurat & festival dates.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hindu Calendar", item: `${SITE_URL}/hindu-calendar` },
        ],
      },
    ],
  },
  "/important-days": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Important Days & Festivals - Katyaayani Astrologer",
        url: `${SITE_URL}/important-days`,
        description: "Important Hindu festivals, vrat, ekadashi & auspicious dates.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Important Days", item: `${SITE_URL}/important-days` },
        ],
      },
    ],
  },
};

export default function SchemaMarkup() {
  const pathname = usePathname();
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    fetch(`/api/admin/seo?page_path=${encodeURIComponent(pathname)}`)
      .then((res) => { if (!res.ok) throw new Error('not ok'); return res.json(); })
      .then((data) => {
        if (data.success && data.data?.schema_markup) {
          setSchema(data.data.schema_markup);
        } else {
          // Fallback to default schema
            setSchema(SCHEMA_DEFAULTS[pathname] || {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: document.title,
              url: `${SITE_URL}${pathname}`,
              isPartOf: { "@id": `${SITE_URL}/#website` },
            });
        }
      })
      .catch(() => setSchema(null));
  }, [pathname]);

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
