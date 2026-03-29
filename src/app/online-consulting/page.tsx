"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Phone, MessageCircle, Clock, Globe, Shield, CheckCircle,
  Sparkles, Calendar, ArrowRight, ChevronDown, ChevronUp,
  Headphones, Lock, Loader2, KeyRound, ExternalLink, PartyPopper, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useOffer } from "@/hooks/useOffer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

const features = {
  en: [
    { icon: Video, title: "HD Video Consultation", desc: "Crystal clear video calls for face-to-face consultations from anywhere in the world" },
    { icon: Phone, title: "Voice Call Option", desc: "Prefer audio only? Connect via high-quality voice calls for your comfort" },
    { icon: Globe, title: "Available Worldwide", desc: "Connect from any country, any timezone - we accommodate your schedule" },
    { icon: Shield, title: "100% Confidential", desc: "Your personal information and readings are completely private and secure" },
    { icon: Clock, title: "Flexible Timing", desc: "Book sessions that fit your schedule with morning, afternoon & evening slots" },
    { icon: Headphones, title: "WhatsApp Support", desc: "Quick support via WhatsApp for any queries and assistance" }
  ],
  hi: [
    { icon: Video, title: "HD वीडियो परामर्श", desc: "दुनिया में कहीं से भी आमने-सामने परामर्श के लिए क्रिस्टल क्लियर वीडियो कॉल" },
    { icon: Phone, title: "वॉयस कॉल विकल्प", desc: "केवल ऑडियो पसंद है? आपकी सुविधा के लिए उच्च गुणवत्ता वाली वॉयस कॉल से जुड़ें" },
    { icon: Globe, title: "विश्वव्यापी उपलब्ध", desc: "किसी भी देश, किसी भी समय क्षेत्र से जुड़ें - हम आपके शेड्यूल को समायोजित करते हैं" },
    { icon: Shield, title: "100% गोपनीय", desc: "आपकी व्यक्तिगत जानकारी और रीडिंग पूरी तरह से निजी और सुरक्षित हैं" },
    { icon: Clock, title: "लचीला समय", desc: "सुबह, दोपहर और शाम के स्लॉट के साथ अपने शेड्यूल के अनुसार सत्र बुक करें" },
    { icon: Headphones, title: "WhatsApp सहायता", desc: "किसी भी प्रश्न के लिए WhatsApp द्वारा त्वरित सहायता" }
  ],
  gu: [
    { icon: Video, title: "HD વીડિયો પરામર્શ", desc: "વિશ્વમાં ક્યાંયથી પણ સામ-સામે પરામર્શ માટે ક્રિસ્ટલ ક્લિયર વીડિયો કૉલ્સ" },
    { icon: Phone, title: "વૉઇસ કૉલ વિકલ્પ", desc: "માત્ર ઑડિયો પસંદ છે? તમારી આરામ માટે ઉચ્ચ ગુણવત્તાના વૉઇસ કૉલ્સથી જોડાઓ" },
    { icon: Globe, title: "વિશ્વભરમાં ઉપલબ્ધ", desc: "કોઈપણ દેશથી, કોઈપણ ટાઇમઝોનથી જોડાઓ - અમે તમારા શેડ્યૂલને સમાયોજિત કરીએ છીએ" },
    { icon: Shield, title: "100% ગોપનીય", desc: "તમારી વ્યક્તિગત માહિતી અને રીડિંગ્સ સંપૂર્ણપણે ખાનગી અને સુરક્ષિત છે" },
    { icon: Clock, title: "લવચીક સમય", desc: "સવાર, બપોર અને સાંજના સ્લોટ્સ સાથે તમારા શેડ્યૂલ મુજબ સત્રો બુક કરો" },
    { icon: Headphones, title: "WhatsApp સહાય", desc: "કોઈપણ પ્રશ્નો માટે WhatsApp દ્વારા ઝડપી સહાય" }
  ]
};

