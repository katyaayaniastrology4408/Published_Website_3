"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, Moon, Sun, Sparkles, MapPin,
  CheckCircle, IndianRupee, Video, Home,
  ChevronRight, Calendar
} from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { Button } from "@/components/ui/button";
import { useOffer } from "@/hooks/useOffer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { PriceDisplay } from "@/components/PriceDisplay";
import Link from "next/link";

// Predefined city data for SEO optimization
const cityData: Record<string, { gu: string, hi: string, description: string, title: string }> = {
  "ahmedabad": {
    gu: "અમદાવાદ",
    hi: "अहमदाबाद",
    title: "Best Astrologer in Ahmedabad",
    description: "Best Astrologer in Ahmedabad for Kundali analysis, Vastu Shastra, and Vedic remedies by Katyaayani Astrologer."
  },
  "surat": {
    gu: "સુરત",
    hi: "सूरत",
    title: "Expert Astrologer in Surat",
    description: "Expert Vedic Astrology services in Surat. Get accurate horoscope readings and personalized solutions today."
  },
  "vadodara": {
    gu: "વડોદરા",
    hi: "वडોદરા",
    title: "Trusted Astrologer in Vadodara",
    description: "Professional Astrology consultation in Vadodara. Specialized in Career, Marriage, and Health predictions."
  },
  "rajkot": {
    gu: "રાજકોટ",
    hi: "राजकोट",
    title: "Famous Astrologer in Rajkot",
    description: "Famous Astrologer in Rajkot providing ancient Vedic wisdom for modern problems by Rudram Joshi."
  },
  "mumbai": {
    gu: "મુંબઈ",
    hi: "मुंबई",
    title: "Top Astrologer in Mumbai",
    description: "Top-rated Astrology services in Mumbai. Connect with Katyaayani Astrologer for online and in-person sessions."
  },
  "delhi": {
    gu: "દિલ્હી",
    hi: "दिल्ली",
    title: "Best Astrologer in Delhi NCR",
    description: "Leading Vedic Astrologer in Delhi NCR. Get your birth chart analyzed by experts for clear life guidance."
  },
  "gandhinagar": {
    gu: "ગાંધીનગર",
    hi: "गांधीनगर",
    title: "Trusted Astrologer in Gandhinagar",
    description: "Trusted Astrology consultation in Gandhinagar. Expertise in Vastu, Kundali, and astrological remedies."
  },
  "bangalore": {
    gu: "બેંગલુરુ",
    hi: "बेंगलुरु",
    title: "Best Astrologer in Bangalore",
    description: "Top Vedic Astrology services in Bangalore. Specialized in career growth and life problem solutions."
  },
  "pune": {
    gu: "પુણે",
    hi: "पुणे",
    title: "Expert Astrologer in Pune",
    description: "Connect with the best astrologer in Pune for accurate future predictions and effective Vedic remedies."
  },
  "hyderabad": {
    gu: "હૈદરાબાદ",
    hi: "हैदराबाद",
    title: "Trusted Astrologer in Hyderabad",
    description: "Experienced Vedic Astrologer in Hyderabad offering Kundali matching and life guidance consultations."
  },
  "kolkata": {
    gu: "કોલકાતા",
    hi: "कोलकाता",
    title: "Famous Astrologer in Kolkata",
    description: "Renowned Astrology services in Kolkata for health, wealth, and family harmony using ancient wisdom."
  },
  "jaipur": {
    gu: "જયપુર",
    hi: "जयपुर",
    title: "Best Astrologer in Jaipur",
    description: "Get expert astrology advice in Jaipur. Specialized in traditional Vedic Jyotish and Vastu consultations."
  },
  "lucknow": {
    gu: "લખનૌ",
    hi: "लखनऊ",
    title: "Expert Astrologer in Lucknow",
    description: "Professional Vedic Astrology in Lucknow. Find solutions for marriage, career, and business growth."
  },
  "indore": {
    gu: "ઈન્દોર",
    hi: "इंदौर",
    title: "Famous Astrologer in Indore",
    description: "Top-rated astrologer in Indore providing personalized horoscope readings and effective remedies."
  },
  "bhavnagar": {
    gu: "ભાવનગર",
    hi: "भावनगर",
    title: "Best Astrologer in Bhavnagar",
    description: "Trusted Vedic Astrology services in Bhavnagar. Expertise in Kundali analysis and Vastu Shastra."
  },
  "jamnagar": {
    gu: "જામનગર",
    hi: "जामनगर",
    title: "Expert Astrologer in Jamnagar",
    description: "Accurate predictions and life guidance in Jamnagar by experienced Katyaayani Astrologer."
  },
  "junagadh": {
    gu: "જૂનાગઢ",
    hi: "जूनागढ़",
    title: "Famous Astrologer in Junagadh",
    description: "Connect with the best astrologer in Junagadh for spiritual growth and astrological solutions."
  },
  "anand": {
    gu: "આણંદ",
    hi: "आणंद",
    title: "Trusted Astrologer in Anand",
    description: "Top Vedic Astrology consultation in Anand. Get personalized remedies for your life challenges."
  },
  "nadiad": {
    gu: "નડિયાદ",
    hi: "नडियाद",
    title: "Best Astrologer in Nadiad",
    description: "Expert Astrology services in Nadiad. Accurate horoscope analysis and Vedic guidance since 2007."
  }
};

