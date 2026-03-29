
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Home, User, Mail, Phone, CreditCard, Hash, Calendar, IndianRupee, Moon, Sun, Download, MapPin, Clock, Sparkles, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  // Payment details from URL params (passed by Uropay redirect or our callback)
  const name = searchParams.get("name") || searchParams.get("customer_name") || "";
  const email = searchParams.get("email") || searchParams.get("customer_email") || "";
  const mobile = searchParams.get("mobile") || searchParams.get("customer_mobile") || searchParams.get("phone") || "";
  const amount = searchParams.get("amount") || "501";
  const transactionId = searchParams.get("transaction_id") || searchParams.get("uropay_order_id") || "";
  const referenceNumber = searchParams.get("reference_number") || searchParams.get("order_id") || searchParams.get("client_order_id") || "";
  const paymentDate = searchParams.get("payment_date") || new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const [paymentData, setPaymentData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  // Fetch payment data from payments table
  useEffect(() => {
    if (transactionId || referenceNumber) {
      fetch(`/api/payments/verify?transaction_id=${transactionId}&reference_number=${referenceNumber}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.payment) setPaymentData(data.payment); })
        .catch(() => { });
    }
  }, [transactionId, referenceNumber]);

  // Fetch full booking details using reference_number (booking ID)
  useEffect(() => {
    const bookingId = referenceNumber;
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setBookingData(data); })
        .catch(() => { });
    }
  }, [referenceNumber]);

  const displayName = bookingData?.full_name || paymentData?.name || name;
  const displayEmail = bookingData?.email || paymentData?.email || email;
  const displayMobile = bookingData?.phone || paymentData?.mobile || mobile;
  const displayAmount = bookingData?.amount || paymentData?.amount || amount;
  const displayTxnId = bookingData?.payment_intent_id || paymentData?.transaction_id || transactionId;
  const displayBookingId = bookingData?.id || referenceNumber;
  const displayDate = paymentData?.payment_date
    ? new Date(paymentData.payment_date).toLocaleString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })
    : paymentDate;

  // Booking-specific details
  const serviceType = bookingData?.service_type || "";
  const bookingDate = bookingData?.booking_date || "";
  const bookingTime = bookingData?.booking_time || "";
  const invoiceNumber = bookingData?.invoice_number || "";
  const dob = bookingData?.date_of_birth || "";
  const tob = bookingData?.time_of_birth || "";
  const pob = bookingData?.place_of_birth || "";
  const city = bookingData?.city || "";
  const address = bookingData?.address || "";

  const getServiceLabel = (type: string) => {
    const map: Record<string, string> = {
      "online": "Online Consultation",
      "home": "Home Consultation",
      "home-within": "Home Consultation (Within 6.5km)",
      "home-outside": "Home Consultation (Outside 6.5km)",
    };
    return map[type] || type || "Consultation";
  };

  // PDF Receipt Download
  const handleDownloadReceipt = () => {
    const serviceName = getServiceLabel(serviceType);
    const bookingDateFormatted = bookingDate ? new Date(bookingDate + "T00:00:00").toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const dobFormatted = dob ? new Date(dob + "T00:00:00").toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${invoiceNumber || displayBookingId}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#fff;color:#1a1a2e;padding:30px}
@page{size:A4;margin:15mm}
.receipt{max-width:800px;margin:auto;padding:40px;border:2px solid #ff6b35;border-radius:16px}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #ff6b35;padding-bottom:20px;margin-bottom:25px}
.logo h1{color:#ff6b35;font-size:24px;margin-bottom:2px}
.logo p{color:#888;font-size:10px;text-transform:uppercase;letter-spacing:2px}
.receipt-info{text-align:right}
.receipt-info .inv{color:#ff6b35;font-size:16px;font-weight:900;margin-bottom:3px}
.receipt-info .txn{color:#22c55e;font-size:11px;font-weight:700;margin-bottom:3px}
.receipt-info .date{color:#888;font-size:11px}
.status-banner{background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:12px 20px;text-align:center;margin-bottom:25px}
.status-banner span{color:#22c55e;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:3px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:25px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:25px}
.box{background:#f9fafb;border:1px solid #eee;border-radius:12px;padding:18px}
.box-title{color:#ff6b35;font-size:9px;text-transform:uppercase;letter-spacing:2px;font-weight:800;margin-bottom:10px}
.box .name{font-weight:700;font-size:15px;margin-bottom:3px}
.box p{font-size:13px;margin-bottom:3px;color:#333}
.box .label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-top:8px;margin-bottom:2px}
table{width:100%;border-collapse:collapse;margin-bottom:20px;border-radius:12px;overflow:hidden}
thead{background:#f9fafb}
th{padding:12px 16px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:700}
th:last-child{text-align:right}
td{padding:12px 16px;border-bottom:1px solid #eee;font-size:14px}
td:last-child{text-align:right;font-weight:700}
.total-row{background:#fff7ed}
.total-row td:first-child{text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;font-weight:700}
.total-row td:last-child{color:#ff6b35;font-size:22px;font-weight:900}
.footer{display:flex;justify-content:space-between;align-items:center;padding-top:15px;border-top:1px solid #eee;margin-top:15px}
.footer .company{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#bbb}
.footer .quote{font-style:italic;font-size:11px;color:#888}
.disclaimer{margin-top:15px;padding:12px;background:#f9fafb;border-radius:8px;font-size:10px;color:#888;text-align:center;border:1px solid #eee}
@media print{body{padding:0}.receipt{border:none;padding:15px}}
</style></head><body>
<div class="receipt">
  <div class="header">
    <div class="logo">
      <h1>\u0915\u093E\u0924\u094D\u092F\u093E\u092F\u0928\u0940 \u091C\u094D\u092F\u094B\u0924\u093F\u0937</h1>
      <p>Katyaayani Astrologer \u2022 Vedic Wisdom</p>
    </div>
    <div class="receipt-info">
      ${invoiceNumber ? `<div class="inv">Invoice: ${invoiceNumber}</div>` : ''}
      <div class="inv">Booking: ${displayBookingId}</div>
      ${displayTxnId ? `<div class="txn">Transaction: ${displayTxnId}</div>` : ''}
      <div class="date">Issued: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
  </div>

  <div class="status-banner"><span>\u2713 Payment Successful \u2022 Booking Confirmed</span></div>

  <div class="grid3">
    <div class="box">
      <div class="box-title">Client Details</div>
      <p class="name">${displayName}</p>
      <p>${displayEmail}</p>
      <p>${displayMobile}</p>
      ${city ? `<p>${city}</p>` : ''}
      ${address ? `<p>${address}</p>` : ''}
    </div>
    <div class="box">
      <div class="box-title">Birth Details</div>
      <p class="label">Date of Birth</p>
      <p class="name">${dobFormatted}</p>
      <p class="label">Birth Time</p>
      <p>${tob || 'N/A'}</p>
      <p class="label">Birth Place</p>
      <p>${pob || 'N/A'}</p>
    </div>
    <div class="box">
      <div class="box-title">Consultation Details</div>
      <p class="name">${serviceName}</p>
      <p class="label">Scheduled Date</p>
      <p>${bookingDateFormatted || 'N/A'}</p>
      <p class="label">Scheduled Time</p>
      <p style="color:#ff6b35;font-weight:700">${bookingTime || 'N/A'}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th>Amount</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>${serviceName}</strong><br><span style="font-size:11px;color:#888">Professional Vedic astrological consultation and guidance</span></td>
        <td>\u20B9 ${displayAmount}</td>
      </tr>
      <tr class="total-row">
        <td>Total Paid</td>
        <td>\u20B9 ${displayAmount}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>
      <p class="quote">\u201C\u0905\u0938\u0924\u094B \u0AAE\u0ABE \u0AB8\u0AA6\u0ACD\u0A97\u0AAE\u0AAF \u0964 \u0AA4\u0AAE\u0AB8\u094B \u0AAE\u0ABE \u0A9C\u0ACD\u0AAF\u094B\u0AA4\u0ABF\u0AB0\u0ACD\u0A97\u0AAE\u0AAF \u0964\u201D</p>
      <p class="company">Katyaayani Jyotish \u2022 Ahmedabad \u2022 +91 98249 29588</p>
    </div>
  </div>
  <div class="disclaimer">This receipt is auto-generated. For queries, contact katyaayaniastrologer01@gmail.com</div>
</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      // Fallback: download as HTML
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${invoiceNumber || displayBookingId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const InfoRow = ({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${theme === "dark" ? "bg-green-500/10" : "bg-green-50"}`}>
          <Icon className="w-4 h-4 text-green-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-xs ${theme === "dark" ? "text-[#a0998c]" : "text-[#75695e]"}`}>{label}</p>
          <p className={`font-semibold text-sm break-all ${highlight ? "text-green-500 text-lg" : theme === "dark" ? "text-[#f5f0e8]" : "text-[#2d1810]"}`}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-[#0a0a0f] text-[#f5f0e8]" : "bg-[#fdfbf7] text-[#2d1810]"}`}>
      {/* Navbar */}
      <nav className={`backdrop-blur-md border-b ${theme === "dark" ? "bg-[#0a0a0f]/95 border-[#ff6b35]/20" : "bg-white/95 border-[#ff6b35]/20"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=8000&height=8000&resize=contain"
              alt="Logo" width={44} height={44} className="rounded-full"
            />
            <span className="font-[family-name:var(--font-cinzel)] text-xl font-semibold text-gradient-ancient hidden sm:inline">
              Katyaayani Astrologer
            </span>
          </Link>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 h-9 w-9">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Success icon */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-green-500/15 border-4 border-green-500/30 flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl font-bold text-green-500 mb-1"
            >
              Payment Successful
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className={`text-sm ${theme === "dark" ? "text-[#a0998c]" : "text-[#75695e]"}`}
            >
              Your booking has been confirmed!
            </motion.p>
          </div>

          {/* Details card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className={`${theme === "dark" ? "bg-[#12121a] border-green-500/20" : "bg-white border-green-500/20"} shadow-lg`}>
              <CardContent className="p-5 md:p-7 space-y-5">

                {/* Customer Details */}
                <div>
                  <h2 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    Customer Details
                  </h2>
                  <div className="space-y-3">
                    <InfoRow icon={User} label="Full Name" value={displayName} />
                    <InfoRow icon={Mail} label="Email" value={displayEmail} />
                    <InfoRow icon={Phone} label="Contact Number" value={displayMobile} />
                    {city && <InfoRow icon={MapPin} label="City" value={city} />}
                  </div>
                </div>

                <div className={`border-t ${theme === "dark" ? "border-white/10" : "border-gray-100"}`} />

                {/* Booking Details */}
                <div>
                  <h2 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    Booking Details
                  </h2>
                  <div className="space-y-3">
                    <InfoRow icon={Sparkles} label="Selected Service" value={getServiceLabel(serviceType)} />
                    {bookingDate && <InfoRow icon={Calendar} label="Booking Date" value={new Date(bookingDate + "T00:00:00").toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />}
                    {bookingTime && <InfoRow icon={Clock} label="Booking Time" value={bookingTime} />}
                  </div>
                </div>

                {/* Birth Details (if available) */}
                {(dob || tob || pob) && (
                  <>
                    <div className={`border-t ${theme === "dark" ? "border-white/10" : "border-gray-100"}`} />
                    <div>
                      <h2 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                        Birth Details
                      </h2>
                      <div className="space-y-3">
                        {dob && <InfoRow icon={Star} label="Date of Birth" value={new Date(dob + "T00:00:00").toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />}
                        {tob && <InfoRow icon={Clock} label="Birth Time" value={tob} />}
                        {pob && <InfoRow icon={MapPin} label="Birth Place" value={pob} />}
                      </div>
                    </div>
                  </>
                )}

                <div className={`border-t ${theme === "dark" ? "border-white/10" : "border-gray-100"}`} />

                {/* Payment Details */}
                <div>
                  <h2 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                    Payment Details
                  </h2>
                  <div className="space-y-3">
                    <InfoRow icon={IndianRupee} label="Amount Paid" value={`₹${displayAmount}`} highlight />
                    {displayBookingId && <InfoRow icon={Hash} label="Booking ID" value={displayBookingId} />}
                    {invoiceNumber && <InfoRow icon={FileText} label="Invoice Number" value={invoiceNumber} />}
                    {displayTxnId && <InfoRow icon={CreditCard} label="Transaction ID" value={displayTxnId} />}
                    <InfoRow icon={Calendar} label="Payment Date" value={displayDate} />
                  </div>
                </div>

                {/* Status badge */}
                <div className={`rounded-xl p-4 flex items-center gap-3 ${theme === "dark" ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"}`}>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className={`text-sm font-bold ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
                      Payment Status: SUCCESS
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-green-400/70" : "text-green-600"}`}>
                      Thank you for choosing Katyaayani Astrologer!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 space-y-3"
          >
            <Button
              onClick={handleDownloadReceipt}
              className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-semibold h-12 rounded-xl text-base"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt (PDF)
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/profile">
                <Button variant="outline" className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 h-11 rounded-xl text-sm">
                  My Bookings
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10 h-11 rounded-xl text-sm">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="text-[#ff6b35] text-lg">Loading...</div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
