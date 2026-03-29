"use client";

import { useState, useEffect } from "react";
import Sun from "lucide-react/dist/esm/icons/sun";
import Moon from "lucide-react/dist/esm/icons/moon";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { contentData } from "@/data/homepage";

export default function CosmicInsights({ panchangApiData }: { panchangApiData?: any }) {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const content = contentData[language].cosmic;

  const [panchang, setPanchang] = useState({
    moonPhase: content.moonPhase,
    tithi: content.tithi,
    nakshatra: content.nakshatra,
    yoga: content.yoga,
    karana: content.karana,
    sunrise: "--",
    sunset: "--"
  });

  const [localPanchangApi, setLocalPanchangApi] = useState<any>(null);

  // Only fetch if no data was passed as prop
  useEffect(() => {
    if (panchangApiData) {
      setLocalPanchangApi(panchangApiData);
      return;
    }

    const fetchPanchangData = async () => {
      try {
        const res = await fetch('/api/panchang');
          if (!res.ok) return;
          const data = await res.json();
        if (data.success) {
          setLocalPanchangApi(data.data);
        }
      } catch (err) {
        console.error("Error fetching panchang data:", err);
      }
    };

    fetchPanchangData();
  }, [panchangApiData]);

  useEffect(() => {
    const apiData = localPanchangApi;
    if (apiData) {
      const to12h = (time24: string) => {
        const [hStr, mStr] = time24.split(':');
        let h = parseInt(hStr);
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${h}:${mStr} ${period}`;
      };

      const getPanchangLabel = (item: { english: string; hindi: string; gujarati: string }) => {
        if (language === 'gu') return item.gujarati;
        if (language === 'hi') return item.hindi;
        return item.english;
      };

      const pakshaLabel = getPanchangLabel(apiData.paksha);

      setPanchang({
        moonPhase: pakshaLabel,
        tithi: getPanchangLabel(apiData.tithi),
        nakshatra: getPanchangLabel(apiData.nakshatra),
        yoga: getPanchangLabel(apiData.yoga),
        karana: getPanchangLabel(apiData.karana),
        sunrise: to12h(apiData.sunrise),
        sunset: to12h(apiData.sunset),
      });
    } else {
      setPanchang(prev => ({
        ...prev,
        moonPhase: content.moonPhase,
        tithi: content.tithi,
        nakshatra: content.nakshatra,
        yoga: content.yoga,
        karana: content.karana,
      }));
    }
  }, [language, content, localPanchangApi]);

  return (
    <section className={`py-20 px-6 overflow-hidden ${theme === 'dark' ? 'bg-[#05030a]' : 'bg-[#fffcf8]'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/5 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ff6b35]">{content.badge}</span>
          </div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-lg md:text-2xl font-bold text-gradient-ancient mb-6 uppercase tracking-widest">
            {content.title}
          </h2>
        </div>

        <div>
          <div className={`relative p-8 md:p-10 rounded-[40px] border transition-all duration-500 overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#0d0d1a] border-white/5 shadow-2xl shadow-orange-500/5' 
              : 'bg-white border-[#ff6b35]/10 shadow-xl'
          }`}>
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-[100px]" />
            
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-5 mb-12 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                <Calendar className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold tracking-wider">{content.panchangTitle}</h3>
                <p className="text-sm uppercase tracking-[0.3em] opacity-60 font-medium">{content.alignment}</p>
              </div>
            </div>

            {/* Current Moon Phase Card */}
            <div className={`p-8 rounded-3xl mb-10 flex flex-col items-center justify-center text-center transition-all ${
              theme === 'dark' ? 'bg-white/5 border border-white/5 shadow-inner' : 'bg-orange-50'
            }`}>
                <div className="relative mb-6">
                  <div className="absolute inset-0 blur-2xl bg-orange-500/20 rounded-full" />
                <Moon className="w-14 h-14 text-orange-400 relative z-10" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-400 font-bold mb-2">{content.moonPhaseLabel}</p>
              <h4 className="text-3xl font-bold tracking-tight">{panchang.moonPhase}</h4>
            </div>

            {/* Panchang Details */}
            <div className="space-y-5">
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-orange-100 hover:bg-orange-50/50'}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-2">{content.tithiLabel}</p>
                <p className="text-base font-semibold text-orange-400 leading-relaxed">{panchang.tithi}</p>
              </div>
              
              <div className={`p-6 rounded-3xl border transition-colors ${theme === 'dark' ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-orange-100 hover:bg-orange-50/50'}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-2">{content.nakshatraLabel}</p>
                <p className="text-base font-semibold text-orange-400 leading-relaxed">{panchang.nakshatra}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`p-5 rounded-3xl border transition-colors ${theme === 'dark' ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-orange-100 hover:bg-orange-50/50'}`}>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-2">{content.yogaLabel}</p>
                  <p className="text-xs font-semibold leading-relaxed">{panchang.yoga}</p>
                </div>
                <div className={`p-5 rounded-3xl border transition-colors ${theme === 'dark' ? 'border-white/5 bg-white/2 hover:bg-white/5' : 'border-orange-100 hover:bg-orange-50/50'}`}>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mb-2">{content.karanaLabel}</p>
                  <p className="text-xs font-semibold leading-relaxed">{panchang.karana}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10 mt-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Sun className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{content.sunriseLabel}</p>
                    <p className="text-sm font-black">{panchang.sunrise}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Moon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{content.sunsetLabel}</p>
                    <p className="text-sm font-black">{panchang.sunset}</p>
                  </div>
                </div>
              </div>
            </div>
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
  );
}
