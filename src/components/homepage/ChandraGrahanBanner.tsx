"use client";

import { useState, useEffect } from "react";
import { Moon, X, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Link from "next/link";

const content = {
  hi: {
    badge: "आज का ग्रहण",
    title: "चंद्र ग्रहण 2026",
    subtitle: "साल का पहला चंद्र ग्रहण — 3 मार्च 2026",
    summary:
      "आज 3 मार्च को साल का पहला चंद्र ग्रहण लग रहा है। यह सिंह राशि में लगेगा और भारत सहित पूरे एशिया में दिखाई देगा। आसमान में चांद लाल रंग का नजर आएगा — इसे ब्लड मून कहते हैं।",
    timingTitle: "ग्रहण का समय",
    timings: [
      { label: "ग्रहण प्रारंभ", time: "दोपहर 3:20 बजे" },
      { label: "खग्रास प्रारंभ", time: "शाम 4:34 बजे" },
      { label: "ग्रहण मध्य", time: "शाम 5:33 बजे" },
      { label: "ग्रहण समाप्त", time: "शाम 6:47 बजे" },
    ],
    sutakTitle: "सूतक काल",
    sutakText:
      "सूतक काल सुबह 6:20 बजे से प्रारंभ हो चुका है। इस दौरान कोई नया काम, पूजा-पाठ या यात्रा न करें।",
    bhadraTitle: "भद्रा का समय",
    bhadraText: "भद्रा सुबह 1:25 बजे से सुबह 4:30 बजे तक प्रभावी रही।",
    whySpecialTitle: "क्यों खास है यह ग्रहण?",
    whySpecialText:
      "पूर्ण चंद्रग्रहण होने के कारण आसमान में चांद लाल रंग का दिखेगा (ब्लड मून)। चंद्रमा की केतु से युति होगी और ग्रहण योग बनेगा।",
    whereTitle: "कहां-कहां दिखेगा?",
    whereText:
      "दिल्ली-एनसीआर, उत्तर प्रदेश, कोलकाता, चेन्नई, मुंबई, हैदराबाद, गुवाहाटी, ईटानगर। पूरे एशिया, ऑस्ट्रेलिया, पैसिफिक द्वीप और उत्तरी-दक्षिणी अमेरिका में भी।",
    doNotTitle: "ग्रहण में न करें ये काम",
    doNotList: [
      "ग्रहण के समय सोने से बचें",
      "भोजन न करें",
      "रसोई का काम न करें",
      "पूजा-पाठ और शुभ कार्य शुरू न करें, यात्रा से बचें",
      "कोई नई वस्तु न खरीदें",
      "सिलाई-कढ़ाई या नुकीले औजारों का उपयोग न करें",
    ],
    astroTitle: "ज्योतिषीय प्रभाव",
    astroText:
      "चंद्र ग्रहण सिंह राशि में लगेगा। शुक्र मीन राशि में तथा सूर्य, बुध, मंगल व राहु कुंभ राशि में रहेंगे। सभी राशियों पर ग्रहों का विशेष प्रभाव रहेगा।",
    disclaimer:
      "यह जानकारी सामान्य मान्यताओं और ज्योतिष पर आधारित है। वैज्ञानिक दृष्टिकोण से ग्रहण एक सामान्य खगोलीय घटना है।",
    readMore: "विस्तार से पढ़ें",
    readLess: "कम करें",
  },
  en: {
    badge: "Today's Eclipse",
    title: "Lunar Eclipse 2026",
    subtitle: "First Lunar Eclipse of the Year — March 3, 2026",
    summary:
      "Today, March 3rd, the year's first lunar eclipse is occurring. It will be in Leo (Simha Rashi) and will be visible across India and Asia. The moon will appear red — known as the Blood Moon.",
    timingTitle: "Eclipse Timings",
    timings: [
      { label: "Eclipse Begins", time: "3:20 PM" },
      { label: "Total Phase Begins", time: "4:34 PM" },
      { label: "Maximum Eclipse", time: "5:33 PM" },
      { label: "Eclipse Ends", time: "6:47 PM" },
    ],
    sutakTitle: "Sutak Kaal (Inauspicious Period)",
    sutakText:
      "Sutak Kaal started at 6:20 AM. Avoid starting new tasks, religious activities or travel during this period.",
    bhadraTitle: "Bhadra Timing",
    bhadraText: "Bhadra was active from 1:25 AM to 4:30 AM.",
    whySpecialTitle: "Why Is This Eclipse Special?",
    whySpecialText:
      "This is a total lunar eclipse, causing the moon to appear blood red (Blood Moon). The Moon will be in conjunction with Ketu, forming an eclipse yoga.",
    whereTitle: "Visible Locations",
    whereText:
      "Delhi-NCR, Uttar Pradesh, Kolkata, Chennai, Mumbai, Hyderabad, Guwahati, Itanagar. Also visible across Asia, Australia, Pacific Islands, and North & South America.",
    doNotTitle: "What Not to Do During Eclipse",
    doNotList: [
      "Avoid sleeping during the eclipse",
      "Do not eat food",
      "Avoid cooking",
      "Avoid starting auspicious work, worship or travel",
      "Do not buy new items",
      "Avoid using sharp tools or needlework",
    ],
    astroTitle: "Astrological Impact",
    astroText:
      "The lunar eclipse is in Leo. Venus is in Pisces while Sun, Mercury, Mars and Rahu are in Aquarius. All zodiac signs will experience special planetary influences.",
    disclaimer:
      "This information is based on traditional beliefs and astrology. From a scientific perspective, a lunar eclipse is a normal astronomical event.",
    readMore: "Read More",
    readLess: "Show Less",
  },
  gu: {
    badge: "આજનું ગ્રહણ",
    title: "ચંદ્ર ગ્રહણ 2026",
    subtitle: "વર્ષનું પ્રથમ ચંદ્ર ગ્રહણ — 3 માર્ચ 2026",
    summary:
      "આજે 3 માર્ચે વર્ષનું પ્રથમ ચંદ્ર ગ્રહણ લાગી રહ્યું છે. આ સિંહ રાશિમાં લાગશે અને ભારત સહિત સમગ્ર એશિયામાં દેખાશે. આકાશમાં ચાંદ લાલ રંગનો દેખાશે — આને બ્લડ મૂન કહેવાય છે.",
    timingTitle: "ગ્રહણનો સમય",
    timings: [
      { label: "ગ્રહણ શરૂ", time: "બપોરે 3:20 કલાકે" },
      { label: "ખગ્રાસ શરૂ", time: "સાંજે 4:34 કલાકે" },
      { label: "ગ્રહણ મધ્ય", time: "સાંજે 5:33 કલાકે" },
      { label: "ગ્રહણ સમાપ્ત", time: "સાંજે 6:47 કલાકે" },
    ],
    sutakTitle: "સૂતક કાળ",
    sutakText:
      "સૂતક કાળ સવારે 6:20 કલાકે શરૂ થઈ ગયો છે. આ દરમ્યાન કોઈ નવું કામ, પૂજા-પાઠ કે મુસાફરી ન કરો.",
    bhadraTitle: "ભદ્રાનો સમય",
    bhadraText: "ભદ્રા સવારે 1:25 થી સવારે 4:30 સુધી અસરકારક રહ્યી.",
    whySpecialTitle: "આ ગ્રહણ શા માટે ખાસ છે?",
    whySpecialText:
      "સંપૂર્ણ ચંદ્ર ગ્રહણ હોવાથી આકાશમાં ચાંદ લાલ રંગનો દેખાશે (બ્લડ મૂન). ચંદ્રની કેતુ સાથે યુતિ થશે અને ગ્રહણ યોગ બનશે.",
    whereTitle: "ક્યાં ક્યાં દેખાશે?",
    whereText:
      "દિલ્હી-NCR, ઉત્તર પ્રદેશ, કોલકાતા, ચેન્નાઈ, મુંબઈ, હૈદ્રાબાદ, ગુવાહાટી, ઈટાનગર. સમગ્ર એશિયા, ઓસ્ટ્રેલિયા, પ્રશાંત ટાપુઓ અને ઉત્તર-દક્ષિણ અમેરિકામાં પણ.",
    doNotTitle: "ગ્રહણ દરમ્યાન ન કરો આ કામ",
    doNotList: [
      "ગ્રહણ સમયે સૂવાનું ટાળો",
      "ભોજન ન કરો",
      "રસોઈ ન કરો",
      "પૂજા-પાઠ અને શુભ કાર્ય શરૂ ન કરો, મુસાફરી ટાળો",
      "કોઈ નવી વસ્તુ ન ખરીદો",
      "સિલાઈ-ભરત કામ કે અણીદાર ઓજારો ન વાપરો",
    ],
    astroTitle: "જ્યોતિષ પ્રભાવ",
    astroText:
      "ચંદ્ર ગ્રહણ સિંહ રાશિમાં લાગશે. શુક્ર મીન રાશિમાં અને સૂર્ય, બુધ, મંગળ અને રાહુ કુંભ રાશિમાં રહેશે. બધી રાશિઓ પર ગ્રહોનો વિશેષ પ્રભાવ રહેશે.",
    disclaimer:
      "આ માહિતી સામાન્ય માન્યતાઓ અને જ્યોતિષ પર આધારિત છે. વૈજ્ઞાનિક દ્રષ્ટિકોણથી ગ્રહણ એ સામાન્ય ખગોળ ઘટના છે.",
    readMore: "વધુ વાંચો",
    readLess: "ઓછું કરો",
  },
};

export default function ChandraGrahanBanner() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Auto-hide if date has passed (March 3, 2026 is the event date)
  // We keep it visible ON March 3rd, and hide it on March 4th or later.
  const [shouldShow, setShouldShow] = useState(true);

    useEffect(() => {
      const checkDate = () => {
        if (typeof window !== "undefined") {
          const today = new Date();
          // Eclipse ends at 6:47 PM on March 3, 2026. 
          // We hide it slightly after (7:00 PM) to ensure anyone watching the site doesn't see it lingering.
          const eventEndDate = new Date("2026-03-03T19:00:00");
          if (today > eventEndDate) {
            setShouldShow(false);
          }
        }
      };
      checkDate();
    // Check every 30 minutes
    const interval = setInterval(checkDate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || !shouldShow) return null;

  const lang = (language as keyof typeof content) in content ? (language as keyof typeof content) : "en";
  const c = content[lang];
  const isDark = theme === "dark";

  return (
      <div
        className={`w-full transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-[#1a0a2e] via-[#120818] to-[#1a0a2e] border-y border-[#ff6b35]/20"
            : "bg-gradient-to-r from-[#fff5ee] via-[#fffcf8] to-[#fff5ee] border-y border-[#ff6b35]/20"
        }`}
      >
      <div className="max-w-5xl mx-auto px-4 py-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? "bg-[#ff6b35]/20" : "bg-[#ff6b35]/10"
              }`}
            >
              <Moon className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    isDark
                      ? "bg-red-900/30 border-red-500/30 text-red-400"
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                  {c.badge}
                </span>
                <h3
                  className={`font-[family-name:var(--font-cinzel)] text-base font-bold ${
                    isDark ? "text-[#f5f0e8]" : "text-[#4a3f35]"
                  }`}
                >
                  {c.title}
                </h3>
              </div>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-[#c4bdb3]" : "text-[#6b5c50]"}`}
              >
                {c.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                isDark
                  ? "border-[#ff6b35]/30 text-[#ff8c5e] hover:bg-[#ff6b35]/10"
                  : "border-[#ff6b35]/40 text-[#ff6b35] hover:bg-[#ff6b35]/10"
              }`}
            >
              {expanded ? (
                <>
                  {c.readLess} <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  {c.readMore} <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? "text-[#c4bdb3] hover:bg-white/10"
                  : "text-[#6b5c50] hover:bg-black/5"
              }`}
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <p
          className={`mt-3 text-sm leading-relaxed ${
            isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
          }`}
        >
          {c.summary}
        </p>

        {/* Quick timings strip */}
        <div className="mt-3 flex flex-wrap gap-2">
          {c.timings.map((t) => (
            <div
              key={t.label}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isDark
                  ? "bg-[#ff6b35]/10 border-[#ff6b35]/20 text-[#ffa07a]"
                  : "bg-[#ff6b35]/8 border-[#ff6b35]/25 text-[#d4541a]"
              }`}
            >
              <Moon className="w-3 h-3 opacity-70" />
              <span className="opacity-70">{t.label}:</span>
              <span className="font-bold">{t.time}</span>
            </div>
          ))}
        </div>

            {/* Read Full Article Link */}
            <div className="mt-4 flex justify-end">
              <Link 
                href="/blog/chandra-grahan-2026-kab-hai-samay-upay"
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${
                  isDark 
                    ? "bg-[#ff6b35] border-[#ff6b35] text-white hover:bg-[#ff8c5e]" 
                    : "bg-[#ff6b35] border-[#ff6b35] text-white hover:bg-[#ff8c5e]"
                }`}
              >
                {language === 'gu' ? 'વિગતવાર લેખ વાંચો' : language === 'hi' ? 'पूरा लेख पढ़ें' : 'Read Full Article'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
  
            {/* Expanded Section */}
            {expanded && (
            <div className="mt-5 space-y-5 border-t border-[#ff6b35]/15 pt-5">
              {/* Sutak */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-[#ff6b35]/5 border-[#ff6b35]/15"
                    : "bg-[#fff5ee] border-[#ff6b35]/20"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-[#ffa07a]" : "text-[#d4541a]"
                  }`}
                >
                  {c.sutakTitle}
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                  }`}
                >
                  {c.sutakText}
                </p>
              </div>
  
              {/* Bhadra */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-white/3 border-white/8"
                    : "bg-white border-[#ff6b35]/10"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-[#f5f0e8]" : "text-[#4a3f35]"
                  }`}
                >
                  {c.bhadraTitle}
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                  }`}
                >
                  {c.bhadraText}
                </p>
              </div>
  
              {/* Why Special */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-white/3 border-white/8"
                    : "bg-white border-[#ff6b35]/10"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-[#f5f0e8]" : "text-[#4a3f35]"
                  }`}
                >
                  {c.whySpecialTitle}
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                  }`}
                >
                  {c.whySpecialText}
                </p>
              </div>
  
              {/* Where Visible */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-white/3 border-white/8"
                    : "bg-white border-[#ff6b35]/10"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-[#f5f0e8]" : "text-[#4a3f35]"
                  }`}
                >
                  {c.whereTitle}
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                  }`}
                >
                  {c.whereText}
                </p>
              </div>
  
              {/* Do Not */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-red-900/10 border-red-500/15"
                    : "bg-red-50 border-red-100"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-2 flex items-center gap-1.5 ${
                    isDark ? "text-red-400" : "text-red-700"
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {c.doNotTitle}
                </h4>
                <ul className="space-y-1">
                  {c.doNotList.map((item, i) => (
                    <li
                      key={i}
                      className={`text-sm flex items-start gap-2 ${
                        isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                      }`}
                    >
                      <span className="text-red-500 mt-0.5 font-bold text-xs">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Astrological Impact */}
              <div
                className={`p-5 rounded-[2rem] border ${
                  isDark
                    ? "bg-white/3 border-white/8"
                    : "bg-white border-[#ff6b35]/10"
                }`}
              >
                <h4
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-[#f5f0e8]" : "text-[#4a3f35]"
                  }`}
                >
                  {c.astroTitle}
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-[#c4bdb3]" : "text-[#5a4f44]"
                  }`}
                >
                  {c.astroText}
                </p>
              </div>

            {/* Disclaimer */}
            <p
              className={`text-[11px] italic opacity-60 ${
                isDark ? "text-[#c4bdb3]" : "text-[#6b5c50]"
              }`}
            >
              {c.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
