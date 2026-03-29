"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Eye, ArrowRight, Star, Sparkles } from "lucide-react";
import { 
  GiRam, GiBull, GiLovers, GiCrab, GiLion, GiFemale, 
  GiScales, GiScorpion, GiArcher, GiCrocJaws, GiAmphora, GiDoubleFish
} from "react-icons/gi";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import Image from "next/image";

const RashifalSection = dynamic(() => import("@/components/homepage/RashifalSection"), { 
  ssr: false,
  loading: () => <div className="h-[650px] w-full bg-gray-100/5" />
});

interface BlogPost {
  id: string;
  title: string;
  title_gujarati?: string;
  title_hindi?: string;
  slug: string;
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

const RASHI_DATA = [
  { english: 'aries', gujarati: 'મેષ', icon: GiRam },
  { english: 'taurus', gujarati: 'વૃષભ', icon: GiBull },
  { english: 'gemini', gujarati: 'મિથુન', icon: GiLovers },
  { english: 'cancer', gujarati: 'કર્ક', icon: GiCrab },
  { english: 'leo', gujarati: 'સિંહ', icon: GiLion },
  { english: 'virgo', gujarati: 'કન્યા', icon: GiFemale },
  { english: 'libra', gujarati: 'તુલા', icon: GiScales },
  { english: 'scorpio', gujarati: 'વૃશ્ચિક', icon: GiScorpion },
  { english: 'sagittarius', gujarati: 'ધન', icon: GiArcher },
  { english: 'capricorn', gujarati: 'મકર', icon: GiCrocJaws },
  { english: 'aquarius', gujarati: 'કુંભ', icon: GiAmphora },
  { english: 'pisces', gujarati: 'મીન', icon: GiDoubleFish },
];

interface BlogIndexClientProps {
  initialPosts: BlogPost[];
}

export default function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const { theme } = useTheme();
  const { language, t } = useTranslation();
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a stable language for the first render
  const currentLanguage = isMounted ? language : 'en';

