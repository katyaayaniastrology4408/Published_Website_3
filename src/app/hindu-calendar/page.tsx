"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Star, Sparkles, ArrowRight, Sun, Moon } from "lucide-react";
import { 
  GiRam, GiBull, GiLovers, GiCrab, GiLion, GiFemale, 
  GiScales, GiScorpion, GiArcher, GiCrocJaws, GiAmphora, GiDoubleFish,
  GiMoon
} from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

interface ImportantDay {
  id: string;
  date: string;
  title_gujarati: string;
  title_hindi: string;
  title_english: string;
  description_gujarati: string;
  description_hindi?: string;
  description_english?: string;
  category: string;
  is_holiday: boolean;
}

interface PanchangEndTime {
  time: string;
  date: string;
}

interface PanchangData {
  date: string;
  vaara: { english: string; hindi: string; gujarati: string };
  tithi: { number: number; english: string; hindi: string; gujarati: string };
  paksha: { english: string; hindi: string; gujarati: string };
  nakshatra: { english: string; hindi: string; gujarati: string };
  yoga: { english: string; hindi: string; gujarati: string };
  karana: { english: string; hindi: string; gujarati: string };
  moonRashi: { english: string; hindi: string; gujarati: string };
  sunRashi: { english: string; hindi: string; gujarati: string };
  hinduMonth: { english: string; hindi: string; gujarati: string };
  sunrise: string;
  sunset: string;
  tithiEnd?: PanchangEndTime | null;
  nakshatraEnd?: PanchangEndTime | null;
  yogaEnd?: PanchangEndTime | null;
  karanaEnd?: PanchangEndTime | null;
  moonRashiEnd?: PanchangEndTime | null;
  sunRashiEnd?: PanchangEndTime | null;
}

const CALENDAR_CATEGORIES = [
  { value: 'all', label: 'બધા', labelHi: 'सभी', labelEn: 'All', icon: Calendar },
  { value: 'festival', label: 'તહેવાર', labelHi: 'त्योहार', labelEn: 'Festivals', icon: Sparkles },
  { value: 'tithi', label: 'તિથિ', labelHi: 'तिथि', labelEn: 'Tithi', icon: GiMoon },
  { value: 'national', label: 'રાષ્ટ્રીય', labelHi: 'राष्ट्रीय', labelEn: 'National', icon: Star },
];

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

