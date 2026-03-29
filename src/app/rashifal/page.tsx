"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  GiRam, GiBull, GiLovers, GiCrab, GiLion, GiFemale, 
  GiScales, GiScorpion, GiArcher, GiCrocJaws, GiAmphora, GiDoubleFish 
} from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

const RASHI_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  aries: GiRam,
  taurus: GiBull,
  gemini: GiLovers,
  cancer: GiCrab,
  leo: GiLion,
  virgo: GiFemale,
  libra: GiScales,
  scorpio: GiScorpion,
  sagittarius: GiArcher,
  capricorn: GiCrocJaws,
  aquarius: GiAmphora,
  pisces: GiDoubleFish,
};

const RASHI_DATA = [
  { english: 'aries', gujarati: 'મેષ', hindi: 'मेष' },
  { english: 'taurus', gujarati: 'વૃષભ', hindi: 'वृषभ' },
  { english: 'gemini', gujarati: 'મિથુન', hindi: 'मिथुन' },
  { english: 'cancer', gujarati: 'કર્ક', hindi: 'कर्क' },
  { english: 'leo', gujarati: 'સિંહ', hindi: 'सिंह' },
  { english: 'virgo', gujarati: 'કન્યા', hindi: 'कन्या' },
  { english: 'libra', gujarati: 'તુલા', hindi: 'तुला' },
  { english: 'scorpio', gujarati: 'વૃશ્ચિક', hindi: 'वृश्चिक' },
  { english: 'sagittarius', gujarati: 'ધન', hindi: 'धनु' },
  { english: 'capricorn', gujarati: 'મકર', hindi: 'मकर' },
  { english: 'aquarius', gujarati: 'કુંભ', hindi: 'कुंभ' },
  { english: 'pisces', gujarati: 'મીન', hindi: 'मीन' },
];

interface RashifalData {
  rashi: string;
  rashi_gujarati: string;
  rashi_hindi: string;
  content_english: string;
  content_gujarati: string;
  content_hindi: string;
  overall_rating: number;
  love_rating: number;
  career_rating: number;
  health_rating: number;
  week_start?: string;
  week_end?: string;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
}

