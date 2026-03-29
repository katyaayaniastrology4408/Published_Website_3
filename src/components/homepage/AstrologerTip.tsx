"use client";

import { Lightbulb, Star, Quote } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { useState, useEffect } from "react";

// ─── Static template data (replace with API/DB later) ────────────────────────

const tipData = {
  en: {
    badge: "Astrologer's Wisdom",
    title: "Tip of the Day",
    subtitle: "Daily guidance from Rudram Joshi",
    tips: [
      { title: "Mercury Retrograde Reminder", tip: "Avoid signing contracts or making major decisions during Mercury retrograde. Use this period for reflection, review, and revision rather than new beginnings.", category: "Planetary" },
      { title: "Moon & Emotions", tip: "Pay attention to your emotional state during the full moon. This is a powerful time to release what no longer serves you and set intentions for new cycles.", category: "Moon" },
      { title: "Rahu-Ketu Axis", tip: "The Rahu-Ketu axis reveals your karmic path. Rahu shows desires to pursue; Ketu shows wisdom you already carry. Balance both for spiritual growth.", category: "Karma" },
      { title: "Saturn's Discipline", tip: "Saturn rewards patience and hard work. Don't resist its lessons — embrace discipline and structure. Delays under Saturn are redirections, not rejections.", category: "Planets" },
      { title: "Lagna Ascendant Power", tip: "Your Lagna (ascendant) shapes your physical presence and life approach. Strengthen it through yoga, meditation, and aligning daily routines with your rising sign.", category: "Kundali" },
      { title: "Jupiter's Blessings", tip: "When Jupiter transits your 11th house, expect gains and fulfillment of desires. Prepare by setting clear intentions and being open to blessings in unexpected forms.", category: "Planets" },
      { title: "Navamsa Chart Secrets", tip: "The Navamsa (D9) chart reveals your soul's purpose and marital harmony. A strong Navamsa can redeem a weak birth chart — always study both together.", category: "Kundali" },
    ],
    // Today's tip index — you can make this dynamic (e.g., dayOfYear % tips.length)
    todayIndex: new Date().getDay() % 7,
    authorLabel: "— Rudram Joshi, Katyaayani Astrologer",
    categoryLabel: "Today's Focus",
  },
  hi: {
    badge: "ज्योतिषी का ज्ञान",
    title: "आज का टिप",
    subtitle: "रुद्रम जोशी का दैनिक मार्गदर्शन",
    tips: [
      { title: "बुध वक्री का स्मरण", tip: "बुध वक्री के दौरान अनुबंध पर हस्ताक्षर या बड़े निर्णय लेने से बचें। इस समय का उपयोग चिंतन और समीक्षा के लिए करें।", category: "ग्रह" },
      { title: "चंद्रमा और भावनाएं", tip: "पूर्णिमा पर अपनी भावनात्मक स्थिति पर ध्यान दें। जो आगे काम न आए उसे छोड़ें और नए चक्र के लिए संकल्प लें।", category: "चंद्रमा" },
      { title: "राहु-केतु अक्ष", tip: "राहु-केतु अक्ष आपका कर्मिक पथ दर्शाता है। राहु इच्छाएं दिखाता है; केतु ज्ञान। दोनों का संतुलन आध्यात्मिक विकास देता है।", category: "कर्म" },
      { title: "शनि का अनुशासन", tip: "शनि धैर्य और कठोर परिश्रम को पुरस्कृत करता है। उसके पाठों का विरोध न करें — देरी अस्वीकृति नहीं, पुनर्निर्देशन है।", category: "ग्रह" },
      { title: "लग्न की शक्ति", tip: "आपका लग्न आपके व्यक्तित्व और जीवन दृष्टिकोण को आकार देता है। योग, ध्यान और दैनिक दिनचर्या से इसे सशक्त करें।", category: "कुंडली" },
      { title: "गुरु का आशीर्वाद", tip: "जब गुरु 11वें भाव में गोचर करे, लाभ और इच्छापूर्ति की अपेक्षा करें। स्पष्ट संकल्प लें और अप्रत्याशित रूपों में आशीर्वाद स्वीकार करें।", category: "ग्रह" },
      { title: "नवांश चार्ट के रहस्य", tip: "नवांश (D9) चार्ट आत्मा का उद्देश्य और वैवाहिक सामंजस्य प्रकट करता है। जन्म कुंडली के साथ हमेशा दोनों का अध्ययन करें।", category: "कुंडली" },
    ],
    todayIndex: 0,
    authorLabel: "— रुद्रम जोशी, कात्यायनी ज्योतिषी",
    categoryLabel: "आज का फोकस",
  },
  gu: {
    badge: "જ્યોતિષીની જ્ઞાાન",
    title: "આજની ટિપ",
    subtitle: "રુદ્રમ જોશીનું દૈનિક માર્ગદર્શન",
    tips: [
      { title: "બુધ વક્રીનું સ્મરણ", tip: "બુધ વક્રી દરમિયાન કરાર પર સહી અથવા મોટા નિર્ણય ટાળો. આ સમયનો ઉપયોગ ચિંતન અને સમીક્ષા માટે કરો.", category: "ગ્રહ" },
      { title: "ચંદ્ર અને ભાવનાઓ", tip: "પૂર્ણિમા પર તમારી ભાવનાત્મક સ્થિતિ પર ધ્યાન આપો. જે આગળ કામ ન આવે તે છોડો અને નવા ચક્ર માટે સંકલ્પ લો.", category: "ચંદ્ર" },
      { title: "રાહુ-કેતુ અક્ષ", tip: "રાહુ-કેતુ અક્ષ તમારો કર્મ-માર્ગ દર્શાવે છે. રાહુ ઇચ્છાઓ, કેતુ જ્ઞાાન દર્શાવે. બંનેનું સંતુલન આધ્યાત્મિક વૃદ્ધિ આપે.", category: "કર્મ" },
      { title: "શનિનો શિસ્ત", tip: "શનિ ધૈર્ય અને મહેનત ને ઇનામ આપે છે. વિલંબ અસ્વીકૃતિ નહિ, પુનઃ-દિશા-નિર્દેશ છે.", category: "ગ્રહ" },
      { title: "લગ્નની શક્તિ", tip: "તમારું લગ્ન વ્યક્તિત્વ અને જીવન-દ્રષ્ટિ ઘડે છે. યોગ, ધ્યાન અને દૈનિક દિનચર્યા દ્વારા તેને સશક્ત કરો.", category: "કુંડળી" },
      { title: "ગુરુના આશીર્વાદ", tip: "ગુરુ 11મા ભાવમાં ગોચર કરે ત્યારે લાભ અને ઇચ્છા-પૂર્તિ અપેક્ષો. સ્પષ્ટ સંકલ્પ લો અને અણધારી રીતે આવતા આશીર્વાદ સ્વીકારો.", category: "ગ્રહ" },
      { title: "નવાંશ ચાર્ટના રહસ્ય", tip: "નવાંશ (D9) ચાર્ટ આત્માનો ઉદ્દેશ અને વૈવાહિક સૌહાર્દ દર્શાવે. હંમેશા બંને ચાર્ટ ભેગા અભ્યાસ કરો.", category: "કુંડળી" },
    ],
    todayIndex: 0,
    authorLabel: "— રુદ્રમ જોશી, કાત્યાયની જ્યોતિષ",
    categoryLabel: "આજનું ફોકસ",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AstrologerTip() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const isDark = theme === "dark";

  const lang = (language as "en" | "hi" | "gu") in tipData ? (language as "en" | "hi" | "gu") : "en";
  const [todayIndex, setTodayIndex] = useState(0);

  useEffect(() => {
    // Set index on client to avoid hydration mismatch
    setTodayIndex(new Date().getDay() % 7);
  }, []);

  const content = tipData[lang];
  const today = content.tips[todayIndex];

  return (
    <section className={`py-20 px-6 ${isDark ? "bg-[#05030a]" : "bg-[#fff8f0]"}`}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ff6b35]/30 bg-[#ff6b35]/5 mb-5">
            <Lightbulb className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#ff6b35]">
              {content.badge}
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-gradient-ancient uppercase tracking-widest">
            {content.title}
          </h2>
          <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-black/40"}`}>
            {content.subtitle}
          </p>
        </div>

        {/* Tip Card */}
        <div className={`relative rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#0d0b1a] border-white/5 shadow-2xl shadow-orange-500/5"
            : "bg-white border-orange-100 shadow-xl shadow-orange-500/5"
        }`}>

          {/* Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative p-8 md:p-10">

            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-orange-400" />
              </div>
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${isDark ? "text-orange-400/70" : "text-orange-500/70"}`}>
                {content.categoryLabel} • {today.category}
              </span>
            </div>

            {/* Title */}
            <h3 className={`font-[family-name:var(--font-cinzel)] text-xl md:text-2xl font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
              {today.title}
            </h3>

            {/* Quote */}
            <div className="relative">
              <Quote className={`absolute -top-2 -left-1 w-6 h-6 ${isDark ? "text-orange-500/20" : "text-orange-300/40"}`} />
              <p className={`text-base leading-relaxed pl-6 ${isDark ? "text-white/75" : "text-black/65"}`}>
                {today.tip}
              </p>
            </div>

            {/* Divider + Author */}
            <div className={`mt-8 pt-6 border-t flex items-center gap-3 ${isDark ? "border-white/5" : "border-orange-50"}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                RJ
              </div>
              <p className={`text-xs font-medium italic ${isDark ? "text-white/40" : "text-black/40"}`}>
                {content.authorLabel}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
