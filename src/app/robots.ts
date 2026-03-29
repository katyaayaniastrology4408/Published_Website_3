import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.katyaayaniastrologer.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
          disallow: ["/admin", "/admin/", "/api/", "/signin", "/signup", "/profile", "/complete-profile", "/auth", "/payment"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/signin", "/signup", "/profile", "/complete-profile", "/auth", "/payment"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/signin", "/signup", "/profile", "/complete-profile", "/auth", "/payment"],
      },
      {
        userAgent: "bingbot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/signin", "/signup", "/profile", "/complete-profile", "/auth", "/payment"],
      },
      {
        userAgent: "msnbot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "facebot",
        allow: "/",
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
      {
        userAgent: "Pinterest",
        allow: "/",
      },
      {
        userAgent: "WhatsApp",
        allow: "/",
      },
      {
        userAgent: "TelegramBot",
        allow: "/",
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Sogou",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "ia_archiver",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
