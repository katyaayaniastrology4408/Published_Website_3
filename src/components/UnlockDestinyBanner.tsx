"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export default function UnlockDestinyBanner() {
  const { user, showAuthModal } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (!user && !hasDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [user, hasDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
  };

  if (!isVisible || user) return null;

  return (
    <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none lg:hidden"
        >
        <div className={`pointer-events-auto relative p-5 rounded-2xl shadow-2xl border w-full max-w-sm sm:max-w-md ${
          theme === 'dark' 
            ? 'bg-[#1a1a2e]/98 border-[#ff6b35]/30 text-[#f5f0e8]' 
            : 'bg-white/98 border-[#ff6b35]/20 text-[#4a3f35]'
        } backdrop-blur-lg`}>
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 opacity-50" />
          </button>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ff6b35]/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <Sparkles className="w-5 h-5 text-[#ff6b35]" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-cinzel)] text-lg font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b35] to-[#ff8c5e]">
                Unlock Your Destiny
              </h3>
              <p className="text-[13px] sm:text-sm opacity-80 mb-4 leading-relaxed font-medium">
                Sign in to get personalized daily horoscopes, track your spiritual journey, and access premium cosmic insights.
              </p>
              
              <Button 
                onClick={() => showAuthModal('signin')}
                size="sm"
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold h-10 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
