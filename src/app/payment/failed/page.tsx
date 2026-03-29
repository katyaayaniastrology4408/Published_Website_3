"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, XCircle, Home, Sun, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error[code]");
  const errorDescription = searchParams.get("error[description]");
  const errorSource = searchParams.get("error[source]");
  const errorReason = searchParams.get("error[reason]");
  
  const { theme, toggleTheme } = useTheme();
  const { language } = useTranslation();

  const getText = (en: string, hi: string, gu: string) => {
    if (language === 'hi') return hi;
    if (language === 'gu') return gu;
    return en;
  };

  const getErrorMessage = () => {
    if (errorCode === "BAD_REQUEST_ERROR") {
      return getText(
        "Payment request was invalid. Please try again with correct details.",
        "भुगतान अनुरोध अमान्य था। कृपया सही विवरण के साथ पुनः प्रयास करें।",
        "ચુકવણી વિનંતી અમાન્ય હતી. કૃપા કરીને સાચી વિગતો સાથે ફરી પ્રયાસ કરો."
      );
    }
    if (errorCode === "GATEWAY_ERROR") {
      return getText(
        "Payment gateway error. Please try again after some time.",
        "भुगतान गेटवे त्रुटि। कृपया कुछ समय बाद पुनः प्रयास करें।",
        "પેમેન્ટ ગેટવે ભૂલ. કૃપા કરીને થોડા સમય પછી ફરી પ્રયાસ કરો."
      );
    }
    if (errorReason === "payment_cancelled") {
      return getText(
        "You cancelled the payment. No charges were made.",
        "आपने भुगतान रद्द कर दिया। कोई शुल्क नहीं लिया गया।",
        "તમે ચુકવણી રદ કરી છે. કોઈ શુલ્ક લીધું નથી."
      );
    }
    return errorDescription || getText(
      "Payment could not be completed. Please try again.",
      "भुगतान पूरा नहीं हो सका। कृपया पुनः प्रयास करें।",
      "ચુકવણી પૂર્ણ થઈ શકી નથી. કૃપા કરીને ફરી પ્રયાસ કરો."
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <nav className={`backdrop-blur-md border-b ${theme === 'dark' ? 'bg-[#0a0a0f]/95 border-[#ff6b35]/20' : 'bg-background/95 border-[#ff6b35]/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=8000&height=8000&resize=contain" alt="Logo" width={48} height={48} className="rounded-full" />
            <span className="font-[family-name:var(--font-cinzel)] text-2xl font-semibold text-gradient-ancient">
              कात्यायनी ज्योतिष
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <GoogleTranslateWidget />
            <Button variant="outline" size="icon" onClick={toggleTheme} className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 h-9 w-9">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
          <Card className={theme === 'dark' ? 'bg-[#12121a] border-red-500/20' : 'bg-white border-red-500/20'}>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-4 text-red-500">
                {getText("Payment Failed", "भुगतान विफल", "ચુકવણી નિષ્ફળ")}
              </h1>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                {getErrorMessage()}
              </p>

              {(errorCode || errorSource) && (
                <div className={`p-4 rounded-lg mb-8 text-left ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>
                        {getText("Error Details", "त्रुटि विवरण", "ભૂલ વિગતો")}
                      </p>
                      {errorCode && (
                        <p className={`text-sm ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                          <span className="font-medium">
                            {getText("Code", "कोड", "કોડ")}:
                          </span> {errorCode}
                        </p>
                      )}
                      {errorSource && (
                        <p className={`text-sm ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                          <span className="font-medium">
                            {getText("Source", "स्रोत", "સ્ત્રોત")}:
                          </span> {errorSource}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg mb-8 ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-600/30' : 'bg-blue-50 border border-blue-300/50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                  {getText(
                    "No charges were made to your account. You can try booking again.",
                    "आपके खाते से कोई शुल्क नहीं लिया गया। आप फिर से बुकिंग का प्रयास कर सकते हैं।",
                    "તમારા ખાતામાંથી કોઈ શુલ્ક લેવામાં આવ્યું નથી. તમે ફરી બુકિંગ કરવાનો પ્રયાસ કરી શકો છો."
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/booking" className="block">
                  <Button className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-semibold">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {getText("Try Again", "पुनः प्रयास करें", "ફરી પ્રયાસ કરો")}
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10">
                    <Home className="w-4 h-4 mr-2" />
                    {getText("Back to Home", "मुखपृष्ठ पर लौटें", "હોમ પર પાછા જાઓ")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#ff6b35]">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
