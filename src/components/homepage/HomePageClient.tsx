"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import { 
  Star, 
  Moon, 
  Sun, 
  Sparkles, 
  House, 
  Video, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Newspaper, 
  Bell, 
  ArrowRight, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import { useOffer } from "@/hooks/useOffer";

// Updated at 2026-03-03-T22:55
const Footer = dynamic(() => import("@/components/homepage/Footer"), { 
  ssr: true,
  loading: () => <div className="h-[600px] w-full bg-gray-100/5" />
});
const CosmicInsights = dynamic(() => import("@/components/homepage/CosmicInsights"), { 
  ssr: true,
  loading: () => <div className="h-[950px] w-full bg-gray-100/5" />
});
const StarField = dynamic(() => import("@/components/homepage/StarField"), { 
  ssr: true 
});
const RashifalSection = dynamic(() => import("@/components/homepage/RashifalSection"), { 
  ssr: true,
  loading: () => <div className="h-[650px] w-full bg-gray-100/5" />
});
const ZodiacSignForm = dynamic(() => import("@/components/homepage/ZodiacSignForm"), { 
  ssr: true,
  loading: () => <div className="h-[800px] w-full bg-gray-100/5" />
});
const AstrologerTip = dynamic(() => import("@/components/homepage/AstrologerTip"), { 
  ssr: true,
  loading: () => <div className="h-[350px] w-full bg-gray-100/5" />
});
  const ChandraGrahanBanner = dynamic(() => import("@/components/homepage/ChandraGrahanBanner"), { 
    ssr: true,
    loading: () => <div className="h-[164px] w-full bg-gray-100/5 mt-20" />
  });

import { testimonialsData, contentData } from "@/data/homepage";
import "@/styles/homepage.css";

interface LatestPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  created_at: string;
}

interface HomePageClientProps {
  initialLatestPosts: LatestPost[];
  hasTodayPosts?: boolean;
  actualLatestPost?: LatestPost | null;
}

