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

export default function DisclaimerPage() {
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
              {mounted ? t("Disclaimer") : "Disclaimer"}
            </h1>

                  <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/30'}`}>
                    <CardContent className="p-8 space-y-6">
                      <section>
                        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                          {mounted ? t("Disclaimer") : "Disclaimer"}
                        </h2>
                        <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                          {mounted ? t("All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought.") : "All astrology-related information on this website is for guidance purposes only. For legal, financial, medical, or personal matters, professional advice should be sought."}
                        </p>
                      </section>
                      
                      <div className={`pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                          {mounted ? t("Guarantee of Results") : "Guarantee of Results"}
                        </h2>
                        <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                          {mounted ? t("Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.") : "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured."}
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