export default function HinduCalendarPage() {
  const { theme } = useTheme();
  const { language, t } = useTranslation();
  const [upcomingDays, setUpcomingDays] = useState<ImportantDay[]>([]);
  const [allCalendarDays, setAllCalendarDays] = useState<ImportantDay[]>([]);
  const [calendarCategory, setCalendarCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [monthlyTithis, setMonthlyTithis] = useState<ImportantDay[]>([]);

    // Auto-update: refresh panchang every 5 minutes + detect day change (IST midnight)
    useEffect(() => {
      fetchPanchang();
      fetchUpcomingDays();

      // Track current IST date to detect day rollover
      const getISTDate = () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
        const istTime = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
        return istTime.toISOString().split('T')[0]; // "YYYY-MM-DD"
      };

      let currentISTDate = getISTDate();

      // Check every 60 seconds for day change + refresh panchang every 5 minutes
      let tickCount = 0;
      const intervalId = setInterval(() => {
        tickCount++;

        // Check for day change every tick (60s)
        const nowISTDate = getISTDate();
        if (nowISTDate !== currentISTDate) {
          currentISTDate = nowISTDate;
          // Day changed - refresh everything
          fetchPanchang();
          fetchUpcomingDays();
          fetchAllCalendarDays();
          fetchMonthlyTithis();
        } else if (tickCount % 5 === 0) {
          // Every 5 minutes, refresh panchang for sunrise/sunset accuracy
          fetchPanchang();
        }
      }, 60 * 1000);

      return () => {
        clearInterval(intervalId);
      };
    }, []);

    useEffect(() => {
      fetchAllCalendarDays();
    }, [selectedYear]);

    // Fetch daily tithis for selected month
    useEffect(() => {
      fetchMonthlyTithis();
    }, [selectedMonth, selectedYear]);

    const to12h = (time24: string) => {
        const [hStr, mStr] = time24.split(':');
        let h = parseInt(hStr);
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${h}:${mStr} ${period}`;
      };

    // Format end time: "સુધી 6 Feb, 1:22 PM"
            const formatEndTime = (end: PanchangEndTime | null | undefined) => {
              if (!end) return null;
              const d = new Date(end.date + 'T00:00:00');
              const day = d.getDate();
              const month = d.toLocaleDateString('en-IN', { month: 'short' });
                const label = language === 'gu' ? 'સુધી' : language === 'hi' ? 'तक' : 'Until';
                return `${label} ${day} ${month}, ${end.time}`;
            };

      const fetchPanchang = async () => {
        try {
        // Use IST date for cache-busting param
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
        const today = istTime.toISOString().split('T')[0];
      const res = await fetch(`/api/panchang?t=${today}`);
            const data = await res.json();
          if (data.success) {
            const d = data.data;
            setPanchang({
              ...d,
              sunrise: to12h(d.sunrise),
              sunset: to12h(d.sunset),
            });
      }
    } catch (error) {
      console.error('Failed to fetch panchang:', error);
    }
  };

  const fetchUpcomingDays = async () => {
    try {
      const res = await fetch('/api/important-days?upcoming=true&limit=6');
      const data = await res.json();
      if (data.success) {
        setUpcomingDays(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming days:', error);
    }
  };

    const fetchAllCalendarDays = async () => {
      try {
        const res = await fetch(`/api/important-days?year=${selectedYear}`);
        const data = await res.json();
        if (data.success) {
          setAllCalendarDays(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch calendar days:', error);
      }
    };

      const fetchMonthlyTithis = async () => {
        try {
          const res = await fetch(`/api/panchang?month=${selectedMonth}&year=${selectedYear}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const tithiEvents: ImportantDay[] = data.data.map((item: any) => ({
              id: `tithi-${item.date}`,
              date: item.date,
              title_gujarati: item.tithi.gujarati,
              title_hindi: item.tithi.hindi,
              title_english: item.tithi.english,
              description_gujarati: `${item.paksha.gujarati} • ${item.nakshatra.gujarati} • ${item.yoga.gujarati}`,
              description_hindi: `${item.paksha.hindi} • ${item.nakshatra.hindi} • ${item.yoga.hindi}`,
              description_english: `${item.paksha.english} • ${item.nakshatra.english} • ${item.yoga.english}`,
              category: 'tithi',
              is_holiday: false,
            }));
            setMonthlyTithis(tithiEvents);
          }
        } catch (error) {
          console.error('Failed to fetch monthly tithis:', error);
        }
      };

  const getLocale = () => {
    if (language === 'gu') return 'gu-IN';
    if (language === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString(getLocale(), { month: 'short' }),
    };
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return language === 'gu' ? 'આજે' : language === 'hi' ? 'आज' : 'Today';
    if (diff === 1) return language === 'gu' ? 'કાલે' : language === 'hi' ? 'कल' : 'Tomorrow';
    if (language === 'gu') return `${diff} દિવસ`;
    if (language === 'hi') return `${diff} दिन`;
    return `${diff} days`;
  };

  const MONTHS = language === 'gu' 
    ? ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર']
    : language === 'hi'
    ? ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Merge DB events with daily tithi data
    const allEvents = [...allCalendarDays, ...(calendarCategory === 'all' || calendarCategory === 'tithi' ? monthlyTithis : [])];

    const filteredCalendarEvents = allEvents.filter(day => {
      const eventDate = new Date(day.date);
      const matchesMonth = eventDate.getMonth() === selectedMonth;
      const matchesCategory = calendarCategory === 'all' || day.category === calendarCategory;
      return matchesMonth && matchesCategory;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTitle = (day: ImportantDay) => {
    if (language === 'gu') return day.title_gujarati;
    if (language === 'hi') return day.title_hindi || day.title_gujarati;
    return day.title_english || day.title_gujarati;
  };

  const getDescription = (day: ImportantDay) => {
    if (language === 'gu') return day.description_gujarati;
    if (language === 'hi') return day.description_hindi || day.description_gujarati;
    return day.description_english || day.description_gujarati;
  };

  const getPanchangLabel = (item: { english: string; hindi: string; gujarati: string }) => {
    if (language === 'gu') return item.gujarati;
    if (language === 'hi') return item.hindi;
    return item.english;
  };

    const todayFormatted = new Date().toLocaleDateString(getLocale(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
        <Navbar />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-bold text-gradient-ancient mb-4">
            {language === 'gu' ? 'હિન્દુ પંચાંગ' : language === 'hi' ? 'हिन्दू पंचांग' : 'Hindu Calendar'}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'gu' ? 'તહેવારો, વ્રત, તિથિ અને મહત્વના દિવસો' : 
             language === 'hi' ? 'त्योहार, व्रत, तिथि और महत्वपूर्ण दिन' :
             'Festivals, Fasts, Tithis and Important Days'}
          </p>
        </div>

        {/* ========= DAILY UPDATE BANNER - REAL TIME ========= */}
        {panchang && (
          <div className={`mb-6 rounded-2xl overflow-hidden border ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#1a1225] via-[#12121a] to-[#0f1a2e] border-orange-500/20' 
              : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-orange-200'
          }`}>
            {/* Header with live indicator */}
            <div className={`px-4 py-2.5 flex items-center justify-center gap-3 ${
              theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
              }`}>
                {language === 'gu' ? "આજનું દૈનિક પંચાંગ • રિયલ ટાઇમ" : language === 'hi' ? "आज का दैनिक पंचांग • रियल टाइम" : "Today's Daily Panchang • Real Time"}
              </span>
            </div>

            <div className="px-4 py-5 md:px-6">
              {/* Row 1: Hindu Month, Vaara, Sunrise, Sunset */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                <div>
                  <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'gu' ? 'હિન્દુ માસ' : language === 'hi' ? 'हिन्दू मास' : 'Hindu Month'}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-[#ff6b35]">{getPanchangLabel(panchang.hinduMonth)}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'gu' ? 'વાર' : language === 'hi' ? 'वार' : 'Day'}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-purple-500">{getPanchangLabel(panchang.vaara)}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'gu' ? 'સૂર્યોદય' : language === 'hi' ? 'सूर्योदय' : 'Sunrise'}
                  </p>
                  <p className="text-lg md:text-xl font-bold">
                    <Sun className="w-4 h-4 inline-block mr-1 text-amber-500" />
                    {panchang.sunrise}
                  </p>
                </div>
                <div>
                  <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {language === 'gu' ? 'સૂર્યાસ્ત' : language === 'hi' ? 'सूर्यास्त' : 'Sunset'}
                  </p>
                  <p className="text-lg md:text-xl font-bold">
                    <Moon className="w-4 h-4 inline-block mr-1 text-indigo-500" />
                    {panchang.sunset}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t mb-4 ${theme === 'dark' ? 'border-white/10' : 'border-orange-200/50'}`} />

                  {/* Row 2: Tithi, Paksha, Nakshatra */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className={`rounded-xl p-3 text-center ${
                        theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white border border-orange-200'
                      }`}>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {language === 'gu' ? 'તિથિ' : language === 'hi' ? 'तिथि' : 'Tithi'}
                        </p>
                        <p className="text-base md:text-lg font-bold text-[#ff6b35]">{getPanchangLabel(panchang.tithi)}</p>
                        {formatEndTime(panchang.tithiEnd) && (
                          <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatEndTime(panchang.tithiEnd)}
                          </p>
                        )}
                      </div>
                    <div className={`rounded-xl p-3 text-center ${
                      theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-white border border-purple-200'
                    }`}>
                      <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {language === 'gu' ? 'પક્ષ' : language === 'hi' ? 'पक्ष' : 'Paksha'}
                      </p>
                      <p className="text-base md:text-lg font-bold text-purple-500">{getPanchangLabel(panchang.paksha)}</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center ${
                        theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white border border-blue-200'
                      }`}>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {language === 'gu' ? 'નક્ષત્ર' : language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}
                        </p>
                        <p className="text-base md:text-lg font-bold text-blue-500">{getPanchangLabel(panchang.nakshatra)}</p>
                        {formatEndTime(panchang.nakshatraEnd) && (
                          <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatEndTime(panchang.nakshatraEnd)}
                          </p>
                        )}
                      </div>
                  </div>

                    {/* Row 3: Yoga, Moon Rashi, Sun Rashi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className={`rounded-xl p-3 text-center ${
                          theme === 'dark' ? 'bg-green-500/10 border border-green-500/20' : 'bg-white border border-green-200'
                        }`}>
                          <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {language === 'gu' ? 'યોગ' : language === 'hi' ? 'योग' : 'Yoga'}
                          </p>
                          <p className="text-sm md:text-base font-bold text-green-500">{getPanchangLabel(panchang.yoga)}</p>
                          {formatEndTime(panchang.yogaEnd) && (
                            <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              {formatEndTime(panchang.yogaEnd)}
                            </p>
                          )}
                        </div>
                        <div className={`rounded-xl p-3 text-center ${
                        theme === 'dark' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white border border-indigo-200'
                      }`}>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {language === 'gu' ? 'ચંદ્ર રાશિ' : language === 'hi' ? 'चंद्र राशि' : 'Moon Sign'}
                        </p>
                        <p className="text-sm md:text-base font-bold text-indigo-500">{getPanchangLabel(panchang.moonRashi)}</p>
                        {formatEndTime(panchang.moonRashiEnd) && (
                          <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatEndTime(panchang.moonRashiEnd)}
                          </p>
                        )}
                      </div>
                      <div className={`rounded-xl p-3 text-center ${
                        theme === 'dark' ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white border border-rose-200'
                      }`}>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {language === 'gu' ? 'સૂર્ય રાશિ' : language === 'hi' ? 'सूर्य राशि' : 'Sun Sign'}
                        </p>
                        <p className="text-sm md:text-base font-bold text-rose-500">{getPanchangLabel(panchang.sunRashi)}</p>
                        {formatEndTime(panchang.sunRashiEnd) && (
                          <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatEndTime(panchang.sunRashiEnd)}
                          </p>
                        )}
                      </div>
                    </div>

              {/* Date line */}
              <p className={`text-center text-xs mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {todayFormatted}
              </p>
            </div>
          </div>
        )}

          {/* Daily Horoscope Banner */}
        <Link href="/rashifal">
          <Card className={`mb-8 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] ${
            theme === 'dark' ? 'bg-gradient-to-r from-[#12121a] to-[#1a1a24]' : 'bg-gradient-to-r from-orange-50 to-purple-50'
          } border-none shadow-xl`}>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold mb-2">
                    {t("Daily Horoscope")}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'gu' ? 'આજનું તમારી રાશિનું ભાગ્યફળ જાણો' :
                     language === 'hi' ? 'आज का अपनी राशि का भाग्यफल जानें' :
                     'Know your zodiac fortune for today'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {RASHI_DATA.slice(0, 6).map((rashi) => (
                      <div 
                        key={rashi.english}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'} border-2 ${theme === 'dark' ? 'border-[#0a0a0f]' : 'border-white'}`}
                      >
                        <rashi.icon className="w-5 h-5 text-[#ff6b35]" />
                      </div>
                    ))}
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#ff6b35] ml-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Hindu Calendar Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-7 h-7 text-[#ff6b35]" />
              {language === 'gu' ? `${selectedYear} નું પંચાંગ` : language === 'hi' ? `${selectedYear} का पंचांग` : `${selectedYear} Calendar`}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedYear(selectedYear - 1)}
                className={theme === 'dark' ? 'border-gray-700' : ''}
              >
                {selectedYear - 1}
              </Button>
              <span className="px-3 py-1 bg-[#ff6b35] text-white rounded-md font-bold">{selectedYear}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedYear(selectedYear + 1)}
                className={theme === 'dark' ? 'border-gray-700' : ''}
              >
                {selectedYear + 1}
              </Button>
            </div>
          </div>

          {/* Month Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {MONTHS.map((month, index) => (
              <Button
                key={index}
                variant={selectedMonth === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMonth(index)}
                className={`${selectedMonth === index ? 'bg-[#ff6b35] hover:bg-[#ff8c5e]' : ''} ${theme === 'dark' ? 'border-gray-700' : ''}`}
              >
                {month}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CALENDAR_CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={calendarCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalendarCategory(cat.value)}
                className={`flex items-center gap-1 ${calendarCategory === cat.value ? 'bg-[#ff6b35] hover:bg-[#ff8c5e]' : ''} ${theme === 'dark' ? 'border-gray-700' : ''}`}
              >
                <cat.icon className="w-4 h-4" />
                {language === 'gu' ? cat.label : language === 'hi' ? cat.labelHi : cat.labelEn}
              </Button>
            ))}
          </div>

          {/* Calendar Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCalendarEvents.length === 0 ? (
              <div className={`col-span-full text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'gu' ? 'આ મહિનામાં કોઈ ઇવેન્ટ નથી' : language === 'hi' ? 'इस महीने में कोई इवेंट नहीं है' : 'No events in this month'}</p>
              </div>
            ) : (
              filteredCalendarEvents.map((day) => {
                const dateInfo = formatShortDate(day.date);
                return (
                  <div key={day.id}>
                    <Card className={`overflow-hidden transition-all hover:scale-[1.02] ${
                      theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'
                    } border-none shadow-md`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-xl ${
                          day.is_holiday 
                            ? 'bg-red-500/10 text-red-500' 
                            : theme === 'dark' ? 'bg-orange-500/10 text-[#ff6b35]' : 'bg-orange-50 text-[#ff6b35]'
                        }`}>
                          <span className="text-2xl font-bold leading-none">{dateInfo.day}</span>
                          <span className="text-[10px] font-medium">{dateInfo.month}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base mb-1">{getTitle(day)}</h3>
                          <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getDescription(day)}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${
                              day.is_holiday 
                                ? 'bg-red-500/10 text-red-500' 
                                : day.category === 'festival' 
                                ? 'bg-purple-500/10 text-purple-500'
                                : day.category === 'tithi'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-green-500/10 text-green-500'
                            }`}>
                                {day.category === 'festival' ? (language === 'gu' ? 'તહેવાર' : language === 'hi' ? 'त्योहार' : 'Festival')
                                  : day.category === 'tithi' ? (language === 'gu' ? 'તિથિ' : language === 'hi' ? 'तिथि' : 'Tithi')
                                  : day.category === 'national' ? (language === 'gu' ? 'રાષ્ટ્રીય' : language === 'hi' ? 'राष्ट्रीय' : 'National')
                                  : day.category}
                              </span>
                            {day.is_holiday && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                                {language === 'gu' ? 'રજા' : language === 'hi' ? 'छुट्टी' : 'Holiday'}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Important Days Section */}
        {upcomingDays.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-[#ff6b35]" />
                {language === 'gu' ? 'આગામી મહત્વના દિવસો' : language === 'hi' ? 'आगामी महत्वपूर्ण दिन' : 'Upcoming Important Days'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {upcomingDays.map((day) => {
                const dateInfo = formatShortDate(day.date);
                return (
                  <Card 
                    key={day.id} 
                    className={`overflow-hidden transition-all hover:scale-[1.02] ${
                      theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'
                    } border-none shadow-md`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex flex-col items-center justify-center w-14 h-14 rounded-xl mb-2 ${
                        day.is_holiday 
                          ? 'bg-red-500/10 text-red-500' 
                          : theme === 'dark' ? 'bg-orange-500/10 text-[#ff6b35]' : 'bg-orange-50 text-[#ff6b35]'
                      }`}>
                        <span className="text-xl font-bold leading-none">{dateInfo.day}</span>
                        <span className="text-[10px] font-medium">{dateInfo.month}</span>
                      </div>
                      <h3 className="font-bold text-xs md:text-sm line-clamp-2 mb-1">
                        {getTitle(day)}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        day.is_holiday 
                          ? 'bg-red-500/10 text-red-500' 
                          : theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getDaysUntil(day.date)}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


