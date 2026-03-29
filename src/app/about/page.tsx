"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Star, Sun, Users, Award, Calendar, Heart, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";
import { useState } from "react";
import EnquiryForm from "@/components/EnquiryForm";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

const CrispChat = dynamic(() => import("@/components/CrispChat"), { ssr: false });

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useTranslation();
  const { user, showAuthModal, showEnquiryModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const astrologers = [
      {
        name: language === 'hi' ? "रुद्रम जोशी" : language === 'gu' ? "રુદ્રમ જોશી" : "Rudram Joshi",
        title: language === 'hi' ? "मुख्य ज्योतिषाचार्य" : language === 'gu' ? "મુખ્ય જ્યોતિષાચાર્ય" : "Chief Astrologer",
        experience: language === 'hi' ? "17+ वर्ष" : language === 'gu' ? "17+ વર્ષ" : "17+ Years",
        specialization: language === 'hi' ? "ज्योतिष एवं कुंडली विशेषज्ञ" : language === 'gu' ? "જ્યોતિષ અને કુંડળી નિષ્ણાત" : "Astrology & Kundli Expert",
        bio: language === 'hi' ? "रुद्रम जोशी जी ने अपना जीवन ग्रहों की गति को समझने में समर्पित किया है। उनके सटीक भविष्यवाणी से हजारों लोगों का जीवन बदल गया है।" : 
             language === 'gu' ? "રુદ્રમ જોશીએ તેમનું જીવન ગ્રહોની ગતિ સમજવામાં સમર્પિત કર્યું છે. તેમની ચોક્કસ આગાહીથી હજારો લોકોનું જીવન બદલાઈ ગયું છે." :
             "Rudram Joshi has dedicated his life to understanding planetary movements. His accurate predictions have transformed thousands of lives.",
      },
    ];
  
  const stats = [
    { icon: Users, value: "10k+", label: language === 'hi' ? "परामर्श" : language === 'gu' ? "પરામર્શ" : "Consultations" },
    { icon: Calendar, value: "17+", label: language === 'hi' ? "वर्षों का अनुभव" : language === 'gu' ? "વર્ષોનો અનુભવ" : "Years Experience" },
    { icon: Award, value: "4.9/5", label: language === 'hi' ? "औसत रेटिंग" : language === 'gu' ? "સરેરાશ રેટિંગ" : "Average Rating" },
  ];

  const values = [
    {
        title: t("Vedic Wisdom"),
        description: language === 'hi' ? "हम सदियों से चली आ रही ज्योतिष परंपरा का सम्मान करते हैं।" :
                     language === 'gu' ? "અમે સદીઓથી ચાલતી જ્યોતિષ પરંપરાનું સન્માન કરીએ છીએ." :
                     "We honor the Vedic astrology tradition that has been passed down through centuries.",
    },
    {
      title: t("Personal Growth"),
      description: language === 'hi' ? "हमारे परामर्श आपकी आत्म-खोज की यात्रा को सशक्त बनाने के लिए डिज़ाइन किए गए हैं।" :
                   language === 'gu' ? "અમારા પરામર્શો તમારી આત્મ-શોધની યાત્રાને સશક્ત બનાવવા માટે રચાયેલા છે." :
                   "Our consultations are designed to empower your journey of self-discovery.",
    },
    {
      title: t("Ethical Practice"),
      description: language === 'hi' ? "हम सत्यनिष्ठा और गोपनीयता के उच्चतम मानकों को बनाए रखते हैं।" :
                   language === 'gu' ? "અમે પ્રામાણિકતા અને ગોપનીયતાના ઉચ્ચતમ ધોરણોને જાળવી રાખીએ છીએ." :
                   "We maintain the highest standards of integrity and confidentiality.",
    },
    {
      title: t("Planetary Connection"),
      description: language === 'hi' ? "हम खगोलीय पिंडों और मानव जीवन के बीच गहरे संबंध में विश्वास करते हैं।" :
                   language === 'gu' ? "અમે ખગોળીય પદાર્થો અને માનવ જીવન વચ્ચેના ઊંડા સંબંધમાં વિશ્વાસ કરીએ છીએ." :
                   "We believe in the profound connection between celestial bodies and human life.",
    },
  ];
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <CrispChat />
      <Navbar />

      <main className="pt-24">
        <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-gradient-to-b from-[#1e1b4b]/30 to-[#0a0a0f]' : 'bg-gradient-to-b from-[#fff4e6] to-[#fef7ed]'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex justify-center gap-2 mb-6">
                <Sun className="w-8 h-8 text-[#ff6b35]" />
                <Star className="w-8 h-8 text-[#ff8c5e]" />
                <Moon className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-bold mb-6 text-gradient-ancient">
                {language === 'hi' ? "अपनी नियति को अनलॉक करें" : language === 'gu' ? "તમારા ભાગ્યને અનલોક કરો" : "Unlock Your Destiny"}
              </h1>
              <p className="text-[#a0998c] text-xl leading-relaxed">
                  {language === 'hi' ? "ज्योतिष का वैदिक ज्ञान आपके जीवन पथ को रोशन करने की प्रतीक्षा कर रहा है।" :
                   language === 'gu' ? "જ્યોતિષનું વૈદિક જ્ઞાન તમારા જીવન પથને પ્રકાશિત કરવા માટે રાહ જોઈ રહ્યું છે।" :
                   "The Vedic wisdom of astrology is waiting to illuminate your life path."}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="flex items-center justify-center py-8 px-6">
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
          <Star className={`w-6 h-6 mx-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
        </div>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`text-center ${theme === 'dark' ? 'bg-[#12121a] border-[#c9a227]/20' : 'bg-[#fff8f0] border-[#ff6b35]/20'}`}>
                    <CardContent className="p-6">
                      <stat.icon className={`w-10 h-10 mx-auto mb-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
                      <p className={`font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`}>
                        {stat.value}
                      </p>
                      <p className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center py-8 px-6">
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
          <Star className={`w-6 h-6 mx-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
        </div>

        <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-[#fff8f0]'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
                {t("Our Story")}
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=600&h=600&fit=crop"
                      alt="Celestial sky"
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-[#c9a227]/20' : 'bg-[#ff6b35]/20'}`}>
                    <span className={`font-[family-name:var(--font-cinzel)] text-4xl ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`}>✧</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                  {language === 'hi' ? "कात्यायनी एस्ट्रोलॉजर की स्थापना 2007 में एक सरल लेकिन गहन उद्देश्य के साथ की गई थी: प्राचीन ज्योतिष के ज्ञान को उन सभी लोगों तक पहुंचाना जो अपने जीवन में मार्गदर्शन की तलाश में हैं।" :
                   language === 'gu' ? "કાત્યાયની એસ્ટ્રોલોજરની સ્થાપના 2007 માં એક સરળ પરંતુ ગહન હેતુ સાથે કરવામાં આવી હતી: પ્રાચીન જ્યોતિષના જ્ઞાનને તે બધા લોકો સુધી પહોંચાડવું જે તેમના જીવનમાં માર્ગદર્શન શોધી રહ્યા છે।" :
                   "Katyaayani Astrologer was founded in 2007 with a simple yet profound purpose: to bring the ancient wisdom of astrology to all those seeking guidance in their lives."}
                </p>
                <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                  {language === 'hi' ? "जो एक छोटे से अभ्यास के रूप में शुरू हुआ था, वह अब दुनिया भर में हजारों खोजियों के लिए एक विश्वसनीय गंतव्य बन गया है। हमारी अनुभवी ज्योतिषियों की टीम समय-सम्मानित ज्योतिषीय ज्ञान को आधुनिक समझ के साथ जोड़ती है।" :
                   language === 'gu' ? "જે એક નાની પ્રેક્ટિસ તરીકે શરૂ થયું હતું, તે હવે વિશ્વભરમાં હજારો શોધકર્તાઓ માટે એક વિશ્વાસપાત્ર સ્થળ બની ગયું છે. અમારી અનુભવી જ્યોતિષીઓની ટીમ સમય-સન્માનિત જ્યોતિષીય જ્ઞાનને આધુનિક સમજણ સાથે જોડે છે।" :
                   "What started as a small practice has now grown into a trusted destination for thousands of seekers worldwide. Our experienced team of astrologers combines time-honored astrological knowledge with modern understanding."}
                </p>
                <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                  {language === 'hi' ? "हम मानते हैं कि ग्रह एक मानचित्र प्रदान करते हैं—पूर्व निर्धारित नियति नहीं, बल्कि हमारी ताकत, चुनौतियों और जीवन के महानतम अवसरों को समझने के लिए एक मार्गदर्शिका।" :
                   language === 'gu' ? "અમે માનીએ છીએ કે ગ્રહો એક નકશો પ્રદાન કરે છે - પૂર્વનિર્ધારિત નિયતિ નહીં, પરંતુ આપણી શક્તિઓ, પડકારો અને જીવનની શ્રેષ્ઠ તકોને સમજવા માટેનું માર્ગદર્શન।" :
                   "We believe that the planets provide a map—not a predetermined destiny, but a guide to understanding our strengths, challenges, and life’s greatest opportunities."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center py-8 px-6">
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
          <Star className={`w-6 h-6 mx-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
        </div>

        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
                {t("Our Astrologers")}
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                {language === 'hi' ? "आपकी आध्यात्मिक यात्रा का मार्गदर्शन करने वाले समर्पित विशेषज्ञ" :
                 language === 'gu' ? "તમારી આધ્યાત્મિક યાત્રાને માર્ગદર્શન આપતા સમર્પિત નિષ્ણાતો" :
                 "Dedicated experts guiding your spiritual journey"}
              </p>
            </motion.div>

            <div className="flex justify-center">
              {astrologers.map((astrologer, index) => (
                <motion.div
                  key={astrologer.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="max-w-2xl w-full"
                >
  <Card className={`relative overflow-hidden ${theme === 'dark' ? 'bg-[#12121a] border-[#c9a227]/30 shadow-2xl shadow-[#c9a227]/5' : 'bg-white border-[#ff6b35]/30 shadow-2xl'} border-2 transition-all duration-500 hover:scale-[1.02] group max-w-2xl mx-auto`}>
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`}>
      <Award className="w-48 h-48 -mr-16 -mt-16" />
    </div>
    <div className={`absolute bottom-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`}>
      <Star className="w-32 h-32 -ml-8 -mb-8" />
    </div>
    
    {/* Decorative corner accents */}
    <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 ${theme === 'dark' ? 'border-[#c9a227]/40' : 'border-[#ff6b35]/40'} m-4`} />
    <div className={`absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 ${theme === 'dark' ? 'border-[#c9a227]/40' : 'border-[#ff6b35]/40'} m-4`} />
    <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 ${theme === 'dark' ? 'border-[#c9a227]/40' : 'border-[#ff6b35]/40'} m-4`} />
    <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 ${theme === 'dark' ? 'border-[#c9a227]/40' : 'border-[#ff6b35]/40'} m-4`} />

    <CardContent className="p-12 text-center relative z-10">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 relative inline-block"
      >
        <div className={`w-36 h-36 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-[#c9a227]/20 via-[#c9a227]/5 to-transparent border-2 border-[#c9a227]/30' : 'bg-gradient-to-br from-[#ff6b35]/20 via-[#ff6b35]/5 to-transparent border-2 border-[#ff6b35]/30'}`}>
          <div className={`w-28 h-28 rounded-full flex items-center justify-center border border-dashed ${theme === 'dark' ? 'border-[#c9a227]/40' : 'border-[#ff6b35]/40'}`}>
            <Users className={`w-14 h-14 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          </div>
        </div>
        <div className={`absolute -bottom-2 right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-[#12121a] border-2 border-[#c9a227]/50' : 'bg-white border-2 border-[#ff6b35]/50'}`}>
          <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
        </div>
      </motion.div>
      
      <h3 className={`font-[family-name:var(--font-cinzel)] text-5xl font-bold mb-4 tracking-wider ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>
        {astrologer.name}
      </h3>
      
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`h-[1px] w-12 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent to-[#c9a227]/50' : 'bg-gradient-to-r from-transparent to-[#ff6b35]/50'}`} />
        <p className={`text-2xl font-cinzel font-semibold tracking-widest uppercase ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`}>
          {astrologer.title}
        </p>
        <div className={`h-[1px] w-12 ${theme === 'dark' ? 'bg-gradient-to-l from-transparent to-[#c9a227]/50' : 'bg-gradient-to-l from-transparent to-[#ff6b35]/50'}`} />
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 ${theme === 'dark' ? 'bg-[#c9a227]/10 border-[#c9a227]/30 text-[#c9a227]' : 'bg-[#ff6b35]/10 border-[#ff6b35]/30 text-[#ff6b35]'}`}>
          <Calendar className="w-5 h-5" />
          <span className="font-bold">{astrologer.experience}</span>
        </div>
        <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 ${theme === 'dark' ? 'bg-white/5 border-white/20 text-[#a0998c]' : 'bg-gray-50 border-gray-300 text-[#6b5847]'}`}>
          <Award className="w-5 h-5" />
          <span className="font-bold">{astrologer.specialization}</span>
        </div>
      </div>
      
      <div className="relative pt-6">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent'}`} />
        <p className={`text-2xl leading-relaxed font-medium italic ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'} max-w-xl mx-auto px-4`}>
          "{astrologer.bio}"
        </p>
      </div>
    </CardContent>
  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center py-8 px-6">
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
          <Star className={`w-6 h-6 mx-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
        </div>

        <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-[#fff8f0]'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
                {t("Our Values")}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#c9a227]/20' : 'bg-white border-[#ff6b35]/20'}`}>
                    <CardContent className="p-6 text-center">
                      <Star className={`w-8 h-8 mx-auto mb-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
                      <h3 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>
                        {value.title}
                      </h3>
                      <p className={`text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center py-8 px-6">
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
          <Star className={`w-6 h-6 mx-4 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
          <div className={`flex-1 h-[2px] max-w-md ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-[#ff6b35]/30 to-transparent'}`} />
        </div>

          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
                    {language === 'hi' ? "संपर्क" : language === 'gu' ? "સંપર્ક" : "Contact"}
                  </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                  {language === 'hi' ? "कोई प्रश्न है? हमें अपनी जानकारी भेजें और हम आपसे संपर्क करेंगे।" : 
                   language === 'gu' ? "કોઈ પ્રશ્ન છે? અમને તમારી વિગતો મોકલો અને અમે તમારો સંપર્ક કરીશું." : 
                   "Have questions? Send us your details and we'll get back to you."}
                </p>
              </div>
              <EnquiryForm />
            </div>
          </section>

          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
              <Card className={`${theme === 'dark' ? 'bg-gradient-to-r from-[#1e1b4b] to-[#12121a] border-[#c9a227]/20' : 'bg-gradient-to-r from-[#fff4e6] to-[#ffe8cc] border-[#ff6b35]/20'}`}>
                <CardContent className="p-12">
                  <Sparkles className={`w-12 h-12 mx-auto mb-6 ${theme === 'dark' ? 'text-[#c9a227]' : 'text-[#ff6b35]'}`} />
                  <h2 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-4 text-gradient-ancient">
                    {t("Begin Your Journey with Us")}
                  </h2>
                  <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                    {language === 'hi' ? "हमारे अनुभवी ज्योतिषी से आपकी कुंडली के रहस्यों को समझने में मार्गदर्शन प्राप्त करें।" :
                     language === 'gu' ? "અમારા અનુભવી જ્યોતિષી પાસેથી તમારી કુંડળીના રહસ્યો સમજવામાં માર્ગદર્શન મેળવો." :
                     "Receive guidance from our experienced astrologer in understanding the mysteries of your Kundli."}
                  </p>
                  <Link href="/booking">
                    <Button size="lg" className={`font-semibold text-xl px-8 ${theme === 'dark' ? 'bg-[#c9a227] hover:bg-[#e8d48b] text-[#0a0a0f]' : 'bg-[#ff6b35] hover:bg-[#ff8c5e] text-white'}`}>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t("Book a Consultation")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
