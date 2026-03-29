"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Moon, Sun, Sparkles, Home, Building2, Video,
  CheckCircle, Clock, IndianRupee, MapPin
} from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { useAuth } from "@/contexts/AuthContext";
import { useOffer } from "@/hooks/useOffer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

function StarField() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const services = [
  {
    icon: Home,
    title: "Home Consultation (Outside 6.5km)",
    titleHi: "घर पर परामर्श (6.5 किमी के बाहर)",
    titleGu: "ઘરે પરામર્શ (6.5 કિમીની બહાર)",
    description: "Personalized our astrology sessions at your home beyond 6.5km of Vastral, Ahmedabad. Detailed consultation with complete Kundli analysis.",
    descriptionHi: "अहमदाबाद के वस्त्राल से 6.5 किमी से अधिक दूरी पर आपके घर पर व्यक्तिगत हमारे ज्योतिष सत्र। पूर्ण कुंडली विश्लेषण के साथ विस्तृत परामर्श।",
    descriptionGu: "અમદાવાદના વસ્ત્રાલથી 6.5 કિમીથી વધુ દૂર તમારા ઘરે વ્યક્તિગત અમારા જ્યોતિષ સત્રો. સંપૂર્ણ કુંડળી વિશ્લેષણ સાથે વિગતવાર પરામર્શ.",
    price: "2101",
    duration: "120 minutes",
    durationHi: "120 मिनट",
    durationGu: "120 મિનિટ",
    features: {
      en: [
        "Consultation outside 6.5km radius",
        "Detailed birth chart analysis",
        "In-depth planetary study",
        "Extended Dasha analysis",
        "Specific remedial measures",
        "Travel time included"
      ],
      hi: [
        "6.5 किमी के दायरे से बाहर परामर्श",
        "विस्तृत जन्म कुंडली विश्लेषण",
        "गहन ग्रह अध्ययन",
        "विस्तारित दशा विश्लेषण",
        "विशिष्ट उपचारात्मक उपाय",
        "यात्रा समय शामिल"
      ],
      gu: [
        "6.5 કિમી વિસ્તારની બહાર પરામર્શ",
        "વિગતવાર જન્મ કુંડળી વિશ્લેષણ",
        "ઊંડાણપૂર્વક ગ્રહ અભ્યાસ",
        "વિસ્તૃત દશા વિશ્લેષણ",
        "વિશિષ્ટ ઉપચારાત્મક પગલાં",
        "મુસાફરીનો સમય સામેલ"
      ]
    }
  },
  {
    icon: Home,
    title: "Home Consultation (Within 6.5km)",
    titleHi: "घर पर परामर्श (6.5 किमी के भीतर)",
    titleGu: "ઘરે પરામર્શ (6.5 કિમીની અંદર)",
    description: "Personalized our astrology sessions at your home within 6.5km of Vastral, Ahmedabad. Detailed consultation with complete Kundli analysis.",
    descriptionHi: "अहमदाबाद के वस्त्राल से 6.5 किमी के भीतर आपके घर पर व्यक्तिगत हमारे ज्योतिष सत्र। पूर्ण कुंडली विश्लेषण के साथ विस्तृत परामर्श।",
    descriptionGu: "અમદાવાદના વસ્ત્રાલથી 6.5 કિમીની અંદર તમારા ઘરે વ્યક્તિગત અમારા જ્યોતિષ સત્રો. સંપૂર્ણ કુંડળી વિશ્લેષણ સાથે વિગતવાર પરામર્શ.",
    price: "1101",
    duration: "90 minutes",
    durationHi: "90 मिनट",
    durationGu: "90 મિનિટ",
    features: {
      en: [
        "Consultation within 6.5km radius of Vastral",
        "Complete birth chart analysis",
        "Planetary positions study",
        "Dasha & transit predictions",
        "Gemstone recommendations",
        "Remedial measures"
      ],
      hi: [
        "वस्त्राल के 6.5 किमी के दायरे में परामर्श",
        "पूर्ण जन्म कुंडली विश्लेषण",
        "ग्रहों की स्थिति का अध्ययन",
        "दशा और गोचर भविष्यवाणी",
        "रत्न सिफारिशें",
        "उपचारात्मक उपाय"
      ],
      gu: [
        "વસ્ત્રાલના 6.5 કિમી વિસ્તારમાં પરામર્શ",
        "સંપૂર્ણ જન્મ કુંડળી વિશ્લેષણ",
        "ગ્રહોની સ્થિતિનો અભ્યાસ",
        "દશા અને સંક્રમણ આગાહી",
        "રત્ન ભલામણો",
        "ઉપચારાત્મક પગલાં"
      ]
    }
  },
  {
    icon: Video,
    title: "Online Consultation",
    titleHi: "ऑनलाइन परामर्श",
    titleGu: "ઓનલાઇન પરામર્શ",
    description: "Connect with us from anywhere in the world via video call. Get your our readings from the comfort of your home.",
    descriptionHi: "वीडियो कॉल के माध्यम से दुनिया में कहीं से भी हमसे जुड़ें। अपने घर के आराम से अपनी हमारे रीडिंग प्राप्त करें।",
    descriptionGu: "વીડિયો કોલ દ્વારા વિશ્વના કોઈપણ સ્થળેથી અમારી સાથે જોડાઓ. તમારા ઘરની આરામથી તમારી અમારા રીડિંગ્સ મેળવો.",
    price: "501",
    duration: "45 minutes",
    durationHi: "45 मिनट",
    durationGu: "45 મિનિટ",
    features: {
      en: [
        "Video/Audio call consultation",
        "Global accessibility",
        "Digital chart sharing",
        "Concise chart analysis",
        "Specific query resolution",
        "Digital remedy report"
      ],
      hi: [
        "वीडियो/ऑडियो कॉल परामर्श",
        "वैश्विक पहुंच",
        "डिजिटल चार्ट साझाकरण",
        "संक्षिप्त चार्ट विश्लेषण",
        "विशिष्ट प्रश्न समाधान",
        "डिजिटल उपाय रिपोर्ट"
      ],
      gu: [
        "વીડિયો/ઓડિયો કોલ પરામર્શ",
        "વૈશ્વિક સુલભતા",
        "ડિજિટલ ચાર્ટ શેરિંગ",
        "સંક્ષિપ્ત ચાર્ટ વિશ્લેષણ",
        "વિશિષ્ટ પ્રશ્ન ઉકેલ",
        "ડિજિટલ ઉપચાર રિપોર્ટ"
      ]
    }
  }
];

