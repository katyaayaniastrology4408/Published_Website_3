"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Calendar, Clock, User, Mail, Moon, Sun, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import dynamic from "next/dynamic";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";

const CrispChat = dynamic(() => import("@/components/CrispChat"), { ssr: false });

  function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const paymentStatus = searchParams.get("status") || searchParams.get("payment_status");
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (bookingId) {
        if (paymentStatus === "success" || paymentStatus === "confirmed") {
          confirmPayment(bookingId);
        } else {
          fetchBookingDetails(bookingId);
        }
      }
    }, [bookingId, paymentStatus]);

    const confirmPayment = async (id: string) => {
      setIsConfirming(true);
      try {
        // Update booking status to confirmed/paid
        await fetch(`/api/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            status: "confirmed",
            payment_status: "success"
          }),
        });
        await fetchBookingDetails(id);
      } catch (error) {
        console.error("Error confirming payment:", error);
        await fetchBookingDetails(id);
      } finally {
        setIsConfirming(false);
      }
    };

    const fetchBookingDetails = async (id: string) => {
      try {
        const response = await fetch(`/api/bookings/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loading || isConfirming) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#ff6b35] animate-spin mb-4" />
          <p className="text-xl">
            {isConfirming ? t("Confirming payment...") : t("Loading booking details...")}
          </p>
        </div>
      );
    }


  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="font-[family-name:var(--font-cinzel)] text-4xl font-bold mb-4 text-gradient-ancient">
          {t("Booking Successful!")}
        </h1>
        <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
          {t("Your astrology consultation has been successfully booked.")}
        </p>

        {booking && (
          <div ref={receiptRef}>
            <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'} text-left mb-8`}>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-gradient-ancient">Katyaayani Astrologer</h2>
                    <p className="text-xs opacity-60">Booking Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>{t("Details")}</h4>
                    <div className={`space-y-2 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#ff6b35]" />
                        {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#ff6b35]" />
                        {booking.booking_time}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>{t("Contact")}</h4>
                    <div className={`space-y-2 ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                      <p className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#ff6b35]" />
                        {booking.full_name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#ff6b35]" />
                        {booking.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#ff6b35]/20">
                  <p className={`text-lg ${theme === 'dark' ? 'text-[#a0998c]' : 'text-[#6b5847]'}`}>
                    Booking ID: <span className={`font-mono ${theme === 'dark' ? 'text-[#f5f0e8]' : 'text-[#2d1810]'}`}>{bookingId}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button className="cursor-pointer bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-semibold px-8 w-full sm:w-auto">
              {t("Go to Home")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-background text-[#2d1810]'}`}>
      <CrispChat />
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
        theme === 'dark' 
          ? 'bg-[#0a0a0f]/95 border-[#ff6b35]/20'
          : 'bg-background/95 border-[#ff6b35]/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=8000&height=8000&resize=contain" alt="Logo" width={48} height={48} className="rounded-full" />
            <span className="font-[family-name:var(--font-cinzel)] text-2xl font-semibold text-gradient-ancient">
              Katyaayani Astrologer
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <GoogleTranslateWidget />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6">
        <Suspense fallback={<div className="text-center py-20">{t("Loading...")}</div>}>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
