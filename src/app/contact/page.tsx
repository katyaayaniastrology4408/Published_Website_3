"use client";

import { motion } from "framer-motion";
import { Star, Phone, Mail, MapPin, Clock, MessageCircle, Instagram } from "lucide-react";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import EnquiryForm from "@/components/EnquiryForm";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";

export default function ContactPage() {
  const { theme } = useTheme();
  const { language } = useTranslation();

  const t = (en: string, hi: string, gu: string) =>
    language === "hi" ? hi : language === "gu" ? gu : en;

    const contactInfo = [
      {
        icon: Phone,
        label: t("Phone / WhatsApp", "फ़ोन / व्हाट्सएप", "ફોન / વ્હૉટ્સએપ"),
        value: "+91 98249 29588",
        link: "https://wa.me/919824929588",
      },
      {
        icon: Instagram,
        label: t("Instagram", "इंस्टाग्राम", "ઇન્સ્ટાગ્રામ"),
        value: "@katyaayani_astrologer",
        link: "https://www.instagram.com/katyaayani_astrologer",
      },
      {
        icon: Mail,
        label: t("Email", "ईमेल", "ઇમેઇલ"),
        value: "katyaayaniastrologer01@gmail.com",
        link: "mailto:katyaayaniastrologer01@gmail.com",
      },
      {
        icon: MapPin,
        label: t("Location", "स्थान", "સ્થળ"),
        value: t("Vastral, Ahmedabad, Gujarat, India", "वस्त्राल, अहमदाबाद, गुजरात, भारत", "વસ્ત્રાલ, અમદાવાદ, ગુજરાત, ભારત"),
        link: "https://maps.google.com/?q=Vastral+Ahmedabad",
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
                  <Star className="w-8 h-8 text-[#ff6b35]" />
                  <MessageCircle className="w-8 h-8 text-[#ff8c5e]" />
                  <Star className="w-8 h-8 text-[#ff6b35]" />
                </div>
                <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">
                  {t("Contact", "संपर्क", "સંપર્ક")}
                </h1>
                <p className={`text-xl leading-relaxed ${theme === "dark" ? "text-[#a0998c]" : "text-[#6b5847]"}`}>
                  {t(
                    "Reach out to Katyaayani Astrologer for consultations, enquiries, or spiritual guidance.",
                    "परामर्श, प्रश्नों या आध्यात्मिक मार्गदर्शन के लिए कात्यायनी ज्योतिषी से संपर्क करें।",
                    "પરામર્શ, પ્રશ્નો અથવા આધ્યાત્મિક માર્ગદર્શન માટે કાત્યાયની જ્યોતિષ સાથે સંપર્ક કરો."
                  )}
                </p>
              </motion.div>
            </div>
          </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`p-6 rounded-xl border h-full ${theme === "dark" ? "bg-[#12121a] border-[#c9a227]/20" : "bg-[#fff8f0] border-[#ff6b35]/20"}`}>
                  <item.icon className={`w-8 h-8 mb-3 ${theme === "dark" ? "text-[#c9a227]" : "text-[#ff6b35]"}`} />
                  <p className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-[#c9a227]" : "text-[#ff6b35]"}`}>{item.label}</p>
                  {item.link ? (
                    <a href={item.link} className={`text-sm hover:underline ${theme === "dark" ? "text-[#f5f0e8]" : "text-[#2d1810]"}`} target="_blank" rel="noopener noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    <p className={`text-sm ${theme === "dark" ? "text-[#f5f0e8]" : "text-[#2d1810]"}`}>{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="py-12 px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-center mb-8 text-gradient-ancient">
                {t("Send Us a Message", "हमें संदेश भेजें", "અમને સંદેશ મોકલો")}
              </h2>
              <EnquiryForm />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
