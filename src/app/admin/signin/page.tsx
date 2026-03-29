"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";
import { useTheme } from "@/contexts/ThemeContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function AdminSignInPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password states
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("admin_auth");
    if (auth) {
      router.push("/admin");
    }
  }, [router]);

    const handleNextStep = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
  
      try {
        if (step === 1) {
          if (!email.includes("@")) {
            setError(t("Please enter a valid email"));
            setIsLoading(false);
            return;
          }
          setStep(2);
        } else if (step === 2) {
          const res = await fetch("/api/admin/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, type: "login" }),
          });
          const data = await res.json();
          if (res.ok) {
            setStep(3);
          } else {
            setError(data.error || t("Invalid credentials"));
          }
        }
      } catch (err) {
        setError(t("An error occurred. Please try again."));
      } finally {
        setIsLoading(false);
      }
    };

  const handleAutoSubmit = async (value: string) => {
    setOtp(value);
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: value }),
      });
      const data = await res.json();
      if (res.ok) {
        // JWT cookie is set by server; store client-side flag for UI checks
        localStorage.setItem("admin_auth", "true");
        if (data.token) localStorage.setItem("admin_jwt", data.token);
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || t("Invalid verification code"));
      }
    } catch (err) {
      setError(t("An error occurred. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password: send OTP via Telegram
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-otp", email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setForgotStep('otp');
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password: verify OTP and set new password
  const handleForgotVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (forgotNewPassword.length < 6) {
      setError(t("Password must be at least 6 characters"));
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError(t("Passwords do not match"));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setForgotStep('done');
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#fcfaf7]'}`}>
      <div className="absolute top-4 right-4 z-50">
        <GoogleTranslateWidget />
      </div>

      <div className="w-full max-w-[420px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#ff6b35]/10 border border-[#ff6b35]/20 mb-4">
            <Lock className="w-8 h-8 text-[#ff6b35]" />
          </div>
          <h1 className="text-3xl font-black font-[family-name:var(--font-cinzel)] text-[#ff6b35] mb-2">
            {t("Admin Portal")}
          </h1>
          <p className="text-muted-foreground">
            {t("Secure access to Katyaayani Astrologer management")}
          </p>
        </div>

          <Card className={`${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} shadow-2xl`}>
            <CardHeader>
            <CardTitle>
              {isForgot 
                ? (forgotStep === 'done' ? t("Password Reset!") : t("Reset Password"))
                : (step === 1 ? t("Admin Login") : step === 2 ? t("Verify Password") : t("Two-Factor Authentication"))
              }
            </CardTitle>
            <CardDescription>
              {isForgot
                ? (forgotStep === 'email' ? t("Enter your admin email to receive an OTP") : forgotStep === 'otp' ? t("Enter the OTP and set a new password") : forgotStep === 'done' ? t("Your password has been updated successfully") : "")
                : (step === 1 ? t("Enter your administrator email") : step === 2 ? t("Enter your password to continue") : t("Enter the 6-digit code sent to your Telegram/Email"))
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isForgot ? (
              <>
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center mb-4">
                    {error}
                  </div>
                )}

                {forgotStep === 'email' && (
                  <form onSubmit={handleForgotSendOtp} className="space-y-4">
                    <div className="space-y-2 text-left">
                      <Label>{t("Admin Email")}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          className={`pl-10 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {t("Send OTP")}
                    </Button>
                    <button type="button" onClick={() => { setIsForgot(false); setError(""); setForgotStep('email'); setForgotEmail(''); }} className="w-full text-xs text-muted-foreground hover:text-[#ff6b35]">
                      {t("Back to Login")}
                    </button>
                  </form>
                )}

                {forgotStep === 'otp' && (
                  <form onSubmit={handleForgotVerifyAndReset} className="space-y-4">
                    <div className="flex flex-col items-center space-y-4 py-2">
                      <p className="text-xs text-muted-foreground text-center">
                        {t("Enter the 6-digit code sent to your Telegram")}
                      </p>
                      <InputOTP maxLength={6} value={forgotOtp} onChange={(value) => setForgotOtp(value)}>
                        <InputOTPGroup className="gap-2">
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={`w-10 h-12 md:w-12 md:h-14 text-lg font-bold border-2 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <div className="space-y-2 text-left">
                      <Label>{t("New Password")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          required
                          className={`pl-10 pr-10 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#ff6b35]">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <Label>{t("Confirm Password")}</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        required
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isLoading || forgotOtp.length !== 6}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {t("Reset Password")}
                    </Button>
                    <button type="button" onClick={() => { setForgotStep('email'); setForgotOtp(''); setError(""); }} className="w-full text-xs text-muted-foreground hover:text-[#ff6b35]">
                      {t("Back")}
                    </button>
                  </form>
                )}

                {forgotStep === 'done' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl font-bold">
                      ✓
                    </div>
                    <p className="text-sm text-muted-foreground">{t("You can now sign in with your new password.")}</p>
                    <Button
                      onClick={() => { setIsForgot(false); setForgotStep('email'); setForgotEmail(''); setForgotOtp(''); setForgotNewPassword(''); setForgotConfirmPassword(''); setError(""); }}
                      className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl"
                    >
                      {t("Sign In Now")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
            <form onSubmit={handleNextStep} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-2 text-left">
                  <Label htmlFor="email">{t("Email Address")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`pl-10 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{t("Password")}</Label>
                    <button
                      type="button"
                      onClick={() => { setIsForgot(true); setError(""); }}
                      className="text-xs text-[#ff6b35] hover:underline"
                    >
                      {t("Forgot?")}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      className={`pl-10 pr-10 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#ff6b35]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className={`w-10 h-12 md:w-12 md:h-14 text-lg font-bold border-2 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-muted-foreground">
                    {t("Enter the 6-digit verification code")}
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleAutoSubmit(otp)}
                    className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-black h-12 rounded-xl mt-4"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      t("Submit OTP")
                    )}
                  </Button>
                </div>
              )}

              {step < 3 && (
                <Button
                  type="submit"
                  className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    t("Continue")
                  )}
                </Button>
              )}


              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full text-xs text-muted-foreground hover:text-[#ff6b35]"
                >
                  {t("Back")}
                </button>
              )}
            </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Katyaayani Astrologer. {t("All rights reserved.")}
        </p>
      </div>
    </div>
  );
}