export default function CitySEOPage() {
  const params = useParams();
  const citySlug = typeof params.city === 'string' ? params.city.toLowerCase() : '';
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
  const data = cityData[citySlug] || {
    gu: cityName,
    hi: cityName,
    title: `Best Astrologer in ${cityName}`,
    description: `Expert Astrology services in ${cityName}. Connect with Katyaayani Astrologer for ancient Vedic wisdom and life solutions.`
  };

  const { theme } = useTheme();
  const { language, t } = useTranslation();
  const { offer, isOfferValid } = useOffer();
  const { user, showAuthModal } = useAuth();

  // Set document title for SEO on client side (since it's a client component)
  useEffect(() => {
    document.title = `${data.title} | Katyaayani Astrologer`;

    // Add meta description dynamically
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description);
    }
  }, [data]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <Navbar />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=2000"
            alt={`Expert Astrologer in ${cityName}`}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mt-10">
          {/* Breadcrumbs for SEO */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs md:text-sm font-medium opacity-60">
            <Link href="/" className="hover:text-[#ff6b35] transition-colors">{t('Home')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/services" className="hover:text-[#ff6b35] transition-colors">{t('Services')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#ff6b35]">Astrologer in {cityName}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-2 mb-6">
              <Sun className="w-8 h-8 text-[#ff6b35] animate-pulse" />
              <Star className="w-8 h-8 text-[#ff8c5e]" />
              <MapPin className="w-8 h-8 text-[#ff6b35]" />
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl font-bold mb-6 text-gradient-ancient leading-tight">
              {language === 'gu' ? `${data.gu}માં શ્રેષ્ઠ જ્યોતિષ` : language === 'hi' ? `${data.hi} में सर्वश्रेष्ठ ज्योतिषी` : `Best Astrologer in ${cityName}`}
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
              {data.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => {
                  if (!user) {
                    showAuthModal('signin');
                  } else {
                    window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                  }
                }}
                className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold px-8 py-7 rounded-full text-lg shadow-xl shadow-[#ff6b35]/20 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> {t('Book Consultation Now')}
              </Button>
              <Link href="/contact">
                <Button variant="outline" className="border-[#ff6b35] text-[#ff6b35] font-bold px-8 py-7 rounded-full text-lg hover:bg-[#ff6b35]/5">
                  {t('Enquire Now')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#ff6b35]" />
                <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold text-[#ff6b35]">
                  {language === 'gu' ? `${data.gu}માં વૈદિક જ્યોતિષ સેવાઓ` : language === 'hi' ? `${data.hi} में वैदिक ज्योतिष सेवाएं` : `Sacred Astrology in ${cityName}`}
                </h2>
              </div>
              <div className={`prose prose-lg max-w-none leading-relaxed ${theme === 'dark' ? 'prose-invert text-[#a0998c]' : 'text-[#6b5847]'}`}>
                <p className="text-xl">
                  Katyaayani Astrologer is renowned for providing the most accurate and insightful astrology services in <strong>{cityName}</strong>. With a legacy rooted in ancient Brahmin traditions and over 18 years of experience, we help you align your life with the cosmic patterns.
                </p>
                <p>
                  Our services in {cityName} are designed to provide practical solutions to complex life problems. From analyzing your birth chart (Kundali) to identifying remedial measures like gemstones and puja, we offer a comprehensive approach to Vedic Jyotish.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "Kundali Analysis", icon: Moon, desc: "A deep dive into your Janam Kundali to reveal life's hidden patterns and future possibilities." },
                { title: "Vastu Shastra", icon: Home, desc: "Transform your home in {cityName} into a source of positive energy and prosperity." },
                { title: "Marriage Matching", icon: Star, desc: "Ensuring celestial compatibility for a harmonious life partnership." },
                { title: "Career Path", icon: Sparkles, desc: "Navigate your professional journey with divine timing and planetary insights." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20 shadow-2xl' : 'bg-white border-[#ff6b35]/10 shadow-xl'} overflow-hidden group`}>
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#ff6b35]/10 flex items-center justify-center mb-6 group-hover:bg-[#ff6b35] transition-colors duration-500">
                        <item.icon className="w-7 h-7 text-[#ff6b35] group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-[#ff6b35] transition-colors">{item.title}</h3>
                      <p className="opacity-70 leading-relaxed">{item.desc.replace('{cityName}', cityName)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className={`p-10 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-[#1a1a2e]/30 border-[#ff6b35]/20' : 'bg-[#fffbf0] border-[#ff6b35]/20'}`}>
              <h3 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold mb-6 text-[#ff6b35]">Why Choose Us in {cityName}?</h3>
              <ul className="space-y-5">
                {[
                  "Over 1,00,000+ satisfied clients globally.",
                  "Scientific and ancient Vedic approach combined.",
                  "Personalized remedies including Mantra, Puja, and Gemstones.",
                  "Available for both Home Visits and Online consultations.",
                  "Privacy and confidentiality guaranteed for every session."
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#ff6b35] flex-shrink-0 mt-1" />
                    <span className="text-lg opacity-80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <Card className={`sticky top-32 ${theme === 'dark' ? 'bg-gradient-to-br from-[#12121a] to-[#1a1a2e] border-[#ff6b35]/30' : 'bg-gradient-to-br from-white to-orange-50 border-[#ff6b35]/20'} shadow-2xl rounded-[2rem]`}>
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-[#ff6b35]" />
                  <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">Book in {cityName}</h3>
                </div>
                <p className="mb-8 opacity-80 leading-relaxed">
                  Join thousands of seekers in {cityName} who have found their path with Katyaayani Astrologer.
                </p>
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#ff6b35]/5 border border-[#ff6b35]/10">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-[#ff6b35]" />
                      <span className="font-semibold">Online Session</span>
                    </div>
                     <PriceDisplay amount={501} className="text-[#ff6b35] text-lg" showBadge={true} showUrgency={false} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#ff6b35]/5 border border-[#ff6b35]/10">
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-[#ff6b35]" />
                      <span className="font-semibold">Home Visit</span>
                    </div>
                    <span className="text-[#ff6b35] font-black">₹ 1,101+</span>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    if (!user) {
                      showAuthModal('signin');
                    } else {
                      window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold py-8 rounded-2xl text-xl shadow-lg shadow-[#ff6b35]/20 hover:scale-[1.02] transition-all"
                >
                  Start Your Reading
                </Button>
                <p className="text-center text-xs opacity-50 mt-4">100% Satisfaction Guaranteed</p>
              </CardContent>
            </Card>

            <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'} rounded-2xl`}>
              <CardContent className="p-8">
                <h3 className="font-bold text-lg mb-6 border-b pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff6b35]" /> Service Locations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(cityData).filter(c => c !== citySlug).map(c => (
                    <Link key={c} href={`/astrologer-in/${c}`} className="text-xs px-4 py-2 rounded-xl border border-[#ff6b35]/20 hover:border-[#ff6b35] hover:bg-[#ff6b35]/5 transition-all font-medium">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