const areasWithin6_5km = [
  "Vastral", "Ramrajya Nagar", "Mahadev Nagar", "Nirant Cross Road", "Odhav",
  "Nikol", "Singarwa", "Amraiwadi", "CTM", "Hatkeshwar", "Rabari Vasahat",
  "Khokhra", "Gomtipur", "Rakhiyal", "Bapunagar", "Thakkarbapa Nagar",
  "Karai", "Vinzol", "Arbudanagar", "Jivanwadi", "Pranami Nagar", "Ratanpura"
];

function DistanceChecker() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<{ status: 'within' | 'outside' | null, area?: string } | null>(null);
  const { theme } = useTheme();
  const { language } = useTranslation();

  const handleCheck = (areaName: string) => {
    const isWithin = areasWithin6_5km.some(a => a.toLowerCase() === areaName.toLowerCase());
    setResult({ status: isWithin ? 'within' : 'outside', area: areaName });
  };

  const getTranslation = (key: string) => {
    const translations: any = {
      title: {
        en: "Check Consultation Zone",
        hi: "परामर्श क्षेत्र की जाँच करें",
        gu: "પરામર્શ વિસ્તાર તપાસો"
      },
      placeholder: {
        en: "Enter your area (e.g., Odhav, Nikol)",
        hi: "अपना क्षेत्र दर्ज करें (जैसे, ओढव, निकोल)",
        gu: "તમારો વિસ્તાર દાખલ કરો (દા.ત., ઓઢવ, નિકોલ)"
      },
      checkBtn: {
        en: "Check Area",
        hi: "क्षेत्र की जाँच करें",
        gu: "વિસ્તાર તપાસો"
      },
      withinMsg: {
        en: "You are within 6.5km! Charge: ₹1,101",
        hi: "आप 6.5 किमी के भीतर हैं! शुल्क: ₹1,101",
        gu: "તમે 6.5 કિમીની અંદર છો! ચાર્જ: ₹1,101"
      },
      outsideMsg: {
        en: "You are outside 6.5km. Charge: ₹2,101",
        hi: "आप 6.5 किमी के बाहर हैं। शुल्क: ₹2,101",
        gu: "તમે 6.5 કિમીની બહાર છો. ચાર્જ: ₹2,101"
      }
    };
    return translations[key][language as 'en' | 'hi' | 'gu'] || translations[key].en;
  };

  return (
    <div className={`p-8 rounded-[2rem] border-2 mb-12 ${theme === 'dark' ? 'bg-[#12121a]/50 border-[#ff6b35]/20' : 'bg-white/80 border-[#ff6b35]/10'
      } backdrop-blur-xl shadow-xl`}>
      <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold mb-6 text-[#ff6b35] flex items-center gap-2">
        <MapPin className="w-6 h-6" /> {getTranslation('title')}
      </h3>
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          className={`flex-1 h-12 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50'}`}
          placeholder={getTranslation('placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck(search)}
        />
        <Button
          onClick={() => handleCheck(search)}
          className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-xl h-12 px-8 font-bold"
        >
          {getTranslation('checkBtn')}
        </Button>
      </div>

      <div className="mt-2 text-sm opacity-60 flex items-center gap-2">
        <Home className="w-4 h-4" />
        <span>{language === 'gu' ? 'ઘરે પરામર્શ શુલ્ક:' : language === 'hi' ? 'घर पर परामर्श शुल्क:' : 'Home Consultation Charges:'} ₹ 2,101 / 1,101</span>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${result.status === 'within'
                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                : 'bg-[#ff6b35]/10 border-[#ff6b35]/20 text-[#ff6b35]'
              }`}
          >
            {result.status === 'within' ? <CheckCircle className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
            <span className="font-bold text-lg">
              {result.status === 'within' ? getTranslation('withinMsg') : getTranslation('outsideMsg')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs opacity-60 uppercase font-black tracking-widest mr-2">{language === 'gu' ? 'લોકપ્રિય વિસ્તારો (6.5km):' : 'Popular areas (6.5km):'}</span>
        {areasWithin6_5km.slice(0, 8).map(area => (
          <button
            key={area}
            onClick={() => {
              setSearch(area);
              handleCheck(area);
            }}
            className="text-[10px] px-2 py-1 rounded-full bg-[#ff6b35]/5 hover:bg-[#ff6b35]/10 border border-[#ff6b35]/10 transition-colors"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { theme } = useTheme();
  const { language, t } = useTranslation();
  const { user, showAuthModal } = useAuth();
  const router = useRouter();
  const { offer, isOfferValid } = useOffer();

  // Dynamic prices from DB
  const [dbPrices, setDbPrices] = useState<Record<string, { price_display: string; duration: string }>>({});
  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (data.prices) {
          const map: Record<string, { price_display: string; duration: string }> = {};
          data.prices.forEach((p: any) => { map[p.id] = { price_display: p.price_display, duration: p.duration }; });
          setDbPrices(map);
        }
      })
      .catch(() => { });
  }, []);

  const getServicePrice = (service: typeof services[0]) => {
    const idMap: Record<string, string> = {
      "Home Consultation (Outside 6.5km)": "home-outside",
      "Home Consultation (Within 6.5km)": "home-within",
      "Online Consultation": "online",
    };
    const id = idMap[service.title];
    return id && dbPrices[id] ? dbPrices[id].price_display : `₹ ${service.price}`;
  };

  const getServiceDurationDynamic = (service: typeof services[0]) => {
    const idMap: Record<string, string> = {
      "Home Consultation (Outside 6.5km)": "home-outside",
      "Home Consultation (Within 6.5km)": "home-within",
      "Online Consultation": "online",
    };
    const id = idMap[service.title];
    return id && dbPrices[id] ? dbPrices[id].duration : getServiceDuration(service);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showAuthModal('signin');
    }
  };

  const getServiceTitle = (service: typeof services[0]) => {
    if (language === 'hi') return service.titleHi;
    if (language === 'gu') return service.titleGu;
    return service.title;
  };

  const getServiceDescription = (service: typeof services[0]) => {
    if (language === 'hi') return service.descriptionHi;
    if (language === 'gu') return service.descriptionGu;
    return service.description;
  };

  const getServiceDuration = (service: typeof services[0]) => {
    if (language === 'hi') return service.durationHi;
    if (language === 'gu') return service.durationGu;
    return service.duration;
  };

  const getServiceFeatures = (service: typeof services[0]) => {
    return (service.features as any)[language] || service.features.en;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <Navbar />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=2000"
            alt="Stars Cover"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
        </div>
        <StarField />
        <div className={`absolute inset-0 ${theme === 'dark'
            ? 'bg-gradient-to-b from-[#2d1b4e]/30 via-transparent to-[#0a0a0f]'
            : 'bg-gradient-to-b from-[#ffe4d6]/30 via-transparent to-[#fef7ed]'
          }`} />

        <div className="relative z-10 text-center px-6 max-w-4xl mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-2 mb-6">
              <Sun className="w-8 h-8 text-[#ff6b35]" />
              <Star className="w-8 h-8 text-[#ff8c5e]" />
              <Moon className="w-8 h-8 text-[#ff6b35]" />
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-5xl md:text-7xl font-bold mb-6 text-gradient-ancient">
              {t('Our Sacred Services')}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
              {language === 'hi' && 'वह परामर्श शैली चुनें जो आपके आध्यात्मिक पथ से मेल खाती हो'}
              {language === 'gu' && 'તમારા આધ્યાત્મિક માર્ગ સાથે સંરેખિત કરવા માટે પરામર્શ શૈલી પસંદ કરો'}
              {language === 'en' && 'Choose the consultation style that aligns with your spiritual path'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-gradient-to-b from-[#0a0a0f] to-[#12121a]' : 'bg-gradient-to-b from-[#fef7ed] to-[#fde4d0]'}`}>
        <div className="max-w-7xl mx-auto">
          <DistanceChecker />

          <div className="grid md:grid-cols-1 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-card border-[#ff6b35]/30'} hover:border-[#ff6b35]/50 transition-all duration-300 group`}>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="w-20 h-20 rounded-full bg-[#ff6b35]/10 flex items-center justify-center mb-6 group-hover:bg-[#ff6b35]/20 transition-colors">
                          <service.icon className="w-10 h-10 text-[#ff6b35]" />
                        </div>
                        <h3 className={`font-[family-name:var(--font-cinzel)] text-3xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>
                          {getServiceTitle(service)}
                        </h3>
                        <p className={`mb-6 text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                          {getServiceDescription(service)}
                        </p>

                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-[#ff6b35]" />
                            <span className="text-[#ff6b35] font-semibold text-2xl">{getServicePrice(service)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#ff6b35]" />
                            <span className={`font-semibold ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>{getServiceDurationDynamic(service)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={(e) => {
                            if (!user) {
                              showAuthModal('signin');
                            } else if (service.title === "Online Consultation") {
                              window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                            } else {
                              router.push('/booking');
                            }
                          }}
                          className="w-full md:w-auto bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-semibold text-xl px-8 py-6"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {language === 'hi' && 'अभी बुक करें'}
                          {language === 'gu' && 'હવે બુક કરો'}
                          {language === 'en' && 'Book Now'}
                        </Button>
                      </div>

                      <div>
                        <h4 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>
                          {language === 'hi' && "क्या शामिल है"}
                          {language === 'gu' && "શું સામેલ છે"}
                          {language === 'en' && "What's Included"}
                        </h4>
                        <ul className="space-y-3">
                          {getServiceFeatures(service).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-1" />
                              <span className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      <section className={`relative py-32 px-6 overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-background'}`}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <Sparkles className="absolute top-10 left-10 w-24 h-24 text-[#ff6b35] blur-sm animate-pulse" />
          <Sun className="absolute bottom-10 right-10 w-32 h-32 text-[#ff8c5e] blur-sm animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`p-12 rounded-[2rem] border-2 shadow-2xl ${theme === 'dark'
                ? 'bg-[#12121a]/50 border-[#ff6b35]/20 shadow-[#ff6b35]/5'
                : 'bg-white/80 border-[#ff6b35]/10 shadow-[#ff6b35]/10'
              } backdrop-blur-xl`}
          >
            <div className="flex justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ff6b35] self-center" />
              <Star className="w-8 h-8 text-[#ff6b35] animate-spin-slow" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ff6b35] self-center" />
            </div>

            <h2 className="font-[family-name:var(--font-cinzel)] text-5xl md:text-6xl font-bold mb-8 text-gradient-ancient leading-tight">
              {language === 'hi' && 'अपनी आध्यात्मिक यात्रा शुरू करें'}
              {language === 'gu' && 'તમારી આધ્યાત્મિક યાત્રા શરૂ કરો'}
              {language === 'en' && 'Begin Your Sacred Journey'}
            </h2>

            <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
              {language === 'hi' && 'ज्योतिष का प्राचीन ज्ञान आपके जीवन को आलोकित करने की प्रतीक्षा कर रहा है।'}
              {language === 'gu' && 'જ્યોતિષનું પ્રાચીન જ્ઞાન તમારા જીવનને પ્રકાશિત કરવાની રાહ જોઈ રહ્યું છે।'}
              {language === 'en' && 'The ancient wisdom of astrology is waiting to illuminate your life path.'}
            </p>

            <div className="flex flex-col items-center gap-8">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold text-2xl px-12 py-8 rounded-full shadow-lg shadow-[#ff6b35]/25 hover:scale-105 transition-all duration-300 group"
                >
                  <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  {t('Book Your Reading')}
                </Button>
              </Link>

              <div className="relative">
                <div className={`flex items-center gap-3 px-8 py-4 rounded-xl border border-dashed transition-colors ${theme === 'dark'
                    ? 'bg-[#ff6b35]/5 border-[#ff6b35]/30'
                    : 'bg-[#ff6b35]/5 border-[#ff6b35]/40'
                  }`}>
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-ping" />
                  <p className={`text-lg font-medium italic ${theme === 'dark' ? 'text-[#ff8c5e]' : 'text-[#e65a2b]'}`}>
                    {language === 'hi' && 'परामर्श के बाद, हम सभी प्रकार की हमारे पूजा सेवाएं भी प्रदान करते हैं।'}
                    {language === 'gu' && 'પરામર્શ પછી, અમે તમામ પ્રકારની અમારા પૂજા સેવાઓ પણ પ્રદાન કરીએ છીએ.'}
                    {language === 'en' && 'Post-consultation, we provide all types of our Pooja services if required.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
