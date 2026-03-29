"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import X from "lucide-react/dist/esm/icons/x";
import Sun from "lucide-react/dist/esm/icons/sun";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { RASHI_ICONS } from "@/components/RashiIcons";

// ─── Static template data ─────────────────────────────────────────────────────

const rashiData = {
  en: {
    badge: "Daily Horoscope",
    title: "Today's Rashifal",
    subtitle: "Cosmic guidance for all 12 zodiac signs",
    rashis: [
        { name: "Aries",       symbol: "♈︎", color: "#ef4444", tip: "A powerful day for new beginnings. Channel your energy wisely and trust your instincts in career matters." },
        { name: "Taurus",      symbol: "♉︎", color: "#f59e0b", tip: "Financial stability is on the horizon. Avoid impulsive decisions and focus on long-term investments." },
        { name: "Gemini",      symbol: "♊︎", color: "#3b82f6", tip: "Communication brings opportunities today. Express yourself clearly and connections will flourish." },
        { name: "Cancer",      symbol: "♋︎", color: "#8b5cf6", tip: "Family ties strengthen today. A nurturing approach resolves old conflicts and brings harmony home." },
        { name: "Leo",         symbol: "♌︎", color: "#f97316", tip: "Your confidence shines bright. Leadership roles and creative projects receive cosmic support today." },
        { name: "Virgo",       symbol: "♍︎", color: "#10b981", tip: "Attention to detail pays off. Health improvements and work recognition arrive through diligence." },
        { name: "Libra",       symbol: "♎︎", color: "#ec4899", tip: "Balance is your strength today. Relationships deepen and artistic pursuits bring joy and recognition." },
        { name: "Scorpio",     symbol: "♏︎", color: "#dc2626", tip: "Hidden truths surface now. Trust your intuition and let go of what no longer serves your growth." },
        { name: "Sagittarius", symbol: "♐︎", color: "#7c3aed", tip: "Expansion and adventure call. A journey — physical or spiritual — opens new perspectives today." },
        { name: "Capricorn",   symbol: "♑︎", color: "#6b7280", tip: "Discipline brings rewards. Career milestones are within reach — stay consistent and determined." },
        { name: "Aquarius",    symbol: "♒︎", color: "#06b6d4", tip: "Innovation sparks today. Unconventional ideas receive support; your unique vision is your power." },
        { name: "Pisces",      symbol: "♓︎", color: "#8b5cf6", tip: "Dreams and intuition guide you. Spiritual practices and creative work flow with cosmic ease today." },
    ]
},
hi: {
  badge: "दैनिक राशिफल",
  title: "आज का राशिफल",
  subtitle: "सभी 12 राशियों के लिए ब्रह्मांडीय मार्गदर्शन",
    rashis: [
        { name: "मेष",      symbol: "♈︎", color: "#ef4444", tip: "नई शुरुआत के लिए शक्तिशाली दिन। करियर में अपनी प्रवृत्ति पर भरोसा करें और ऊर्जा का सही उपयोग करें।" },
        { name: "वृषभ",    symbol: "♉︎", color: "#f59e0b", tip: "आर्थिक स्थिरता नज़दीक है। आवेशपूर्ण निर्णयों से बचें और दीर्घकालिक निवेश पर ध्यान दें।" },
        { name: "मिथुन",   symbol: "♊︎", color: "#3b82f6", tip: "संवाद से अवसर मिलते हैं। आज स्पष्ट रूप से व्यक्त करें, संबंध प्रगाढ़ होंगे।" },
        { name: "कर्क",    symbol: "♋︎", color: "#8b5cf6", tip: "पारिवारिक बंधन मज़બૂત होते हैं। पुराने विवाद सुलझते हैं और घर में सुकून आता है।" },
        { name: "सिंह",    symbol: "♌︎", color: "#f97316", tip: "आत्मविश्वास चमकता है। नेतृत्व और रचनात्मक कार्यों को आज ब्रह्मांडीय समर्थन मिलता है।" },
        { name: "कन्या",   symbol: "♍︎", color: "#10b981", tip: "विस्तार पर ध्यान देने से फल मिलता है। स्वास्थ्य सुधार और कार्यस्थल पर मान्यता मिलती है।" },
        { name: "तुला",    symbol: "♎︎", color: "#ec4899", tip: "संतुलन आपकी शक्ति है। संबंध गहरे होते हैं और कलात्मक प्रयास खुशी लाते हैं।" },
        { name: "वृश्चિક", symbol: "♏︎", color: "#dc2626", tip: "छुपे सत्य सामने आते हैं। अपनी अंतरात्मा पर भरोसा करें और जो आगे न बढ़ाए उसे छोड़ें।" },
        { name: "ધનુ",     symbol: "♐︎", color: "#7c3aed", tip: "विस्तार और रोमांच बुलाता है। शारीरिक या आध्यात्मिक यात्रा नए दृष्टिकोण खोलती है।" },
        { name: "મકર",     symbol: "♑︎", color: "#6b7280", tip: "अनुशासन से पुरस्कार मिलते हैं। करियर में मील का पत्थर पहुंच के भीतर है।" },
        { name: "કુંભ",    symbol: "♒︎", color: "#06b6d4", tip: "नवाचार जागता है। अपरंपरागत विचारों को समर्थन मिलता है; आपकी अनूठी दृष्टि शक्ति है।" },
        { name: "મીન",     symbol: "♓︎", color: "#8b5cf6", tip: "सपने और अंतर्ज्ञान मार्गदर्शन करते हैं। आध्यात्मिक अभ्यास और रचनात्मक कार्य आसानी से चलते हैं।" },
    ]
},
gu: {
  badge: "દૈનિક રાશિફળ",
  title: "આજનું રાશિફળ",
  subtitle: "12 રાશિઓ માટે કોસ્મિક માર્ગદર્શન",
    rashis: [
        { name: "મેષ",     symbol: "♈︎", color: "#ef4444", tip: "નવી શરૂઆત માટે શક્તિશાળી દિવસ. કારકિર્દીમાં તમારી સૂઝ પર ભરોસો રાખો." },
        { name: "વૃષભ",   symbol: "♉︎", color: "#f59e0b", tip: "આર્થિક સ્થિરતા નજીક છે. આવેગપૂર્ણ નિર્ણયો ટાળો અને લાંબા ગાળાના રોકાણ પર ધ્યાન આપો." },
        { name: "મિથુન",  symbol: "♊︎", color: "#3b82f6", tip: "સંચાર તકો લાવે છે. આજે સ્પષ્ટ રીતે વ્યક્ત થાઓ, સંબંધો ફૂલે-ફળે." },
        { name: "કર્ક",   symbol: "♋︎", color: "#8b5cf6", tip: "પારિવારિક સ્નેહ ગાઢ થાય છે. જૂના ઝઘડા ઉકેલાય છે અને ઘરમાં સૌહાર્દ આવે છે." },
        { name: "સિંહ",   symbol: "♌︎", color: "#f97316", tip: "આત્મવિશ્વાસ ચમકે છે. નેતૃત્વ અને સર્જનાત્મક કાર્યોને આજે કોસ્મિક સહાય મળે છે." },
        { name: "કન્યા",  symbol: "♍︎", color: "#10b981", tip: "વિગત પર ધ્યાન આપવાથી ફળ મળે છે. સ્વાસ્થ્ય સુધાર અને કાર્યસ્થળ પર માન્યતા આવે છે." },
        { name: "તુલા",   symbol: "♎︎", color: "#ec4899", tip: "સંતુલન તમારી શક્તિ છે. સંબંધો ઊંડા થાય છે અને કલાત્મક પ્રયાસ ખુશી લાવે છે." },
        { name: "વૃશ્ચિક", symbol: "♏︎", color: "#dc2626", tip: "છૂપા સત્ય સામે આવે છે. અંતઃકરણ પર ભરોસો રાખો અને જે આગળ ન વધારે તે છોડો." },
        { name: "ધનુ",    symbol: "♐︎", color: "#7c3aed", tip: "વિસ્તાર અને સાહસ બોલાવે છે. શારીરિક અથવા આધ્યાત્મિક યાત્રા નવા દ્રષ્ટિકોણ ખોલે છે." },
        { name: "મકર",    symbol: "♑︎", color: "#6b7280", tip: "શિસ્ત પ્રતિફળ આપે છે. કારકિર્દીનો મોટો સીમાચિહ્ન પહોંચ ભીતર છે." },
        { name: "કુંભ",   symbol: "♒︎", color: "#06b6d4", tip: "નવીનતા જાગે છે. બિન-પ્રચલિત વિચારોને સહાય મળે છે; તમારી અનોખી દ્રષ્ટિ તાકાત છે." },
        { name: "મીન",    symbol: "♓︎", color: "#8b5cf6", tip: "સ્વપ્ન અને અંતઃપ્રેરણા માર્ગ ચીંધે છે. આધ્યાત્મિક અભ્યાસ અને સર્જનાત્મક કાર્ય સહેલાઈથી ચાલે છે." },
    ]
}

};

