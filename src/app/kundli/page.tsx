"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Moon, Sun, Sparkles, BookOpen, User, Heart, Briefcase, Shield } from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";

export default function KundliPage() {
  const { theme } = useTheme();
  const { language } = useTranslation();

  const t = (en: string, hi: string, gu: string) =>
    language === "hi" ? hi : language === "gu" ? gu : en;

  const services = [
    {
      icon: User,
      title: t("Janam Kundali", "जन्म कुंडली", "જન્મ કુંડળી"),
      desc: t(
        "Complete birth chart analysis based on date, time and place of birth.",
        "जन्म तिथि, समय और स्थान के आधार पर सम्पूर्ण जन्म कुंडली विश्लेषण।",
        "જન્મ તારીખ, સમય અને સ્થળ આધારે સંપૂર્ણ જન્મ કુંડળી વિશ્લેષण."
      ),
    },
    {
      icon: Heart,
      title: t("Kundali Matching", "कुंडली मिलान", "કુંડળી મિળાન"),
      desc: t(
        "Detailed horoscope compatibility analysis for marriage — Ashtakoota & Mangalik check.",
        "विवाह के लिए विस्तृत कुंडली मिलान — अष्टकूट एवं मांगलिक जांच।",
        "લગ્ન માટે વિગતવાર કુંડળી મિળાન — અષ્ટકૂટ અને માંગળિક ચકાસણી."
      ),
    },
    {
      icon: Briefcase,
      title: t("Career Kundali", "करियर कुंडली", "કારકિર્દી કુંડળી"),
      desc: t(
        "Know your best career path, business prospects, and financial periods from your chart.",
        "अपनी कुंडली से सर्वोत्तम करियर, व्यवसाय और आर्थिक काल जानें।",
        "તમારી કુંડળી પ્રમાણે શ્રેષ્ઠ કારકિર્દી, ધંધો અને આર્થિક સમય જાણો."
      ),
    },
    {
      icon: Shield,
      title: t("Dasha & Transit", "दशा व गोचर", "દશા અને ગ્રહ ગોચર"),
      desc: t(
        "Planetary period (Dasha) analysis and current transit effects on your life.",
        "ग्रह दशा विश्लेषण और वर्तमान गोचर का आपके जीवन पर प्रभाव।",
        "ગ્રહ દશા વિશ્લેષण અને વર્તમાન ગ્રહ ગોચરની તમારા જીવન પર અસર."
      ),
    },
    {
      icon: BookOpen,
      title: t("Remedies & Upay", "उपाय और समाधान", "ઉપાય અને સમાધાન"),
      desc: t(
        "Personalized Vedic remedies — gems, mantras, puja, and lifestyle corrections.",
        "व्यक्तिगत वैदिक उपाय — रत्न, मंत्र, पूजा और जीवनशैली सुधार।",
        "વ્યક્તિગત વૈદિક ઉપાય — રત્ન, મંત્ર, પૂજા અને જીવનશૈલી સુધારો."
      ),
    },
    {
      icon: Star,
      title: t("Yearly Predictions", "वार्षिक भविष्यफल", "વાર્ષિક ભવિષ્ય"),
      desc: t(
        "Detailed annual horoscope for the coming year — health, wealth, love & career.",
        "आने वाले वर्ष के लिए विस्तृत राशिफल — स्वास्थ्य, धन, प्रेम और करियर।",
        "આવતા વર્ષ માટે વિગતવાર ભવિષ્ય — આરોગ્ય, ધન, પ્રેમ અને કારકિર્દી."
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0f] text-[#f5f0e8]" : "bg-background text-[#2d1810]"}`}>
      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className={`py-16 px-6 ${theme === "dark" ? "bg-gradient-to-b from-[#1e1b4b]/30 to-[#0a0a0f]" : "bg-gradient-to-b from-[#fff4e6] to-[#fef7ed]"}`}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-center gap-2 mb-6">
                <Sun className="w-8 h-8 text-[#ff6b35]" />
                <Star className="w-8 h-8 text-[#ff8c5e]" />
                <Moon className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
                {t("Kundali Analysis", "कुंडली विश्लेषण", "કુંડળી વિશ્લેષণ")}
              </h1>
              <p className={`text-xl leading-relaxed max-w-2xl mx-auto ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
                {t(
                  "Expert Vedic Kundali (birth chart) analysis by Katyaayani Astrologer. Unlock the secrets of your destiny through ancient Jyotish science.",
                  "कात्यायनी ज्योतिषी द्वारा विशेषज्ञ वैदिक कुंडली विश्लेषण। प्राचीन ज्योतिष विज्ञान के माध्यम से अपने भाग्य के रहस्यों को उजागर करें।",
                  "કાત્યાયની જ્યોતિષ દ્વારા નિષ્ણાત વૈદિક કુંડળી વિશ્લેષণ. પ્રાચીન જ્યોતિષ વિજ્ઞાન દ્વારા તમારા ભાગ્યના રહસ્યો ઉઘાડો."
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* What is Kundali */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className={`p-8 rounded-2xl border ${theme === "dark" ? "bg-[#12121a] border-[#c9a227]/20" : "bg-[#fff8f0] border-[#ff6b35]/20"}`}>
                <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-4 text-gradient-ancient">
                  {t("What is a Kundali?", "कुंडली क्या है?", "કુંડળી શું છે?")}
                </h2>
                <p className={`text-lg leading-relaxed mb-4 ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
                  {t(
                    "A Kundali (also called Janam Patrika or birth chart) is an astrological diagram that maps the exact positions of planets at the moment of your birth. In Vedic astrology, this chart is the blueprint of your life — revealing your strengths, challenges, karmic patterns, and potential.",
                    "कुंडली (जन्म पत्रिका या जन्म चार्ट) एक ज्योतिषीय आरेख है जो आपके जन्म के समय ग्रहों की सटीक स्थिति को दर्शाता है। वैदिक ज्योतिष में, यह चार्ट आपके जीवन का खाका है — आपकी ताकत, चुनौतियां, कर्म पैटर्न और क्षमता को प्रकट करता है।",
                    "કુંડળી (જન્મ પત્રિકા અથવા જન્મ ચાર્ટ) એ એક જ્યોતિષ આકૃતિ છે જે તમારા જન્મ સમયે ગ્રહોની ચોક્કસ સ્થિતિ દર્શાવે છે. વૈદિક જ્યોતિષમાં, આ ચાર્ટ તમારા જીવનનો નકશો છે — તમારી શક્તિઓ, પડકારો, કર્મ પ્રારૂપ અને ક્ષમતા દર્શાવે છે."
                  )}
                </p>
                <p className={`text-lg leading-relaxed ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
                  {t(
                    "Katyaayani Astrologer (Rudram Joshi) has 17+ years of experience reading and interpreting Kundalis. With deep knowledge of Parashari and Jaimini systems, every reading is personalized, accurate, and actionable.",
                    "कात्यायनी ज्योतिषी (रुद्रम जोशी) के पास कुंडली पढ़ने और व्याख्या करने का 17+ वर्षों का अनुभव है। पाराशरी और जैमिनी प्रणालियों की गहरी जानकारी के साथ, प्रत्येक पठन व्यक्तिगत, सटीक और व्यावहारिक है।",
                    "કાત્યાયની જ્યોતિષ (રુદ્રમ જોષી) ને 17+ વર્ષનો કુંડળી વાંચન અને અર્થઘટનનો અનુભવ છે. પારાશરી અને જૈમિની પ્રણાલીઓના ઊંડા જ્ઞાન સાથે, દરેક વાંચન વ્યક્તિગત, ચોક્કસ અને ઉપયોગી છે."
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Kundali Services */}
        <section className={`py-12 px-6 ${theme === "dark" ? "bg-[#12121a]" : "bg-[#fff8f0]"}`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-center mb-10 text-gradient-ancient">
              {t("Our Kundali Services", "हमारी कुंडली सेवाएं", "અમારી કુંડળી સેવાઓ")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`h-full ${theme === "dark" ? "bg-[#0a0a0f] border-[#c9a227]/20" : "bg-white border-[#ff6b35]/20"}`}>
                    <CardContent className="p-6">
                      <svc.icon className={`w-10 h-10 mb-4 ${theme === "dark" ? "text-[#c9a227]" : "text-[#ff6b35]"}`} />
                      <h3 className={`font-[family-name:var(--font-cinzel)] text-lg font-bold mb-2 ${theme === "dark" ? "text-[#f5f0e8]" : "text-[#2d1810]"}`}>
                        {svc.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>{svc.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-4 text-gradient-ancient">
              {t("Get Your Kundali Read Today", "आज अपनी कुंडली पढ़वाएं", "આજ તમારી કુંડળી વંચાવો")}
            </h2>
            <p className={`text-lg mb-8 max-w-xl mx-auto ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
              {t(
                "Book a consultation with Katyaayani Astrologer for a detailed, personalized Kundali reading.",
                "विस्तृत, व्यक्तिगत कुंडली विश्लेषण के लिए कात्यायनी ज्योतिषी के साथ परामर्श बुक करें।",
                "વિગતવાર, વ્યક્તિગત કુંડળી વિশ્લેષણ માટે કાત્યાયની જ્યોતિષ સાથે પરામર્શ બુક કરો."
              )}
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                {t("Book Kundali Consultation", "कुंडली परामर्श बुक करें", "કુંડળી પરામર્શ બુક કરો")}
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Hidden SEO text */}
        <div className="sr-only">
          <h2>Kundali Analysis - Vedic Astrology Birth Chart Reading</h2>
          <p>Katyaayani Astrologer offers expert Vedic kundali analysis, janam kundali reading, kundali matching for marriage, and personalized astrology remedies since 2007. Book online kundali consultation today.</p>
          <h3>કુંડળી વિશ્લેષણ - વૈદિક જ્યોતિષ</h3>
          <p>કાત્યાયની જ્યોતિષ દ્વારા કુંડળી વિશ્લેષણ, ગ્રહ ગોચર, દશા ભવિષ્ય.</p>
          <h3>कुंडली विश्लेषण - वैदिक ज्योतिष</h3>
          <p>कात्यायनी ज्योतिषी द्वारा जन्म कुंडली विश्लेषण, कुंडली मिलान, ग्रह दशा भविष्यफल।</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
