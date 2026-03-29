"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import Navbar from "@/components/homepage/Navbar";

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
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          if (data.reviews.length > 0) {
            const avg = (data.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / data.reviews.length).toFixed(1);
            setStats({ avg, count: data.reviews.length });
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const t = (en: string, hi: string, gu: string) => {
    if (language === 'gu') return gu;
    if (language === 'hi') return hi;
    return en;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar hasNotification={false} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {t("Client Reviews", "ग्राहक समीक्षाएं", "ગ્રાહક સમીક્ષાઓ")}
            </h1>
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
              {t(
                "Read what our clients have to say about their experience.",
                "पढ़ें कि हमारे ग्राहकों का अनुभव कैसा रहा।",
                "વાંચો કે અમારા ગ્રાહકોનો અનુભવ કેવો રહ્યો."
              )}
            </p>
            
            {/* Google-style stats summary */}
            {!loading && stats.count > 0 && (
              <div className={`inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-5 rounded-3xl border ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20 shadow-lg shadow-[#ff6b35]/5' : 'bg-white border-[#ff6b35]/20 shadow-lg shadow-[#ff6b35]/5'}`}>
                <div className="text-left flex items-center gap-4">
                  <span className="text-5xl font-black text-[#ff6b35] font-[family-name:var(--font-cinzel)]">{stats.avg}</span>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(stats.avg)) ? 'fill-[#ff6b35] text-[#ff6b35]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className={`text-sm font-semibold opacity-70 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {stats.count} {t("Reviews", "समीक्षाएं", "સમીક્ષાઓ")}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-[#ff6b35]/20 mx-2" />
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-50">
                    {t("Powered by", "सत्यापित", "દ્વારા સંચાલિત")}
                  </span>
                  <a 
                    href="https://search.google.com/local/reviews?placeid=ChIJU4nnqVi3bg4RyDOjuqExd_w" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-5 object-contain" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#ff6b35]" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 opacity-50 italic">
              {t("No reviews found.", "कोई समीक्षा नहीं मिली।", "કોઈ સમીક્ષા મળી નથી.")}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {reviews.map((review) => (
                <Card key={review.id} className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-[#f8f4ee] border-[#ff6b35]/30'} h-full relative overflow-hidden group hover:border-[#ff6b35]/50 transition-colors`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="G" className="h-4" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5e] flex items-center justify-center text-white font-bold text-lg">
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
                          <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest ml-2">
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
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
