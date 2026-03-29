"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
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

const MONTHS = {
  gu: ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'],
  hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  all: { gu: 'બધા', hi: 'सभी', en: 'All' },
  festival: { gu: 'તહેવાર', hi: 'त्योहार', en: 'Festival' },
  national: { gu: 'રાષ્ટ્રીય', hi: 'राष्ट्रीय', en: 'National' },
};

export default function ImportantDaysPage() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const [year, setYear] = useState(new Date().getFullYear());
  const [allDays, setAllDays] = useState<ImportantDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDays();
  }, [year]);

  const fetchDays = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/important-days?year=${year}`);
      const data = await res.json();
      if (data.success) {
        setAllDays(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch important days:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocale = () => {
    if (language === 'gu') return 'gu-IN';
    if (language === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  const filteredDays = selectedCategory === 'all' 
    ? allDays 
    : allDays.filter(d => d.category === selectedCategory);

  const groupedByMonth = filteredDays.reduce((acc, day) => {
    const month = new Date(day.date).getMonth();
    if (!acc[month]) acc[month] = [];
    acc[month].push(day);
    return acc;
  }, {} as Record<number, ImportantDay[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      weekday: date.toLocaleDateString(getLocale(), { weekday: 'short' }),
    };
  };

  const getTitle = (day: ImportantDay) => {
    if (language === 'gu') return day.title_gujarati || day.title_english;
    if (language === 'hi') return day.title_hindi || day.title_english;
    return day.title_english || day.title_gujarati;
  };

  const getDescription = (day: ImportantDay) => {
    if (language === 'gu') return day.description_gujarati || day.description_english;
    if (language === 'hi') return day.description_hindi || day.description_english;
    return day.description_english || day.description_gujarati;
  };

  const getMonthName = (month: number) => {
    const lang = language as keyof typeof MONTHS;
    return (MONTHS[lang] || MONTHS.en)[month];
  };

  const getCategoryLabel = (key: string) => {
    const lang = language as keyof (typeof CATEGORY_LABELS)[string];
    return CATEGORY_LABELS[key]?.[lang] || CATEGORY_LABELS[key]?.en || key;
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold text-gradient-ancient mb-4">
            {language === 'gu' ? `મહત્વના દિવસો ${year}` : language === 'hi' ? `महत्वपूर्ण दिन ${year}` : `Important Days ${year}`}
          </h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'gu' ? 'ગુજરાતી તહેવારો અને રાષ્ટ્રીય રજાઓ' : 
             language === 'hi' ? 'त्योहार और राष्ट्रीय छुट्टियाँ' :
             'Festivals and National Holidays'}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear(year - 1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} shadow-lg`}>
            <Calendar className="w-5 h-5 text-[#ff6b35]" />
            <span className="font-bold text-xl">{year}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setYear(year + 1)}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-10">
          {Object.keys(CATEGORY_LABELS).map((key) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className={selectedCategory === key ? 'bg-[#ff6b35] hover:bg-[#ff8c5e]' : ''}
            >
              {getCategoryLabel(key)}
            </Button>
          ))}
        </div>

        {/* Important Days List */}
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {Object.entries(groupedByMonth).map(([month, days]) => (
              <div key={month}>
                <h2 className={`font-[family-name:var(--font-cinzel)] text-xl font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-[#ff6b35]' : 'text-[#ff6b35]'}`}>
                  <Star className="w-5 h-5" />
                  {getMonthName(parseInt(month))}
                </h2>
                <div className="space-y-3">
                  {days.map((day) => {
                    const dateInfo = formatDate(day.date);
                    const today = isToday(day.date);
                    const past = isPast(day.date);
                    
                    return (
                      <Card 
                        key={day.id} 
                        className={`overflow-hidden transition-all ${
                          today ? 'ring-2 ring-[#ff6b35]' : ''
                        } ${past ? 'opacity-60' : ''} ${
                          theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'
                        } border-none shadow-md`}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                            day.is_holiday 
                              ? 'bg-red-500/10 text-red-500' 
                              : today 
                                ? 'bg-[#ff6b35] text-white'
                                : theme === 'dark' ? 'bg-orange-500/10 text-[#ff6b35]' : 'bg-orange-50 text-[#ff6b35]'
                          }`}>
                            <span className="text-2xl font-bold leading-none">{dateInfo.day}</span>
                            <span className="text-[10px] font-medium mt-1">{dateInfo.weekday}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-base md:text-lg truncate">{getTitle(day)}</h3>
                              {day.is_holiday && (
                                <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-bold">
                                  {language === 'gu' ? 'રજા' : language === 'hi' ? 'छुट्टी' : 'Holiday'}
                                </span>
                              )}
                              {today && (
                                <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[#ff6b35] text-white font-bold">
                                  {language === 'gu' ? 'આજે' : language === 'hi' ? 'आज' : 'Today'}
                                </span>
                              )}
                            </div>
                            {getDescription(day) && (
                              <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {getDescription(day)}
                              </p>
                            )}
                          </div>
                          <div className={`flex-shrink-0 text-xs px-3 py-1 rounded-full ${
                            day.category === 'national' 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {getCategoryLabel(day.category)}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredDays.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">
                  {language === 'gu' ? 'આ વર્ષ માટે કોઈ દિવસો મળ્યા નથી' : 
                   language === 'hi' ? 'इस वर्ष के लिए कोई दिन नहीं मिले' :
                   'No days found for this year'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
