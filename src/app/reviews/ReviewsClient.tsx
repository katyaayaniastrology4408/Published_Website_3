"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Moon, Sun, Sparkles, ChevronRight, 
  MessageSquare, User, Calendar, Filter, 
  ChevronLeft, ArrowRight, Quote
} from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsData } from "@/data/homepage";

function StarField() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ReviewsClient() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [dbReviews, setDbReviews] = useState<{ name: string; text: string; rating: number; created_at?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number>(0); // 0 means all
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 9;

  useEffect(() => {
    setMounted(true);
    fetch('/api/feedback?minRating=1')
      .then(r => r.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setDbReviews(json.data.map((f: any) => ({ 
            name: f.name, 
            text: f.comment, 
            rating: f.rating,
            created_at: f.created_at 
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  const staticReviews = (testimonialsData as any)[language] || testimonialsData.en;
  const allReviews = [...dbReviews, ...staticReviews];
  
  const filteredReviews = filter === 0 
    ? allReviews 
    : allReviews.filter(r => r.rating === filter);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const t = (en: string, hi: string, gu: string) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-20">
        <StarField />
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#2d1b4e]/30 via-transparent to-[#0a0a0f]'
            : 'bg-gradient-to-b from-[#ffecd9]/20 via-transparent to-[#fdfbf7]'
        }`} />

        <div className="relative z-10 text-center px-6 max-w-4xl mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-2 mb-6">
              <Sun className="w-8 h-8 text-[#ff6b35]" />
              <Star className="w-8 h-8 text-[#ff8c5e]" />
              <Moon className="w-8 h-8 text-[#ff6b35]" />
            </div>
            
            {/* Breadcrumbs */}
            <nav className="flex justify-center items-center gap-2 mb-4 text-sm font-medium opacity-60">
              <Link href="/" className="hover:text-[#ff6b35] transition-colors">{t('Home', 'होम', 'હોમ')}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#ff6b35]">{t('Reviews', 'समीक्षाएं', 'સમીક્ષાઓ')}</span>
            </nav>

            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-bold mb-6 text-gradient-ancient">
              {t('Divine Testimonials', 'दिव्य प्रशंसापत्र', 'દિવ્ય પ્રશંસાપત્રો')}
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
              {t(
                'Read how the cosmic guidance has helped souls navigate their life path and find spiritual clarity.',
                'पढ़ें कि कैसे लौકિક मार्गदर्शन ने आत्माओं को उनके जीवन पथ पर चलने और आध्यात्मिक स्पष्टता खोजने में मदद की है।',
                'વાંચો કે કેવી રીતે કોસ્મિક માર્ગદર્શને આત્માઓને તેમના જીવન પથ પર નેવિગેટ કરવામાં અને આધ્યાત્મિક સ્પષ્ટતા શોધવામાં મદદ કરી છે.'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 p-6 rounded-2xl border border-[#ff6b35]/20 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-[#ff6b35]" />
              <span className="font-semibold">{t('Filter by Rating:', 'रेटિંગ द्वारा फ़िल्ટર करें:', 'રેટિંગ દ્વારા ફિલ્ટર કરો:') }</span>
              <div className="flex flex-wrap gap-2">
                {[0, 5, 4, 3].map((r) => (
                  <Button
                    key={r}
                    variant={filter === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setFilter(r); setCurrentPage(1); }}
                    className={`rounded-full px-4 ${filter === r ? 'bg-[#ff6b35] hover:bg-[#ff8c5e]' : 'border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10'}`}
                  >
                    {r === 0 ? t('All', 'सभी', 'બધા') : `${r} ★`}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm opacity-60 font-medium">
              {t('Showing', 'दिखा रहे हैं', 'દર્શાવે છે')} {filteredReviews.length} {t('testimonials', 'प्रशंसापत्र', 'પ્રશંસાપત્રો')}
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200/10 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {paginatedReviews.map((review, index) => (
                    <motion.div
                      key={`${review.name}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'} h-full hover:shadow-xl hover:shadow-[#ff6b35]/10 transition-all group overflow-hidden relative`}>
                        <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Quote className="w-24 h-24 rotate-12" />
                        </div>
                        <CardContent className="p-8 flex flex-col h-full relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                                <div className="flex items-center gap-1.5 opacity-60">
                                  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="G" width={37} height={12} className="h-3" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('Google', 'गूगल', 'ગૂગલ')}</span>
                                </div>
                            </div>
                            
                            <p className={`italic mb-6 flex-grow leading-relaxed ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
                              &ldquo;{review.text}&rdquo;
                            </p>
  
                            <div className="flex items-center gap-3 pt-6 border-t border-[#ff6b35]/10">
                              <div className="w-10 h-10 rounded-full bg-[#ff6b35]/10 flex items-center justify-center overflow-hidden border border-[#ff6b35]/20">
                                <User className="w-5 h-5 text-[#ff6b35]" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`font-[family-name:var(--font-cinzel)] font-bold text-sm ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                                    {review.name}
                                  </p>
                                  {(review as any).badge && (
                                    <span className="text-[8px] bg-[#4285F4]/10 text-[#4285F4] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                      {(review as any).badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {(review as any).date || (review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent')}
                                </p>
                              </div>
                            </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t('Previous', 'पिछला', 'અગાઉનું')}
                  </Button>
                  <span className="font-bold">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                  >
                    {t('Next', 'अगला', 'આગળ')}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && filteredReviews.length === 0 && (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-[#ff6b35]/30">
              <MessageSquare className="w-16 h-16 text-[#ff6b35] mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">{t('No reviews found', 'कोई समीक्षा नहीं मिली', 'કોઈ સમીક્ષા મળી નથી')}</h3>
              <p className="opacity-60">{t('Try changing your rating filter.', 'अपनी रेटिंग फ़िल्टर बदलने का प्रयास करें।', 'તમારા રેટિંગ ફિલ્ટર બદલવાનો પ્રયાસ કરો.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#ff6b35]/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6b35]/20 to-transparent" />
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-[#ff6b35] mx-auto mb-6" />
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-6 text-gradient-ancient">
            {t('Share Your Experience', 'अपना अनुभव साझा करें', 'તમારો અનુભવ શેર કરો')}
          </h2>
          <p className={`text-xl mb-10 ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
            {t(
              'Your feedback helps us serve the community better. Share your divine journey with us.',
              'आपकी प्रतिक्रिया हमें समुदाय की बेहतर सेवा करने में मदद करती है। अपनी दिव्य यात्रा हमारे साथ साझा करें।',
              'તમારો પ્રતિસાદ અમને સમુદાયની વધુ સારી સેવા કરવામાં મદદ કરે છે. તમારી દિવ્ય યાત્રા અમારી સાથે શેર કરો.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback">
              <Button size="lg" className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-8 py-6 text-lg w-full sm:w-auto">
                {t('Share Your Experience', 'अपना अनुभव साझा करें', 'તમારો અનુભવ શેર કરો')}
                <MessageSquare className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 px-8 py-6 text-lg w-full sm:w-auto">
                {t('Book Your Reading', 'अपनी रीडिंग बुक करें', 'તમારું વાંચન બુક કરો')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

        <section className={`py-20 px-6 border-t ${theme === 'dark' ? 'border-white/5 bg-[#0d0d12]' : 'border-black/5 bg-white'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" width={85} height={28} className="h-7 object-contain" />
                  <div className="h-6 w-px bg-gray-300 mx-2" />
                  <span className="text-2xl font-bold font-[family-name:var(--font-cinzel)] tracking-tight">Customer Reviews</span>
                </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl font-extrabold text-[#FBBC05]">4.9</span>
                  <div className="flex flex-col items-start">
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#FBBC05] text-[#FBBC05]" />
                      ))}
                    </div>
                    <p className="text-sm font-medium opacity-60">
                      {t('Verified 4.9/5.0 Rating', 'सत्यापित 4.9/5.0 रेटिंग', 'ચકાસાયેલ 4.9/5.0 રેટિંગ')}
                    </p>
                  </div>
                </div>
                      <p className="text-lg font-bold mb-8">
                        {t('Based on 10,000+ authentic customer consultations', '10,000+ प्रामाणिक ग्राहक परामर्श के आधार पर', '૧૦,૦૦૦+ અધિકૃત ગ્રાહક પરામર્શના આધારે')}
                      </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <a 
                      href="https://search.google.com/local/reviews?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#4285F4] text-white shadow-lg shadow-[#4285F4]/20 hover:bg-[#357abd] transition-all font-bold text-lg active:scale-95"
                    >
                      <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="G" className="w-6 h-6 bg-white rounded-full p-0.5" />
                      {t('View All Google Reviews', 'गूगल पर सभी समीक्षाएं देखें', 'Google પર બધી સમીક્ષાઓ જુઓ')}
                    </a>
                    
                    <a 
                      href="https://search.google.com/local/writereview?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w&source=g.page.m.ia._&laa=nmx-review-solicitation-ia2" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/5 transition-all font-bold text-lg active:scale-95"
                  >
                    <Star className="w-5 h-5" />
                    {t('Write a Review', 'एक समीक्षा लिखें', 'સમીક્ષા લખો')}
                  </a>
                </div>
              
                <p className="text-xs opacity-50 max-w-md mx-auto leading-relaxed">
                  {t(
                    'Our Google reviews are manually verified and updated from our official Business Profile to ensure transparency and trust.',
                    'हमारी गूगल समीक्षाएं पारदर्शिता और विश्वास सुनिश्चित करने के लिए हमारे आधिकारिक बिजनेस प्रोफाइल से मैन्युअल रूप से सत्यापित और अपडेट की जाती हैं।',
                    'અમારી Google સમીક્ષાઓ પારદર્શિતા અને વિશ્વાસ સુનિશ્ચિત કરવા માટે અમારી સત્તાવાર બિઝનેસ પ્રોફાઇલમાંથી મેન્યુઅલી ચકાસવામાં આવે છે અને અપડેટ કરવામાં આવે છે.'
                  )}
                </p>
            </motion.div>
          </div>
        </section>

      <Footer />
    </div>
  );
}
