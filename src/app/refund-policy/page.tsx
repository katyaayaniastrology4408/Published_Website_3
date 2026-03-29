"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

export default function RefundPolicyPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-[#ff6b35] hover:text-[#ff8c5e]">
                <ChevronLeft className="w-4 h-4 mr-2" />
                {mounted ? t("Back to Home") : "Back to Home"}
              </Button>
            </Link>

              <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-8 text-gradient-ancient">
                {mounted ? t("Refund Policy") : "Refund Policy"}
              </h1>

              <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/30'}`}>
                  <CardContent className="p-8 space-y-6">
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">
                      {mounted ? t("Refund Policy") : "Refund Policy"}
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'} leading-relaxed text-lg`}>
                      {mounted ? t("Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.") : "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion."}
                    </p>
                  </CardContent>
                </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