function RashifalPageContent() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') === 'weekly' ? 'weekly' : 'daily';

    const [viewType] = useState<'daily' | 'weekly'>(initialTab);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedWeekStart, setSelectedWeekStart] = useState("");

    useEffect(() => {
      // Set dates on client to avoid hydration mismatch
      const now = new Date();
      setSelectedDate(now.toISOString().split('T')[0]);
      setSelectedWeekStart(getMonday(now).toISOString().split('T')[0]);
    }, []);
      const [selectedRashi, setSelectedRashi] = useState<string | null>(null);
      const [rashifalData, setRashifalData] = useState<RashifalData[]>([]);
      const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (viewType === 'daily') {
      fetchDailyRashifal();
    } else {
      fetchWeeklyRashifal();
    }
  }, [selectedDate, selectedWeekStart, viewType]);

  const fetchDailyRashifal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_rashifal')
        .select('*')
        .eq('date', selectedDate)
        .order('rashi');
      if (!error) setRashifalData(data || []);
    } catch (error) {
      console.error('Failed to fetch rashifal:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyRashifal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_rashifal')
        .select('*')
        .eq('week_start', selectedWeekStart)
        .order('rashi');
      if (!error) setRashifalData(data || []);
    } catch (error) {
      console.error('Failed to fetch weekly rashifal:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const changeWeek = (weeks: number) => {
    const date = new Date(selectedWeekStart);
    date.setDate(date.getDate() + (weeks * 7));
    setSelectedWeekStart(date.toISOString().split('T')[0]);
  };

  const getRashiData = (rashi: string) => {
    return rashifalData.find(r => r.rashi === rashi);
  };

  const getContent = (data: RashifalData | null | undefined) => {
    if (!data) return language === 'gu' ? 'રાશિફળ ઉપલબ્ધ નથી' : language === 'hi' ? 'राशिफल उपलब्ध नहीं है' : 'Horoscope not available';
    if (language === 'gu') return data.content_gujarati || data.content_english;
    if (language === 'hi') return data.content_hindi || data.content_english;
    return data.content_english;
  };

  const getRashiName = (rashi: { english: string; gujarati: string; hindi: string }) => {
    if (language === 'gu') return rashi.gujarati;
    if (language === 'hi') return rashi.hindi;
    return rashi.english;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    if (language === 'gu') return date.toLocaleDateString('gu-IN', options);
    if (language === 'hi') return date.toLocaleDateString('hi-IN', options);
    return date.toLocaleDateString('en-IN', options);
  };

  const formatWeekRange = (startStr: string) => {
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const yearOpts: Intl.DateTimeFormatOptions = { year: 'numeric' };
    const locale = language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    return `${start.toLocaleDateString(locale, opts)} - ${end.toLocaleDateString(locale, opts)}, ${end.toLocaleDateString(locale, yearOpts)}`;
  };

  const selectedRashiData = selectedRashi ? getRashiData(selectedRashi) : null;
  const selectedRashiInfo = selectedRashi ? RASHI_DATA.find(r => r.english === selectedRashi) : null;

  const todayMonday = selectedWeekStart; // Use the client-side calculated value

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold text-gradient-ancient mb-4">
              {viewType === 'daily' 
                ? (language === 'gu' ? 'દૈનિક રાશિફળ' : language === 'hi' ? 'दैनिक राशिफल' : 'Daily Horoscope')
                : (language === 'gu' ? 'સાપ્તાહિક રાશિફળ' : language === 'hi' ? 'साप्ताहिक राशिफल' : 'Weekly Horoscope')
              }
            </h1>
            <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {viewType === 'daily'
                ? (language === 'gu' ? 'આજનું તમારું ભાગ્ય જાણો' : language === 'hi' ? 'आज का अपना भाग्य जानें' : 'Know your fortune today')
                : (language === 'gu' ? 'આ અઠવાડિયાનું તમારું ભાગ્ય જાણો' : language === 'hi' ? 'इस सप्ताह का अपना भाग्य जानें' : 'Know your fortune this week')
              }
            </p>
          </div>

            {/* Date / Week Selector */}

        <div className="flex items-center justify-center gap-4 mb-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => viewType === 'daily' ? changeDate(-1) : changeWeek(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} shadow-lg`}>
              <Calendar className="w-5 h-5 text-[#ff6b35]" />
              <span className="font-medium text-sm md:text-base">
                {viewType === 'daily' ? formatDate(selectedDate) : formatWeekRange(selectedWeekStart)}
              </span>
            </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => viewType === 'daily' ? changeDate(1) : changeWeek(1)}
            className="rounded-full"
            disabled={viewType === 'daily' ? selectedDate === new Date().toISOString().split('T')[0] : selectedWeekStart === todayMonday}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Rashi Grid */}
        {!selectedRashi ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={viewType}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {RASHI_DATA.map((rashi) => {
              const data = getRashiData(rashi.english);
              return (
                <Card
                  key={rashi.english}
                  className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                    theme === 'dark' ? 'bg-[#12121a] hover:bg-[#1a1a24]' : 'bg-white hover:bg-orange-50'
                  } border-none shadow-lg`}
                  onClick={() => setSelectedRashi(rashi.english)}
                >
                <CardContent className="p-6 text-center">
                      {(() => {
                        const IconComponent = RASHI_ICONS[rashi.english];
                        return (
                          <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                            <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-[#ff6b35]" />
                          </div>
                        );
                      })()}
                      <h3 className="font-bold text-base md:text-lg mb-1 capitalize">{getRashiName(rashi)}</h3>
                      {data && (
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1" title="Data available" />
                      )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedRashi(null)}
              className="mb-6 text-[#ff6b35] hover:bg-[#ff6b35]/10"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'gu' ? 'બધી રાશિઓ' : language === 'hi' ? 'सभी राशियाँ' : 'All Rashis'}
            </Button>

            <Card className={`overflow-hidden ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} border-none shadow-2xl`}>
              <div className="h-3 bg-gradient-to-r from-[#ff6b35] via-[#ffa07a] to-[#2d1b4e]" />
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      {(() => {
                        const IconComponent = RASHI_ICONS[selectedRashi];
                        return (
                          <div className={`w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 rounded-[32px] flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                            <IconComponent className="w-14 h-14 md:w-16 md:h-16 text-[#ff6b35]" />
                          </div>
                        );
                      })()}
                        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold capitalize">
                      {selectedRashiInfo && getRashiName(selectedRashiInfo)}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#ff6b35] mt-2">
                      {language === 'gu' ? 'દૈનિક રાશિફળ' : language === 'hi' ? 'दैनिक राशिफल' : 'Daily Prediction'}
                    </p>
                    {viewType === 'weekly' && (

                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatWeekRange(selectedWeekStart)}
                    </p>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : (
                    <>
                        <p className={`text-lg md:text-xl leading-relaxed mb-8 whitespace-pre-line font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            {getContent(selectedRashiData)}
                          </p>
                    </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RashifalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full" /></div>}>
      <RashifalPageContent />
    </Suspense>
  );
}
