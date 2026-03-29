import { supabaseAdmin } from "@/lib/supabase";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Katyaayani Astrologer",
  description: "Read latest insights on astrology, dharma, and spirituality from Katyaayani Astrologer. Daily Rashifal, Hindu Panchang, and Vedic knowledge.",
};

export default async function BlogPage() {
    const { data: posts } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return <BlogIndexClient initialPosts={posts || []} />;
}
