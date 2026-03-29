"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Home, Building2, Video, Calendar, Clock, User, Mail, Phone, MapPin, ArrowLeft, Check, Loader2, Sun, Menu, X, AlertCircle, CreditCard, Lock, Sparkles, PartyPopper, Copy, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";
import { useOffer } from "@/hooks/useOffer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/homepage/Footer";

import Script from "next/script";

const CrispChat = dynamic(() => import("@/components/CrispChat"), { ssr: false });

const DEFAULT_CONSULTATION_TYPES = [
  {
    id: "home-outside",
    icon: Home,
    title: { en: "Home Consultation (Outside 6.5km)", hi: "घर पर परामर्श (6.5 किमी के बाहर)", gu: "ઘરે પરામર્શ (6.5 કિમીની બહાર)" },
    description: { en: "Personalized Vedic astrology sessions beyond 6.5km of Vastral, Ahmedabad", hi: "अहमदाबाद के वस्त्राल से 6.5 किमी से अधिक दूरी पर आपके घर पर व्यक्तिगत वैदिक ज्योतिष सत्र", gu: "અમદાવાદના વસ્ત્રાલથી 6.5 કિમીથી વધુ દૂર તમારા ઘરે વ્યક્તિગત વૈદિક જ્યોતિષ સત્રો" },
    availability: { en: "Only in Ahmedabad", hi: "केवल अहमदाबाद में", gu: "ફક્ત અમદાવાદમાં" },
    price: 210100,
    priceDisplay: "₹ 2,101",
    duration: { en: "120 minutes", hi: "120 मिनट", gu: "120 મિનિટ" },
    locationRestricted: true,
  },
  {
    id: "home-within",
    icon: Home,
    title: { en: "Home Consultation (Within 6.5km)", hi: "घर पर परामर्श (6.5 किमी के भीतर)", gu: "ઘરે પરામર્શ (6.5 કિમીની અંદર)" },
    description: { en: "Personalized Vedic astrology sessions within 6.5km of Vastral, Ahmedabad", hi: "अहमदाबाद के वस्त्राल से 6.5 किमी के भीतर आपके घर पर व्यक्तिगत वैदिक ज्योतिष सत्र", gu: "અમદાવાદના વસ્ત્રાલથી 6.5 કિમીની અંદર તમારા ઘરે વ્યક્તિગત વૈદિક જ્યોતિષ સત્રો" },
    availability: { en: "Only in Ahmedabad", hi: "केवल अहमदाबाद में", gu: "ફક્ત અમદાવાદમાં" },
    price: 110100,
    priceDisplay: "₹ 1,101",
    duration: { en: "90 minutes", hi: "90 मिनट", gu: "90 મિનિટ" },
    locationRestricted: true,
  },
  {
    id: "online",
    icon: Video,
    title: { en: "Online Consultation", hi: "ऑनलाइन परामर्श", gu: "ઓનલાઈન પરામર્શ" },
    description: { en: "Connect with us from anywhere in the world via video call", hi: "वीडियो कॉल के माध्यम से दुनिया में कहीं से भी हमसे जुड़ें", gu: "વીડિયો કોલ દ્વારા વિશ્વના કોઈપણ સ્થળેથી અમારી સાથે જોડાઓ" },
    availability: { en: "Available everywhere", hi: "सभी जगह उपलब्ध", gu: "બધે ઉપલબ્ધ" },
    price: 50100,
    priceDisplay: "₹ 501",
    duration: { en: "45 minutes", hi: "45 मिनट", gu: "45 મિનિટ" },
    locationRestricted: false,
  }
];

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

const getAvailableTimeSlots = (date: Date | undefined): string[] => {
  if (!date) return [];
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) return timeSlots;
  if (dayOfWeek === 6) return ["11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  return timeSlots.filter(slot => slot !== "10:00 AM");
};

