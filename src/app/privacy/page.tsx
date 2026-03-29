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

export default function PrivacyPage() {
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

                <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-8 text-[#ff6b35]">
                  {mounted ? t("Privacy Policy") : "Privacy Policy"}
                </h1>

                  <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/30'}`}>
                    <CardContent className="p-8">
                      <div className={`${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'} space-y-6`}>
                        <p className="text-lg font-semibold text-[#ff6b35]">
                          {mounted ? t("We respect your privacy and protect your personal information.") : "We respect your privacy and protect your personal information."}
                        </p>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <span className="text-[#ff6b35] font-bold mt-1">•</span>
                            <span>{mounted ? t("We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them.") : "We collect details such as name, email, date, time, and place of birth only when you voluntarily provide them."}</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#ff6b35] font-bold mt-1">•</span>
                            <span>{mounted ? t("Information is used to provide astrology readings and personalized content.") : "Information is used to provide astrology readings and personalized content."}</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#ff6b35] font-bold mt-1">•</span>
                            <span>{mounted ? t("Non-personal data (browser type, site usage) may be collected for analytics and improvement.") : "Non-personal data (browser type, site usage) may be collected for analytics and improvement."}</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#ff6b35] font-bold mt-1">•</span>
                            <span>{mounted ? t("We do not sell, rent, or trade your personal data to third parties.") : "We do not sell, rent, or trade your personal data to third parties."}</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#ff6b35] font-bold mt-1">•</span>
                            <span>{mounted ? t("Reasonable security measures are taken to protect your information.") : "Reasonable security measures are taken to protect your information."}</span>
                          </li>
                        </ul>
                        <p className="pt-4 border-t border-[#ff6b35]/10 font-medium italic">
                          {mounted ? t("By using our website, you agree to this Privacy Policy.") : "By using our website, you agree to this Privacy Policy."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
