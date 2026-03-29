"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import { testimonialsData } from "@/data/homepage";

const Footer = dynamic(() => import("@/components/homepage/Footer"), { ssr: false });

export default function ReviewsPageClient() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avg: "5.0", count: 0 });

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        const lang = (language === 'hi' || language === 'gu') ? language : 'en';
        const staticReviews = testimonialsData[lang].map((r: any, i: number) => ({
          id: `static-${i}`,
          name: r.name,
          message: r.text,
          rating: r.rating || 5,
          created_at: new Date(Date.now() - (i * 86400000 * 5)).toISOString(), // mock dates
          is_featured: !!r.badge
        }));

        let allReviews = staticReviews;
        if (data.success && Array.isArray(data.reviews)) {
          const validDbReviews = data.reviews.filter((r: any) => r.name && r.name.trim() !== "" && r.message && r.message.trim() !== "");
          
          allReviews = [
            staticReviews[0],
            staticReviews[1],
            ...validDbReviews,
            ...staticReviews.slice(2)
          ];
        } else {
          allReviews = staticReviews;
        }
        
        setReviews(allReviews);
        if (allReviews.length > 0) {
          const avg = (allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length).toFixed(1);
          setStats({ avg, count: allReviews.length });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [language]);

  const t = (en: string, hi: string, gu: string) => {
    if (language === 'gu') return gu;
    if (language === 'hi') return hi;
    return en;
  };

  const ReviewCard = ({ review }: { review: any }) => (
    <Card key={review.id} className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-[#f8f4ee] border-[#ff6b35]/30'} h-full relative overflow-hidden group hover:border-[#ff6b35]/50 transition-colors`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="G" className="h-4" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5e] flex items-center justify-center text-white font-bold text-lg shrink-0">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className={`font-[family-name:var(--font-cinzel)] font-bold text-base ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                {review.name}
              </p>
              {review.is_featured && (
                <Star className="w-3 h-3 fill-[#ff6b35] text-[#ff6b35]" />
              )}
            </div>
            <div className="flex gap-0.5 mt-1 items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-300'}`} />
              ))}
              <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest ml-2 whitespace-nowrap">
                {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
          {review.message}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar hasNotification={false} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {t("Client Reviews", "ग्राहक समीक्षाएं", "ગ્રાહક સમીક્ષાઓ")}
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
              {t(
                "Read what our clients have to say about their experience.",
                "पढ़ें कि हमारे ग्राहकों का अनुभव कैसा रहा।",
                "વાંચો કે અમારા ગ્રાહકોનો અનુભવ કેવો રહ્યો."
              )}
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <div className={`w-full max-w-2xl p-8 rounded-[2.5rem] border flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20 shadow-[#ff6b35]/5' : 'bg-white border-[#ff6b35]/20 shadow-[#ff6b35]/10'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b35]/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ff6b35]/5 rounded-full blur-3xl -ml-16 -mb-16" />
              
              <div className="text-center sm:text-left relative z-10">
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-2">
                  <span className={`text-7xl font-black font-[family-name:var(--font-cinzel)] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>4.9</span>
                  <span className="text-2xl font-medium opacity-60">/ 5.0</span>
                </div>
                <div className="flex justify-center sm:justify-start gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                </div>
                <p className={`text-lg font-bold opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'gu' ? '૧૦,૦૦૦+ પરામર્શ' : language === 'hi' ? '10,000+ परामर्श' : '10,000+ Consultations'}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-6 relative z-10">
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-10 object-contain" />
                <div className="flex flex-col gap-3 w-full">
                  <a 
                    href="https://search.google.com/local/reviews?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap px-8 py-4 rounded-2xl font-black text-lg text-center transition-all bg-[#ff6b35] text-white hover:bg-[#ff8c5e] hover:-translate-y-1 shadow-lg hover:shadow-[#ff6b35]/30 flex items-center justify-center gap-3"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {t("Write a Review", "समीक्षा लिखें", "સમીક્ષા લખો")}
                  </a>
                  <a 
                    href="https://search.google.com/local/reviews?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black text-[#4285F4] hover:underline flex items-center justify-center gap-1 opacity-80 hover:opacity-100"
                  >
                    {t("View all on Google", "Google पर सभी देखें", "Google પર બધા જુઓ")} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#ff6b35]" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="col-span-full text-center py-20 opacity-50 italic">
                {t("No reviews found.", "कोई समीक्षा नहीं मिली।", "કોઈ સમીક્ષા મળી નથી.")}
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