const howItWorks = {
  en: [
    { step: 1, title: "Book Your Slot", desc: "Choose your preferred date and time slot from our availability calendar" },
    { step: 2, title: "Share Birth Details", desc: "Provide your birth date, time, and place for accurate kundali preparation" },
    { step: 3, title: "Make Payment", desc: "Secure payment via UPI, cards, or net banking" },
    { step: 4, title: "Join Session", desc: "Receive meeting link via email/WhatsApp and join at scheduled time" }
  ],
  hi: [
    { step: 1, title: "अपना स्लॉट बुक करें", desc: "हमारे उपलब्धता कैलेंडर से अपनी पसंदीदा तारीख और समय स्लॉट चुनें" },
    { step: 2, title: "जन्म विवरण साझा करें", desc: "सटीक कुंडली तैयारी के लिए अपनी जन्म तिथि, समय और स्थान प्रदान करें" },
    { step: 3, title: "भुगतान करें", desc: "UPI, कार्ड या नेट बैंकिंग के माध्यम से सुरक्षित भुगतान" },
    { step: 4, title: "सत्र में शामिल हों", desc: "ईमेल/व्हाट्सएप के माध्यम से मीटिंग लिंक प्राप्त करें और निर्धारित समय पर जुड़ें" }
  ],
  gu: [
    { step: 1, title: "તમારો સ્લોટ બુક કરો", desc: "અમારા ઉપલબ્ધતા કેલેન્ડરમાંથી તમારી પસંદગીની તારીખ અને સમય સ્લોટ પસંદ કરો" },
    { step: 2, title: "જન્મ વિગતો શેર કરો", desc: "સચોટ કુંડળી તૈયારી માટે તમારી જન્મ તારીખ, સમય અને સ્થળ આપો" },
    { step: 3, title: "ચુકવણી કરો", desc: "UPI, કાર્ડ અથવા નેટ બેંકિંગ દ્વારા સુરક્ષિત ચુકવણી" },
    { step: 4, title: "સત્રમાં જોડાઓ", desc: "ઇમેઇલ/વ્હોટ્સએપ દ્વારા મીટિંગ લિંક મેળવો અને નિર્ધારિત સમયે જોડાઓ" }
  ]
};

