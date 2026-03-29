import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://www.katyaayaniastrologer.com";
const SITE_NAME = "Katyaayani Astrologer";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const supabase = getSupabase();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, featured_image, author_name, published_at, tags, category")
    .eq("slug", slug)
    .single();

  if (!post) {
    return {
      title: `Blog | ${SITE_NAME}`,
      description: "Read our latest astrology articles.",
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const ogImage = post.featured_image || `${SITE_URL}/og-default.png`;
  const description = post.excerpt || `Read "${post.title}" on ${SITE_NAME}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description,
    keywords: post.tags || [],
    robots: "index, follow",
    alternates: { canonical: canonicalUrl },
    authors: [{ name: post.author_name || SITE_NAME }],
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: post.title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at,
      authors: [post.author_name || SITE_NAME],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [{ url: ogImage, alt: post.title }],
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
