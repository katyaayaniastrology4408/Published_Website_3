"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, Loader2, CheckCircle, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { contentData } from "@/data/homepage";

const STORAGE_KEY = "newsletter-popup-subscribed";

export default function NewsletterPopup() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const content = contentData[language];
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Don't show if already subscribed/dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setIsVisible(true);
      }
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as shown so it never shows again
    localStorage.setItem(STORAGE_KEY, "dismissed");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        localStorage.setItem(STORAGE_KEY, "subscribed");
        setTimeout(() => setIsVisible(false), 2500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const texts = {
    hi: {
      title: "कॉस्मिक अपडेट्स पाएं",
      subtitle: "ज्योतिष अपडेट्स, राशिफल और विशेष ऑफर सीधे आपके इनबॉक्स में",
      placeholder: "आपका ईमेल दर्ज करें",
      button: "सदस्यता लें",
      success: "सफलतापूर्वक सदस्यता ली!",
      successDesc: "धन्यवाद! आप जल्द ही अपडेट्स प्राप्त करेंगे।",
      error: "कृपया पुनः प्रयास करें",
      noSpam: "कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।",
    },
    gu: {
      title: "કોસ્મિક અપડેટ્સ મેળવો",
      subtitle: "જ્યોતિષ અપડેટ્સ, રાશિફળ અને વિશેષ ઑફર્સ સીધા તમારા ઇનબોક્સમાં",
      placeholder: "તમારો ઈમેલ દાખલ કરો",
      button: "સબ્સ્ક્રાઇબ કરો",
      success: "સફળતાપૂર્વક સબ્સ્ક્રાઇબ થયું!",
      successDesc: "આભાર! તમે ટૂંક સમયમાં અપડેટ્સ મેળવશો.",
      error: "કૃપા કરી ફરીથી પ્રયાસ કરો",
      noSpam: "કોઈ સ્પામ નહીં. ગમે ત્યારે અનસબ્સ્ક્રાઇબ કરો.",
    },
    en: {
      title: "Get Cosmic Updates",
      subtitle: "Astrology insights, horoscopes & special offers delivered to your inbox",
      placeholder: "Enter your email",
      button: "Subscribe",
      success: "Successfully Subscribed!",
      successDesc: "Thank you! You'll receive updates soon.",
      error: "Please try again",
      noSpam: "No spam. Unsubscribe anytime.",
    },
  };

  const t = texts[language] || texts.en;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed z-[201] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`relative w-full max-w-md overflow-hidden rounded-3xl border-2 shadow-2xl pointer-events-auto ${
                theme === "dark"
                  ? "bg-[#12121a] border-[#ff6b35]/30 text-[#f5f0e8]"
                  : "bg-white border-[#ff6b35]/20 text-[#2d1810]"
              }`}
            >
              {/* Decorative elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#ff6b35]/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#ff6b35]/10 rounded-full blur-3xl" />

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-[#a0998c]"
                    : "hover:bg-black/5 text-[#6b5847]"
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#ff6b35] via-[#ff8c5e] to-[#ff6b35]" />

              <div className="p-8">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-xl mb-2">
                      {t.success}
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
                      {t.successDesc}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Icon */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 rounded-2xl bg-[#ff6b35]/10">
                        <Mail className="w-6 h-6 text-[#ff6b35]" />
                      </div>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-[#ff6b35]/60 fill-[#ff6b35]/40"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-2xl mb-2">
                      {t.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`text-sm mb-6 leading-relaxed ${
                      theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"
                    }`}>
                      {t.subtitle}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.placeholder}
                        required
                        autoFocus
                        className={`w-full px-4 py-3.5 text-sm rounded-xl border-2 transition-all outline-none ${
                          theme === "dark"
                            ? "bg-[#1a1a2e] border-[#ff6b35]/20 text-[#f5f0e8] placeholder:text-[#6b5847] focus:border-[#ff6b35]/60"
                            : "bg-[#faf7f2] border-[#ff6b35]/15 text-[#2d1810] placeholder:text-[#a0998c] focus:border-[#ff6b35]/50"
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-[#ff6b35] text-white hover:bg-[#e55a2b] disabled:opacity-60 active:scale-[0.98]"
                      >
                        {status === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {t.button}
                      </button>
                    </form>

                    {/* Error */}
                    {status === "error" && (
                      <p className="text-red-500 text-xs mt-2 text-center">{t.error}</p>
                    )}

                    {/* No spam note */}
                    <p className={`text-xs text-center mt-4 ${
                      theme === "dark" ? "text-[#6b5847]" : "text-[#a0998c]"
                    }`}>
                      {t.noSpam}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
