"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import { useAuth } from "@/contexts/AuthContext";

export default function EnquiryPopup() {
  const { user, loading, isEnquiryModalOpen, showEnquiryModal, hideEnquiryModal } = useAuth();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    if (user || isAdminRoute) {
      if (isEnquiryModalOpen) hideEnquiryModal();
      return;
    }

        if (!isEnquiryModalOpen && !loading) {
          const timer = setTimeout(() => {
            if (!user) {
              showEnquiryModal();
            }
          }, 60000); 

          return () => clearTimeout(timer);
        }
  }, [user, loading, isEnquiryModalOpen]);

  if (user || isAdminRoute) return null;

  return (
    <AnimatePresence>
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg mx-auto"
          >
            <EnquiryForm onClose={hideEnquiryModal} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

