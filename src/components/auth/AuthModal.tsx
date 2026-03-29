"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, LogIn, UserPlus, Mail, User, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [success, setSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<string | null>(null);

  // Common fields for both signin & signup
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setError("");
  }, [currentView]);

  useEffect(() => {
    if (authView) {
      setCurrentView(authView);
      setError("");
    }
  }, [authView]);

  const resetFields = () => {
    setFullName("");
    setDob("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  // ─── SIGN UP ───
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!fullName.trim()) throw new Error("Please enter your full name.");
      if (!dob) throw new Error("Please enter your date of birth.");
      if (!email.trim()) throw new Error("Please enter your email.");

      const res = await fetch("/api/auth/signup-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), dob, email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed.");

      // Set session from returned tokens
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        hideAuthModal();
        resetFields();
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── SIGN IN ───
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!fullName.trim()) throw new Error("Please enter your full name.");
      if (!dob) throw new Error("Please enter your date of birth.");
      if (!email.trim()) throw new Error("Please enter your email.");

      const res = await fetch("/api/auth/login-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), dob, email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      // Set session from returned tokens
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        hideAuthModal();
        resetFields();
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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

  // ─── Shared form fields ───
  const FormFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Full Name")}</Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="pl-10 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
            placeholder={t("Enter your full name")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Date of Birth")}</Label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="pl-10 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">{t("Email Address")}</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-14 rounded-2xl border-[#ff6b35]/30 focus:border-[#ff6b35]"
            placeholder="your@email.com"
          />
        </div>
      </div>
    </>
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

            <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-3xl bg-[#ff6b35]/10 mb-4">
                  {currentView === 'signin' ? (
                    <LogIn className="w-8 h-8 text-[#ff6b35]" />
                  ) : (
                    <UserPlus className="w-8 h-8 text-[#ff6b35]" />
                  )}
                </div>
                <h2 className={`text-3xl font-[family-name:var(--font-cinzel)] font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-[#2d1810]'
                }`}>
                  {success ? t("Success!") : currentView === 'signin' ? t("Welcome Back") : t("Begin Your Journey")}
                </h2>
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {success
                    ? t("You're all set!")
                    : currentView === 'signin'
                      ? t("Enter your name, DOB and email to sign in")
                      : t("Create your account in seconds")}
                </p>
              </div>

              {/* Success state */}
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
                  <h3 className="text-2xl font-bold text-green-500">
                    {currentView === 'signin' ? t("Welcome Back!") : t("Account Ready")}
                  </h3>
                  <p className="text-gray-400 mt-2">{t("Redirecting you now...")}</p>
                </div>

              /* ═══ SIGN IN ═══ */
              ) : currentView === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-5">
                  <p className="text-center text-gray-500 -mt-2 mb-2">
                    {t("New here?")} <button type="button" onClick={() => { setCurrentView('signup'); resetFields(); }} className="text-[#ff6b35] font-bold hover:underline">{t("Create Account")}</button>
                  </p>

                  <FormFields />

                  {error && <FieldError msg={error} />}

                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : t('Sign In')}
                  </Button>

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

              /* ═══ SIGN UP ═══ */
              ) : (
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Google Sign Up first */}
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

                  <FormFields />

                  {error && <FieldError msg={error} />}

                  <Button
                    type="submit"
                    className="w-full h-14 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-2xl text-lg font-bold shadow-lg shadow-[#ff6b35]/20"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : t('Create Account')}
                  </Button>

                  <p className="text-center text-gray-500 text-sm">
                    {t("Already have an account?")} <button type="button" onClick={() => { setCurrentView('signin'); resetFields(); }} className="text-[#ff6b35] font-bold hover:underline">{t("Sign In")}</button>
                  </p>

                  {error && <BottomError msg={error} />}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