const faqs = {
  en: [
    { q: "What platform do you use for video calls?", a: "We use Google Meet or Zoom for video consultations. You'll receive the meeting link 30 minutes before your scheduled session via email and WhatsApp." },
    { q: "Can I reschedule my appointment?", a: "Yes, you can reschedule up to 24 hours before your appointment. Contact us via WhatsApp or email to reschedule." },
    { q: "What if I face technical issues during the call?", a: "Don't worry! If the call disconnects, we'll immediately call you back. If issues persist, we can switch to a phone call or reschedule at no extra cost." },
    { q: "How long is each consultation session?", a: "Online consultations are 45 minutes long, providing ample time for detailed kundali analysis and your questions." },
    { q: "Will I get a recording of the session?", a: "For privacy reasons, sessions are not recorded. However, you'll receive a detailed written summary via email within 24 hours." },
    { q: "What languages are supported?", a: "We offer consultations in English, Hindi, and Gujarati. Choose your preferred language while booking." }
  ],
  hi: [
    { q: "आप वीडियो कॉल के लिए कौन सा प्लेटफॉर्म इस्तेमाल करते हैं?", a: "हम वीडियो परामर्श के लिए Google Meet या Zoom का उपयोग करते हैं। आपको निर्धारित सत्र से 30 मिनट पहले ईमेल और व्हाट्सएप के माध्यम से मीटिंग लिंक प्राप्त होगा।" },
    { q: "क्या मैं अपनी अपॉइंटमेंट को पुनर्निर्धारित कर सकता हूं?", a: "हां, आप अपनी अपॉइंटमेंट से 24 घंटे पहले तक पुनर्निर्धारित कर सकते हैं। पुनर्निर्धारित करने के लिए व्हाट्सएप या ईमेल के माध्यम से संपर्क करें।" },
    { q: "अगर कॉल के दौरान तकनीकी समस्या आती है तो?", a: "चिंता न करें! अगर कॉल डिस्कनेक्ट होती है, तो हम तुरंत आपको वापस कॉल करेंगे। अगर समस्या बनी रहती है, तो हम फोन कॉल पर स्विच कर सकते हैं या बिना किसी अतिरिक्त लागत के पुनर्निर्धारित कर सकते हैं।" },
    { q: "प्रत्येक परामर्श सत्र कितना लंबा है?", a: "ऑनलाइन परामर्श 45 मिनट का होता है, जो विस्तृत कुंडली विश्लेषण और आपके प्रश्नों के लिए पर्याप्त समय प्रदान करता है।" },
    { q: "क्या मुझे सत्र की रिकॉर्डिंग मिलेगी?", a: "गोपनीयता कारणों से, सत्र रिकॉर्ड नहीं किए जाते। हालांकि, आपको 24 घंटे के भीतर ईमेल के माध्यम से एक विस्तृत लिखित सारांश प्राप्त होगा।" },
    { q: "कौन सी भाषाएं समर्थित हैं?", a: "हम अंग्रेजी, हिंदी और गुजराती में परामर्श प्रदान करते हैं। बुकिंग करते समय अपनी पसंदीदा भाषा चुनें।" }
  ],
  gu: [
    { q: "તમે વીડિયો કૉલ્સ માટે કયું પ્લેટફોર્મ વાપરો છો?", a: "અમે વીડિયો પરામર્શ માટે Google Meet અથવા Zoom નો ઉપયોગ કરીએ છીએ. તમને નિર્ધારિત સત્રના 30 મિનિટ પહેલાં ઇમેઇલ અને વ્હોટ્સએપ દ્વારા મીટિંગ લિંક મળશે." },
    { q: "શું હું મારી એપોઇન્ટમેન્ટ રિશેડ્યૂલ કરી શકું?", a: "હા, તમે તમારી એપોઇન્ટમેન્ટના 24 કલાક પહેલાં સુધી રિશેડ્યૂલ કરી શકો છો. રિશેડ્યૂલ કરવા માટે વ્હોટ્સએપ અથવા ઇમેઇલ દ્વારા સંપર્ક કરો." },
    { q: "જો કૉલ દરમિયાન ટેકનિકલ સમસ્યા આવે તો?", a: "ચિંતા ન કરો! જો કૉલ ડિસ્કનેક્ટ થાય, તો અમે તરત જ તમને પાછા કૉલ કરીશું. જો સમસ્યા ચાલુ રહે, તો અમે ફોન કૉલ પર સ્વિચ કરી શકીએ અથવા કોઈ વધારાના ખર્ચ વિના રિશેડ્યૂલ કરી શકીએ." },
    { q: "દરેક પરામર્શ સત્ર કેટલું લાંબું છે?", a: "ઓનલાઇન પરામર્શ 45 મિનિટનું છે, જે વિગતવાર કુંડળી વિશ્લેષણ અને તમારા પ્રશ્નો માટે પૂરતો સમય પ્રદાન કરે છે." },
    { q: "શું મને સત્રની રેકોર્ડિંગ મળશે?", a: "ગોપનીયતાના કારણોસર, સત્રો રેકોર્ડ થતા નથી. જો કે, તમને 24 કલાકની અંદર ઇમેઇલ દ્વારા વિગતવાર લેખિત સારાંશ મળશે." },
    { q: "કઈ ભાષાઓ સપોર્ટેડ છે?", a: "અમે અંગ્રેજી, હિન્દી અને ગુજરાતીમાં પરામર્શ આપીએ છીએ. બુકિંગ કરતી વખતે તમારી પસંદગીની ભાષા પસંદ કરો." }
  ]
};

const stats = [
  { value: "10k+", labelEn: "Consultations", labelHi: "परामर्श", labelGu: "પરામર્શ" },
  { value: "17+", labelEn: "Years Experience", labelHi: "वर्षों का अनुभव", labelGu: "વર્ષોનો અનુભવ" },
  { value: "4.9/5", labelEn: "Average Rating", labelHi: "औसत रेटिंग", labelGu: "સરેરાશ રેટિંગ" }
];

interface OnlineBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  service_type: string;
  payment_status: string;
}

