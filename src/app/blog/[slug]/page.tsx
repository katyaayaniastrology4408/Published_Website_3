import { supabaseAdmin } from "@/lib/supabase";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.katyaayaniastrologer.com';
  
  // 1. Get Base Image URL
  let rawImageUrl = post.featured_image;
  if (rawImageUrl && !rawImageUrl.startsWith('http')) {
    rawImageUrl = `${appUrl}${rawImageUrl.startsWith('/') ? '' : '/'}${rawImageUrl}`;
  }

  // 2. Encode for safety (WhatsApp fails on spaces/special chars)
  // We use encodeURI to keep the protocol/slashes but encode spaces/etc.
  const encodedImageUrl = rawImageUrl ? encodeURI(rawImageUrl) : '';

  // 3. Robust OG Image URL (WhatsApp favors JPG/PNG, absolute, <300KB)
  // We add a version timestamp to bust WhatsApp's cache
  const cacheBuster = `v=${new Date(post.published_at).getTime()}`;
  let finalOgImageUrl = encodedImageUrl;

  if (encodedImageUrl.includes('supabase.co/storage/v1/object/public')) {
    // We try to provide an optimized URL for WhatsApp using standard Supabase transformation params
    // These work on public URLs too if the project has the feature enabled.
    // If not, they are ignored or might fail, so we'll be careful.
    const separator = finalOgImageUrl.includes('?') ? '&' : '?';
    // We use a slightly smaller width (800) to ensure the file size stays under 300KB for WhatsApp
    finalOgImageUrl = `${finalOgImageUrl}${separator}width=800&height=420&resize=contain&${cacheBuster}`;
  } else if (finalOgImageUrl) {
    const separator = finalOgImageUrl.includes('?') ? '&' : '?';
    finalOgImageUrl = `${finalOgImageUrl}${separator}${cacheBuster}`;
  }

  return {
    title: `${post.title} | Katyaayani Astrologer`,
    description: post.excerpt,
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      siteName: "Katyaayani Astrologer",
      images: [
        {
          url: finalOgImageUrl,
          width: 800,
          height: 420,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author_name],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [finalOgImageUrl],
    },
    other: {
      // Direct meta tags that WhatsApp likes (redundant but helpful)
      'og:image:secure_url': finalOgImageUrl,
      'image': finalOgImageUrl,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("category", post.category)
    .eq("is_published", true)
    .neq("id", post.id)
    .limit(3);

  // Increment view count (safer implementation)
  try {
    // We use a separate await to ensure it completes but doesn't block rendering if it fails
    // However, since this is a server component, we want to be careful.
    // Using simple update as fallback if RPC is missing/failing
    await supabaseAdmin
      .from("blog_posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", post.id);
  } catch (err) {
    console.error('Error incrementing view count:', err);
  }

  return <BlogPostClient post={post} relatedPosts={relatedPosts || []} />;
}
