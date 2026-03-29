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

export default function TermsPage() {
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
              {mounted ? t("Terms and Conditions") : "Terms and Conditions"}
            </h1>

            <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/30'}`}>
                <CardContent className="p-8 space-y-8">
                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("1. Services") : "1. Services"}
                    </h2>
                    <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                      {mounted ? t("This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience.") : "This website provides astrology services including birth chart analysis, horoscope reading, marriage matching, numerology, and consultations. These services are based on traditional beliefs and experience."}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("2. Acceptance of Terms") : "2. Acceptance of Terms"}
                    </h2>
                    <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                      {mounted ? t("By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website.") : "By using this website, you agree to these terms and conditions. If you do not agree, please do not use the website."}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("3. Guarantee of Results") : "3. Guarantee of Results"}
                    </h2>
                    <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                      {mounted ? t("Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured.") : "Astrological services do not guarantee future outcomes. Results may vary depending on individual circumstances and personal actions. Accordingly, and in line with the prescribed parameters, the achievement of specific results cannot be assured."}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("4. Refund Policy") : "4. Refund Policy"}
                    </h2>
                    <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>
                      {mounted ? t("Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion.") : "Once a service or consultation is booked and completed, no refunds will be issued under any circumstances. The guidance provided is final and cannot be reversed. However, we may offer rescheduling at our discretion."}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("5. Age Requirement") : "5. Age Requirement"}
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'} whitespace-pre-line leading-relaxed`}>
                      {mounted ? t("Our website and services are intended for users aged 18 years and above.") : "Our website and services are intended for users aged 18 years and above."}{"\n"}
                      {mounted ? t("Users under the age of 18 should not provide any personal information on this website.") : "Users under the age of 18 should not provide any personal information on this website."}{"\n"}
                      {mounted ? t("We do not knowingly collect personal data from children under 18.") : "We do not knowingly collect personal data from children under 18."}{"\n"}
                      {mounted ? t("If we discover that such information has been provided, we will promptly delete it.") : "If we discover that such information has been provided, we will promptly delete it."}{"\n"}
                      {mounted ? t("By using this website, you confirm that you meet the minimum age requirement.") : "By using this website, you confirm that you meet the minimum age requirement."}
                    </p>
                  </section>

                  <section>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-3 text-[#ff6b35]">
                      {mounted ? t("6. Required Birth Details Policy") : "6. Required Birth Details Policy"}
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'} mb-4`}>
                      {mounted ? t("To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:") : "To provide accurate and effective astrology consultation, it is mandatory for the client to share the following correct birth details:"}
                    </p>
                    <ul className={`space-y-3 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ff6b35] font-bold">•</span>
                        <span>{mounted ? t("Birth Date") : "Birth Date"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ff6b35] font-bold">•</span>
                        <span>{mounted ? t("Birth Time") : "Birth Time"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#ff6b35] font-bold">•</span>
                        <span>{mounted ? t("Birth Place") : "Birth Place"}</span>
                      </li>
                    </ul>
                  </section>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