type Rashi = { name: string; symbol: string; color: string; tip: string };

    function RashiModal({ rashi, index, isDark, language, onClose }: { rashi: Rashi; index: number; isDark: boolean; language: string; onClose: () => void }) {

      const [mounted, setMounted] = useState(false);
      const Icon = RASHI_ICONS[index];
    
      useEffect(() => {
        setMounted(true);
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
      }, []);
    
      useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
      }, [onClose]);
    
      if (!mounted) return null;
    
      return createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
    
            {/* Modal box */}
            <div
              className={`relative w-full max-w-md rounded-[40px] shadow-2xl p-10 md:p-12 overflow-hidden ${
                isDark ? "bg-[#0d0b1a] border border-white/10" : "bg-white border border-orange-100"
              }`}
              style={{ zIndex: 100000 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Background Glow */}
              <div 
                className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] opacity-20 pointer-events-none" 
                style={{ backgroundColor: rashi.color }}
              />

              <div className="absolute top-8 left-10 flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                <Sparkles className="w-3 h-3 text-[#ff6b35]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#ff6b35]">
                  {language === 'gu' ? 'રાશિફળ' : language === 'hi' ? 'राशिफल' : 'Horoscope'}
                </span>
              </div>


            {/* Close */}
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 z-[100001] ${
                isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/5 hover:bg-black/10 text-black"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
  
            {/* SVG Icon */}
            <div
              className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"
              style={{ background: rashi.color + "15" }}
            >
              <Icon color={rashi.color} size={64} />
            </div>
  
            {/* Name */}
            <h3
              className="text-center text-3xl md:text-4xl font-bold font-[family-name:var(--font-cinzel)] mb-2"
              style={{ color: rashi.color }}
            >
              {rashi.name}
            </h3>
            <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 mb-8">
              {rashi.symbol} DAILY PREDICTION
            </p>
  
            {/* Divider */}
            <div className="h-px mb-8" style={{ background: rashi.color + "25" }} />
  
            {/* Prediction */}
            <p className={`text-lg md:text-xl leading-relaxed text-center font-medium ${isDark ? "text-white/80" : "text-black/70"}`}>
              {rashi.tip}
            </p>
          </div>

      </div>,
      document.body
    );
  }

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function RashifalSection() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const isDark = theme === "dark";

  const lang = (language as "en" | "hi" | "gu") in rashiData ? (language as "en" | "hi" | "gu") : "en";
  const content = rashiData[lang];

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className={`py-24 px-6 relative overflow-hidden ${isDark ? "bg-[#07040e]" : "bg-[#fffaf4]"}`} data-no-translate>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6b35]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff6b35]/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/10 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#ff6b35] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#ff6b35]">
              {content.badge}
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold text-gradient-ancient uppercase tracking-widest mb-4">
            {content.title}
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto opacity-70 mb-10 ${isDark ? "text-white" : "text-black"}`}>
            {content.subtitle}
          </p>

        </div>

        {/* 12 Rashi Grid — click opens popup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {content.rashis.map((rashi, i) => {
              const Icon = RASHI_ICONS[i];
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`rounded-[2.5rem] border p-6 flex flex-col items-center gap-4 text-center transition-all duration-500 w-full group relative overflow-hidden ${
                    isDark
                      ? "bg-[#0d0b1a] border-white/5 hover:border-[#ff6b35]/40 hover:bg-white/5 shadow-lg shadow-black/20"
                      : "bg-white border-orange-100 hover:border-[#ff6b35]/40 shadow-sm hover:shadow-xl hover:shadow-[#ff6b35]/10"
                  }`}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${rashi.color}08 0%, transparent 70%)` }}
                  />

                  <div
                    className="w-16 h-16 rounded-[1.75rem] flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner"
                    style={{ background: rashi.color + "15" }}
                  >
                    <Icon color={rashi.color} size={36} />
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className={`font-bold text-lg ${isDark ? "text-white/90" : "text-black/80"}`}>
                      {rashi.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 group-hover:opacity-60 transition-opacity">
                      {language === 'gu' ? 'તમારું ભાગ્ય' : language === 'hi' ? 'आपका भाग्य' : 'View Destiny'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
      </div>

      {/* Popup Modal */}
        {selected !== null && (
          <RashiModal
            rashi={content.rashis[selected]}
            index={selected}
            isDark={isDark}
            language={language}
            onClose={() => setSelected(null)}
          />
        )}
    </section>
  );
}
