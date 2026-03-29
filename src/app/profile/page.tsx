"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, Calendar, Shield, LogOut, Loader2, UserCircle, 
  Sparkles, MapPin, Globe, Clock, CalendarDays, CheckCircle2, 
  XCircle, Edit3, Mail, Lock, ShieldCheck, Zap, CreditCard, AlertCircle, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { toast } from "sonner";
import Script from "next/script";
import { calculatePanchang } from "@/lib/panchang";

export default function ProfilePage() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const { user, loading: authLoading, signOut } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    phone: "",
    gender: "",
    address: "",
    city: ""
  });
  const router = useRouter();

  const handleRescheduleSubmit = async (bookingId: string) => {
    setIsSubmittingReschedule(true);
    try {
      const res = await fetch("/api/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          reason: rescheduleReason,
          requested_date: rescheduleDate || null,
          requested_time: rescheduleTime || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(language === 'gu' ? 'રિશેડ્યૂલ વિનંતી મોકલવામાં આવી!' : language === 'hi' ? 'रिशेड्यूल अनुरोध भेजा गया!' : 'Reschedule request sent!');
        setRescheduleBookingId(null);
        setRescheduleReason("");
        setRescheduleDate("");
        setRescheduleTime("");
      } else {
        toast.error(result.error || "Failed to send request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  const fetchUserBookings = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });
      
      if (!error) setUserBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchUserAlerts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/user-alerts", {
        headers: { 
          "Authorization": `Bearer ${session?.access_token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setAlerts(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  const handleMarkAlertAsRead = async (alertId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/user-alerts", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ alertId }),
      });
      const result = await response.json();
      if (result.success) {
        setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_read: true } : a));
      }
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to update profile");
      
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      toast.success(t("Profile updated successfully!"));
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || t("Failed to update profile"));
    } finally {
      setIsLoading(false);
    }
  };

    const getVedicSigns = (dob: string, tob?: string) => {
      if (!dob || dob === "Not specified" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
      try {
          const [year, month, day] = dob.split('-').map(Number);
          let hours = 8, minutes = 0;
          if (tob && tob !== "Not specified" && /^\d{2}:\d{2}/.test(tob)) {
              const [h, m] = tob.split(':').map(Number);
              hours = isNaN(h) ? 8 : h; 
              minutes = isNaN(m) ? 0 : m;
          }
          
          if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

          // Use Date.UTC to avoid local timezone issues
          const utcTimestamp = Date.UTC(year, month - 1, day, hours, minutes) - (5.5 * 60 * 60 * 1000);
          const utcBirth = new Date(utcTimestamp);
          
          const panchang = calculatePanchang(utcBirth);
          if (!panchang || !panchang.sunRashi || !panchang.moonRashi) return null;

          return {
              sun: panchang.sunRashi,
              moon: panchang.moonRashi
          };
      } catch (e) {
          console.error("Vedic signs calc error:", e);
          return null;
      }
    };

  useEffect(() => {
    async function getProfile() {
      if (authLoading) return;
      
      if (!user) {
        router.push("/signin");
        return;
      }

      try {
        if (user.email) {
          fetchUserBookings(user.email);
          fetchUserAlerts();
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        if (profileData) {
          setProfile(profileData);
          setEditForm({
            name: profileData.name || user.user_metadata?.full_name || "",
            dob: profileData.dob || user.user_metadata?.dob || "",
            tob: profileData.tob || user.user_metadata?.tob || "",
            pob: profileData.pob || user.user_metadata?.pob || "",
            phone: profileData.phone || user.user_metadata?.phone_number || "",
            gender: profileData.gender || user.user_metadata?.gender || "",
            address: profileData.address || "",
            city: profileData.city || ""
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getProfile();
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsSignOutLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        await supabase.auth.signOut();
        toast.success(t("Account deleted successfully"));
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.error || t("Failed to delete account"));
      }
    } catch {
      toast.error(t("Something went wrong"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-background'}`}>
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff6b35] mx-auto" />
          <p className="font-[family-name:var(--font-cinzel)] text-[#ff6b35] animate-pulse">{t("Connecting to the Stars")}</p>
        </div>
      </div>
    );
  }

  const profileName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Seeker";
  const profilePhone = profile?.phone || user?.user_metadata?.phone_number || "Not linked";
  const profileGender = profile?.gender || user?.user_metadata?.gender || "Not specified";
  
    const defaultBoyPic = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/08a15695-f57b-4aed-b5f6-2cbce14746cf/image-1770399458068.png?width=8000&height=8000&resize=contain";
  const defaultGirlPic = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-25-000158-1766601772966.png?width=8000&height=8000&resize=contain";
  const defaultCoverPic = "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=2000";
  
  const profilePic = profile?.profile_pic || user?.user_metadata?.profile_pic || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || 
    (profileGender?.toLowerCase() === 'female' ? defaultGirlPic : defaultBoyPic);

    const birthDate = profile?.dob || user?.user_metadata?.dob || "Not specified";
    const birthTime = profile?.tob || user?.user_metadata?.tob || "Not specified";
    const vedicSigns = getVedicSigns(birthDate, birthTime);

    const getTranslatedSign = (item: { english: string; hindi: string; gujarati: string }) => {
        if (!item) return "Unknown";
        if (language === 'gu') return item.gujarati || "Unknown";
        if (language === 'hi') return item.hindi || "Unknown";
        return item.english ? item.english.split(' (')[0] : "Unknown";
    };


  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0f] text-[#f5f0e8]' : 'bg-[#fdfbf7] text-[#4a3f35]'}`}>
        <Script src="https://cdn.uropay.me/uropay-embed.min.js" strategy="lazyOnload" />
        <Navbar />
      
        <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12 md:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-32 sm:mb-24"
          >
            <div className="h-36 sm:h-48 md:h-72 rounded-2xl sm:rounded-[3rem] overflow-hidden relative shadow-2xl">
              <img src={defaultCoverPic} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            <div className="absolute -bottom-24 sm:-bottom-16 left-3 right-3 sm:left-8 sm:right-8 flex flex-col items-center md:flex-row md:items-end gap-4 sm:gap-6">
              <div className="relative group">
                <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-2xl sm:rounded-[2.5rem] border-4 sm:border-[8px] ${theme === 'dark' ? 'border-[#0a0a0f]' : 'border-white'} overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105`}>
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left mb-2 sm:mb-4 w-full">
                <div className="flex flex-col items-center md:flex-row md:items-end gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold drop-shadow-lg break-words max-w-full">
                    {profileName}
                  </h1>
                  <Badge className="bg-[#ff6b35] text-white px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    {t("Verified Seeker")}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium opacity-70 break-all">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff6b35] flex-shrink-0" /> <span className="truncate max-w-[200px] sm:max-w-none">{user?.email}</span>
                  </span>
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium opacity-70">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#ff6b35] flex-shrink-0" /> {profilePhone}
                  </span>
                </div>
              </div>

                <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-xl sm:rounded-2xl h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-bold shadow-lg shadow-[#ff6b35]/20"
                  >
                    {isEditing ? t("Cancel") : <><Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> {t("Edit")}</>}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-xl sm:rounded-2xl h-10 sm:h-12 px-4 sm:px-6 font-bold"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-600/30 text-red-600 hover:bg-red-600/10 rounded-xl sm:rounded-2xl h-10 sm:h-12 px-4 sm:px-6 font-bold"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Delete Account Confirmation Modal */}
                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl ${theme === 'dark' ? 'bg-[#12121a] border border-red-500/20' : 'bg-white border border-red-200'}`}
                      >
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-500" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-[family-name:var(--font-cinzel)] font-bold text-red-500">
                            {t("Delete Account")}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            {t("This will permanently delete your account, all bookings, enquiries, and personal data. This action cannot be undone.")}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs font-bold opacity-60">
                              {t("Type DELETE to confirm")}
                            </Label>
                            <Input
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="DELETE"
                              className={`mt-1 h-12 rounded-xl border-2 text-center font-mono font-bold text-lg tracking-widest ${
                                deleteConfirmText === "DELETE" 
                                  ? "border-red-500 text-red-500" 
                                  : theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                              className="flex-1 h-12 rounded-xl font-bold"
                            >
                              {t("Cancel")}
                            </Button>
                            <Button
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmText !== "DELETE" || isDeleting}
                              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-40"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <><Trash2 className="w-4 h-4 mr-2" /> {t("Delete Forever")}</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mt-28 sm:mt-24">
            <div className="space-y-4 sm:space-y-8 order-2 lg:order-1">
              {alerts.length > 0 && (
                <Card className={`overflow-hidden rounded-2xl sm:rounded-[2.5rem] border-none shadow-xl ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'}`}>
                  <CardContent className="p-4 sm:p-8">
                    <h3 className="text-xs sm:text-sm font-black text-[#ff6b35] uppercase mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 tracking-[0.2em]">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> {t("Cosmic Alerts")}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {alerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${alert.is_read ? 'opacity-60 grayscale' : 'border-[#ff6b35]/30 bg-[#ff6b35]/5'} ${theme === 'dark' ? 'bg-white/5' : 'bg-[#ff6b35]/5'}`}
                          onClick={() => !alert.is_read && handleMarkAlertAsRead(alert.id)}
                        >
                          <div className="flex justify-between items-start gap-3 sm:gap-4">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs sm:text-sm">{alert.title}</h4>
                              <p className="text-[10px] sm:text-xs mt-1 opacity-80 break-words">{alert.message}</p>
                              <p className="text-[9px] sm:text-[10px] mt-2 opacity-40">{new Date(alert.created_at).toLocaleString()}</p>
                            </div>
                            {!alert.is_read && <Badge className="bg-[#ff6b35] text-white text-[7px] sm:text-[8px] uppercase flex-shrink-0">{t("New")}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className={`overflow-hidden rounded-2xl sm:rounded-[2.5rem] border-none shadow-xl ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'}`}>
                <CardContent className="p-4 sm:p-8">
                  <h3 className="text-xs sm:text-sm font-black text-indigo-400 uppercase mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3 tracking-[0.2em]">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> {t("Soul Analytics")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#ff6b35]/5 border border-[#ff6b35]/10 text-center col-span-2">
                      <p className="text-2xl sm:text-3xl font-black text-[#ff6b35]">{userBookings.length}</p>
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold opacity-40 mt-1">{t("Total Consultations")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4 sm:space-y-8 order-1 lg:order-2">
            {isEditing ? (
              <Card className={`overflow-hidden rounded-2xl sm:rounded-[3rem] border-none shadow-2xl ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'}`}>
                <CardHeader className="p-4 sm:p-10 pb-0">
                  <CardTitle className="font-[family-name:var(--font-cinzel)] text-xl sm:text-3xl text-[#ff6b35]">{t("Update Identity")}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{t("Align your earthly details with the cosmic flow")}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-10">
                  <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Full Name")}</Label>
                        <Input 
                          className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35] bg-opacity-50"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Gender")}</Label>
                        <select 
                          className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 px-4 text-sm sm:text-base ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-50'} focus:border-[#ff6b35] outline-none`}
                          value={editForm.gender}
                          onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                        >
                          <option value="male">{t("male")}</option>
                          <option value="female">{t("female")}</option>
                          <option value="other">{t("other")}</option>
                        </select>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Phone")}</Label>
                        <Input 
                          className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Birth Date")}</Label>
                          <Input 
                            type="date"
                            className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                            value={editForm.dob}
                            onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Birth Time")}</Label>
                          <Input 
                            type="time"
                            className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                            value={editForm.tob}
                            onChange={(e) => setEditForm({...editForm, tob: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Birth Place")}</Label>
                          <Input 
                            className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                            value={editForm.pob}
                            onChange={(e) => setEditForm({...editForm, pob: e.target.value})}
                          />
                        </div>
                          <div className="space-y-2 sm:space-y-3 sm:col-span-1">
                            <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("Address")}</Label>
                            <Input 
                              className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                              value={editForm.address}
                              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2 sm:space-y-3 sm:col-span-1">
                            <Label className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 ml-2">{t("City")}</Label>
                            <Input 
                              className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 focus:border-[#ff6b35]"
                              value={editForm.city}
                              onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                            />
                          </div>
                        </div>
                    <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] h-12 sm:h-16 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-[#ff6b35]/30">
                      {t("Save Cosmic Identity")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <Card className={`rounded-2xl sm:rounded-[2.5rem] border shadow-xl ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'}`}>
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#ff6b35] to-[#ffa07a]" />
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="font-[family-name:var(--font-cinzel)] text-lg sm:text-2xl flex items-center gap-2 sm:gap-3 text-[#ff6b35]">
                      <UserCircle className="w-5 h-5 sm:w-6 sm:h-6" /> {t("Cosmic Identity")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-[#ff6b35]/5">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Gender")}</span>
                      <span className="font-bold text-sm sm:text-base capitalize">{profileGender}</span>
                    </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-[#ff6b35]/5">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Status")}</span>
                        <span className="text-[10px] sm:text-xs font-black text-[#ff6b35] uppercase">{t("Active Seeker")}</span>
                      </div>
                      <div className="flex justify-between items-start py-2 sm:py-3 border-b border-[#ff6b35]/5">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40 mt-1">{t("Address")}</span>
                        <span className="font-bold text-xs sm:text-sm text-right max-w-[150px] break-words">{profile?.address || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Joined")}</span>
                        <span className="font-bold text-sm sm:text-base">{new Date(user?.created_at).toLocaleDateString()}</span>
                      </div>
                  </CardContent>
                </Card>

                <Card className={`rounded-2xl sm:rounded-[2.5rem] border shadow-xl ${theme === 'dark' ? 'bg-[#12121a] border-purple-500/20' : 'bg-white border-purple-500/10'}`}>
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="font-[family-name:var(--font-cinzel)] text-lg sm:text-2xl flex items-center gap-2 sm:gap-3 text-purple-500">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6" /> {t("Planetary Alignment")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center py-2 sm:py-3 border-b border-purple-500/5">
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Date")}</span>
                      <span className="font-bold text-sm sm:text-base">{birthDate}</span>
                    </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-purple-500/5">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Time")}</span>
                        <span className="font-bold text-sm sm:text-base">{birthTime || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-purple-500/5">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Place")}</span>
                        <span className="font-bold text-sm sm:text-base capitalize">{profile?.pob || "Not specified"}</span>
                      </div>
                        <div className="flex justify-between items-center py-2 sm:py-3 border-b border-purple-500/5">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Surya Sign")}</span>
                          <Badge className="bg-rose-500 text-white capitalize text-xs sm:text-sm">{vedicSigns ? getTranslatedSign(vedicSigns.sun) : "Unknown"}</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 sm:py-3">
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">{t("Chandra Sign")}</span>
                          <Badge className="bg-indigo-500 text-white capitalize text-xs sm:text-sm">{vedicSigns ? getTranslatedSign(vedicSigns.moon) : "Unknown"}</Badge>
                        </div>

                  </CardContent>
                </Card>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center px-1 sm:px-2">
                <h3 className="text-lg sm:text-2xl font-[family-name:var(--font-cinzel)] font-bold text-[#ff6b35] flex items-center gap-2 sm:gap-3">
                  <CalendarDays className="w-5 h-5 sm:w-7 sm:h-7" /> {t("Updates")}
                </h3>
              </div>
              
              {userBookings.length === 0 ? (
                <Card className={`rounded-2xl sm:rounded-[3rem] border-none shadow-xl p-8 sm:p-16 text-center ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'}`}>
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-[#ff6b35]/20 mx-auto mb-4 sm:mb-6" />
                  <p className="opacity-40 font-medium text-sm sm:text-lg">{t("The stars are waiting for your first step.")}</p>
                  <Button 
                    onClick={() => router.push('/booking')}
                    className="mt-6 sm:mt-8 bg-[#ff6b35] hover:bg-[#ff8c5e] text-white rounded-xl sm:rounded-2xl px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-black uppercase tracking-widest shadow-xl shadow-[#ff6b35]/20"
                  >
                    {t("Book Your Session")}
                  </Button>
                </Card>
              ) : (
              <div className="grid gap-4 sm:gap-6">
                    {userBookings.map((booking) => (
                      <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Card className={`overflow-hidden rounded-xl sm:rounded-[2.5rem] border shadow-xl ${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/10'}`}>
                          <CardContent className="p-4 sm:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                              <div className="flex items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-[1.5rem] flex-shrink-0 ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-[#ff6b35]/10 text-[#ff6b35]'}`}>
                                  {booking.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" /> : booking.status === 'cancelled' ? <XCircle className="w-5 h-5 sm:w-7 sm:h-7" /> : <Clock className="w-5 h-5 sm:w-7 sm:h-7" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-black text-base sm:text-xl capitalize tracking-tight break-words">{booking.service_type} {t("Consultation")}</h4>
                                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm opacity-50 mt-1 font-bold">
                                    <span>{booking.booking_date}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{booking.booking_time}</span>
                                  </div>
                                  {booking.invoice_number && (
                                    <p className="text-[10px] sm:text-xs font-mono font-bold text-[#ff6b35] mt-2">{t("Invoice")}: {booking.invoice_number}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto">
                                <div className="text-left sm:text-right">
                                  <Badge className={`capitalize ${booking.status === 'confirmed' ? 'bg-green-500' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-[#ff6b35]'} text-white px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase`}>
                                    {t(booking.status)}
                                  </Badge>
                                  <p className="text-xs font-black opacity-40 mt-1 sm:mt-2">₹{booking.amount}</p>
                                </div>
                              </div>
                            </div>

                            {/* Complete Payment Section for pending/failed payments */}
                            {(booking.payment_status === 'pending' || booking.payment_status === 'failed') && booking.status !== 'cancelled' && (
                              <div className="mt-4 sm:mt-6">
                                {expandedPaymentId === booking.id ? (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'bg-[#0a0a0f] border-[#ff6b35]/30' : 'bg-[#fff7ed] border-[#ff6b35]/30'}`}
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-[#ff6b35]" />
                                        <span className="font-bold text-sm sm:text-base">
                                          {language === 'gu' ? 'ચુકવણી પૂર્ણ કરો' : language === 'hi' ? 'भुगतान पूर्ण करें' : 'Complete Payment'}
                                        </span>
                                      </div>
                                      <span className="text-xl sm:text-2xl font-black text-[#ff6b35]">₹{booking.amount}</span>
                                    </div>

                                    <div className="flex justify-center">
                                      <div className="w-full">
                                        {booking.service_type === 'online' ? (
                                          <a 
                                            href="https://urpy.link/D9kGay"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-14 rounded-xl text-lg font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95" 
                                          >
                                            {language === 'gu' ? '₹501 ચૂકવો' : language === 'hi' ? '₹501 भुगतान करें' : 'Pay ₹501'}
                                          </a>
                                        ) : booking.service_type === 'home' && booking.amount <= 1101 ? (
                                          <a 
                                            href="#" 
                                            className="uropay-btn w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-14 rounded-xl text-lg font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95" 
                                            data-uropay-api-key="8F7R1DGSMX1EYI5LEVLFL8NLZQM8EKAE" 
                                            data-uropay-button-id="ALPHA279545" 
                                            data-uropay-environment="LIVE" 
                                            data-uropay-amount="1101"
                                            data-uropay-success-redirect-url="https://www.katyaayaniastrologer.com/payment-success"
                                            data-uropay-failure-redirect-url="https://www.katyaayaniastrologer.com/payment-failed"
                                          >
                                            {language === 'gu' ? '₹1101 ચૂકવો' : language === 'hi' ? '₹1101 भुगतान करें' : 'Pay ₹1101'}
                                          </a>
                                        ) : booking.service_type === 'home' && booking.amount > 1101 ? (
                                          <a 
                                            href="#" 
                                            className="uropay-btn w-full inline-flex items-center justify-center bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-14 rounded-xl text-lg font-bold shadow-xl shadow-[#ff6b35]/30 transition-all active:scale-95" 
                                            data-uropay-api-key="8F7R1DGSMX1EYI5LEVLFL8NLZQM8EKAE" 
                                            data-uropay-button-id="ALPHA413457" 
                                            data-uropay-environment="LIVE" 
                                            data-uropay-amount="2101"
                                            data-uropay-success-redirect-url="https://www.katyaayaniastrologer.com/payment-success"
                                            data-uropay-failure-redirect-url="https://www.katyaayaniastrologer.com/payment-failed"
                                          >
                                            {language === 'gu' ? '₹2101 ચૂકવો' : language === 'hi' ? '₹2101 भुगतान करें' : 'Pay ₹2101'}
                                          </a>
                                        ) : (
                                          <Button 
                                            onClick={() => router.push(`/booking?booking_id=${booking.id}`)}
                                            className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-14 rounded-xl text-lg font-bold shadow-xl shadow-[#ff6b35]/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                                          >
                                            <CreditCard className="w-5 h-5" />
                                            {language === 'gu' ? `₹${booking.amount} ચૂકવો` : language === 'hi' ? `₹${booking.amount} भुगतान करें` : `Pay ₹${booking.amount}`}
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <p className={`mt-4 text-xs font-medium text-center ${theme === 'dark' ? 'text-amber-500' : 'text-amber-700'}`}>
                                      <AlertCircle className="w-3 h-3 inline mr-1" />
                                      {language === 'gu' 
                                        ? 'ચુકવણી પછી રિસીપ્ટનો સ્ક્રીનશોટ રાખો.' 
                                        : language === 'hi' 
                                        ? 'भुगतान के बाद रसीद का स्क्रीनशॉट रखें।' 
                                        : 'Keep a screenshot of the receipt after payment.'}
                                    </p>

                                    <Button 
                                      variant="ghost" 
                                      onClick={() => setExpandedPaymentId(null)} 
                                      className="w-full mt-3 text-xs opacity-60"
                                    >
                                      {language === 'gu' ? 'બંધ કરો' : language === 'hi' ? 'बंद करें' : 'Close'}
                                    </Button>
                                  </motion.div>
                                ) : (
                                  <Button 
                                    onClick={() => setExpandedPaymentId(booking.id)}
                                    className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-[#ff6b35]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                  >
                                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {language === 'gu' ? 'ચુકવણી પૂર્ણ કરો' : language === 'hi' ? 'भुगतान पूर्ण करें' : 'Complete Payment'}
                                  </Button>
                                )}
                              </div>
                              )}

                              {/* Reschedule Button */}
                              {booking.status !== 'cancelled' && (
                                <div className="mt-4">
                                  {rescheduleBookingId === booking.id ? (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'bg-[#0a0a0f] border-amber-500/30' : 'bg-amber-50 border-amber-400/30'}`}
                                    >
                                      <div className="flex items-center gap-2 mb-4">
                                        <CalendarDays className="w-5 h-5 text-amber-500" />
                                        <span className="font-bold text-sm sm:text-base">
                                          {language === 'gu' ? 'રિશેડ્યૂલ વિનંતી' : language === 'hi' ? 'रिशेड्यूल अनुरोध' : 'Reschedule Request'}
                                        </span>
                                      </div>
                                      <div className="space-y-3">
                                        <div>
                                          <Label className="text-xs font-bold opacity-60">
                                            {language === 'gu' ? 'કારણ' : language === 'hi' ? 'कारण' : 'Reason'}
                                          </Label>
                                          <textarea
                                            value={rescheduleReason}
                                            onChange={(e) => setRescheduleReason(e.target.value)}
                                            placeholder={language === 'gu' ? 'રિશેડ્યૂલ કરવાનું કારણ...' : language === 'hi' ? 'रिशेड्यूल का कारण...' : 'Reason for rescheduling...'}
                                            className={`w-full p-3 rounded-xl border text-sm min-h-[80px] resize-none ${theme === 'dark' ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200'}`}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <Label className="text-xs font-bold opacity-60">
                                              {language === 'gu' ? 'નવી તારીખ (વૈકલ્પિક)' : language === 'hi' ? 'नई तारीख (वैकल्पिक)' : 'New Date (Optional)'}
                                            </Label>
                                            <Input
                                              type="date"
                                              value={rescheduleDate}
                                              onChange={(e) => setRescheduleDate(e.target.value)}
                                              className={`rounded-xl ${theme === 'dark' ? 'bg-[#12121a] border-white/10' : ''}`}
                                            />
                                          </div>
                                          <div>
                                            <Label className="text-xs font-bold opacity-60">
                                              {language === 'gu' ? 'નવો સમય (વૈકલ્પિક)' : language === 'hi' ? 'नया समय (वैकल्पिक)' : 'New Time (Optional)'}
                                            </Label>
                                            <Input
                                              type="time"
                                              value={rescheduleTime}
                                              onChange={(e) => setRescheduleTime(e.target.value)}
                                              className={`rounded-xl ${theme === 'dark' ? 'bg-[#12121a] border-white/10' : ''}`}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            onClick={() => handleRescheduleSubmit(booking.id)}
                                            disabled={isSubmittingReschedule || !rescheduleReason.trim()}
                                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white h-11 rounded-xl font-bold"
                                          >
                                            {isSubmittingReschedule ? (
                                              <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                              language === 'gu' ? 'વિનંતી મોકલો' : language === 'hi' ? 'अनुरोध भेजें' : 'Send Request'
                                            )}
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            onClick={() => { setRescheduleBookingId(null); setRescheduleReason(""); setRescheduleDate(""); setRescheduleTime(""); }}
                                            className="h-11 rounded-xl"
                                          >
                                            {language === 'gu' ? 'રદ કરો' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                                          </Button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      onClick={() => setRescheduleBookingId(booking.id)}
                                      className={`w-full h-11 rounded-xl text-sm font-bold border-2 ${theme === 'dark' ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-amber-400/40 text-amber-600 hover:bg-amber-50'}`}
                                    >
                                      <CalendarDays className="w-4 h-4 mr-2" />
                                      {language === 'gu' ? 'રિશેડ્યૂલ કરો' : language === 'hi' ? 'रिशेड्यूल करें' : 'Request Reschedule'}
                                    </Button>
                                  )}
                                </div>
                              )}
                              </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
}
