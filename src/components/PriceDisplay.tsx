"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useOffer } from "@/hooks/useOffer";
import { Flame } from "lucide-react";

interface PriceDisplayProps {
  amount: number | string;
  className?: string;
  showBadge?: boolean;
  showUrgency?: boolean;
}

export function PriceDisplay({ amount, className = "", showBadge = true, showUrgency = true }: PriceDisplayProps) {
  const { theme } = useTheme();
  const { offer, isOfferValid, loading } = useOffer();

  // If loading or offer is not valid, just show the normal amount.
  if (loading || !isOfferValid || !offer) {
    return <span className={`font-black ${className}`}>₹ {amount}</span>;
  }

  // Check if the amount passed is related to this offer (501)
  const isTargetAmount = Number(amount) === offer.original_price || Number(amount) === offer.offer_price;
  
  if (!isTargetAmount) {
    return <span className={`font-black ${className}`}>₹ {amount}</span>;
  }

  // Simply show the offer price prominently
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`font-black text-[#ff6b35] ${className} drop-shadow-sm`}>
          ₹{offer.offer_price}
        </span>
      </div>
      
      {showBadge && (
        <div className="flex items-center gap-1 mt-0.5 bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-[#ff6b35]/20">
          <Flame className="w-3 h-3" />
          <span>{offer.title || `SPECIAL OFFER`}</span>
        </div>
      )}

      {showUrgency && (
        <span className="text-[10px] text-[#ff6b35] font-black tracking-wider mt-0.5 animate-pulse">
          ⚡ ONLY {Math.max(0, offer.max_slots - offer.used_slots)} SLOTS LEFT
        </span>
      )}
    </div>
  );
}
