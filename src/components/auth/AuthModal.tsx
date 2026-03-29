"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, LogIn, UserPlus, Eye, EyeOff, Mail, Lock, KeyRound, Phone, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/components/GoogleTranslateWidget";

export default function AuthModal() {
  const { isAuthModalOpen, hideAuthModal, authView } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signInMethod, setSignInMethod] = useState<'password' | 'otp'>('password');
    const [signInOtpValue, setSignInOtpValue] = useState("");
    const [signInStep, setSignInStep] = useState<'credentials' | 'otp'>('credentials');

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [tob, setTob] = useState("");
    const [pob, setPob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
    const [signupOtpValue, setSignupOtpValue] = useState("");
    
      const [currentView, setCurrentView] = useState<string | null>(null);
      const [success, setSuccess] = useState(false);

    // Forgot password states
      const [forgotEmail, setForgotEmail] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [forgotNewPassword, setForgotNewPassword] = useState("");
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
    const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password' | 'done'>('email');

    // Scroll hint
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollHint, setShowScrollHint] = useState(false);

    const checkScroll = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      const canScroll = el.scrollHeight > el.clientHeight + 10;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 30;
      setShowScrollHint(canScroll && !nearBottom);
    }, []);

    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      const ro = new ResizeObserver(checkScroll);
      ro.observe(el);
      return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
    }, [checkScroll, currentView, isAuthModalOpen, signupStep, forgotStep]);


        useEffect(() => {
    setError("");
  }, [currentView]);

  useEffect(() => {
    if (authView) {
      setCurrentView(authView);
      setError("");
    }
  }, [authView]);

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  const validatePassword = (pass: string) => {
    const hasCapital = /[A-Z]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return hasCapital && hasSymbol && isLongEnough;
  };

    const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        if (signInStep === 'credentials') {
          const response = await fetch("/api/auth/login-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: signInEmail, password: signInPassword }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Invalid email or password");
          
          setSignInStep('otp');
          setIsLoading(false);
          return;
        }

        if (signInStep === 'otp') {
          const verifyRes = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: signInEmail,
              otp: signInOtpValue,
              type: 'login'
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid verification code");

          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: signInEmail,
            password: signInPassword,
          });

          if (signInError) throw signInError;

          if (data?.user) {
            fetch("/api/auth/save-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                email: signInEmail,
                password: signInPassword
              }),
            }).catch(err => console.error("Save password failed:", err));

            fetch("/api/auth/login-notification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                email: signInEmail,
                name: data.user?.user_metadata?.full_name || "Seeker"
              }),
            }).catch(err => console.error("Notification failed:", err));

            hideAuthModal();
            router.push("/");
            router.refresh();
          }
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSendSignupOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!validatePassword(password)) {
        setError("Password must be 8+ characters, with a capital letter and a symbol.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!gender) {
        setError("Please select a gender.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/signup-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, fullName }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to send verification code");

        setSignupStep('otp');
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const handleVerifySignupOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const verifyRes = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email,
            otp: signupOtpValue,
            type: 'signup'
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid verification code");

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            fullName,
            phone: phoneNumber,
            gender,
            dob,
            tob,
            pob
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create account");

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
    
        setSuccess(true);
        setTimeout(() => {
          hideAuthModal();
          router.push("/");
          router.refresh();
        }, 2000);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
      };

    const handleForgotSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, type: "forgot_password" }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to send OTP");
        setForgotStep('otp');
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const handleForgotVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, type: "forgot_password" }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Invalid OTP");
        setForgotStep('new_password');
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const handleForgotResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!validatePassword(forgotNewPassword)) {
        setError("Password must be 8+ characters, with a capital letter and a symbol.");
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail, newPassword: forgotNewPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to reset password");
        setForgotStep('done');
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const FieldError = ({ msg }: { msg: string }) => (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="text-xs font-bold text-red-500 mt-1.5 flex items-center gap-1.5 px-1"
      >
        <AlertCircle className="w-3 h-3" />
        {t(msg)}
      </motion.div>
    );

    const BottomError = ({ msg }: { msg: string }) => (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black text-center flex items-center justify-center gap-2 uppercase tracking-wide"
      >
        <AlertCircle className="w-4 h-4" />
        {t(msg)}
      </motion.div>
    );

  return (
    <AnimatePresence mode="wait">
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hideAuthModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-2xl ${
              theme === 'dark' ? 'bg-[#12121a] border border-[#ff6b35]/20' : 'bg-white border border-[#ff6b35]/20'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff6b35] via-[#ffa07a] to-[#2d1b4e]" />
            
            <button
              onClick={hideAuthModal}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-6 h-6 text-[#ff6b35]" />
            </button>

            <div ref={scrollRef} className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-3xl bg-[#ff6b35]/10 mb-4">
                    {currentView === 'signin' ? (
                      <LogIn className="w-8 h-8 text-[#ff6b35]" />
                    ) : currentView === 'forgot' ? (
                      <KeyRound className="w-8 h-8 text-[#ff6b35]" />
                    ) : (
                      <UserPlus className="w-8 h-8 text-[#ff6b35]" />
                    )}
                  </div>
                  <h2 className={`text-3xl font-[family-name:var(--font-cinzel)] font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-[#2d1810]'
                  }`}>
                    {success ? t("Success!") : currentView === 'signin' ? t("Welcome Back") : currentView === 'forgot' ? t("Reset Password") : t("Begin Your Journey")}
                  </h2>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {success ? t("Everything is set!") : currentView === 'signin' ? t("Enter your cosmic credentials") : currentView === 'forgot' ? (forgotStep === 'email' ? t("We'll send a verification code to your email") : forgotStep === 'otp' ? t("Enter the code sent to your email") : forgotStep === 'new_password' ? t("Create a new secure password") : t("You're all set!")) : t("Join our spiritual community")}
                  </p>
              </div>

                  {success ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500 text-4xl"
                        >
                          ✓
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-bold text-green-500">{t("Account Ready")}</h3>
                        <p className="text-gray-400 mt-2">{t("Your spiritual journey begins now...")}</p>
                      </div>
                      ) : currentView === 'signin' ? (
                        <form onSubmit={handleSignIn} className="space-y-6">
                        <p className="text-center text-gray-500 -mt-2 mb-2">
                          {t("New seeker?")} <button type="button" onClick={() => setCurrentView('signup')} className="text-[#ff6b35] font-bold hover:underline">{t("Create Account")}</button>
                        </p>
                        
                        {signInStep === 'credentials' ? (
                          <>
                            <div className="space-y-2">
                              <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Email Address")}</Label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="email"
                                  value={signInEmail}
                                  onChange={(e) => setSignInEmail(e.target.value)}
                                  required
                                  className="pl-10 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
                                  placeholder="your@star.com"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Password")}</Label>
                                <button 
                                  type="button"
                                  onClick={() => setCurrentView('forgot')}
                                  className="text-sm text-[#ff6b35] hover:underline"
                                >
                                  {t("Forgot?")}
                                </button>
                              </div>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  value={signInPassword}
                                  onChange={(e) => setSignInPassword(e.target.value)}
                                  required
                                  className="pl-12 pr-12 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff6b35]"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {error && <FieldError msg={error} />}
                            </div>

                            <Button type="submit" className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" disabled={isLoading}>
                              {isLoading ? <Loader2 className="animate-spin" /> : t('Sign In & Get OTP')}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-6">
                            <div className="space-y-4 text-center">
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t("Verification code sent to")} <br />
                                <span className="font-bold text-[#ff6b35]">{signInEmail}</span>
                              </p>
                              
                              <div className="flex justify-center">
                                <InputOTP
                                  maxLength={6}
                                  value={signInOtpValue}
                                  onChange={(value) => setSignInOtpValue(value)}
                                >
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                    <InputOTPSlot index={1} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                    <InputOTPSlot index={2} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                    <InputOTPSlot index={3} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                    <InputOTPSlot index={4} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                    <InputOTPSlot index={5} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                                  </InputOTPGroup>
                                </InputOTP>
                              </div>
                              {error && <FieldError msg={error} />}
                            </div>

                            <Button 
                              type="submit" 
                              className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" 
                              disabled={isLoading || signInOtpValue.length !== 6}
                            >
                              {isLoading ? <Loader2 className="animate-spin" /> : t('Verify & Sign In')}
                            </Button>

                            <div className="text-center">
                              <button 
                                type="button" 
                                onClick={() => {
                                  setSignInStep('credentials');
                                  setSignInOtpValue("");
                                }} 
                                className="text-sm text-gray-500 hover:text-[#ff6b35] transition-colors"
                              >
                                {t("Back to credentials")}
                              </button>
                            </div>
                          </div>
                        )}


                        <div className="flex items-center gap-3 my-2">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                          <span className="text-xs text-gray-400 uppercase tracking-widest">{t("or")}</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                          className={`w-full h-14 flex items-center justify-center gap-3 rounded-2xl border-2 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                            theme === 'dark'
                              ? 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          {t("Continue with Google")}
                        </button>
                        {error && <BottomError msg={error} />}
                      </form>
              ) : currentView === 'forgot' ? (

                  forgotStep === 'email' ? (
                    <form onSubmit={handleForgotSendOtp} className="space-y-6">
                      <p className="text-center text-gray-500 -mt-2 mb-2">
                        {t("Enter your registered email to receive a verification code.")}
                      </p>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Email Address")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            className="pl-10 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
                            placeholder="your@star.com"
                          />
                        </div>
                        {error && <FieldError msg={error} />}
                      </div>
                      <Button type="submit" className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : t('Send Verification Code')}
                      </Button>
                      <button type="button" onClick={() => { setCurrentView('signin'); setForgotStep('email'); setForgotEmail(''); }} className="w-full text-center text-[#ff6b35] font-bold hover:underline text-sm">{t("Back to Login")}</button>
                      {error && <BottomError msg={error} />}
                    </form>
                  ) : forgotStep === 'otp' ? (
                    <form onSubmit={handleForgotVerifyOtp} className="space-y-6">
                      <div className="space-y-4 text-center">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t("A 6-digit verification code has been sent to")} <br />
                          <span className="font-bold text-[#ff6b35]">{forgotEmail}</span>
                        </p>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={forgotOtp} onChange={(value) => setForgotOtp(value)}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                              <InputOTPSlot index={1} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                              <InputOTPSlot index={2} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                              <InputOTPSlot index={3} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                              <InputOTPSlot index={4} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                              <InputOTPSlot index={5} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {error && <FieldError msg={error} />}
                      </div>
                      <Button type="submit" className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" disabled={isLoading || forgotOtp.length !== 6}>
                        {isLoading ? <Loader2 className="animate-spin" /> : t('Verify Code')}
                      </Button>
                      <button type="button" onClick={() => { setForgotStep('email'); setForgotOtp(''); }} className="w-full text-center text-sm text-gray-500 hover:text-[#ff6b35]">{t("Back")}</button>
                      {error && <BottomError msg={error} />}
                    </form>
                  ) : forgotStep === 'new_password' ? (
                    <form onSubmit={handleForgotResetPassword} className="space-y-6">
                      <p className="text-center text-gray-500 -mt-2 mb-2">
                        {t("Create a new password for your account.")}
                      </p>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("New Password")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={forgotNewPassword}
                            onChange={(e) => setForgotNewPassword(e.target.value)}
                            required
                            className="pl-12 pr-12 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
                            placeholder="e.g. Astro@123"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff6b35]">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{t("Use a strong password with capital letters, numbers & symbols")}</p>
                        {error && <FieldError msg={error} />}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Confirm Password")}</Label>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          required
                          className="h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
                        />
                      </div>
                      <Button type="submit" className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : t('Reset Password')}
                      </Button>
                      {error && <BottomError msg={error} />}
                    </form>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-4xl">✓</motion.div>
                      </div>
                      <h3 className="text-2xl font-bold text-green-500">{t("Password Reset!")}</h3>
                      <p className="text-gray-400 mt-2">{t("Your password has been updated successfully.")}</p>
                      <Button onClick={() => { setCurrentView('signin'); setForgotStep('email'); setForgotEmail(''); setForgotOtp(''); setForgotNewPassword(''); setForgotConfirmPassword(''); }} className="mt-6 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl font-bold px-8">
                        {t("Sign In Now")}
                      </Button>
                    </div>
                  )
                ) : signupStep === 'details' ? (
                  <form onSubmit={handleSendSignupOtp} className="space-y-4">

                    {/* Google Sign Up */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className={`w-full h-14 flex items-center justify-center gap-3 rounded-2xl border-2 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {t("Sign up with Google")}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      <span className="text-xs text-gray-400 uppercase tracking-widest">{t("or fill form")}</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Full Name")}</Label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Phone")}</Label>
                      <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                    </div>
                  </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Email")}</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" placeholder="example@gmail.com" />
                      <p className="text-xs text-gray-400 mt-1">{t("Enter your valid email address (e.g. yourname@gmail.com)")}</p>
                    </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500">{t("Gender")}</Label>
                    <div className="flex gap-4">
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          gender === g ? 'bg-[#ff6b35] border-[#ff6b35] text-white' : 'border-[#ff6b35]/30 text-gray-500'
                        }`}>
                          <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} className="hidden" />
                          <span className="capitalize text-sm font-bold">{t(g)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Birth Date")}</Label>
                      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Birth Time")}</Label>
                      <Input type="time" value={tob} onChange={(e) => setTob(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-500">{t("Birth Place")}</Label>
                    <Input placeholder={t("City, State")} value={pob} onChange={(e) => setPob(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                  </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500">{t("Password")}</Label>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" placeholder="e.g. Astro@123" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t("Use a strong password with capital letters, numbers & symbols (e.g. Astro@123)")}</p>
                      {error && <FieldError msg={error} />}
                    </div>
                  <div className="space-y-2 pb-2">
                    <Label className="text-xs font-bold text-gray-500">{t("Confirm Password")}</Label>
                    <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="rounded-xl border-[#ff6b35]/30" />
                  </div>
                  <Button type="submit" className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : t('Verify Email & Continue')}
                  </Button>
                  <p className="text-center text-gray-500 text-sm">
                    {t("Already a seeker?")} <button type="button" onClick={() => setCurrentView('signin')} className="text-[#ff6b35] font-bold hover:underline">{t("Sign In")}</button>
                  </p>
                  {error && <BottomError msg={error} />}
                </form>
              ) : (
                <form onSubmit={handleVerifySignupOtp} className="space-y-6">
                  <div className="space-y-4 text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t("A 6-digit verification code has been sent to")} <br />
                      <span className="font-bold text-[#ff6b35]">{email}</span>
                    </p>
                    
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signupOtpValue}
                        onChange={(value) => setSignupOtpValue(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                          <InputOTPSlot index={1} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                          <InputOTPSlot index={2} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                          <InputOTPSlot index={3} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                          <InputOTPSlot index={4} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                          <InputOTPSlot index={5} className="w-10 h-12 md:w-12 md:h-14 text-xl border-[#ff6b35]/30" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && <FieldError msg={error} />}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20" 
                    disabled={isLoading || signupOtpValue.length !== 6}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : t('Verify & Create Account')}
                  </Button>

                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => {
                        setSignupStep('details');
                        setSignupOtpValue("");
                      }} 
                      className="text-sm text-gray-500 hover:text-[#ff6b35] transition-colors"
                    >
                      {t("Back to signup details")}
                    </button>
                  </div>
                  {error && <BottomError msg={error} />}
                </form>
              )}
              </div>

              {/* Scroll down hint overlay */}
              {showScrollHint && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-20"
                  style={{ background: theme === 'dark' ? 'linear-gradient(transparent, #12121a 70%)' : 'linear-gradient(transparent, white 70%)', padding: '24px 0 12px' }}>
                  <div className="flex flex-col items-center gap-1 animate-bounce">
                    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: '#ff6b35', fontWeight: 600 }}>Scroll</span>
                    <ChevronDown className="w-5 h-5 text-[#ff6b35] -mt-1" />
                    <ChevronDown className="w-5 h-5 text-[#ff6b35] -mt-3 opacity-60" />
                  </div>
                </div>
              )}
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
