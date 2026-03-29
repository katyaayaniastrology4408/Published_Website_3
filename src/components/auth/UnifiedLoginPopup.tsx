"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function UnifiedLoginPopup() {
  const { user, showAuthModal } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
      if (user) {
        setIsVisible(false);
        return;
      }

        const timer = setTimeout(() => {
          if (!user) {
            setIsVisible(true);
          }
        }, 2000);

      return () => clearTimeout(timer);
    }, [user]);

    const handleDismiss = () => {
      setIsVisible(false);
      sessionStorage.setItem('unified-login-popup-dismissed', 'true');
    };

  if (user || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="fixed z-[100] w-[calc(100%-2rem)] max-w-sm 
                     bottom-6 right-4
                     lg:right-6 lg:bottom-6"
        >
        <div className={`relative overflow-hidden rounded-[2rem] border-2 shadow-2xl ${
          theme === 'dark' 
            ? 'bg-[#12121a] border-[#ff6b35]/30 text-[#f5f0e8]' 
            : 'bg-white border-[#ff6b35]/20 text-[#2d1810]'
        }`}>
          {/* Decorative background element */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#ff6b35]/10 rounded-full blur-2xl" />
          
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#ff6b35]/10 text-[#a0998c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#ff6b35]/10">
                <Sparkles className="w-5 h-5 text-[#ff6b35]" />
              </div>
              <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-xl">
                Unlock Your Destiny
              </h3>
            </div>

            <p className={`mb-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
              Sign in to get personalized daily horoscopes, track your spiritual journey, and access premium cosmic insights.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  showAuthModal('signin');
                  setIsVisible(false);
                }}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 group"
              >
                <LogIn className="w-4 h-4" />
                Sign In Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