export default function OnlineConsultingPage() {
  const { theme } = useTheme();
  const { language, t } = useTranslation();
  const { user, showAuthModal } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasOnlineBooking, setHasOnlineBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState<OnlineBooking | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [verifyingInvoice, setVerifyingInvoice] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const { offer, isOfferValid } = useOffer();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkOnlineBooking = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("id, booking_date, booking_time, status, service_type, payment_status")
          .eq("email", user.email)
          .eq("service_type", "online")
          .in("payment_status", ["pending", "completed", "success"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setHasOnlineBooking(true);
          setOnlineBooking(data);
        }
      } catch (err) {
        console.error("Error checking online booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      checkOnlineBooking();
    }
  }, [user, mounted]);

  const handleBookNow = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      showAuthModal('signin');
    }
  };

  const handleVerifyInvoice = async () => {
    if (!invoiceNumber.trim()) {
      setInvoiceError(language === 'gu' ? 'કૃપા કરી બિલ/ઇન્વૉઇસ નંબર દાખલ કરો' : language === 'hi' ? 'कृपया बिल/इनवॉइस नंबर दर्ज करें' : 'Please enter bill/invoice number');
      return;
    }

    setVerifyingInvoice(true);
    setInvoiceError("");

    try {
      // First check meeting_codes table
      const { data: meetingCode, error: meetingError } = await supabase
        .from("meeting_codes")
        .select("*")
        .eq("invoice_number", invoiceNumber.trim().toUpperCase())
        .maybeSingle();

      if (meetingCode && !meetingCode.is_used) {
        // Meeting code found and not used - mark as used and redirect
        await supabase
          .from("meeting_codes")
          .update({ is_used: true, used_at: new Date().toISOString(), used_by: user?.email })
          .eq("id", meetingCode.id);

        setMeetLink(meetingCode.meet_link || "https://meet.google.com/landing");
        setShowSuccessPopup(true);
        return;
      }

      // If not found in meeting_codes, check bookings table
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("invoice_number", invoiceNumber.trim().toUpperCase())
        .eq("service_type", "online")
        .maybeSingle();

      if (booking) {
        // Valid booking found - redirect to Google Meet landing
        setMeetLink("https://meet.google.com/landing");
        setShowSuccessPopup(true);
        return;
      }

      // Neither found - show error
      setInvoiceError(language === 'gu' ? 'અમાન્ય અથવા સમાપ્ત થયેલ ઇન્વૉઇસ નંબર' : language === 'hi' ? 'अमान्य या समाप्त इनवॉइस नंबर' : 'Invalid or expired invoice number');
    } catch (err) {
      setInvoiceError(language === 'gu' ? 'કંઈક ખોટું થયું' : language === 'hi' ? 'कुछ गलत हुआ' : 'Something went wrong');
    } finally {
      setVerifyingInvoice(false);
    }
  };

  const handleJoinMeet = () => {
    if (meetLink) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: meetLink } }, "*");
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#fdfbf7]'}`}>
        <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
      </div>
    );
  }

  if (!user || !hasOnlineBooking) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
        <Navbar />
        <section className="min-h-[80vh] flex items-center justify-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <div className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#ff6b35]/10' : 'bg-[#ff6b35]/10'}`}>
              <Lock className="w-12 h-12 text-[#ff6b35]" />
            </div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
              {language === 'gu' ? 'એક્સક્લુસિવ એક્સેસ' : language === 'hi' ? 'एक्सक्लूसिव एक्सेस' : 'Exclusive Access'}
            </h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
              {language === 'gu'
                ? 'આ પેજ ફક્ત ઓનલાઇન કન્સલ્ટિંગ બુક કરનાર ગ્રાહકો માટે ઉપલબ્ધ છે. ઓનલાઇન સત્ર બુક કરો અને પૂર્ણ માહિતી મેળવો.'
                : language === 'hi'
                  ? 'यह पेज केवल ऑनलाइन कन्सल्टिंग बुक करने वाले ग्राहकों के लिए उपलब्ध है। ऑनलाइन सत्र बुक करें और पूर्ण जानकारी प्राप्त करें।'
                  : 'This page is exclusively available for customers who have booked online consulting. Book an online session to get full access.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button
                  onClick={handleBookNow}
                  size="lg"
                  className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-[#ff6b35]/25"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {language === 'gu' ? 'ઓનલાઇન સત્ર બુક કરો' : language === 'hi' ? 'ऑनलाइन सत्र बुक करें' : 'Book Online Session'}
                </Button>
              </Link>
            </div>
            <div className={`mt-6 flex justify-center ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
              <PriceDisplay amount={501} className="text-xl" showBadge={true} showUrgency={false} />
              <span className="text-sm self-end mb-1 ml-1"> / 45 {language === 'gu' ? 'મિનિટ' : language === 'hi' ? 'मिनट' : 'minutes'}</span>
            </div>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  const currentFeatures = features[language as keyof typeof features] || features.en;
  const currentHowItWorks = howItWorks[language as keyof typeof howItWorks] || howItWorks.en;
  const currentFaqs = faqs[language as keyof typeof faqs] || faqs.en;

  const getLabel = (stat: typeof stats[0]) => {
    if (language === 'hi') return stat.labelHi;
    if (language === 'gu') return stat.labelGu;
    return stat.labelEn;
  };

  const whatsappNumber = "919824929588";
  const whatsappMessage = language === 'gu'
    ? "નમસ્તે! મને ઓનલાઇન જ્યોતિષ પરામર્શ વિશે જાણકારી જોઈએ છે."
    : language === 'hi'
      ? "नमस्ते! मुझे ऑनलाइन ज्योतिष परामर्श के बारे में जानकारी चाहिए।"
      : "Hello! I would like to know about online astrology consultation.";

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
      <Navbar />

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a0a2e] via-[#0a0a0f] to-[#0f1a2e]' : 'bg-gradient-to-br from-[#fff5eb] via-[#fdfbf7] to-[#f0e6d8]'}`} />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6b35]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ff8c5e]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-6">
              <Globe className="w-4 h-4 text-[#ff6b35]" />
              <span className="text-sm font-medium text-[#ff6b35]">
                {language === 'gu' ? 'વિશ્વભરમાં ઉપલબ્ધ' : language === 'hi' ? 'विश्वव्यापी उपलब्ध' : 'Available Worldwide'}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-ancient">
              {language === 'gu' ? 'ઓનલાઇન જ્યોતિષ પરામર્શ' : language === 'hi' ? 'ऑनलाइन ज्योतिष परामर्श' : 'Online Astrology Consultation'}
            </h1>

            <p className={`text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
              {language === 'gu'
                ? 'ઘરે બેઠા વીડિયો કૉલ દ્વારા પ્રામાણિક વૈદિક જ્યોતિષ પરામર્શ મેળવો. વિશ્વના કોઈપણ ખૂણેથી જોડાઓ.'
                : language === 'hi'
                  ? 'घर बैठे वीडियो कॉल के माध्यम से प्रामाणिक वैदिक ज्योतिष परामर्श प्राप्त करें। दुनिया के किसी भी कोने से जुड़ें।'
                  : 'Get authentic Vedic astrology consultation via video call from the comfort of your home. Connect from anywhere in the world.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={(e) => {
                  if (!user) {
                    showAuthModal('signin');
                  } else {
                    window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
                  }
                }}
                className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-[#ff6b35]/25 flex items-center justify-center transition-all"
              >
                <Video className="w-5 h-5 mr-2" />
                <span className="flex items-center gap-2">
                  {language === 'gu' ? 'હવે બુક કરો -' : language === 'hi' ? 'अभी बुक करें -' : 'Book Now -'}
                  <PriceDisplay amount={501} className="text-white relative top-[2px]" showBadge={false} showUrgency={false} />
                </span>
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-bold text-lg px-8 py-6 rounded-2xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'gu' ? 'WhatsApp પર ચેટ કરો' : language === 'hi' ? 'WhatsApp पर चैट करें' : 'Chat on WhatsApp'}
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-[#ff6b35]/5'}`}
                >
                  <p className="text-2xl md:text-3xl font-bold text-[#ff6b35]">{stat.value}</p>
                  <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>{getLabel(stat)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Google Meet Code Entry Section */}
      <section className={`py-16 px-6 ${theme === 'dark' ? 'bg-gradient-to-b from-[#0f0f15] to-[#0a0a0f]' : 'bg-gradient-to-b from-[#f0e6d8] to-[#fdfbf7]'}`}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/30' : 'bg-white border-[#ff6b35]/20'} overflow-hidden`}>
              <CardContent className="p-8 md:p-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <KeyRound className="w-8 h-8 text-green-500" />
                </div>

                <h3 className={`font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                  {language === 'gu' ? 'Google Meet માં જોડાઓ' : language === 'hi' ? 'Google Meet से जुड़ें' : 'Join Google Meet'}
                </h3>

                <p className={`mb-6 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                  {language === 'gu'
                    ? 'પેમેન્ટ સફળ થયા પછી WhatsApp પર મળેલ બિલ/ઇન્વૉઇસ નંબર અહીં દાખલ કરો'
                    : language === 'hi'
                      ? 'भुगतान सफल होने के बाद WhatsApp पर मिला बिल/इनवॉइस नंबर यहां दर्ज करें'
                      : 'Enter the bill/invoice number received via WhatsApp after successful payment'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="text"
                    placeholder={language === 'gu' ? 'ઇન્વૉઇસ નંબર (દા.ત. ASTRO26001)' : language === 'hi' ? 'इनवॉइस नंबर (उदा. ASTRO26001)' : 'Invoice No. (e.g. ASTRO26001)'}
                    value={invoiceNumber}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value.toUpperCase());
                      setInvoiceError("");
                    }}
                    className={`text-center text-lg tracking-widest uppercase font-bold ${theme === 'dark' ? 'bg-[#0a0a0f] border-[#ff6b35]/30' : 'bg-[#fdfbf7] border-[#ff6b35]/30'} focus:border-green-500`}
                    maxLength={20}
                  />
                  <Button
                    onClick={handleVerifyInvoice}
                    disabled={verifyingInvoice || !invoiceNumber.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-5 rounded-xl"
                  >
                    {verifyingInvoice ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Video className="w-5 h-5 mr-2" />
                        {language === 'gu' ? 'જોડાઓ' : language === 'hi' ? 'जुड़ें' : 'Join'}
                      </>
                    )}
                  </Button>
                </div>

                <p className={`text-xs mt-3 font-medium ${theme === 'dark' ? 'text-amber-500/80' : 'text-amber-600'}`}>
                  <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                  {language === 'gu'
                    ? 'તમારો ઇન્વૉઇસ નંબર પ્રોફાઇલ પેજમાં હશે, ત્યાંથી ચેક કરો.'
                    : language === 'hi'
                      ? 'आपका इनवॉइस नंबर प्रोफाइल पेज में होगा, वहां से चेक करें।'
                      : 'Your invoice number will be on the profile page, please check there.'}
                </p>

                {invoiceError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-3"
                  >
                    {invoiceError}
                  </motion.p>
                )}

                <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#ff6b35]/10'}`}>
                  <p className={`text-xs ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                    <MessageCircle className="w-4 h-4 inline mr-1 text-green-500" />
                    {language === 'gu'
                      ? 'ઇન્વૉઇસ નંબર નથી મળ્યો? WhatsApp પર સંપર્ક કરો'
                      : language === 'hi'
                        ? 'इनवॉइस नंबर नहीं मिला? WhatsApp पर संपर्क करें'
                        : "Didn't receive the invoice number? Contact us on WhatsApp"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Success Popup Dialog */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className={`${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/30' : 'bg-white border-[#ff6b35]/20'} max-w-md`}>
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"
            >
              <PartyPopper className="w-10 h-10 text-green-500" />
            </motion.div>
            <DialogTitle className={`font-[family-name:var(--font-cinzel)] text-2xl font-bold ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
              {language === 'gu' ? 'ચુકવણી સફળ!' : language === 'hi' ? 'भुगतान सफल!' : 'Payment Successful!'}
            </DialogTitle>
            <DialogDescription className={`${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'} text-base`}>
              {language === 'gu'
                ? 'તમારી ચુકવણી સફળતાપૂર્વક ચકાસાઈ ગઈ છે. Google Meet સત્રમાં જોડાવા માટે નીચેના બટન પર ક્લિક કરો.'
                : language === 'hi'
                  ? 'आपका भुगतान सफलतापूर्वक सत्यापित हो गया है। Google Meet सत्र में शामिल होने के लिए नीचे दिए गए बटन पर क्लिक करें।'
                  : 'Your payment has been verified successfully. Click the button below to join the Google Meet session.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <Button
              onClick={handleJoinMeet}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-xl text-lg"
            >
              <Video className="w-5 h-5 mr-2" />
              {language === 'gu' ? 'Google Meet માં જોડાઓ' : language === 'hi' ? 'Google Meet से जुड़ें' : 'Join Google Meet'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <p className={`text-xs text-center ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
              {language === 'gu'
                ? 'નવી ટેબમાં Google Meet ખુલશે'
                : language === 'hi'
                  ? 'नई टैब में Google Meet खुलेगा'
                  : 'Google Meet will open in a new tab'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0f0f15]' : 'bg-[#f8f4ee]'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {language === 'gu' ? 'ઓનલાઇન કન્સલ્ટિંગના ફાયદા' : language === 'hi' ? 'ऑनलाइन परामर्श के लाभ' : 'Benefits of Online Consulting'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
              {language === 'gu' ? 'આધુનિક ટેકનોલોજી સાથે પ્રાચીન જ્ઞાન' : language === 'hi' ? 'आधुनिक तकनीक के साथ प्राचीन ज्ञान' : 'Ancient wisdom meets modern technology'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'} hover:border-[#ff6b35]/40 transition-all`}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#ff6b35]/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 text-[#ff6b35]" />
                    </div>
                    <h3 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#fdfbf7]'}`}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {language === 'gu' ? 'કેવી રીતે કામ કરે છે?' : language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works?'}
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#ff6b35]/20 hidden md:block" />

            {currentHowItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'}`}>
                    <CardContent className="p-6">
                      <h3 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#ff6b35] flex items-center justify-center text-white font-bold text-lg z-10 hidden md:flex">
                  {step.step}
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0f0f15]' : 'bg-[#f8f4ee]'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl font-bold mb-4 text-gradient-ancient">
              {language === 'gu' ? 'વારંવાર પૂછાતા પ્રશ્નો' : language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'} ${openFaq === index ? 'border-[#ff6b35]/40' : ''}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardContent className="p-0">
                    <div className="p-5 flex items-center justify-between">
                      <h4 className={`font-semibold pr-4 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#4a3f35]'}`}>
                        {faq.q}
                      </h4>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-[#ff6b35] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#ff6b35] flex-shrink-0" />
                      )}
                    </div>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`px-5 pb-5 pt-0 border-t ${theme === 'dark' ? 'border-[#ff6b35]/10 text-[#a0998c]' : 'border-[#ff6b35]/10 text-[#75695e]'}`}
                      >
                        <p className="pt-4 text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#fdfbf7]'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-8 md:p-12 rounded-3xl text-center relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a0a2e] to-[#0f1a2e] border border-[#ff6b35]/20' : 'bg-gradient-to-br from-[#fff5eb] to-[#ffe8d6] border border-[#ff6b35]/20'
              }`}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ff6b35]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ff8c5e]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-[#ff6b35] mx-auto mb-6" />
              <h2 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-4xl font-bold mb-4 text-gradient-ancient">
                {language === 'gu' ? 'તમારી યાત્રા આજે જ શરૂ કરો' : language === 'hi' ? 'अपनी यात्रा आज ही शुरू करें' : 'Start Your Journey Today'}
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                {language === 'gu'
                  ? 'તમારા જીવનના પ્રશ્નોના જવાબ વૈદિક જ્યોતિષના પ્રાચીન જ્ઞાનમાં છુપાયેલા છે.'
                  : language === 'hi'
                    ? 'आपके जीवन के प्रश्नों के उत्तर वैदिक ज्योतिष के प्राचीन ज्ञान में छिपे हैं।'
                    : "The answers to your life's questions lie hidden in the ancient wisdom of Vedic astrology."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button
                    onClick={handleBookNow}
                    size="lg"
                    className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-xl shadow-[#ff6b35]/25"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {language === 'gu' ? 'સત્ર બુક કરો' : language === 'hi' ? 'सत्र बुक करें' : 'Book a Session'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-500 hover:bg-green-500/10 font-bold text-lg px-10 py-7 rounded-2xl"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}>
                    {language === 'gu' ? '45 મિનિટ સત્ર' : language === 'hi' ? '45 मिनट सत्र' : '45 min session'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}>
                    {language === 'gu' ? '100% ગોપનીય' : language === 'hi' ? '100% गोपनीय' : '100% confidential'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}>
                    {language === 'gu' ? 'ત્રણ ભાષાઓમાં' : language === 'hi' ? 'तीन भाषाओं में' : '3 languages'}
                  </span>
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