  const getLocale = () => {
    if (currentLanguage === 'gu') return 'gu-IN';
    if (currentLanguage === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  const formatDate = (dateStr: string) => {
    if (!isMounted) return "";
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

  const getPostTitle = (post: BlogPost) => {
    let title = post.title;
    if (currentLanguage === 'gu' && post.title_gujarati) title = post.title_gujarati;
    else if (currentLanguage === 'hi' && post.title_hindi) title = post.title_hindi;
    
    // Fallback: If title contains " / ", it might be a combined string (EN / GU / HI)
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

  const getPostExcerpt = (post: BlogPost) => {
    let excerpt = post.excerpt;
    if (currentLanguage === 'gu' && post.excerpt_gujarati) excerpt = post.excerpt_gujarati;
    else if (currentLanguage === 'hi' && post.excerpt_hindi) excerpt = post.excerpt_hindi;

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

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold text-gradient-ancient mb-4">
            {t("Blog")}
          </h1>
          <p className={`text-base md:text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {t("Daily Horoscope, Hindu Calendar and Astrology Knowledge")}
          </p>
        </div>

          {/* Two-column layout: Left = posts, Right = banners+highlights */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* RIGHT — Highlight Banners (rendered after posts in DOM but shown right via order) */}
            <aside className="lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-5 lg:order-2">

            {/* Daily Horoscope Banner */}
            <Link href="/rashifal">
              <div className={`overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl p-5 rounded-2xl ${
                theme === 'dark' ? 'bg-gradient-to-br from-[#12121a] to-[#1a1a24]' : 'bg-gradient-to-br from-orange-50 to-purple-50'
              } border-none shadow-lg`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                    <Star className="w-4 h-4 text-[#ff6b35]" />
                  </div>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold">
                      {t("Daily Horoscope")}
                    </h2>
                  </div>
                  <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t("Know your zodiac fortune for today")}
                  </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {RASHI_DATA.slice(0, 6).map((rashi) => (
                      <div
                        key={rashi.english}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'} border ${theme === 'dark' ? 'border-[#0a0a0f]' : 'border-white'}`}
                      >
                        <rashi.icon className="w-3.5 h-3.5 text-[#ff6b35]" />
                      </div>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#ff6b35]" />
                </div>
              </div>
            </Link>

            {/* Weekly Horoscope Banner */}
            <Link href="/rashifal?tab=weekly">
              <div className={`overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl p-5 rounded-2xl ${
                theme === 'dark' ? 'bg-gradient-to-br from-[#1a1224] to-[#12121a]' : 'bg-gradient-to-br from-purple-50 to-orange-50'
              } border-none shadow-lg`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </div>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold">
                      {t("Weekly Horoscope")}
                    </h2>
                  </div>
                  <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t("Know your zodiac fortune for this week")}
                  </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {RASHI_DATA.slice(6, 12).map((rashi) => (
                      <div
                        key={rashi.english}
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'} border ${theme === 'dark' ? 'border-[#0a0a0f]' : 'border-white'}`}
                      >
                        <rashi.icon className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-500" />
                </div>
              </div>
            </Link>

            {/* Hindu Calendar Banner */}
            <Link href="/hindu-calendar">
              <div className={`overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl p-5 rounded-2xl ${
                theme === 'dark' ? 'bg-gradient-to-br from-[#1a1a24] to-[#12121a]' : 'bg-gradient-to-br from-yellow-50 to-orange-50'
              } border-none shadow-lg`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                    <Calendar className="w-4 h-4 text-yellow-500" />
                  </div>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-base font-bold">
                      {t("Hindu Calendar")}
                    </h2>
                  </div>
                  <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t("Know festivals, fasts, tithis and important days")}
                  </p>
                <div className="flex items-center justify-end">
                  <ArrowRight className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </Link>


            {/* Recent post images preview */}
            {posts.length > 0 && (

              <div className={`rounded-2xl border p-4 ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/15 shadow-sm'}`}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-[#ff6b35]' : 'text-[#cc4400]'}`}>
                    {t("Recent Posts")}
                  </p>
                <div className="flex flex-col gap-3">
                  {posts.slice(0, 4).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-3 group">
                        {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={getPostTitle(post)}
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-xl object-contain flex-shrink-0 bg-black/5 dark:bg-white/5"
                            />
                        ) : (
                        <div className={`w-14 h-14 rounded-xl flex-shrink-0 ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-orange-50'}`} />
                      )}
                        <p className={`text-xs font-medium line-clamp-2 group-hover:text-[#ff6b35] transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-[#4a3f35]'}`} data-no-translate>
                          {getPostTitle(post)}
                        </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

            {/* LEFT — Blog Posts */}
            <div className="flex-1 min-w-0 lg:order-1">
            {posts.length === 0 ? (

                <div className="text-center py-20">
                  <p className="text-xl text-gray-500">
                    {t("No blog posts found")}
                  </p>
                  <p className="text-gray-400 mt-2">
                    {t("New articles will be added soon")}
                  </p>
                </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col divide-y"
                style={{ borderColor: theme === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(0,0,0,0.07)' }}
              >
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block py-7 first:pt-0">
                    <article className="flex flex-col sm:flex-row gap-5">

                      {/* Thumbnail */}
                      {post.featured_image ? (
                        <div className="sm:w-44 md:w-52 flex-shrink-0 rounded-xl overflow-hidden relative bg-black/5 dark:bg-white/5" style={{ minHeight: '120px' }}>
                          <img
                            src={post.featured_image}
                            alt={getPostTitle(post)}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className={`sm:w-44 md:w-52 flex-shrink-0 rounded-xl ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-orange-50'}`} style={{ minHeight: '120px' }} />
                      )}

                      {/* Text */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className={`font-[family-name:var(--font-cinzel)] font-bold text-xl leading-snug mb-2 group-hover:text-[#ff6b35] transition-colors ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d2318]'}`} data-no-translate>
                              {getPostTitle(post)}
                            </h3>
                            {getPostExcerpt(post) && (
                              <p className={`text-sm leading-relaxed mb-3 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} data-no-translate>
                                {getPostExcerpt(post)}
                              </p>
                            )}
                          </div>
                        <div className={`flex items-center gap-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#ff6b35]/10 text-[#ff6b35]">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.view_count || 0}
                          </div>
                        </div>
                      </div>

                    </article>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </main>

      <RashifalSection />
      <Footer />
    </div>
  );
}
