"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Eye, ArrowLeft, Share2, User, X, Check, Link as LinkIcon, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  title_gujarati?: string;
  title_hindi?: string;
  slug: string;
  content: string;
  content_gujarati?: string;
  content_hindi?: string;
  excerpt: string;
  excerpt_gujarati?: string;
  excerpt_hindi?: string;
  featured_image: string;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string;
  view_count: number;
}

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const { theme } = useTheme();
    const { language, t } = useTranslation();
    const router = useRouter();
  
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a stable language for the first render (matching the server default)
  const currentLanguage = isMounted ? language : 'en';

  const getLocale = () => {
    if (currentLanguage === 'gu') return 'gu-IN';
    if (currentLanguage === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  const formatDate = (dateStr: string) => {
    if (!isMounted) return ""; // Still avoid hydration mismatch on dates as they depend on locale
    try {
      return new Date(dateStr).toLocaleDateString(getLocale(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getPostTitle = (p: BlogPost) => {
    let title = p.title;
    if (currentLanguage === 'gu' && p.title_gujarati) title = p.title_gujarati;
    else if (currentLanguage === 'hi' && p.title_hindi) title = p.title_hindi;
    
    if (title.includes(' / ')) {
      const parts = title.split(' / ');
      if (parts.length >= 3) {
        if (currentLanguage === 'en') return parts[0];
        if (currentLanguage === 'gu') return parts[1];
        if (currentLanguage === 'hi') return parts[2];
      }
    }
    return title;
  };

  const getPostExcerpt = (p: BlogPost) => {
    let excerpt = p.excerpt;
    if (currentLanguage === 'gu' && p.excerpt_gujarati) excerpt = p.excerpt_gujarati;
    else if (currentLanguage === 'hi' && p.excerpt_hindi) excerpt = p.excerpt_hindi;

    if (excerpt && excerpt.includes(' / ')) {
      const parts = excerpt.split(' / ');
      if (parts.length >= 3) {
        if (currentLanguage === 'en') return parts[0];
        if (currentLanguage === 'gu') return parts[1];
        if (currentLanguage === 'hi') return parts[2];
      }
    }
    return excerpt;
  };

  const getPostContent = (p: BlogPost) => {
    let content = p.content;
    if (currentLanguage === 'gu' && p.content_gujarati) content = p.content_gujarati;
    else if (currentLanguage === 'hi' && p.content_hindi) content = p.content_hindi;

    if (content && content.includes(' / ')) {
      const parts = content.split(' / ');
      if (parts.length >= 3) {
        if (currentLanguage === 'en') return parts[0];
        if (currentLanguage === 'gu') return parts[1];
        if (currentLanguage === 'hi') return parts[2];
      }
    }
    return content;
  };

  const getShareUrl = () => typeof window !== 'undefined' ? window.location.href : '';
  const getShareTitle = () => getPostTitle(post);
  const getShareText = () => getPostExcerpt(post);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareTitle() + '\n\n' + getShareUrl())}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareTitle())}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareTitle())}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnEmail = () => {
    const subject = encodeURIComponent(getShareTitle());
    const body = encodeURIComponent(getShareText() + '\n\n' + getShareUrl());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-[#ff6b35] hover:bg-[#ff6b35]/10"
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Go Back")}
          </Button>

        <article className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT SIDEBAR — highlights */}
            <aside className="w-full lg:w-[450px] lg:flex-shrink-0 order-1 lg:order-1">
              <div className="lg:sticky lg:top-28 flex flex-col gap-6">

                {/* Featured Image inside sidebar */}
                {post.featured_image && (
                  <div className="w-full">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black/5 dark:bg-white/5 border border-[#ff6b35]/10">
                      <img
                        src={post.featured_image}
                        alt={getPostTitle(post)}
                        className="w-full h-auto block"
                        loading="eager"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#ff6b35] text-white text-[10px] font-bold px-3 py-1 rounded-full capitalize shadow-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights Card */}
                <div className={`rounded-2xl border p-5 flex flex-col gap-4 ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-[#fffdf9] border-[#ff6b35]/20'}`}>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">
                          {t("Author")}
                        </p>
                        <p className="text-sm font-semibold">{post.author_name}</p>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">
                          {t("Published")}
                        </p>
                        <p className="text-sm font-semibold">{formatDate(post.published_at)}</p>
                      </div>
                    </div>
  
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-[#ff6b35] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">
                          {t("Views")}
                        </p>
                        <p className="text-sm font-semibold">{post.view_count}</p>
                      </div>
                    </div>
  
                    {/* Share Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="w-full border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                        {t("Share this post")}
                      </Button>
  
                      <AnimatePresence>
                        {showShareMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              className={`absolute left-0 top-12 z-50 w-full rounded-2xl shadow-2xl border p-3 ${
                                theme === 'dark' ? 'bg-[#1a1a2e] border-gray-700' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2 px-1">
                                <span className="text-sm font-semibold">
                                  {t("Share this post")}
                                </span>
                                <button onClick={() => setShowShareMenu(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            <div className="space-y-1">
                              <button onClick={shareOnWhatsApp} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                WhatsApp
                              </button>
                              <button onClick={shareOnFacebook} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                              </button>
                              <button onClick={shareOnTwitter} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                X (Twitter)
                              </button>
                              <button onClick={shareOnTelegram} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.012-1.252-.242-1.865-.44-.751-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                Telegram
                              </button>
                              <button onClick={shareOnLinkedIn} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn
                              </button>
                              <button onClick={shareOnEmail} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5 text-[#ff6b35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                Email
                              </button>
                              <button onClick={handleCopyLink} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <LinkIcon className="w-5 h-5 text-[#ff6b35]" />}
                                  {copied
                                    ? t("Link Copied!")
                                    : t("Copy Link")
                                  }
                                </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Back to blog (desktop) */}
                <div className="hidden lg:block">
                  <Link href="/blog">
                    <Button variant="outline" className="w-full border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("More Blog Posts")}
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT — title + full article */}
            <div className="flex-1 min-w-0 order-2 lg:order-2">
                <header className="mb-10">
                  <div className="flex items-center gap-2 text-[#ff6b35] font-bold text-sm uppercase tracking-widest mb-4">
                    <span className="bg-[#ff6b35]/10 px-3 py-1 rounded-md">{post.category}</span>
                  </div>
                  
                  <h1 className="font-[family-name:var(--font-cinzel)] text-[32px] md:text-[40px] font-extrabold mb-6 leading-tight" data-no-translate>
                    {getPostTitle(post)}
                  </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35]">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{post.author_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.view_count} views</span>
                  </div>
                </div>
              </header>

                <div className={`blog-content-wrapper ${theme === 'dark' ? 'blog-dark' : 'blog-light'}`} data-no-translate>
                  <div
                    className={`premium-blog-content prose prose-lg max-w-none whitespace-pre-line ${theme === 'dark' ? 'prose-invert' : ''}`}
                    dangerouslySetInnerHTML={{ __html: getPostContent(post) }}
                  />
                </div>

              {/* Tags (Bottom) */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-widest opacity-60">
                      <Tag className="w-4 h-4" />
                      {t("Tags")}
                    </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                          theme === 'dark' ? 'bg-white/5 hover:bg-[#ff6b35] hover:text-white border border-white/10' : 'bg-gray-100 hover:bg-[#ff6b35] hover:text-white border border-gray-200'
                        }`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Posts Section */}
              {relatedPosts.length > 0 && (
                <section className="mt-20 pt-12 border-t border-border">
                  <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-8">
                    {t("Related Posts")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                        <div className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 ${
                          theme === 'dark' ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-100'
                        }`}>
                            <div className="relative overflow-hidden bg-black/5 dark:bg-white/5">
                              {rp.featured_image && (
                                <img
                                  src={rp.featured_image}
                                  alt={getPostTitle(rp)}
                                  className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                              )}
                            </div>
                          <div className="p-4">
                            <span className="text-[10px] uppercase tracking-widest text-[#ff6b35] font-bold">
                              {rp.category}
                            </span>
                            <h4 className="font-bold mt-1 line-clamp-2 leading-snug group-hover:text-[#ff6b35] transition-colors">
                              {getPostTitle(rp)}
                            </h4>
                            <div className="mt-3 flex items-center justify-between text-[10px] opacity-60">
                              <span>{formatDate(rp.published_at)}</span>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{rp.view_count}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Back to Blog (mobile) */}
              <div className="mt-12 text-center lg:hidden">
                  <Link href="/blog">
                    <Button className="bg-[#ff6b35] hover:bg-[#ff8c5e]">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("View More Blog Posts")}
                    </Button>
                  </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
