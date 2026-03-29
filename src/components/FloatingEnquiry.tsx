"use client";

import { MessageSquareText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMenu } from "@/contexts/MenuContext";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function FloatingEnquiry() {
  const { showEnquiryModal, user } = useAuth();
  const { isMenuOpen } = useMenu();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Hide when user is logged in, on admin routes, or when mobile menu is open
  if (user || isAdminRoute || isMenuOpen) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => showEnquiryModal()}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[#ff6b35] text-white shadow-2xl shadow-[#ff6b35]/40 flex items-center gap-2 group hover:pr-6 transition-all duration-300 border-2 border-white/20"
      aria-label="Enquire now"
    >
      <MessageSquareText className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 font-bold whitespace-nowrap">
        Enquire Now
      </span>
    </motion.button>
  );
}