// Updated at 2026-03-04-T10:15 - New blog notification & HMR fix
export default function HomePageClient({ initialLatestPosts, hasTodayPosts, actualLatestPost }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { language } = useTranslation();
  const { user, showAuthModal, showEnquiryModal } = useAuth();
  const [panchangTimes, setPanchangTimes] = useState({ sunrise: "--", sunset: "--" });
  const [panchangApiData, setPanchangApiData] = useState<any>(null);
  const [hinduCalendar, setHinduCalendar] = useState({ month: "--", tithi: "--", vaara: "--", paksha: "--" });
  const [dbReviews, setDbReviews] = useState<{ name: string; text: string; rating: number; date?: string; badge?: string }[]>([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: "5.0", totalCount: 0 });
  const [latestPosts, setLatestPosts] = useState<LatestPost[]>(initialLatestPosts);
  const [newBlogBanner, setNewBlogBanner] = useState<{ show: boolean, post: LatestPost | null }>({ show: false, post: null });
  const { offer, isOfferValid } = useOffer();

  useEffect(() => {
    setMounted(true);
    
    // Check for "New Blog" notification (posted within last 24 hours)
    if (actualLatestPost) {
      const postDate = new Date(actualLatestPost.created_at);
      const now = new Date();
      const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours >= 0 && diffInHours <= 24) {
        setNewBlogBanner({ show: true, post: actualLatestPost });
      }
    }

    // Fetch reviews
    fetch('/api/reviews')
        .then(r => r.json())
        .then(json => {
          if (json.success && Array.isArray(json.reviews)) {
            const allReviews = json.reviews;
            
            // Stats
            if (allReviews.length > 0) {
              const avg = (allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length).toFixed(1);
              setReviewStats({ avgRating: avg, totalCount: allReviews.length });
            }

            // Featured reviews (max 5)
            const featured = allReviews.filter((r: any) => r.is_featured).slice(0, 5);
            setDbReviews(featured.map((f: any) => ({ 
              name: f.name, 
              text: f.message, 
              rating: f.rating,
              date: new Date(f.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
              badge: "Verified"
            })));
          }
        })
        .catch(() => {});

      // Removed auto-fetch fallback to satisfy "only show blogs on their specific date" requirement
      /*
      if (initialLatestPosts.length === 0) {
        fetch('/api/blog?limit=3&published=true')
          .then(r => r.json())
          .then(json => {
            if (json.success && Array.isArray(json.data)) {
              setLatestPosts(json.data.slice(0, 3));
            }
          })
          .catch(() => {});
      }
      */
    
    let lastFetchDate = '';

    const fetchPanchangData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api/panchang?t=${today}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          lastFetchDate = today;
          setPanchangApiData(data.data);
          const to12h = (time24: string) => {
            const [hStr, mStr] = time24.split(':');
            let h = parseInt(hStr);
            const period = h >= 12 ? 'PM' : 'AM';
            if (h > 12) h -= 12;
            if (h === 0) h = 12;
            return `${h}:${mStr} ${period}`;
          };
          setPanchangTimes({
            sunrise: to12h(data.data.sunrise),
            sunset: to12h(data.data.sunset)
          });
          const getLang = (item: { english: string; hindi: string; gujarati: string }) => {
            if (language === 'gu') return item.gujarati;
            if (language === 'hi') return item.hindi;
            return item.english;
          };
          setHinduCalendar({
            month: getLang(data.data.hinduMonth),
            tithi: getLang(data.data.tithi),
            vaara: getLang(data.data.vaara),
            paksha: getLang(data.data.paksha),
          });
        }
      } catch (err) {
        console.error("Error fetching panchang:", err);
      }
    };
    fetchPanchangData();

    const intervalId = setInterval(() => {
      const now = new Date().toISOString().split('T')[0];
      if (now !== lastFetchDate) {
        fetchPanchangData();
      }
    }, 60 * 1000);
    const refreshId = setInterval(fetchPanchangData, 30 * 60 * 1000);
    return () => { clearInterval(intervalId); clearInterval(refreshId); };
  }, [language, initialLatestPosts.length]);

  // Chandra Grahan 2026 — schedule email blast 1 hour after page first load
  useEffect(() => {
    const GRAHAN_KEY = 'grahan_email_sent_2026_03_03';
    if (sessionStorage.getItem(GRAHAN_KEY)) return;
    sessionStorage.setItem(GRAHAN_KEY, 'scheduled');
    const timer = setTimeout(() => {
      fetch('/api/grahan/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
        .then(() => sessionStorage.setItem(GRAHAN_KEY, 'sent'))
        .catch(() => {});
    }, 60 * 60 * 1000); // 1 hour
    return () => clearTimeout(timer);
  }, []);

  const content = contentData[language];
  const staticTestimonials = testimonialsData[language];
  // Use DB featured reviews, if less than 5, fallback to static ones to fill up to 5
  const testimonials = dbReviews.length > 0 
    ? [...dbReviews, ...staticTestimonials].slice(0, 5) 
    : staticTestimonials;

  const handleBookClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showAuthModal('signin');
    }
  };

  if (!mounted) return null;

    return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar hasNotification={newBlogBanner.show} />

      <div className="mt-20 relative z-40 shadow-sm shadow-[#ff6b35]/5">
        <ChandraGrahanBanner />
      </div>

      {/* Floating New Blog Notification (Premium Glass Toast) */}
      {newBlogBanner.show && newBlogBanner.post && (
        <div 
          id="new-blog-banner"
          className="fixed bottom-8 right-8 z-[100] max-w-[360px] w-full animate-in slide-in-from-bottom-10 fade-in duration-700 ease-out p-1"
        >
          <div className={`relative overflow-hidden shadow-[0_20px_50px_rgba(255,107,53,0.15)] rounded-[2.5rem] transition-all duration-500 border-2 ${
            theme === 'dark' 
              ? 'bg-[#1a1a2e]/90 border-[#ff6b35]/40 backdrop-blur-xl' 
              : 'bg-white/90 border-[#ff6b35]/30 backdrop-blur-xl'
          }`}>
            {/* Elegant Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff8c5e]/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative p-6">
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  theme === 'dark' ? 'bg-[#ff6b35]/20 shadow-[#ff6b35]/10' : 'bg-[#ff6b35]/10 shadow-[#ff6b35]/5'
                }`}>
                  <Bell className="w-7 h-7 text-[#ff6b35] animate-bounce-slow" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] ${
                      theme === 'dark' ? 'bg-[#ff6b35]/20 text-[#ff8c5e]' : 'bg-[#ff6b35]/10 text-[#ff6b35]'
                    }`}>
                      {language === 'gu' ? 'નવો લેખ' : language === 'hi' ? 'नया लेख' : 'NEW ARTICLE'}
                    </span>
                    <button 
                      onClick={() => setNewBlogBanner({ show: false, post: null })}
                      className={`p-2 rounded-xl transition-all hover:bg-[#ff6b35]/10 ${
                        theme === 'dark' ? 'text-white/40 hover:text-[#ff6b35]' : 'text-black/40 hover:text-[#ff6b35]'
                      }`}
                      aria-label="Close notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className={`text-[16px] font-extrabold leading-tight line-clamp-2 mb-5 font-[family-name:var(--font-cinzel)] ${
                    theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'
                  }`}>
                    {newBlogBanner.post.title}
                  </h3>
                  
                  <Link 
                    href={`/blog/${newBlogBanner.post.slug}`}
                    className="group/btn relative flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#ff6b35] text-white text-[13px] font-black uppercase tracking-[0.15em] transition-all hover:bg-[#ff8c5e] active:scale-[0.97] shadow-[0_10px_25px_rgba(255,107,53,0.3)] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {language === 'gu' ? 'હમણાં વાંચો' : language === 'hi' ? 'अभी पढ़ें' : 'Read Now'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-24">

        <StarField />
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#2d1b4e]/30 via-transparent to-[#0a0a0f]'
            : 'bg-gradient-to-b from-[#ffecd9]/20 via-transparent to-[#fdfbf7]'
        }`} />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="fade-in-up">
            <div className="flex justify-center gap-4 mb-6">
              <Sun className="w-12 h-12 text-[#ff6b35]" />
              <Moon className="w-12 h-12 text-[#ffa07a]" />
              <Star className="w-12 h-12 text-[#ff6b35]" />
            </div>
            <h2 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient-ancient">
              {content.heroTitle}
            </h2>
            <p className={`text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
              {content.heroDesc}
            </p>

            <div className={`inline-flex items-center gap-6 px-6 py-3 rounded-2xl border mb-10 min-h-[66px] ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/20'
            }`}>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-[#ff6b35]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'સૂર્યોદય' : language === 'hi' ? 'सूर्योदय' : 'SUNRISE'}
                  </p>
                  <p className="text-sm font-bold min-w-[80px]">{panchangTimes.sunrise}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-[#ff6b35]/20" />
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#ffa07a]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'સૂર્યાસ્ત' : language === 'hi' ? 'सूर्યાસ્ત' : 'SUNSET'}
                  </p>
                  <p className="text-sm font-bold min-w-[80px]">{panchangTimes.sunset}</p>
                </div>
              </div>
            </div>

            <div className={`inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-2xl border mb-10 min-h-[66px] ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/20'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ff6b35]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'હિંદુ માસ' : language === 'hi' ? 'हिंदू मास' : 'HINDU MONTH'}
                  </p>
                  <p className="text-sm font-bold min-w-[70px]">{hinduCalendar.month}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-[#ff6b35]/20" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#ffa07a]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'તિથિ' : language === 'hi' ? 'तिथि' : 'TITHI'}
                  </p>
                  <p className="text-sm font-bold min-w-[70px]">{hinduCalendar.tithi}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-[#ff6b35]/20" />
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#ff6b35]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'પક્ષ' : language === 'hi' ? 'पक्ष' : 'PAKSHA'}
                  </p>
                  <p className="text-sm font-bold min-w-[70px]">{hinduCalendar.paksha}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-[#ff6b35]/20" />
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#ffa07a]" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                    {language === 'gu' ? 'વાર' : language === 'hi' ? 'वार' : 'DAY'}
                  </p>
                  <p className="text-sm font-bold min-w-[70px]">{hinduCalendar.vaara}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={(e) => {
                    if (!user) {
                      showAuthModal('signin');
                    } else {
                      window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                    }
                  }}
                  size="lg" 
                  className="cursor-pointer bg-[#ff6b35] hover:bg-[#ff8c5e] hover:no-underline text-white font-semibold text-lg px-6 py-5 w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {content.beginJourney}
                </Button>
              <Button 
                onClick={() => showEnquiryModal()}
                size="lg" 
                variant="outline"
                className="cursor-pointer border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 hover:no-underline text-lg px-6 py-5 w-full sm:w-auto"
              >
                Enquire Now
              </Button>
              {!user && (
                <Button 
                  onClick={() => showAuthModal('signin')}
                  size="lg" 
                  variant="ghost" 
                  className="cursor-pointer text-[#ff6b35] hover:bg-[#ff6b35]/10 hover:no-underline text-lg px-6 py-5 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-hint">
          <span>Scroll</span>
          <div className="chevrons">
            <ChevronDown />
            <ChevronDown />
            </div>
          </div>
        </section>

        {/* Trust Signals Bar */}
        <section className={`py-12 border-y ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/10'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-[#ff6b35] text-3xl md:text-4xl font-bold font-[family-name:var(--font-cinzel)] mb-1">17+</p>
                <p className={`text-sm uppercase tracking-widest font-semibold ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                  {language === 'gu' ? 'વર્ષોનો અનુભવ' : language === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[#ff6b35] text-3xl md:text-4xl font-bold font-[family-name:var(--font-cinzel)] mb-1">10k+</p>
                <p className={`text-sm uppercase tracking-widest font-semibold ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                  {language === 'gu' ? 'પરામર્શ' : language === 'hi' ? 'परामर्श' : 'Consultations'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[#ff6b35] text-3xl md:text-4xl font-bold font-[family-name:var(--font-cinzel)] mb-1">{reviewStats.avgRating}/5</p>
                <div className="flex justify-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(reviewStats.avgRating)) ? 'fill-[#ff6b35] text-[#ff6b35]' : 'text-gray-300'}`} />)}
                </div>
                <p className={`text-sm uppercase tracking-widest font-semibold ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                  {language === 'gu' ? 'રેટિંગ' : language === 'hi' ? 'रेटिंग' : 'Average Rating'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile & Tablet Only Sign-in Section */}
      <section className={`lg:hidden py-6 px-4 flex justify-center ${user ? 'hidden' : 'block'}`}>
        <div className={`fade-in-up max-w-sm w-full p-5 rounded-2xl text-center relative overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#1a1a2e] border border-[#ff6b35]/20 shadow-lg shadow-[#ff6b35]/10' 
            : 'bg-[#fffdf9] border border-[#ff6b35]/30 shadow-lg shadow-[#ff6b35]/10'
        }`}>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#ff6b35]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#ff8c5e]/10 rounded-full blur-3xl" />
          

          <Sparkles className="w-7 h-7 text-[#ff6b35] mx-auto mb-3" />

          <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold mb-2 text-gradient-ancient">
            Unlock Your Destiny
          </h3>
          <p className={`mb-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
            Sign in for personalized horoscopes and premium cosmic insights.
          </p>
          <Button
            onClick={() => showAuthModal('signin')}
            className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold py-5 rounded-xl text-base shadow-md shadow-[#ff6b35]/20 active:scale-95 transition-all"
          >
            Sign In Now
          </Button>
          </div>
        </section>
  
        <ZodiacSignForm />
        <RashifalSection />
  
        <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-gradient-to-b from-[#0a0a0f] to-[#12121a]' : 'bg-gradient-to-b from-[#fdfbf7] to-[#f8f4ee]'}`}>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center gap-2 mb-6">
                <Sun className="w-8 h-8 text-[#ff6b35]" />
                <Star className="w-8 h-8 text-[#ff8c5e]" />
                <Moon className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h2 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
                {content.servicesTitle}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                {content.servicesDesc}
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <Card 
                onClick={() => showEnquiryModal()}
                className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-[#fffdf9] border-[#ff6b35]/30'} hover:border-[#ff6b35]/50 transition-all duration-300 h-full group cursor-pointer`}
              >
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#ff6b35]/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff6b35]/20 transition-colors">
                      <House className="w-8 h-8 text-[#ff6b35]" />
                    </div>
                  <h3 className={`font-[family-name:var(--font-cinzel)] text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                    {content.homeConsultation}
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                    {content.homeConsultationDesc}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Link href="/online-consulting" className="block h-full no-underline">
                <Card 
                  className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-[#fffdf9] border-[#ff6b35]/30'} hover:border-[#ff6b35]/50 transition-all duration-300 h-full group cursor-pointer relative overflow-hidden`}
                >
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                      {language === 'gu' ? 'વિશ્વભરમાં' : language === 'hi' ? 'विश्वव्यापी' : 'Worldwide'}
                    </span>
                  </div>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#ff6b35]/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff6b35]/20 transition-colors">
                      <Video className="w-8 h-8 text-[#ff6b35]" />
                    </div>
                    <h3 className={`font-[family-name:var(--font-cinzel)] text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                      {content.onlineMeeting}
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                      {content.onlineMeetingDesc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="cursor-pointer border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 text-xl px-8 py-6">
              <Link href="/services" className="no-underline">
                {content.viewAllServices}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 scroll-hint mx-auto">
            <span>Scroll</span>
            <div className="chevrons">
              <ChevronDown />
              <ChevronDown />
            </div>
          </div>
        </div>
      </section>

      <CosmicInsights panchangApiData={panchangApiData} />
  
      <AstrologerTip />
      
      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#fdfbf7]'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-2 mb-4">
                <Newspaper className="w-8 h-8 text-[#ff6b35]" />
              </div>
                <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-3 text-gradient-ancient">
                  {hasTodayPosts 
                    ? (language === 'gu' ? 'આજના ખાસ લેખ' : language === 'hi' ? 'आज के विशेष लेख' : "Today's Special Insights")
                    : (language === 'gu' ? 'તાજા લેખ' : language === 'hi' ? 'ताज़े लेख' : 'Latest from the Blog')}
                </h2>
                <p className={`text-lg ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                  {hasTodayPosts
                    ? (language === 'gu' ? 'આજના દિવસ માટે વિશેષ જ્યોતિષ માર્ગદર્શન' : language === 'hi' ? 'आज के दिन के लिए विशेष ज्योतिष मार्गदर्शन' : "Special astrological guidance for today")
                    : (language === 'gu' ? 'જ્યોતિષ, ધર્મ અને આધ્યાત્મિકતા પર નવા લેખ' : language === 'hi' ? 'ज्योतिष, धर्म और आध्यात्मिकता पर नए लेख' : 'Fresh insights on astrology, dharma & spirituality')}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="no-underline group">
                  <Card className={`overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#ff6b35]/10 group-hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-[#fffdf9] border-[#ff6b35]/20'}`}>
                      {post.featured_image && (
                        <div className="relative h-48 overflow-hidden bg-black/5 dark:bg-white/5">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-[#ff8c5e]' : 'text-[#ff6b35]'}`}>
                            {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                            {new Date(post.created_at).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] && (
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                                {language === 'gu' ? 'નવું' : language === 'hi' ? 'नया' : 'NEW'}
                              </span>
                            )}
                        </div>
                        <h3 className={`font-[family-name:var(--font-cinzel)] font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#ff6b35] transition-colors ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                          {post.title}
                        </h3>
                      {post.excerpt && (
                        <p className={`text-sm line-clamp-2 ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-3">
                        <span className="text-[#ff6b35] text-xs font-semibold">
                          {language === 'gu' ? 'વધુ વાંચો' : language === 'hi' ? 'पढ़ते रहें' : 'Read more'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-[#ff6b35] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="cursor-pointer border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 text-lg px-8 py-5">
                <Link href="/blog" className="no-underline">
                  {language === 'gu' ? 'બધા લેખ જુઓ' : language === 'hi' ? 'सभी लेख देखें' : 'View All Posts'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-[#fffdf9]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {content.testimonialsTitle}
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>{content.testimonialsDesc}</p>
            {/* Review count badge */}
              <div className="flex flex-col items-center mt-4 gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${theme === 'dark' ? 'bg-[#ff6b35]/10 border-[#ff6b35]/30 text-[#ff8c5e]' : 'bg-[#ff6b35]/10 border-[#ff6b35]/30 text-[#ff6b35]'}`}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {language === 'gu' ? `${reviewStats.avgRating} રેટિંગ (${reviewStats.totalCount} સમીક્ષાઓ)` : language === 'hi' ? `${reviewStats.avgRating} रेटिंग (${reviewStats.totalCount} समीक्षाएं)` : `${reviewStats.avgRating} Rating (${reviewStats.totalCount} Reviews)`}
                    </span>
                  <a 
                    href="https://search.google.com/local/reviews?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" width={37} height={12} className="h-3 object-contain" />
                  <span>{language === 'gu' ? 'ગૂગલ પર જુઓ' : language === 'hi' ? 'गूगल पर देखें' : 'View on Google'}</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
          </div>

          {/* First 3 reviews always visible */}
            <div className="grid md:grid-cols-3 gap-8 mb-4">
              {testimonials.slice(0, 3).map((testimonial) => (
                <div key={testimonial.name}>
                    <Card className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-[#f8f4ee] border-[#ff6b35]/30'} h-full relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="G" width={37} height={12} className="h-3" />
                      </div>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`font-[family-name:var(--font-cinzel)] font-semibold text-sm ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                              {testimonial.name}
                            </p>
                            {(testimonial as any).badge && (
                              <span className="text-[8px] bg-[#4285F4]/10 text-[#4285F4] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                {(testimonial as any).badge}
                              </span>
                            )}
                          </div>
                          {(testimonial as any).date && (
                            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-0.5">{(testimonial as any).date}</p>
                          )}
                        </div>
                      </div>
                      <p className={`italic text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>&ldquo;{testimonial.text}&rdquo;</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

          {/* Remaining reviews - blurred preview row + link to /reviews */}
          <div className="relative">
            {/* Blurred preview of next 3 */}
            <div className="grid md:grid-cols-3 gap-8 blur-[1px] pointer-events-none select-none">
              {testimonials.slice(3, 6).map((testimonial) => (
                <div key={testimonial.name}>
                  <Card className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20 shadow-lg shadow-[#ff6b35]/5' : 'bg-[#f8f4ee] border-[#ff6b35]/30'} h-full relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="G" className="h-3" />
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`font-[family-name:var(--font-cinzel)] font-semibold text-sm ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                              {testimonial.name}
                            </p>
                            {(testimonial as any).badge && (
                              <span className="text-[8px] bg-[#4285F4]/10 text-[#4285F4] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                {(testimonial as any).badge}
                              </span>
                            )}
                          </div>
                          {(testimonial as any).date && (
                            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-0.5">{(testimonial as any).date}</p>
                          )}
                        </div>
                      </div>
                      <p className={`italic text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>&ldquo;{testimonial.text}&rdquo;</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            {/* Gradient overlay + Link button */}
            <div className={`absolute inset-0 flex flex-col items-center justify-end pb-4 ${theme === 'dark' ? 'bg-gradient-to-t from-[#12121a] via-[#12121a]/80 to-transparent' : 'bg-gradient-to-t from-[#fffdf9] via-[#fffdf9]/80 to-transparent'}`}>
              <Link href="/reviews" className="no-underline hover:no-underline">
                <Button
                  size="lg"
                  className="cursor-pointer bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-semibold px-8 py-5 shadow-lg shadow-[#ff6b35]/20"
                >
                  <Star className="w-4 h-4 mr-2 fill-white" />
                    {language === 'gu' ? 'બધી સમીક્ષાઓ વાંચો' : language === 'hi' ? 'सभी समीक्षाएं पढ़ें' : 'Read All Reviews'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 scroll-hint mx-auto">
            <span>Scroll</span>
            <div className="chevrons">
              <ChevronDown />
              <ChevronDown />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
