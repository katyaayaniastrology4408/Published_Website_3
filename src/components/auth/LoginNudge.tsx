"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";

export default function LoginNudge() {
  const { user, loading, showAuthModal } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show nudge after 5 seconds if user is not logged in
    const timer = setTimeout(() => {
      if (!user && !loading && !isDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, loading, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Optionally save to localStorage so it doesn't show again in this session
    sessionStorage.setItem('login-nudge-dismissed', 'true');
  };

  useEffect(() => {
    if (sessionStorage.getItem('login-nudge-dismissed')) {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible || user) return null;

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-3rem)] max-w-sm lg:hidden"
        >
        <div className={`relative p-6 rounded-[2rem] shadow-2xl border ${
          theme === 'dark' 
            ? 'bg-[#12121a] border-[#ff6b35]/30 text-white' 
            : 'bg-white border-[#ff6b35]/20 text-[#2d1810]'
        }`}>
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#ff6b35]/10 text-[#ff6b35]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
                <h4 className="font-[family-name:var(--font-cinzel)] font-bold text-lg mb-1">
                  {t("Unlock Your Destiny")}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  {t("Sign in to book personalized consultations and see your daily cosmic alignment.")}
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      showAuthModal('signin');
                      setIsVisible(false);
                    }}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-xl text-sm font-bold"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("Sign In")}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-[#ff6b35] text-sm"
                  >
                    {t("Later")}
                  </Button>

              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
