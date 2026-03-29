"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, Star, Sun, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { calculatePanchang } from "@/lib/panchang";

export default function HoroscopePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [horoscopeData, setHoroscopeData] = useState<{
      horoscope_data: string;
      challenging_days?: string;
      standout_days?: string;
      month?: string;
    } | null>(null);
    const [moonHoroscopeData, setMoonHoroscopeData] = useState<{
      horoscope_data: string;
      challenging_days?: string;
      standout_days?: string;
      month?: string;
    } | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [viewType, setViewType] = useState<'daily' | 'yearly'>('daily');
    const { theme } = useTheme();
    const { language, t } = useTranslation();
    const router = useRouter();

    const getVedicSigns = (dob: string, tob?: string) => {

    if (!dob) return null;
    try {
        const [year, month, day] = dob.split('-').map(Number);
        let hours = 8, minutes = 0;
        if (tob) {
            const [h, m] = tob.split(':').map(Number);
            hours = h; minutes = m;
        }
        
        // Use Date.UTC to avoid local timezone issues
        const utcTimestamp = Date.UTC(year, month - 1, day, hours, minutes) - (5.5 * 60 * 60 * 1000);
        const utcBirth = new Date(utcTimestamp);
        
        const panchang = calculatePanchang(utcBirth);
        return {
            sun: panchang.sunRashi.english.split(' (')[0].toLowerCase(),
            moon: panchang.moonRashi.english.split(' (')[0].toLowerCase(),
            sunTranslated: panchang.sunRashi,
            moonTranslated: panchang.moonRashi
        };
    } catch (e) {
        return null;
    }
  };

  useEffect(() => {
    async function getData() {
      if (!authUser) {
        router.push("/");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();
      
      setProfile(profileData);
      setIsLoading(false);
    }
    getData();
  }, [router, authUser]);

      useEffect(() => {
        async function fetchHoroscope() {
          const dob = profile?.dob || authUser?.user_metadata?.dob;
          const tob = profile?.tob || authUser?.user_metadata?.tob;
          const signs = getVedicSigns(dob, tob);
          if (!signs) return;

          setIsFetching(true);
          try {
            const res = await fetch(`/api/horoscope?sign=${signs.moon}&type=${viewType}`);
            const data = await res.json();
            if (data.success) {
              setMoonHoroscopeData(data.data);
            }
          } catch (err) {
            console.error("Failed to fetch horoscope:", err);
          } finally {
            setIsFetching(false);
          }
        }
    
        if (!isLoading && (profile || authUser)) {
          fetchHoroscope();
        }
      }, [isLoading, profile, authUser, viewType]);
  
    if (isLoading) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-background'}`}>
          <Loader2 className="w-12 h-12 animate-spin text-[#ff6b35]" />
        </div>
      );
    }
  
    const dobInput = profile?.dob || authUser?.user_metadata?.dob;
    const tobInput = profile?.tob || authUser?.user_metadata?.tob;
    const vedicSigns = getVedicSigns(dobInput, tobInput);

    const getTranslatedSign = (item: { english: string; hindi: string; gujarati: string }) => {
        if (language === 'gu') return item.gujarati;
        if (language === 'hi') return item.hindi;
        return item.english.split(' (')[0];
    };


  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 print:hidden">
            <div className="flex gap-2 self-start">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="hover:bg-[#ff6b35]/10 text-[#ff6b35]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("Back to Profile")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {language === 'gu' ? 'ડાઉનલોડ કરો' : language === 'hi' ? 'डाउनलोड करें' : 'Download Report'}
              </Button>
            </div>

          <div className="flex bg-[#ff6b35]/10 p-1.5 rounded-2xl border border-[#ff6b35]/20">
            <Button
              variant={viewType === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('daily')}
              className={`rounded-xl px-6 ${viewType === 'daily' ? 'bg-[#ff6b35] text-white shadow-lg' : 'text-[#ff6b35] hover:bg-[#ff6b35]/10'}`}
            >
              {language === 'gu' ? 'દૈનિક' : language === 'hi' ? 'दैनिक' : 'Daily'}
            </Button>
            <Button
              variant={viewType === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewType('yearly')}
              className={`rounded-xl px-6 ${viewType === 'yearly' ? 'bg-[#ff6b35] text-white shadow-lg' : 'text-[#ff6b35] hover:bg-[#ff6b35]/10'}`}
            >
              {language === 'gu' ? 'વાર્ષિક' : language === 'hi' ? 'वार्ષિક' : 'Yearly Outlook'}
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={viewType}
          className="space-y-8"
        >
            <div className="text-center space-y-6">
              <h1 className="font-[family-name:var(--font-cinzel)] text-5xl md:text-7xl font-bold text-gradient-ancient tracking-tight">
                {viewType === 'daily' ? t("Your Daily Alignment") : t("Cosmic Forecast")}
              </h1>
              
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center gap-3 text-xl text-[#a0998c] capitalize font-medium">
                      <span className="bg-[#ff6b35]/10 px-4 py-1 rounded-full text-[#ff6b35] border border-[#ff6b35]/20">
                          {vedicSigns ? getTranslatedSign(vedicSigns.moonTranslated) : "..."}
                      </span>
                      <span>•</span>
                      <span className="notranslate">{viewType === 'daily' ? new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : horoscopeData?.month || new Date().getFullYear()}</span>
                  </div>
                </div>

            </div>

            {!vedicSigns ? (

            <Card className="p-12 text-center border-dashed border-2 border-[#ff6b35]/30 bg-[#ff6b35]/5 rounded-[2.5rem]">
              <p className="text-2xl mb-6 font-medium">{t("We need your birth date to calculate your horoscope.")}</p>
              <Button onClick={() => router.push('/profile')} size="lg" className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-lg px-8 py-6 rounded-2xl shadow-xl shadow-[#ff6b35]/20">
                {t("Complete Profile")}
              </Button>
            </Card>
          ) : (
            <div className="grid gap-8">
              <Card className={`overflow-hidden rounded-[2.5rem] border-none shadow-2xl ${theme === 'dark' ? 'bg-[#12121a] shadow-[#000]/50' : 'bg-white shadow-[#ff6b35]/5'}`}>
                <div className="h-4 bg-gradient-to-r from-[#ff6b35] via-[#ffa07a] to-[#2d1b4e]" />
                <CardHeader className="text-center pt-10 pb-4">
                  <div className="w-24 h-24 rounded-[2rem] bg-[#ff6b35]/10 flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300">
                    {viewType === 'daily' ? <Sparkles className="w-12 h-12 text-[#ff6b35]" /> : <Sun className="w-12 h-12 text-[#ff6b35]" />}
                  </div>
                  <CardTitle className="font-[family-name:var(--font-cinzel)] text-4xl font-bold tracking-wide">
                    {viewType === 'daily' ? t("Cosmic Guidance") : t("Yearly Outlook")}
                  </CardTitle>
                </CardHeader>
                  <CardContent className="px-10 pb-12 pt-4">
                    {isFetching ? (
                      <div className="flex flex-col items-center py-20 gap-6">
                        <div className="relative">
                          <Loader2 className="w-16 h-16 animate-spin text-[#ff6b35] opacity-20" />
                          <Sparkles className="w-8 h-8 text-[#ff6b35] absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <p className="text-xl font-medium text-[#a0998c] animate-pulse">{t("Consulting the celestial bodies...")}</p>
                      </div>
                      ) : (
                        <div className="space-y-12">
                          {/* Horoscope Section */}
                          {moonHoroscopeData ? (
                            <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                <Star className="w-6 h-6 text-[#ff6b35]" />
                                <h3 className="text-xl font-bold uppercase tracking-widest text-[#ff6b35]">
                                  {language === 'gu' ? 'તમારું રાશિફળ' : language === 'hi' ? 'आपका राशिफल' : 'Your Horoscope'}
                                  {vedicSigns && ` - ${getTranslatedSign(vedicSigns.moonTranslated)}`}
                                </h3>
                              </div>
                              <div className="relative">
                                <span className="absolute -left-4 -top-4 text-8xl text-[#ff6b35]/10 font-serif">"</span>
                                <p className={`text-xl md:text-2xl leading-relaxed text-justify relative z-10 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {moonHoroscopeData.horoscope_data}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-xl md:text-2xl leading-relaxed text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {t("The stars are currently recalibrating. Please check back in a moment.")}
                            </p>
                          )}
                            
                          {viewType === 'yearly' && moonHoroscopeData && (
                            <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-gray-500/10">
                              <div className={`p-6 rounded-3xl border transition-all hover:scale-105 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-blue-50/50 border-blue-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="p-2 rounded-lg bg-blue-500/20"><Calendar className="w-4 h-4 text-blue-500" /></div>
                                  <p className="text-xs font-black text-[#a0998c] uppercase tracking-[0.2em]">{t("Standout Days")}</p>
                                </div>
                                <p className="font-bold text-2xl text-gradient-ancient">
                                  {moonHoroscopeData?.standout_days || "Multiple"}
                                </p>
                              </div>
                              <div className={`p-6 rounded-3xl border transition-all hover:scale-105 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-red-50/50 border-red-100'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="p-2 rounded-lg bg-red-500/20"><AlertCircle className="w-4 h-4 text-red-500" /></div>
                                  <p className="text-xs font-black text-[#a0998c] uppercase tracking-[0.2em]">{t("Challenging Days")}</p>
                                </div>
                                <p className="font-bold text-2xl text-gradient-ancient">
                                  {moonHoroscopeData?.challenging_days || "Few"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                  </CardContent>

              </Card>

              </div>
            )}
          </motion.div>
      </main>

      <Footer />
    </div>
  );
}