export default function BookingPage() {
  const { user, loading, showAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, t } = useTranslation();

  const [consultationTypes, setConsultationTypes] = useState(DEFAULT_CONSULTATION_TYPES);
  const [step, setStep] = useState(1);
  const [userGender, setUserGender] = useState<string>("male");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isBookingSaved, setIsBookingSaved] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [hasSentPendingNotification, setHasSentPendingNotification] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [paymentTransactionId, setPaymentTransactionId] = useState<string | null>(null);

  const { offer: offerSettings, isOfferValid: isOfferValid } = useOffer();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    questions: "",
  });

  // Fetch prices from DB (admin can update them)
  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (data.prices && data.prices.length > 0) {
          setConsultationTypes((prev) =>
            prev.map((ct) => {
              const dbPrice = data.prices.find((p: any) => p.id === ct.id);
              if (!dbPrice) return ct;
              return {
                ...ct,
                price: dbPrice.price,
                priceDisplay: dbPrice.price_display,
                duration: {
                  en: dbPrice.duration,
                  hi: dbPrice.duration,
                  gu: dbPrice.duration,
                },
              };
            })
          );
        }
      })
      .catch(() => {/* use defaults */ });
  }, []);

  const selectedConsultation = consultationTypes.find(type => type.id === selectedType);

  // Determine current price based on offer settings OR default price
  const getCurrentPrice = () => {
    if (!selectedConsultation) return 0;

    // Check if there is a site-wide special offer for online consulting and if the selected type matches its original price
    if (isOfferValid && offerSettings && offerSettings.is_active) {
      // Assuming the offer is specifically on the base online consulting (original 501, offer 501)
      // You can expand this logic if the offer applies to other types like 'home-within' (1101 -> ?)
      if (selectedType === 'online' && selectedConsultation.price === (offerSettings.original_price * 100)) {
        return offerSettings.offer_price * 100;
      }
    }
    return selectedConsultation.price;
  };

  const getText = (text: { en: string; hi: string; gu: string }) => text[language as keyof typeof text] || text.en;

  const sendTelegramNotification = async (pStatus: string = "pending", overrideData: any = null) => {
    try {
      const data = overrideData || {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        service_type: selectedConsultation ? getText(selectedConsultation.title) : "Consultation",
        booking_date: selectedDate ? selectedDate.toLocaleDateString() : "",
        booking_time: selectedTime,
        birth_details: `${formData.birthDate} at ${formData.birthTime} in ${formData.birthPlace}`,
        special_requests: formData.questions,
        amount: getCurrentPrice() / 100
      };

      if (!data.name || !data.service_type || !data.booking_date || !data.booking_time) return;

      await fetch("/api/bookings/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          address: data.address,
          service_type: data.service_type,
          booking_date: data.booking_date,
          booking_time: data.booking_time,
          birth_details: data.birth_details,
          special_requests: data.special_requests,
          payment_status: pStatus,
          amount: data.amount
        }),
      });
    } catch (error) {
      console.error("Failed to send telegram notification:", error);
    }
  };

  const confirmPayment = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed", payment_status: "completed" }),
      });

      if (response.ok) {
        const data = await response.json();
        // Send notification with the fetched data to ensure it's not empty
        sendTelegramNotification("success", {
          name: data.full_name,
          email: data.email,
          phone: data.phone,
          city: data.city || "",
          address: data.address || "",
          service_type: data.service_type,
          booking_date: data.booking_date,
          booking_time: data.booking_time,
          birth_details: `${data.date_of_birth} at ${data.time_of_birth} in ${data.place_of_birth}`,
          special_requests: data.special_requests,
          amount: data.amount
        });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) showAuthModal('signin');
  }, [user, loading, showAuthModal]);

  useEffect(() => {
    async function fetchAllAvailability() {
      try {
        const response = await fetch("/api/availability");
        const data = await response.json();
        if (data.success) {
          const blocked = data.data
            .filter((a: any) => a.is_available === false)
            .map((a: any) => a.date);
          setBlockedDates(blocked);
        }
      } catch (error) {
        console.error("Error fetching all availability:", error);
      }
    }
    fetchAllAvailability();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name, phone, address, gender, dob, tob, pob, city")
          .eq("id", user.id)
          .maybeSingle();

        if (data && !error) {
          if (data.gender) setUserGender(data.gender);

          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name || user.user_metadata?.full_name || user.user_metadata?.name || "",
            email: user.email || prev.email,
            phone: data.phone || prev.phone || user.user_metadata?.phone_number || "",
            address: data.address || prev.address || "",
            birthDate: data.dob || user.user_metadata?.dob || prev.birthDate || "",
            birthTime: data.tob || user.user_metadata?.tob || prev.birthTime || "",
            birthPlace: data.pob || user.user_metadata?.pob || prev.birthPlace || "",
            city: data.city || prev.city || "",
          }));
        } else {
          // Fallback to user metadata if profile fetch fails or is empty
          if (user.user_metadata?.gender) setUserGender(user.user_metadata.gender);
          setFormData(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || user.user_metadata?.name || prev.name,
            email: user.email || prev.email,
            phone: user.user_metadata?.phone_number || prev.phone || "",
            birthDate: user.user_metadata?.dob || prev.birthDate || "",
            birthTime: user.user_metadata?.tob || prev.birthTime || "",
            birthPlace: user.user_metadata?.pob || prev.birthPlace || "",
          }));
        }
      }
    }
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bid = urlParams.get('booking_id');
    const pStatus = urlParams.get('payment_status');
    if (bid) {
      setBookingId(bid);
      setStep(4);
      fetchBookingDetails(bid);
      if (pStatus === 'success') {
        // Legacy/direct success - verify with DB via polling
        setPaymentSuccess(true);
        setPaymentFailed(false);
        setShowPaymentSuccessPopup(true);
        confirmPayment(bid);
      } else if (pStatus === 'failed') {
        setPaymentSuccess(false);
        setPaymentFailed(true);
      }
      // For 'pending' or any other status, polling will detect the actual state
    }
  }, []);

  useEffect(() => {
    if (step === 4 && bookingId && formData.name && !paymentSuccess && !hasSentPendingNotification) {
      const pStatus = paymentFailed ? "failed" : "pending";
      sendTelegramNotification(pStatus);
      setHasSentPendingNotification(true);
    }
  }, [step, bookingId, formData.name, paymentSuccess, paymentFailed, hasSentPendingNotification]);

  // Poll booking payment status every 3 seconds when on step 4 with pending payment
  // This catches the case where UROPay popup closes (Continue Shopping) and webhook already updated DB
  useEffect(() => {
    if (step !== 4 || !bookingId || paymentSuccess || paymentFailed) return;

    let isCancelled = false;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok || isCancelled) return;
        const data = await res.json();
        if (!data || isCancelled) return;

        const dbStatus = data.payment_status;
        if (dbStatus === 'completed' || dbStatus === 'success') {
          setPaymentSuccess(true);
          setPaymentFailed(false);
          setShowPaymentSuccessPopup(true);
          if (data.payment_intent_id) setPaymentTransactionId(data.payment_intent_id);
          if (data.invoice_number) setInvoiceNumber(data.invoice_number);
          if (data.full_name) setFormData(prev => ({
            ...prev,
            name: data.full_name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            city: data.city || prev.city,
            address: data.address || prev.address,
            birthDate: data.date_of_birth || prev.birthDate,
            birthTime: data.time_of_birth || prev.birthTime,
            birthPlace: data.place_of_birth || prev.birthPlace,
            questions: data.special_requests || prev.questions,
          }));
          if (data.service_type) setSelectedType(data.service_type);
          confirmPayment(bookingId);
          clearInterval(pollInterval);
        } else if (dbStatus === 'failed' || dbStatus === 'cancelled') {
          setPaymentFailed(true);
          setPaymentSuccess(false);
          if (data.full_name) setFormData(prev => ({
            ...prev,
            name: data.full_name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            city: data.city || prev.city,
            address: data.address || prev.address,
          }));
          clearInterval(pollInterval);
        }
      } catch (err) {
        // Silently continue polling
      }
    }, 3000);

    return () => {
      isCancelled = true;
      clearInterval(pollInterval);
    };
  }, [step, bookingId, paymentSuccess, paymentFailed]);

  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      if (today.getDay() === 0) {
        setSelectedDate(today);
      }
    }
  }, [selectedDate]);

  const profilePic = userGender.toLowerCase() === "female"
    ? "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-25-000158-1766601181550.png?width=8000&height=8000&resize=contain"
    : "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-20-145054-1766223343347.png?width=8000&height=8000&resize=contain";

  const isAhmedabad = formData.city.toLowerCase().includes('ahmedabad') || formData.city.toLowerCase().includes('અમદાવાદ') || formData.city.toLowerCase().includes('अहमदाबाद');
  const availableConsultationTypes = consultationTypes.filter(type => type.locationRestricted ? isAhmedabad : true);

  const fetchAvailability = async (date: Date) => {
    setIsCheckingAvailability(true);
    setSlotError(null);
    setSelectedTime(null);
    setIsDayBlocked(false);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/availability?date=${dateStr}`);
      const data = await response.json();
      if (data.success) {
        if (data.data?.is_available === false) {
          setIsDayBlocked(true);
        }
        setBookedSlots(data.data?.blocked_times || []);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (bookedSlots.includes(time)) {
      const errorMessages = { en: "Time slot already booked", hi: "समय स्लॉट पहले से बुक है", gu: "સમય સ્લોટ પહેલેથી જ બુક છે" };
      setSlotError(errorMessages[language as keyof typeof errorMessages] || errorMessages.en);
      return;
    }
    setSlotError(null);
    setSelectedTime(time);
  };

  const handleDownloadInvoice = () => {
    const price = getCurrentPrice() / 100;
    const serviceName = selectedConsultation ? getText(selectedConsultation.title) : "Consultation Session";
    const dateStr = selectedDate?.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${invoiceNumber}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fff;color:#1a1a2e;padding:40px}@page{size:A4;margin:20mm}.invoice-box{max-width:800px;margin:auto;padding:40px;border:2px solid #ff6b35;border-radius:16px}.header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #eee;padding-bottom:20px;margin-bottom:30px}.logo-section h1{color:#ff6b35;font-size:28px;margin-bottom:4px}.logo-section p{color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px}.invoice-info{text-align:right}.invoice-info .inv-num{color:#ff6b35;font-size:18px;font-weight:900;margin-bottom:4px}.invoice-info .inv-date{color:#888;font-size:12px}.section-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px}.section-box{background:#f9fafb;border:1px solid #eee;border-radius:12px;padding:20px}.section-title{color:#ff6b35;font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:12px}.section-box p{margin-bottom:4px;font-size:14px}.section-box .name{font-weight:700;font-size:16px}table{width:100%;border-collapse:collapse;margin-bottom:30px;border-radius:12px;overflow:hidden}thead tr{background:#f9fafb}th{padding:14px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:700}th:last-child{text-align:right}td{padding:14px 16px;border-bottom:1px solid #eee}td:last-child{text-align:right;font-weight:700;font-size:18px}.total-row{background:#fff7ed}td.total-label{text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:700}.total-amount{color:#ff6b35;font-size:24px;font-weight:900}.footer{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:20px;border-top:1px solid #eee}.status{background:#f0fdf4;border:2px solid #22c55e;color:#22c55e;padding:8px 20px;border-radius:12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px}.footer-right{text-align:right}.footer-right .quote{font-style:italic;font-size:12px;color:#888;margin-bottom:4px}.footer-right .company{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#bbb}.disclaimer{margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;font-size:11px;color:#888;text-align:center;border:1px solid #eee}@media print{body{padding:0}.invoice-box{border:none;padding:20px}}</style></head><body><div class="invoice-box"><div class="header"><div class="logo-section"><h1>\u0915\u093E\u0924\u094D\u092F\u093E\u092F\u0928\u0940 \u091C\u094D\u092F\u094B\u0924\u093F\u0937</h1><p>Vedic Wisdom for Modern Destinies</p></div><div class="invoice-info"><div class="inv-num">Invoice #: ${invoiceNumber}</div>${paymentTransactionId ? `<div style="color:#22c55e;font-size:12px;font-weight:700;margin-bottom:4px">Transaction ID: ${paymentTransactionId}</div>` : ''}<div class="inv-date">Issued on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div></div><div class="section-grid"><div class="section-box"><div class="section-title">Client Details</div><p class="name">${formData.name}</p><p>${formData.email}</p><p>${formData.phone}</p>${formData.city ? `<p>${formData.city}</p>` : ''}</div><div class="section-box"><div class="section-title">Consultation Details</div><p class="name">${serviceName}</p><p>${dateStr}</p><p style="color:#ff6b35;font-weight:700">${selectedTime}</p></div></div><table><thead><tr><th>Service Description</th><th>Amount</th></tr></thead><tbody><tr><td><strong>${serviceName}</strong><br><span style="font-size:12px;color:#888">Professional Vedic astrological guidance and calculations.</span></td><td>\u20B9 ${formatCurrency(price)}</td></tr><tr class="total-row"><td class="total-label">Total Amount Paid</td><td class="total-amount">\u20B9 ${formatCurrency(price)}</td></tr></tbody></table><div class="footer"><div class="status">BOOKING CONFIRMED</div><div class="footer-right"><p class="quote">\u201C\u0905\u0938\u0924\u094B \u0AAE\u0ABE \u0AB8\u0AA6\u0ACD\u0A97\u0AAE\u0AAF \u0964 \u0AA4\u0AAE\u0AB8\u094B \u0AAE\u0ABE \u0A9C\u0ACD\u0AAF\u094B\u0AA4\u0ABF\u0AB0\u0ACD\u0A97\u0AAE\u0AAF \u0964\u201D</p><p class="company">Katyaayani Jyotish \u2022 Ahmedabad \u2022 +91 98249 29588</p></div></div><div class="disclaimer">This invoice is auto-generated at the time of booking. For any queries, contact us at katyaayaniastrologer01@gmail.com</div></div></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t('Invoice downloaded successfully!'));
  };

  const fetchBookingDetails = async (bid: string) => {
    try {
      const response = await fetch(`/api/bookings/${bid}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({ name: data.full_name, email: data.email, phone: data.phone, city: data.city || "", address: data.address || "", birthDate: data.date_of_birth, birthTime: data.time_of_birth, birthPlace: data.place_of_birth, questions: data.special_requests || "" });
        setSelectedType(data.service_type);
        setSelectedDate(new Date(data.booking_date));
        setSelectedTime(data.booking_time);
        setInvoiceNumber(data.invoice_number);
        if (data.payment_intent_id) setPaymentTransactionId(data.payment_intent_id);
        if (data.payment_status === 'success' || data.payment_status === 'completed') {
          setPaymentSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const canProceedToStep2 = selectedType !== null && formData.city;
  const canProceedToStep3 = formData.name && formData.email && formData.phone && formData.birthDate && formData.birthTime;
  const canProceedToStep4 = selectedDate !== undefined && selectedTime !== null;

  const handleSubmitBooking = async () => {
    if (!selectedConsultation || !selectedDate || !selectedTime) return;
    setIsCreatingOrder(true);
    setSlotError(null);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const checkRes = await fetch(`/api/availability?date=${dateStr}`);
      const checkData = await checkRes.json();

      if (checkData.success) {
        if (checkData.data?.is_available === false) {
          setSlotError(language === 'gu' ? 'આ દિવસ હવે ઉપલબ્ધ નથી' : 'This day is no longer available');
          setIsCreatingOrder(false);
          return;
        }
        if (checkData.data?.blocked_times?.includes(selectedTime)) {
          setSlotError(language === 'gu' ? 'આ સમય સ્લોટ હમણાં જ બુક થઈ ગયો છે' : 'This time slot was just booked by someone else');
          setIsCreatingOrder(false);
          return;
        }
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: selectedType?.startsWith("home") ? formData.address : null,
          date_of_birth: formData.birthDate,
          time_of_birth: formData.birthTime || "00:00",
          place_of_birth: formData.birthPlace || "Not specified",
          service_type: selectedConsultation.id.startsWith('home') ? 'home' : selectedConsultation.id,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          special_requests: formData.questions || null,
          payment_status: "pending",
          amount: getCurrentPrice() / 100,
          status: "pending"
        }),
      });
      if (!response.ok) {
        const errorResult = await response.json();
        setSlotError(errorResult.message || "Failed to save booking");
        return;
      }
      const result = await response.json();
      if (result.success && result.data?.[0]) {
        setBookingId(result.data[0].id);
        setInvoiceNumber(result.data[0].invoice_number);
        setIsBookingSaved(true);
        setStep(4);
        sendTelegramNotification("pending");
      }
    } catch (error) {
      console.error("Error saving booking:", error);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleRetryPayment = () => {
    setPaymentFailed(false);
    setPaymentSuccess(false);
    setHasSentPendingNotification(false);
    // This will re-show the payment buttons and restart polling
  };

  const handlePayment = async () => {
    if (!bookingId || !selectedConsultation) return;
    setIsProcessingPayment(true);
    try {
      // If online consultation with price 501, use the specific payment link
      if (selectedType === 'online' && (getCurrentPrice() / 100) === 501) {
        window.open('https://urpy.link/D9kGay', '_blank', 'noopener,noreferrer');
        setIsProcessingPayment(false);
        return;
      }

      // If offer is valid and has a direct payment link, use it
      if (isOfferValid && offerSettings?.payment_link && (getCurrentPrice() / 100) === offerSettings.offer_price) {
        window.location.href = offerSettings.payment_link;
        return;
      }

      const response = await fetch("/api/uropay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getCurrentPrice() / 100,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          order_id: bookingId,
        }),
      });
      const data = await response.json();
      if (data.success && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#ebe3d5] text-[#2d1810]'}`}>
      <CrispChat />
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${theme === 'dark' ? 'bg-[#0a0a0f]/95 border-[#ff6b35]/20' : 'bg-[#ebe3d5]/95 border-[#ff6b35]/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=112&height=112&resize=contain"
              alt="Katyaayani Astrologer"
              width={56}
              height={56}
              priority
              className="object-contain"
            />
            <span className="font-[family-name:var(--font-cinzel)] text-xs md:text-sm lg:text-base font-bold text-gradient-ancient leading-tight whitespace-nowrap">
              KATYAAYANI<br />ASTROLOGER
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-[#ff6b35] transition-colors text-xl">{t('Home')}</Link>
            <Link href="/services" className="hover:text-[#ff6b35] transition-colors text-xl">{t('Services')}</Link>

            <Link href="/booking" className="text-[#ff6b35] text-xl">{t('Book')}</Link>
            <Link href="/feedback" className="hover:text-[#ff6b35] transition-colors text-xl">{t('Feedback')}</Link>
            <Link href="/about" className="hover:text-[#ff6b35] transition-colors text-xl">{t('About')}</Link>
          </div>
          <div className="flex items-center gap-2">
            <GoogleTranslateWidget />
            <Button variant="outline" size="icon" onClick={toggleTheme} className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 h-9 w-9">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {user && (
              <Link href="/profile" className="hidden md:block">
                <div className="w-9 h-9 rounded-full border border-[#ff6b35] overflow-hidden relative group">
                  <Image src="https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=2000" alt="Stars" fill className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  <Image src={profilePic} alt="Profile" width={36} height={36} className="w-full h-full object-cover relative z-10" />
                </div>
              </Link>
            )}
            <Link href="/" className="hidden md:block">
              <Button variant="ghost" className="hover:text-[#ff6b35] text-xl h-9"><ArrowLeft className="w-4 h-4 mr-1" />Home</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#ff6b35] h-9 w-9">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`md:hidden border-t ${theme === 'dark' ? 'border-[#ff6b35]/20' : 'border-[#ff6b35]/20'} ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#ebe3d5]'}`}>
              <div className="px-6 py-4 space-y-3">
                <Link href="/" className="block py-2 hover:text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t('Home')}</Link>
                <Link href="/services" className="block py-2 hover:text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t('Services')}</Link>
                <Link href="/booking" className="block py-2 text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t('Book')}</Link>
                <Link href="/feedback" className="block py-2 hover:text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t('Feedback')}</Link>
                <Link href="/about" className="block py-2 hover:text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t('About')}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-4 text-gradient-ancient">{t('Book Your Consultation')}</h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>{t('Four simple steps')}</p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? "bg-[#ff6b35] text-white" : theme === 'dark' ? "bg-[#1a1a2e] text-[#a0998c]" : "bg-gray-200 text-gray-500"}`}>{step > s ? <Check className="w-5 h-5" /> : s}</div>
                  {s < 4 && <div className={`w-8 h-1 mx-1 ${step > s ? "bg-[#ff6b35]" : theme === 'dark' ? "bg-[#1a1a2e]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-semibold mb-6 text-center">{t('Choose Your Consultation Type')}</h2>
              <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'} mb-8`}>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ff6b35]" />{t('Your City')} *</Label>
                    <input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      readOnly={!!user && !!formData.city}
                      className={`w-full h-10 px-3 rounded-md border ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#ff6b35]/20 text-[#f5f0e8]' : 'bg-white border-[#ff6b35]/20 text-[#2d1810]'} ${!!user && !!formData.city ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                      placeholder="e.g., Ahmedabad"
                    />

                  </div>
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-6">
                {availableConsultationTypes.map((type) => (
                  <Card key={type.id} className={`cursor-pointer ${selectedType === type.id ? "bg-[#ff6b35]/20 border-[#ff6b35]" : theme === 'dark' ? "bg-[#12121a] border-[#ff6b35]/20" : "bg-white border-[#ff6b35]/20"} ${!formData.city ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => formData.city && setSelectedType(type.id)}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedType === type.id ? "bg-[#ff6b35]" : "bg-[#ff6b35]/10"}`}>
                        <type.icon className={`w-7 h-7 ${selectedType === type.id ? "text-white" : "text-[#ff6b35]"}`} />
                      </div>
                      <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-semibold mb-2">{getText(type.title)}</h3>
                      <p className="text-xl mb-2 opacity-60">{getText(type.description)}</p>
                      <p className="text-xs mb-4 font-medium text-amber-500">{getText(type.availability)}</p>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[#ff6b35] font-bold text-xl">{type.priceDisplay}</span>
                        <span className="text-xs opacity-60">{getText(type.duration)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-8"><Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-8">{t('Continue')}</Button></div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-semibold mb-6 text-center">{t('Your Details')}</h2>
              <Card className={`${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} border-[#ff6b35]/20`}>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4 text-[#ff6b35]" />{t('Full Name')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.name}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.name ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#ff6b35]" />{t('Email')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.email}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.email ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                        placeholder="Your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#ff6b35]" />{t('Phone')} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.phone}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.phone ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                        placeholder="+91 98249 29588"
                      />
                    </div>
                    {selectedType?.startsWith("home") && (
                      <div className="space-y-4 md:col-span-2">
                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ff6b35]" />{t('Address')}</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            readOnly={!!user && !!formData.address}
                            className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.address ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                            placeholder="Your home address"
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#ff6b35]" />{t('Birth Date')} *</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.birthDate}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.birthDate ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#ff6b35]" />{t('Birth Time')} *</Label>
                      <Input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        required
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.birthTime}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.birthTime ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="birthPlace" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ff6b35]" />{t('Birth Place')}</Label>
                      <Input
                        id="birthPlace"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        readOnly={!!user && !!formData.birthPlace}
                        className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 ${!!user && !!formData.birthPlace ? 'opacity-70 cursor-not-allowed select-none' : ''}`}
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="questions">{t('Special Questions')}</Label>
                      <Textarea id="questions" name="questions" value={formData.questions} onChange={handleInputChange} className={`${theme === 'dark' ? 'bg-[#1a1a2e] text-[#f5f0e8]' : 'bg-white text-[#2d1810]'} border-[#ff6b35]/20 min-h-[100px]`} placeholder="Career, relationships, etc..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="border-[#ff6b35] text-[#ff6b35]">{t('Back')}</Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-8">{t('Continue')}</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-semibold mb-6 text-center">{t('Select Date & Time')}</h2>
              {slotError && <Card className="bg-red-900/20 border-red-600/30 mb-6"><CardContent className="p-6 flex gap-3"><AlertCircle className="w-5 h-5 text-red-500" /><div><p className="font-semibold">{slotError}</p></div></CardContent></Card>}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <Card className={`${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} border-[#ff6b35]/20`}>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#ff6b35]" />{t('Select Date')}</CardTitle></CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        return date < new Date(new Date().setHours(0, 0, 0, 0)) || blockedDates.includes(dateStr);
                      }}
                      className="rounded-md border border-[#ff6b35]/20 mx-auto"
                    />
                  </CardContent>
                </Card>
                <Card className={`${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} border-[#ff6b35]/20`}>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#ff6b35]" />{t('Select Time')}</CardTitle></CardHeader>
                  <CardContent>
                    {isCheckingAvailability ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : isDayBlocked ? (
                      <div className="text-center py-8 space-y-3">
                        <Lock className="w-10 h-10 text-amber-500 mx-auto" />
                        <p className="font-semibold text-amber-500">{language === 'gu' ? 'આ દિવસ માટે બુકિંગ ઉપલબ્ધ નથી' : language === 'hi' ? 'इस दिन के लिए बुकिंग उपलब्ध नहीं है' : 'Booking not available for this day'}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {getAvailableTimeSlots(selectedDate).map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            disabled={bookedSlots.includes(time)}
                            className={`${selectedTime === time ? "bg-[#ff6b35] text-white" : "border-[#ff6b35]/20 text-[#a0998c]"}`}
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}{bookedSlots.includes(time) && ` (${language === 'gu' ? 'બુક' : language === 'hi' ? 'बुक' : 'Booked'})`}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between mt-8">
                {!isBookingSaved && (
                  <Button variant="outline" onClick={() => setStep(2)} className="border-[#ff6b35] text-[#ff6b35]">{t('Back')}</Button>
                )}
                {!isBookingSaved ? (
                  <Button onClick={handleSubmitBooking} disabled={!canProceedToStep4 || isCheckingAvailability || isCreatingOrder} className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-8 ml-auto">
                    {isCreatingOrder ? t('Processing...') : t('Book Now')}
                  </Button>
                ) : (
                  <Button onClick={() => setStep(4)} className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-10 h-16 text-xl font-bold shadow-xl shadow-[#ff6b35]/30 flex items-center gap-3 ml-auto">
                    <CreditCard className="w-6 h-6" /> {t('Proceed to Payment')}
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <Script src="https://cdn.uropay.me/uropay-embed.min.js" strategy="lazyOnload" />

              <div className="mb-8 print:hidden">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${paymentFailed ? 'bg-red-500/20' : paymentSuccess ? 'bg-green-500/20' : 'bg-[#ff6b35]/20'}`}>
                  {paymentSuccess ? <Check className="w-12 h-12 text-green-500" /> : paymentFailed ? <AlertCircle className="w-12 h-12 text-red-500" /> : <CreditCard className="w-12 h-12 text-[#ff6b35]" />}
                </div>
                <h2 className="font-[family-name:var(--font-cinzel)] text-4xl font-bold mb-4 text-gradient-ancient">
                  {paymentSuccess ? t("Booking Confirmed!") : paymentFailed ? (language === 'gu' ? 'ચુકવણી નિષ્ફળ!' : language === 'hi' ? 'भुगतान विफल!' : 'Payment Failed!') : t("Complete Your Payment")}
                </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                  {paymentSuccess
                    ? t("Thank you for booking your consultation.")
                    : paymentFailed
                      ? (language === 'gu' ? 'તમારી ચુકવણી પ્રક્રિયા નિષ્ફળ થઈ. કૃપા કરી ફરીથી પ્રયાસ કરો.' : language === 'hi' ? 'आपका भुगतान विफल हो गया। कृपया पुनः प्रयास करें।' : 'Your payment could not be processed. Please try again.')
                      : t("Please complete your payment to confirm your consultation.")}
                </p>

                {/* Payment Status Badge */}
                {(paymentSuccess || paymentFailed) && (
                  <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold ${paymentSuccess ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                    {paymentSuccess ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {paymentSuccess ? (language === 'gu' ? 'ચુકવણી સફળ' : language === 'hi' ? 'भुगतान सफल' : 'Payment Successful') : (language === 'gu' ? 'ચુકવણી નિષ્ફળ' : language === 'hi' ? 'भुगतान विफल' : 'Payment Failed')}
                  </div>
                )}

                {/* Polling indicator - when waiting for payment confirmation */}
                {!paymentSuccess && !paymentFailed && bookingId && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#ff6b35]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === 'gu' ? 'ચુકવણીની સ્થિતિ તપાસી રહ્યા છીએ...' : language === 'hi' ? 'भुगतान स्थिति जांच रहे हैं...' : 'Checking payment status...'}
                  </div>
                )}

                {!paymentSuccess && (
                  <div className="mt-12 p-8 rounded-3xl border border-[#ff6b35]/20 bg-[#ff6b35]/5 max-w-md mx-auto">
                    {paymentFailed && (
                      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-red-500 font-bold text-sm flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {language === 'gu' ? 'ચુકવણી પ્રક્રિયા નિષ્ફળ થઈ. કૃપા કરી ફરીથી પ્રયાસ કરો.' : language === 'hi' ? 'भुगतान प्रक्रिया विफल हुई। कृपया पुनः प्रयास करें।' : 'Payment processing failed. Please try again.'}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg opacity-70">{paymentFailed ? (language === 'gu' ? 'ફરી ચૂકવો:' : language === 'hi' ? 'पुनः भुगतान करें:' : 'Retry Payment:') : t('Amount to Pay:')}</span>
                      <span className="text-3xl font-bold text-[#ff6b35]">₹ {formatCurrency(getCurrentPrice() / 100)}</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-full">
                        {selectedType === 'online' ? (
                          <div className="flex justify-center flex-col items-center">
                            {isOfferValid && offerSettings && offerSettings.is_active && (
                              <p className="text-xs font-bold text-red-500 mb-2 animate-pulse">{offerSettings.urgency_text}</p>
                            )}
                            {(getCurrentPrice() / 100) === 501 ? (
                              <a
                                href="https://urpy.link/D9kGay"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95"
                              >
                                {language === 'gu' ? `₹${getCurrentPrice() / 100} માટે હમણાં ખરીદો` : language === 'hi' ? `₹${getCurrentPrice() / 100} के लिए अभी खरीदें` : `Buy Now for ₹${getCurrentPrice() / 100}`}
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="uropay-btn w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95"
                                data-uropay-api-key="8F7R1DGSMX1EYI5LEVLFL8NLZQM8EKAE"
                                data-uropay-button-id="XRAY456627"
                                data-uropay-environment="LIVE"
                                data-uropay-amount={getCurrentPrice() / 100}
                                data-uropay-callback-url="/api/payments/callback"
                                data-uropay-success-url="/payment-success"
                                data-uropay-failure-url="/payment-failed"
                              >
                                {language === 'gu' ? `₹${getCurrentPrice() / 100} માટે હમણાં ખરીદો` : language === 'hi' ? `₹${getCurrentPrice() / 100} के लिए अभी खरीदें` : `Buy Now for ₹${getCurrentPrice() / 100}`}
                              </a>
                            )}
                          </div>
                        ) : selectedType === 'home-within' ? (
                          <div className="flex justify-center">
                            <a
                              href="#"
                              className="uropay-btn w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95"
                              data-uropay-api-key="8F7R1DGSMX1EYI5LEVLFL8NLZQM8EKAE"
                              data-uropay-button-id="ALPHA279545"
                              data-uropay-environment="LIVE"
                              data-uropay-amount="1101"
                              data-uropay-callback-url="/api/payments/callback"
                              data-uropay-success-url="/payment-success"
                              data-uropay-failure-url="/payment-failed"
                            >
                              {language === 'gu' ? '₹1101 માટે હમણાં ખરીદો' : language === 'hi' ? '₹1101 के लिए अभी खरीदें' : 'Buy Now for ₹1101'}
                            </a>
                          </div>
                        ) : selectedType === 'home-outside' ? (
                          <div className="flex justify-center">
                            <a
                              href="#"
                              className="uropay-btn w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95"
                              data-uropay-api-key="8F7R1DGSMX1EYI5LEVLFL8NLZQM8EKAE"
                              data-uropay-button-id="ALPHA413457"
                              data-uropay-environment="LIVE"
                              data-uropay-amount="2101"
                              data-uropay-callback-url="/api/payments/callback"
                              data-uropay-success-url="/payment-success"
                              data-uropay-failure-url="/payment-failed"
                            >
                              {language === 'gu' ? '₹2101 માટે હમણાં ખરીદો' : language === 'hi' ? '₹2101 के लिए अभी खरીदें' : 'Buy Now for ₹2101'}
                            </a>
                          </div>
                        ) : (
                          <Button
                            onClick={handlePayment}
                            disabled={isProcessingPayment}
                            className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#ff6b35]/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                          >
                            {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                            {t('Pay')} ₹{getCurrentPrice() / 100}
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className={`mt-6 text-sm font-medium ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'}`}>
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {language === 'gu'
                        ? 'તમારો ઇન્વૉઇસ નંબર લખી લેજો અને રિસીપ્ટનો સ્ક્રીનશોટ પ્રૂફ માટે રાખો. જો જ્યોતિષી માંગે તો આપવો જરૂરી છે.'
                        : language === 'hi'
                          ? 'अपना इनवॉइस नंबर लिख लें और रसीद का स्क्रीनशॉट प्रमाण के लिए रखें। यदि ज्योतिषी मांगे तो देना जरूरी है।'
                          : 'Please note down your invoice number and keep a screenshot of the receipt as proof. It is mandatory to provide if the astrologer asks.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-12 mb-12 text-left">
                <div id="booking-receipt" className={`relative p-8 rounded-xl shadow-lg border transition-all duration-300 ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35] text-[#f5f0e8]' : 'bg-[#fdfbf7] border-[#e5e7eb] text-[#1a1a2e]'}`}>
                  <div className="relative z-10">
                    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b ${theme === 'dark' ? 'border-[#333333]' : 'border-[#e5e7eb]'}`}>
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <img
                          src="https://yiuhyqfkdnuzalqyxshe.supabase.co/storage/v1/object/sign/logo/logo_withoutname-removebg.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82M2M4NzEzYy0zNWNkLTQ0ZWEtYTQ1ZS04YjdiZWUwMGJhOTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ29fd2l0aG91dG5hbWUtcmVtb3ZlYmcucG5nIiwiaWF0IjoxNzY3MjQ5Nzk3LCJleHAiOjE3OTg3ODU3OTd9.t7yqIWFi065m7keMdas28eYxqIKwAYI06LTu6FOw2nc"
                          alt="Logo"
                          width={60}
                          height={60}
                          className="rounded-full"
                          crossOrigin="anonymous"
                        />
                        <div>
                          <h4 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">कात्यायनी ज्योतिष</h4>
                          <p className={`text-[10px] uppercase tracking-wider ${theme === 'dark' ? 'text-[#888888]' : 'text-[#666666]'} font-semibold`}>Vedic Wisdom for Modern Destinies</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        {invoiceNumber && (
                          <p className="text-lg font-black text-[#ff6b35] mb-1">{t('Invoice #:')} {invoiceNumber}</p>
                        )}
                        {paymentTransactionId && (
                          <p className={`text-xs font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            {language === 'gu' ? 'ટ્રાન્ઝેક્શન ID:' : language === 'hi' ? 'ट्रांज़ैक्शन ID:' : 'Transaction ID:'} {paymentTransactionId}
                          </p>
                        )}
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-[#888888]' : 'text-[#666666]'}`}>{t('Issued on:')} {new Date().toLocaleDateString(language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'gu-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className={`p-5 rounded-lg border transition-all duration-300 ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#333333]' : 'bg-white border-[#f3f4f6] shadow-sm'}`}>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#ff6b35] mb-3">{t('Client Details')}</h5>
                        <div className="space-y-1">
                          <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{formData.name}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-[#cccccc]' : 'text-[#4b5563]'} font-medium`}>{formData.email}</p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-[#cccccc]' : 'text-[#4b5563]'} font-medium`}>{formData.phone}</p>
                          {formData.city && <p className={`text-sm ${theme === 'dark' ? 'text-[#cccccc]' : 'text-[#4b5563]'} font-medium`}>{formData.city}</p>}
                        </div>
                      </div>
                      <div className={`p-5 rounded-lg border transition-all duration-300 ${theme === 'dark' ? 'bg-[#1a1a2e] border-[#333333]' : 'bg-white border-[#f3f4f6] shadow-sm'}`}>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#ff6b35] mb-3">{t('Consultation Details')}</h5>
                        <div className="space-y-1">
                          <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{selectedConsultation ? getText(selectedConsultation.title) : t("Vedic Session")}</p>
                          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-[#cccccc]' : 'text-[#4b5563]'}`}>{selectedDate?.toLocaleDateString(language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'gu-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p className="text-sm font-bold text-[#ff6b35]">{selectedTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`mb-8 overflow-hidden rounded-lg border transition-all duration-300 ${theme === 'dark' ? 'border-[#333333] shadow-lg shadow-black/20' : 'border-[#f3f4f6] shadow-sm'}`}>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-[#f9fafb]'}`}>
                            <th className={`p-4 text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-[#888888]' : 'text-[#6b7280]'}`}>{t('Service Description')}</th>
                            <th className={`p-4 text-right text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-[#888888]' : 'text-[#6b7280]'}`}>{t('Amount')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={`border-b ${theme === 'dark' ? 'border-[#333333] bg-[#1a1a2e]' : 'border-[#f3f4f6] bg-white'}`}>
                            <td className="p-4">
                              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#111827]'} mb-1`}>{selectedConsultation ? getText(selectedConsultation.title) : t("Consultation Session")}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-[#888888]' : 'text-[#6b7280]'}`}>{t('Professional Vedic astrological guidance and calculations.')}</p>
                            </td>
                            <td className={`p-4 text-right font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>₹ {formatCurrency(getCurrentPrice() / 100)}</td>
                          </tr>
                          <tr className={`${theme === 'dark' ? 'bg-[#ff6b35]/10' : 'bg-[#fff7ed]'}`}>
                            <td className={`p-4 text-right font-bold ${theme === 'dark' ? 'text-[#888888]' : 'text-[#6b7280]'} text-[10px] uppercase tracking-widest`}>{t('Total Amount Paid')}</td>
                            <td className="p-4 text-right font-bold text-[#ff6b35] text-2xl">₹ {formatCurrency(getCurrentPrice() / 100)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-sm border-2 ${paymentSuccess ? "bg-[#f0fdf4]/10 border-green-500 text-green-500" : paymentFailed ? "bg-[#fef2f2]/10 border-red-500 text-red-500" : "bg-[#fff7ed]/10 border-orange-500 text-orange-500"}`}>
                        {paymentSuccess ? t("Booking Confirmed") : paymentFailed ? t("Payment Failed") : t("Status: Payment Pending")}
                      </div>
                      <div className="text-center md:text-right">
                        <p className={`text-xs italic mb-2 ${theme === 'dark' ? 'text-[#cccccc]' : 'text-[#4b5563]'} font-medium`}>"असतो મા સદ્ગમય । તમસો મા જ્યોતિર્ગમય ।"</p>
                        <p className={`text-[9px] uppercase tracking-widest ${theme === 'dark' ? 'text-[#444444]' : 'text-[#9ca3af]'} font-bold`}>{t('Katyaayani Jyotish • Ahmedabad • +91 98249 29588')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
                {paymentFailed && (
                  <Button onClick={handleRetryPayment} className="bg-red-500 hover:bg-red-600 text-white px-8 font-bold">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {language === 'gu' ? 'ફરીથી ચુકવણી કરો' : language === 'hi' ? 'पुनः भुगतान करें' : 'Retry Payment'}
                  </Button>
                )}
                {!paymentSuccess && !paymentFailed && (
                  <Button variant="ghost" onClick={() => setStep(3)} className="text-[#a0998c]">{t('Change details')}</Button>
                )}
                <Link href="/"><Button className="bg-[#ff6b35]/10 hover:bg-[#ff8c5e] text-[#ff6b35] border border-[#ff6b35]/20 px-8">{t('Return Home')}</Button></Link>
                {paymentSuccess && (
                  <>
                    <Button onClick={handleDownloadInvoice} className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white px-8">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'gu' ? 'ઇન્વૉઇસ ડાઉનલોડ' : language === 'hi' ? 'इनवॉइस डाउनलोड' : 'Download Invoice'}
                    </Button>
                    <Link href="/profile"><Button variant="outline" className="border-[#ff6b35] text-[#ff6b35]">{t('View My Bookings')}</Button></Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Dialog open={showPaymentSuccessPopup} onOpenChange={setShowPaymentSuccessPopup}>
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
                ? 'તમારી બુકિંગ સફળતાપૂર્વક પૂર્ણ થઈ ગઈ છે.'
                : language === 'hi'
                  ? 'आपकी बुकिंग सफलतापूर्वक पूर्ण हो गई है।'
                  : 'Your booking has been successfully completed.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {invoiceNumber && (
              <div className={`p-4 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'bg-[#0a0a0f] border-[#ff6b35]/40' : 'bg-[#fff7ed] border-[#ff6b35]/40'}`}>
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                  {language === 'gu' ? 'તમારો ઇન્વૉઇસ નંબર' : language === 'hi' ? 'आपका इनवॉइस नंबर' : 'Your Invoice Number'}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-black text-[#ff6b35] tracking-wider">{invoiceNumber}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(invoiceNumber);
                      setCopiedInvoice(true);
                      setTimeout(() => setCopiedInvoice(false), 2000);
                    }}
                    className="border-[#ff6b35]/30 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                  >
                    {copiedInvoice ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {paymentTransactionId && (
                  <p className={`text-xs font-bold mt-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {language === 'gu' ? 'ટ્રાન્ઝેક્શન ID:' : language === 'hi' ? 'ट्रांज़ैक्शन ID:' : 'Transaction ID:'} {paymentTransactionId}
                  </p>
                )}
              </div>
            )}

            {selectedType === 'online' && (
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <p className="text-sm font-bold text-green-600 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  {language === 'gu' ? 'Google Meet માટે' : language === 'hi' ? 'Google Meet के लिए' : 'For Google Meet'}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#75695e]'}`}>
                  {language === 'gu'
                    ? 'આ ઇન્વૉઇસ નંબર Google Meet સત્રમાં જોડાવા માટે જરૂરી છે. તેને સાચવી રાખો!'
                    : language === 'hi'
                      ? 'यह इनवॉइस नंबर Google Meet सत्र में शामिल होने के लिए आवश्यक है। इसे सहेज कर रखें!'
                      : 'This invoice number is required to join the Google Meet session. Save it!'}
                </p>
                <Link href="/online-consulting">
                  <Button className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold">
                    <Video className="w-4 h-4 mr-2" />
                    {language === 'gu' ? 'Google Meet માં જોડાઓ' : language === 'hi' ? 'Google Meet से जुड़ें' : 'Join Google Meet'}
                  </Button>
                </Link>
              </div>
            )}

            <Button
              onClick={handleDownloadInvoice}
              variant="outline"
              className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-bold py-5 rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'gu' ? 'ઇન્વૉઇસ ડાઉનલોડ કરો' : language === 'hi' ? 'इनवॉइस डाउनलोड करें' : 'Download Invoice'}
            </Button>

            <Button
              onClick={() => setShowPaymentSuccessPopup(false)}
              className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold py-5 rounded-xl"
            >
              {language === 'gu' ? 'બંધ કરો' : language === 'hi' ? 'बंद करें' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
