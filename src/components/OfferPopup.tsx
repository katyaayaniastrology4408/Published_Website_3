"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useOffer } from "@/hooks/useOffer";

interface OfferSettings {
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  original_price: number;
  offer_price: number;
  title: string;
  urgency_text: string;
  popup_text: string;
  payment_link: string | null;
}

export function OfferPopup() {
  const { offer, isOfferValid, loading } = useOffer();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading && isOfferValid && offer) {
      // Show popup if not dismissed in this session
      const dismissed = sessionStorage.getItem("offer_popup_dismissed");
      if (!dismissed) {
        // Delay popup slightly for better UX
        setTimeout(() => setIsVisible(true), 1500);
      }
    }
  }, [loading, isOfferValid, offer]);

  // Countdown timer logic
  useEffect(() => {
    if (!offer?.end_date || !isVisible) return;

    const timer = setInterval(() => {
      const difference = new Date(offer.end_date!).getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setIsVisible(false);
        return;
      }

      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [offer, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("offer_popup_dismissed", "true");
  };

  if (!offer || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-[calc(100%-48px)] max-w-sm md:w-96 shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="relative">
            {/* Close button */}
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content banner */}
            <div className="bg-gradient-to-br from-[#ff6b35] to-[#ff4500] p-6 text-white text-center shadow-inner relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>

                <motion.div 
                    animate={{ rotate: [-5, 5, -5] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex justify-center mb-3"
                >
                    <PartyPopper className="w-10 h-10 text-yellow-300 drop-shadow-md" />
                </motion.div>

                <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-bold mb-2 tracking-wide drop-shadow-md">
                    {offer.title}
                </h3>
                
                <p className="text-sm font-medium mb-4 text-white/90 leading-relaxed">
                    {offer.popup_text}
                </p>

                <div className="flex items-center justify-center gap-3 mb-5 bg-black/20 py-2.5 px-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="text-right">
                        <span className="text-2xl font-black text-yellow-300 drop-shadow-sm leading-none">₹{offer.offer_price}</span>
                    </div>
                </div>

                {timeLeft && (
                  <div className="flex flex-col items-center mb-5 bg-black/10 py-2 rounded-lg border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-white/90 mb-1.5 font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Offer Ends In</span>
                    </div>
                    <div className="flex gap-2 text-center text-lg font-mono font-bold text-yellow-300">
                        {timeLeft.d > 0 && <span className="bg-black/20 px-2 rounded">{timeLeft.d}d</span>}
                        <span className="bg-black/20 px-2 rounded">{String(timeLeft.h).padStart(2, '0')}h</span>
                        <span className="bg-black/20 px-2 rounded">{String(timeLeft.m).padStart(2, '0')}m</span>
                        <span className="bg-black/20 px-2 rounded">{String(timeLeft.s).padStart(2, '0')}s</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    handleClose();
                    window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                  }} 
                  className="block w-full group relative"
                >
                    <div className="absolute inset-0 bg-yellow-400 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative w-full bg-white text-[#ff4500] hover:bg-yellow-50 font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest text-sm shadow-lg border border-white/50 active:scale-[0.98] flex items-center justify-center">
                        Book Now
                    </div>
                </button>

                {offer.urgency_text && (
                  <p className="text-[10px] text-yellow-200 mt-4 font-semibold uppercase tracking-widest">
                    {offer.urgency_text}
                  </p>
                )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
