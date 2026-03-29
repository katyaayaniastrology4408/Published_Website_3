"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Send,
  Server,
  Zap,
} from "lucide-react";

interface Props {
  isDark: boolean;
  t: (key: string) => string;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}

export default function EmailConfigPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testingResend, setTestingResend] = useState(false);
  const [status, setStatus] = useState<{
    smtp: { status: string; error?: string; config?: { user: string; service: string } };
    resend: { status: string; error?: string; fromEmail?: string };
  } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/email-config");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setError("Failed to fetch email config status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const sendTest = async (type: "smtp" | "resend") => {
    if (!testEmail) {
      setError("Please enter a test email address");
      return;
    }
    if (type === "smtp") setTestingSmtp(true);
    else setTestingResend(true);

    try {
      const res = await fetch("/api/admin/email-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, testEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`${type === "smtp" ? "SMTP" : "Resend"} test email sent to ${testEmail}`);
      } else {
        setError(data.error || `${type} test failed`);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      if (type === "smtp") setTestingSmtp(false);
      else setTestingResend(false);
    }
  };

  const card = `p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">
            {t("Email Configuration")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Manage SMTP (Gmail) and Resend email providers")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchStatus}
          disabled={loading}
          className="border-[#ff6b35]/20 text-[#ff6b35]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="ml-2">{t("Refresh Status")}</span>
        </Button>
      </div>

      {/* Architecture Info */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Server className="w-5 h-5" /> {t("Email Routing Architecture")}
          </CardTitle>
          <CardDescription>{t("Which provider handles which type of emails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SMTP */}
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm">Gmail SMTP</p>
                  <p className="text-[10px] text-muted-foreground">{status?.smtp?.config?.user || process.env.NEXT_PUBLIC_APP_URL}</p>
                </div>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  loading ? "bg-amber-500/10 text-amber-500" :
                  status?.smtp?.status === "connected" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {loading ? "Checking..." : status?.smtp?.status || "Unknown"}
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  "OTP Verification",
                  "Welcome Email (New User)",
                  "Login Security Alert",
                  "Booking Confirmation",
                  "Password Reset",
                  "Weekly Horoscope",
                  "Admin Notifications",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="text-xs">{t(item)}</span>
                  </div>
                ))}
              </div>
              {status?.smtp?.error && (
                <div className={`mt-3 p-2 rounded-lg text-xs ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {status.smtp.error}
                </div>
              )}
            </div>

            {/* Resend */}
            <div className={card}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-[#ff6b35]/10 text-[#ff6b35]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm">Resend</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                    {status?.resend?.fromEmail || "noreply@katyaayaniastrologer.com"}
                  </p>
                </div>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  loading ? "bg-amber-500/10 text-amber-500" :
                  status?.resend?.status === "connected" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {loading ? "Checking..." : status?.resend?.status || "Unknown"}
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  "Newsletter Campaigns",
                  "Blog Post Updates",
                  "Daily Rashifal Updates",
                  "Astrology Tips",
                  "Bulk Subscriber Emails",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#ff6b35] shrink-0" />
                    <span className="text-xs">{t(item)}</span>
                  </div>
                ))}
              </div>
              {status?.resend?.error && (
                <div className={`mt-3 p-2 rounded-lg text-xs ${isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"}`}>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {status.resend.error}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Send className="w-5 h-5" /> {t("Send Test Email")}
          </CardTitle>
          <CardDescription>
            {t("Test both providers by sending a test email to any address")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Test Email Address")}</Label>
            <Input
              type="email"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className={isDark ? "bg-white/5 border-white/10" : ""}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => sendTest("smtp")}
              disabled={testingSmtp || !testEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
            >
              {testingSmtp ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Sending...")}</>
              ) : (
                <><Mail className="w-4 h-4 mr-2" /> {t("Test Gmail SMTP")}</>
              )}
            </Button>
            <Button
              onClick={() => sendTest("resend")}
              disabled={testingResend || !testEmail}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold"
            >
              {testingResend ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Sending...")}</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" /> {t("Test Resend")}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Config Details */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Server className="w-5 h-5" /> {t("Current Configuration")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Gmail SMTP User", value: "katyaayaniastrologer01@gmail.com", badge: "SMTP" },
              { label: "Gmail App Password", value: "••••••••••••••••", badge: "SMTP" },
              { label: "Resend API Key", value: "re_ZNV7b••••••••••••••", badge: "Resend" },
              { label: "Resend From Email", value: status?.resend?.fromEmail || "noreply@katyaayaniastrologer.com", badge: "Resend" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t(item.label)}</p>
                  <p className="text-sm font-mono font-bold mt-0.5">{item.value}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  item.badge === "SMTP" ? "bg-blue-500/10 text-blue-500" : "bg-[#ff6b35]/10 text-[#ff6b35]"
                }`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-3 rounded-lg text-xs ${isDark ? "bg-amber-500/5 border border-amber-500/10 text-amber-300/80" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
            <p className="font-bold mb-1">{t("Note:")}</p>
            <p>{t("To change email credentials, update the .env.local file and restart the server.")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
