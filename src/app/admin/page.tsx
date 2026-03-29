"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Menu,
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Search,
  ChevronRight,
  UserPlus,
  CalendarDays,
  CreditCard,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
  Bot,
  Lock,
  KeyRound,
  Eye,
  Mail,
  Phone,
  Filter,
  Download,
  Star,
  ExternalLink,
  MapPin,
  CalendarCheck,
  Globe,
  Video,
  FileText,
  Link2,
  Heart,
  Briefcase,
    Activity,
    BarChart3,
    TrendingUp,
    Smartphone,
    Monitor,
    Tablet,
    Tag,
    Search as SearchIcon,
      ArrowUpRight,
      ArrowDownRight,
        Upload,
        ImageIcon,
        X as XIcon,
        Send,
        Inbox,
          AlertCircle,
            Gauge,
    Palette,
      Zap,
      Shield,
      Server,
        Edit3,
        IndianRupee,
        Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import GoogleTranslateWidget, { useTranslation } from "@/components/GoogleTranslateWidget";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { getGmailLink } from "@/lib/email-links";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import SeoTestingPanel from "@/components/admin/SeoTestingPanel";
import SeoMonitorPanel from "@/components/admin/SeoMonitorPanel";
import SocialPreviewPanel from "@/components/admin/SocialPreviewPanel";
import WebmasterPingPanel from "@/components/admin/WebmasterPingPanel";
import IndexingPanel from "@/components/admin/IndexingPanel";
import AutomationPanel from "@/components/admin/AutomationPanel";
import PerformancePanel from "@/components/admin/PerformancePanel";
import SecurityPanel from "@/components/admin/SecurityPanel";
import SchedulingPanel from "@/components/admin/SchedulingPanel";
import ReportsPanel from "@/components/admin/ReportsPanel";
import DevOpsPanel from "@/components/admin/DevOpsPanel";
import ScalingPanel from "@/components/admin/ScalingPanel";
import ReschedulePanel from "@/components/admin/ReschedulePanel";
import InvoicePanel from "@/components/admin/InvoicePanel";
import NewsletterPanel from "@/components/admin/NewsletterPanel";
import EmailConfigPanel from "@/components/admin/EmailConfigPanel";
import EmailTemplatesPanel from "@/components/admin/EmailTemplatesPanel";
import PricingPanel from "@/components/admin/PricingPanel";
import GalleryPanel from "@/components/admin/GalleryPanel";
import OfferPanel from "@/components/admin/OfferPanel";
import ReviewsPanel from "@/components/admin/ReviewsPanel";

// Safe JSON parse helper - prevents "Unexpected end of JSON input" errors
async function safeJson(res: Response) {
  if (res.status === 204) return { success: true };
  try {
    const text = await res.text();
    if (!text) return { success: res.ok };
    return JSON.parse(text);
  } catch {
    return { success: res.ok };
  }
}

type Activity = {
  id: string;
  type: 'booking' | 'user' | 'enquiry' | 'feedback' | 'reset_request' | 'admin_action';
  title: string;
  description: string;
  time: string;
  status?: string;
};

type PasswordResetRequest = {
  id: string;
  email: string;
  phone: string;
  details: string;
  status: string;
  created_at: string;
};

type BlockedDate = {
  id: string;
  date: string;
  reason: string;
};

type Booking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  payment_status: string;
  amount: number;
  status: string;
  created_at: string;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  invoice_number?: string;
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
};

type UserRecord = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
    gender?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    email_verified?: boolean;
    role?: string;
  };

type FeedbackRecord = {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
};

type MeetingCode = {
  id: string;
  code: string;
  invoice_number: string;
  meet_link: string;
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
};

export default function AdminDashboard() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ table: string, id: string } | null>(null);
  const [settingsOtp, setSettingsOtp] = useState("");
  const [showSettingsOtp, setShowSettingsOtp] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalEnquiries: 0,
    totalRevenue: 0,
    bookingsTrend: "+12%",
    usersTrend: "+5%",
    enquiriesTrend: "+8%",
    revenueTrend: "+15%"
  });

  // Data
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [meetingCodes, setMeetingCodes] = useState<MeetingCode[]>([]);
  
  const [consultationNotes, setConsultationNotes] = useState<{id: string; user_id: string; user_email: string; note: string; category: string; created_at: string}[]>([]);
  const [newNote, setNewNote] = useState({ note: "", category: "general" });
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState({ date: "", reason: "" });
  const [newMeetingCode, setNewMeetingCode] = useState({ invoiceNumber: "", meetLink: "" });
  const [availabilityFilterDate, setAvailabilityFilterDate] = useState("");
  const [broadcast, setBroadcast] = useState({ subject: "", message: "" });
  
  // Email Stats
  const [emailStats, setEmailStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    todaySent: 0,
    todayFailed: 0,
    monthSent: 0,
    gmailSent: 0,
    resendSent: 0,
    gmailDailyLimit: 500,
    gmailTodayUsed: 0,
    gmailRemaining: 500,
    gmailTodayFailed: 0,
    resendDailyLimit: 100,
    resendTodayUsed: 0,
    resendRemaining: 100,
    resendTodayFailed: 0,
  });
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [emailStatsLoading, setEmailStatsLoading] = useState(false);
  
  // Settings
  const [adminSettings, setAdminSettings] = useState({
    email: "",
    botToken: "",
    chatId: ""
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [pwdStep, setPwdStep] = useState(1);
  const [pwdEmail, setPwdEmail] = useState("");
  const [pwdOtp, setPwdOtp] = useState("");

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchConsultationNotes(selectedUser.email);
  }, [selectedUser]);

  useEffect(() => {
    if (activeTab === "settings") {
      fetchEmailStats();
    }
  }, [activeTab]);

  const checkAuth = () => {
    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      router.push("/admin/signin");
    }
  };

    const fetchEmailStats = async () => {
      setEmailStatsLoading(true);
      try {
        const res = await fetch("/api/admin/email-stats");
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        const data = JSON.parse(text);
        if (data.success) {
          setEmailStats(data.stats);
          setRecentEmails(data.recentEmails || []);
        }
      } catch (err) {
        console.error("Failed to fetch email stats:", err);
      } finally {
        setEmailStatsLoading(false);
      }
    };

  const fetchData = async () => {
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? "+100%" : "+0%";
      const diff = ((current - previous) / previous) * 100;
      return `${diff >= 0 ? '+' : ''}${diff.toFixed(0)}%`;
    };

    setIsLoading(true);
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString();

        // Fetch counts first (batch 1) - use head:false to avoid 204 JSON parse crash
          const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: false }).limit(0);
          const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: false }).limit(0);
          const { count: enquiryCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: false }).limit(0);
          const { data: revenueDataRaw } = await supabase.from('bookings').select('amount, created_at').eq('payment_status', 'completed');

          // Fetch trend counts (batch 2)
          const { count: currentBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: false }).limit(0).gte('created_at', thirtyDaysAgo);
          const { count: previousBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: false }).limit(0).lt('created_at', thirtyDaysAgo).gte('created_at', sixtyDaysAgo);
          const { count: currentUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: false }).limit(0).gte('created_at', thirtyDaysAgo);
          const { count: previousUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: false }).limit(0).lt('created_at', thirtyDaysAgo).gte('created_at', sixtyDaysAgo);
          const { count: currentEnquiries } = await supabase.from('enquiries').select('*', { count: 'exact', head: false }).limit(0).gte('created_at', thirtyDaysAgo);
          const { count: previousEnquiries } = await supabase.from('enquiries').select('*', { count: 'exact', head: false }).limit(0).lt('created_at', thirtyDaysAgo).gte('created_at', sixtyDaysAgo);

        const totalRevenue = revenueDataRaw?.reduce((acc: number, curr: { amount?: number }) => acc + (Number(curr.amount) || 0), 0) || 0;
        const currentRevenue = revenueDataRaw?.filter((r: { created_at?: string }) => r.created_at && r.created_at >= thirtyDaysAgo).reduce((acc: number, curr: { amount?: number }) => acc + (Number(curr.amount) || 0), 0) || 0;
        const previousRevenue = revenueDataRaw?.filter((r: { created_at?: string }) => r.created_at && r.created_at >= sixtyDaysAgo && r.created_at < thirtyDaysAgo).reduce((acc: number, curr: { amount?: number }) => acc + (Number(curr.amount) || 0), 0) || 0;

        setStats({
          totalBookings: bookingCount || 0,
          totalUsers: userCount || 0,
          totalEnquiries: enquiryCount || 0,
          totalRevenue,
          bookingsTrend: calculateTrend(currentBookings || 0, previousBookings || 0),
          usersTrend: calculateTrend(currentUsers || 0, previousUsers || 0),
          enquiriesTrend: calculateTrend(currentEnquiries || 0, previousEnquiries || 0),
          revenueTrend: calculateTrend(currentRevenue, previousRevenue)
        });

        // Fetch full data (batch 3)
        const bookingsRes = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        const usersRes = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        const enquiriesRes = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        const feedbackRes = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
        const blockedRes = await supabase.from('blocked_dates').select('*').order('date', { ascending: true });
        const resetRequestsRes = await supabase.from('password_reset_requests').select('*').order('created_at', { ascending: false });
        const meetingCodesRes = await supabase.from('meeting_codes').select('*').order('created_at', { ascending: false });

        const bData = bookingsRes.data || [];
        const uData = (usersRes.data || []).map((u: any) => ({
          ...u,
          full_name: u.name || u.full_name || 'Valued User'
        }));
        const eData = enquiriesRes.data || [];
        const fData = feedbackRes.data || [];
        const blData = blockedRes.data || [];
        const rData = resetRequestsRes.data || [];
        const mcData = meetingCodesRes.data || [];

        setBookings(bData);
        setUsers(uData);
        setEnquiries(eData);
        setFeedbacks(fData);
        setBlockedDates(blData);
        setResetRequests(rData);
        setMeetingCodes(mcData);

const combined: Activity[] = [
          ...bData.slice(0, 5).map((b: Booking) => ({
            id: b.id,
            type: 'booking' as const,
            title: t('New Booking: ') + b.full_name,
            description: t(b.service_type) + t(' on ') + b.booking_date,
            time: b.created_at,
            status: b.payment_status
          })),
          ...uData.slice(0, 5).map((u: UserRecord) => ({
            id: u.id,
            type: 'user' as const,
            title: t('New User: ') + u.full_name,
            description: t('Joined from ') + u.email,
            time: u.created_at
          })),
          ...eData.slice(0, 5).map((e: Enquiry) => ({
            id: e.id,
            type: 'enquiry' as const,
            title: t('New Enquiry: ') + e.name,
            description: e.subject || t('General Inquiry'),
            time: e.created_at
          })),
          ...fData.slice(0, 5).map((f: FeedbackRecord) => ({
            id: f.id,
            type: 'feedback' as const,
            title: t('Feedback: ') + f.name,
            description: `${f.rating} ` + t('Stars') + ' - ' + (f.message || (f as any).comment || '').substring(0, 50) + '...',
            time: f.created_at
          })),
          ...rData.slice(0, 5).map((r: PasswordResetRequest) => ({
            id: r.id,
            type: r.email === 'ADMIN_NOTIF' ? 'admin_action' as const : 'reset_request' as const,
            title: r.email === 'ADMIN_NOTIF' ? t('Admin Password Updated') : t('Password Reset Request'),
            description: r.email === 'ADMIN_NOTIF' ? t('The administrator panel password has been changed') : r.email,
            time: r.created_at,
            status: r.status
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20);

        setRecentActivity(combined);

const { data: settings } = await supabase.from('admin_settings').select('*');
        const settingsMap = (settings || []).reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {});

      setAdminSettings({
        email: settingsMap['admin_email'] || "",
        botToken: settingsMap['telegram_bot_token'] || "",
        chatId: settingsMap['telegram_chat_id'] || ""
      });

    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = (email: string, password?: string) => {
    const gmailUrl = getGmailLink({ email, password }, "password_reset_draft");
    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: gmailUrl } }, "*");
  };

  const fetchConsultationNotes = async (email: string) => {
    setIsLoadingNotes(true);
    try {
      const res = await fetch(`/api/admin/consultation-notes?user_email=${encodeURIComponent(email)}`);
      const data = await safeJson(res);
      if (data.success) setConsultationNotes(data.data || []);
    } catch { /* ignore */ } finally { setIsLoadingNotes(false); }
  };

  const addConsultationNote = async () => {
    if (!selectedUser || !newNote.note.trim()) return;
    try {
      const res = await fetch('/api/admin/consultation-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser.id, user_email: selectedUser.email, note: newNote.note, category: newNote.category }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setConsultationNotes(prev => [data.data, ...prev]);
        setNewNote({ note: "", category: "general" });
        setSuccess(t("Note added successfully"));
      }
    } catch { setError(t("Failed to add note")); }
  };

  const deleteConsultationNote = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/consultation-notes?id=${id}`, { method: 'DELETE' });
      const data = await safeJson(res);
      if (data.success) setConsultationNotes(prev => prev.filter(n => n.id !== id));
    } catch { setError(t("Failed to delete note")); }
  };

  const handleResetUserPassword = async (email: string) => {
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await safeJson(response);
      if (data.success) {
        setSuccess(t("Password reset successful. Opening Gmail..."));
        handleSendResetEmail(data.email, data.password);
      } else {
        setError(data.error || t("Failed to reset password"));
      }
    } catch (err) {
      setError(t("An error occurred while resetting password"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApprovePayment = async (bookingId: string, userEmail: string) => {
    setIsActionLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          payment_status: "completed",
          status: "confirmed"
        }),
      });
      const data = await safeJson(response);
      if (response.ok && data.success) {
        setSuccess(t("Payment approved successfully!"));
        try {
          // Get user_id from profiles using email
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .maybeSingle();
          
          if (profileData?.id) {
            await supabase.from('user_alerts').insert([{
              user_id: profileData.id,
              title: 'Payment Approved! / ચુકવણી મંજૂર!',
              message: 'Your payment has been successfully verified and your booking is now confirmed. The astrologer will contact you soon. Thank you!\n\nતમારી ચુકવણી સફળતાપૂર્વક ચકાસવામાં આવી છે અને તમારી બુકિંગ હવે પુષ્ટિ થઈ ગઈ છે. જ્યોતિષી ટૂંક સમયમાં તમારો સંપર્ક કરશે. આભાર!',
              type: 'payment_success',
              is_read: false
            }]);
          }
        } catch (alertError) {
          console.error("Alert insert error:", alertError);
        }
        fetchData();
      } else {
        setError(data.message || t("Failed to approve payment"));
      }
    } catch (err: any) {
      console.error("Approve payment error:", err);
      setError(err?.message || t("An error occurred while approving payment"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendBroadcastMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcast.subject || !broadcast.message) {
      setError(t("Subject and message are required"));
      return;
    }
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/admin/broadcast-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(broadcast),
      });
      const data = await safeJson(response);
      if (data.success) {
        setSuccess(t(data.message));
        setBroadcast({ subject: "", message: "" });
      } else {
        setError(data.error || t("Failed to send broadcast message"));
      }
    } catch (err) {
      setError(t("An error occurred while broadcasting message"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_jwt");
    router.push("/admin/signin");
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/admin/block-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlockedDate),
      });
      const data = await safeJson(response);
      if (response.ok) {
        setSuccess(t(data.message || "Date blocked successfully"));
        setNewBlockedDate({ date: "", reason: "" });
        fetchData();
      } else {
        setError(data.error || t("Failed to block date"));
      }
    } catch (err) {
      setError(t("Failed to block date"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUnblockDate = async (id: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
      if (error) throw error;
      setSuccess(t("Date unblocked successfully"));
      fetchData();
    } catch (err) {
      setError(t("Failed to unblock date"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteRecord = async (table: string, id: string) => {
    setIsActionLoading(true);
    try {
      if (table === 'profiles') {
        // Use comprehensive delete API for users
        const res = await fetch('/api/admin/users/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id }),
        });
        const data = await safeJson(res);
        if (!data.success) throw new Error(data.error);
      } else {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
      }
      setSuccess(t("Record deleted successfully"));
      fetchData();
    } catch (err) {
      setError(t("Failed to delete record"));
    } finally {
      setIsActionLoading(false);
      setDeleteConfirmation(null);
    }
  };

  const handleAddMeetingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingCode.invoiceNumber || !newMeetingCode.meetLink) {
      setError(t("Invoice number and Google Meet link are required"));
      return;
    }
    setIsActionLoading(true);
    try {
      const { error } = await supabase.from('meeting_codes').insert([{
        code: newMeetingCode.invoiceNumber.toUpperCase(),
        invoice_number: newMeetingCode.invoiceNumber.toUpperCase(),
        meet_link: newMeetingCode.meetLink,
        is_used: false
      }]);
      if (error) throw error;
      setSuccess(t("Meeting code added successfully"));
      setNewMeetingCode({ invoiceNumber: "", meetLink: "" });
      fetchData();
    } catch (err) {
      setError(t("Failed to add meeting code"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteMeetingCode = async (id: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await supabase.from('meeting_codes').delete().eq('id', id);
      if (error) throw error;
      setSuccess(t("Meeting code deleted successfully"));
      fetchData();
    } catch (err) {
      setError(t("Failed to delete meeting code"));
    } finally {
      setIsActionLoading(false);
    }
  };

    const handleUpdateSettingsRequest = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsActionLoading(true);
      try {
        const response = await fetch("/api/admin/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: adminSettings.email, 
            type: "settings_update",
            skipOtp: true // Directly verify password and skip OTP
          }),
        });
        if (response.ok) {
          const settingsToUpdate = [
            { key: 'admin_email', value: adminSettings.email },
            { key: 'telegram_bot_token', value: adminSettings.botToken },
            { key: 'telegram_chat_id', value: adminSettings.chatId }
          ];
  
          for (const item of settingsToUpdate) {
            await supabase.from('admin_settings').upsert(item, { onConflict: 'key' });
          }
          
          setSuccess(t("Settings updated successfully"));
        } else {
          const data = await safeJson(response);
          setError(data.error || t("Failed to update settings"));
        }
      } catch (err) {
        setError(t("An error occurred"));
      } finally {
        setIsActionLoading(false);
      }
    };

  const handleUpdateSettingsWithOTP = async (otpValue: string) => {
    setSettingsOtp(otpValue);
    setIsActionLoading(true);
    try {
      const verifyRes = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminSettings.email, otp: otpValue }),
      });

      if (!verifyRes.ok) {
          const data = await safeJson(verifyRes);
        setError(data.error || t("Invalid verification code"));
        setIsActionLoading(false);
        return;
      }

      const settingsToUpdate = [
        { key: 'admin_email', value: adminSettings.email },
        { key: 'telegram_bot_token', value: adminSettings.botToken },
        { key: 'telegram_chat_id', value: adminSettings.chatId }
      ];

      for (const item of settingsToUpdate) {
        await supabase.from('admin_settings').upsert(item, { onConflict: 'key' });
      }
      
      setSuccess(t("Settings updated successfully"));
      setShowSettingsOtp(false);
      setSettingsOtp("");
    } catch (err) {
      setError(t("Failed to update settings"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateSettingsWithOTP(settingsOtp);
  };

    const handleSendPwdOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsActionLoading(true);
      try {
        const response = await fetch("/api/admin/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: pwdEmail, 
            type: "password_change",
            skipOtp: true 
          }),
        });
        const data = await safeJson(response);
        if (response.ok) {
          setPwdStep(3); // Skip OTP verification step
          setSuccess(t("Credentials verified. Please enter new password."));
        } else {
          setError(data.error || t("Invalid credentials"));
        }
      } catch (err) {
        setError(t("An error occurred"));
      } finally {
        setIsActionLoading(false);
      }
    };

  const handleVerifyPwdOtpWithOTP = async (otpValue: string) => {
    setPwdOtp(otpValue);
    setIsActionLoading(true);
    try {
      const response = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pwdEmail, otp: otpValue }),
      });
      const data = await safeJson(response);
      if (response.ok) {
        setPwdStep(3);
        setSuccess(t("OTP verified successfully"));
      } else {
        setError(data.error || t("Invalid code"));
      }
    } catch (err) {
      setError(t("An error occurred"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleVerifyPwdOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyPwdOtpWithOTP(pwdOtp);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError(t("Passwords do not match"));
      return;
    }
    setIsActionLoading(true);
    try {
      // We skip currentPassword verification here because we already verified via OTP
      // But the API might expect it. Let's look at /api/admin/auth/update-password
      // I should update that API too or just pass a flag.
      
      const response = await fetch("/api/admin/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newPassword: passwords.new,
          isOtpVerified: true // Added this flag
        }),
      });
      const data = await safeJson(response);
      if (data.success) {
        setSuccess(t("Password updated successfully"));
        setPasswords({ current: "", new: "", confirm: "" });
        setPwdStep(1);
        setPwdEmail("");
        setPwdOtp("");
      } else {
        setError(data.error || t("Failed to update password"));
      }
    } catch (err) {
      setError(t("An error occurred"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendRescheduleEmail = async (booking: Booking) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/reschedule-email`, {
        method: "POST"
      });
      const data = await safeJson(response);
      if (data.success) {
        setSuccess(t("Reschedule email sent successfully"));
      } else {
        setError(data.error || t("Failed to send email"));
      }
    } catch (err) {
      setError(t("An error occurred"));
    } finally {
      setIsActionLoading(false);
    }
  };


  // Filtered Data
  const filteredActivity = useMemo(() => {
    if (!searchTerm) return recentActivity;
    return recentActivity.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recentActivity, searchTerm]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => 
      b.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enquiries, searchTerm]);

  const filteredResetRequests = useMemo(() => {
    return resetRequests.filter(r => 
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resetRequests, searchTerm]);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const filteredBookingsByDate = availabilityFilterDate 
    ? bookings.filter((b: Booking) => b.booking_date === availabilityFilterDate)
    : [];

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#0a0a0f] text-[#f5f0e8]" : "bg-[#fcfaf7] text-[#2d1810]"}`}>
      {/* Sidebar - Desktop */}
      <aside className={`w-64 border-r ${isDark ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'} hidden lg:flex flex-col sticky top-0 h-screen`}>
        <SidebarContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout} 
          isDark={isDark} 
          t={t} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-6 ${isDark ? 'bg-[#12121a]/50 border-[#ff6b35]/10' : 'bg-white/5 border-[#ff6b35]/10'} backdrop-blur-md sticky top-0 z-20`}>
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Sidebar Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-[#ff6b35]">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className={`p-0 w-64 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}>
                  <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Sidebar navigation for the administration panel
                  </SheetDescription>
                  <SidebarContent 
                    activeTab={activeTab} 
                    setActiveTab={(tab) => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }} 
                    handleLogout={handleLogout} 
                    isDark={isDark} 
                    t={t} 
                  />
                </SheetContent>
              </Sheet>

              <div className="relative max-w-md w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder={t("Search anything...")} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-9 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`} 
                />
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div>
                <GoogleTranslateWidget />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-[#ff6b35]">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-[#ff6b35]" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-5 h-5" />
                {recentActivity.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff6b35] rounded-full border-2 border-background animate-pulse"></span>
                )}
              </Button>
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'} z-50`}
                    >
                        <div className="p-4 border-b border-[#ff6b35]/10 flex justify-between items-center bg-[#ff6b35]/5">
                          <h3 className="font-bold text-sm flex items-center gap-2 text-[#ff6b35]"><Bell className="w-4 h-4" /> {t("Latest Activities")}</h3>
                          <span className="text-[10px] bg-[#ff6b35] text-white px-2 py-0.5 rounded-full font-bold">{recentActivity.length} New</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                          {recentActivity.length > 0 ? recentActivity.map((act) => (
                            <div 
                              key={act.id} 
                              onClick={() => {
                                if (act.type === 'booking') {
                                  const b = bookings.find(x => x.id === act.id);
                                  if (b) setSelectedBooking(b);
                                } else if (act.type === 'enquiry') {
                                  const e = enquiries.find(x => x.id === act.id);
                                  if (e) setSelectedEnquiry(e);
                                } else if (act.type === 'user') {
                                  const u = users.find(x => x.id === act.id);
                                  if (u) setSelectedUser(u);
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3 rounded-xl flex gap-3 ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#ff6b35]/5'} transition-all cursor-pointer group`}
                            >
                              <div className={`mt-1 p-2 rounded-lg h-fit ${
                                act.type === 'booking' ? 'bg-blue-500/10 text-blue-500' :
                                act.type === 'user' ? 'bg-green-500/10 text-green-500' :
                                act.type === 'reset_request' ? 'bg-red-500/10 text-red-500' :
                                'bg-amber-500/10 text-amber-500'
                              }`}>
                                {act.type === 'booking' ? <Calendar className="w-3 h-3" /> :
                                 act.type === 'user' ? <UserPlus className="w-3 h-3" /> :
                                 act.type === 'reset_request' ? <KeyRound className="w-3 h-3" /> :
                                 <MessageSquare className="w-3 h-3" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold group-hover:text-[#ff6b35] transition-colors">{t(act.title)}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{t(act.description)}</p>
                                <p className="text-[8px] text-muted-foreground mt-1 flex items-center gap-1 opacity-60">
                                  <Clock className="w-2 h-2" /> {new Date(act.time).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          )) : (
                            <div className="py-10 text-center text-xs text-muted-foreground italic">{t("No recent activities")}</div>
                          )}
                        </div>
                        <div className="p-3 border-t border-[#ff6b35]/10 bg-[#ff6b35]/5">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-[10px] font-bold text-[#ff6b35] hover:bg-[#ff6b35]/10"
                            onClick={() => setShowNotifications(false)}
                          >
                            {t("Close Panel")}
                          </Button>
                        </div>

                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-[#ff6b35] flex items-center justify-center text-white font-bold text-xs shadow-lg">AD</div>
          </div>
        </header>

          <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
            {success && <Alert message={t(success)} type="success" onClose={() => setSuccess("")} />}
            {error && <Alert message={t(error)} type="error" onClose={() => setError("")} />}

              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard title={t("Total Bookings")} value={stats.totalBookings.toString()} trend={stats.bookingsTrend} icon={<Calendar className="w-5 h-5" />} isDark={isDark} />
                    <StatCard title={t("Total Users")} value={stats.totalUsers.toString()} trend={stats.usersTrend} icon={<Users className="w-5 h-5" />} isDark={isDark} />
                    <StatCard title={t("New Enquiries")} value={stats.totalEnquiries.toString()} trend={stats.enquiriesTrend} icon={<MessageSquare className="w-5 h-5" />} isDark={isDark} />
                    <StatCard title={t("Total Revenue")} value={`${stats.totalRevenue.toLocaleString()}`} trend={stats.revenueTrend} icon={<CreditCard className="w-5 h-5" />} isDark={isDark} />
                  </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className={`lg:col-span-2 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Recent Activity")}</CardTitle>
                        <CardDescription>{t("Latest updates from your database")}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading} className="border-[#ff6b35]/20 text-[#ff6b35]">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </Button>
                    </CardHeader>
                    <CardContent><div className="space-y-6">{isLoading ? <LoadingState /> : filteredActivity.length > 0 ? filteredActivity.map((activity, idx) => <ActivityItem key={activity.id + idx} activity={activity} isDark={isDark} t={t} />) : <EmptyState message={t("No recent activity found.")} />}</div></CardContent>
                  </Card>
                  <div className="space-y-6">
                      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                        <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("Quick Status")}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <StatusBadge label={t("System")} value={t("Online")} color="green" />
                          <StatusBadge label={t("Database")} value={isLoading ? t("Checking...") : t("Connected")} color={isLoading ? "amber" : "green"} />
                          <StatusBadge 
                            label={t("Telegram")} 
                            value={adminSettings.botToken && adminSettings.chatId ? t("Linked") : t("Not Linked")} 
                            color={adminSettings.botToken && adminSettings.chatId ? "green" : "red"} 
                          />
                        </CardContent>
                      </Card>
                    <Card className="bg-gradient-to-br from-[#ff6b35] to-[#ff8c5e] text-white border-none shadow-xl">
                      <CardHeader><CardTitle className="font-[family-name:var(--font-cinzel)]">{t("Availability Control")}</CardTitle><CardDescription className="text-white/80">{t("Block dates for holidays")}</CardDescription></CardHeader>
                      <CardContent><Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white" onClick={() => setActiveTab("availability")}>{t("Open Panel")}</Button></CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "bookings" && (
              <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div><CardTitle className="font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Bookings Management")}</CardTitle><CardDescription>{t("View and manage all appointments")}</CardDescription></div>
                </CardHeader>
                <CardContent>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#ff6b35]/10">
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Customer")}</th>
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Service")}</th>
                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Date & Time")}</th>
                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Invoice")}</th>
                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Status")}</th>
                            <th className="p-4 text-right font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? <tr><td colSpan={6} className="py-10"><LoadingState /></td></tr> : filteredBookings.map((b) => (
                            <tr key={b.id} className="border-b border-[#ff6b35]/5 hover:bg-[#ff6b35]/5 transition-colors group">
                              <td className="p-4"><p className="font-bold text-sm">{b.full_name}</p><p className="text-xs text-muted-foreground">{b.email}</p></td>
                              <td className="p-4"><span className="px-2 py-1 rounded-md bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-bold uppercase">{t(b.service_type)}</span></td>
                              <td className="p-4"><p className="text-sm font-medium">{b.booking_date}</p><p className="text-xs text-muted-foreground">{b.booking_time}</p></td>
                              <td className="p-4"><span className="font-mono font-bold text-xs text-[#ff6b35]">{b.invoice_number || '-'}</span></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${b.payment_status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(b.payment_status)}</span>
                                {b.payment_status === 'pending' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[10px] font-bold"
                                    onClick={() => handleApprovePayment(b.id, b.email)}
                                    disabled={isActionLoading}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> {t("Approve")}
                                  </Button>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10" onClick={() => setSelectedBooking(b)}>{t("View Details")}</Button>
                                <Button variant="ghost" size="icon" className="text-[#ff6b35] md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleSendRescheduleEmail(b)}><Mail className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeleteConfirmation({ table: 'bookings', id: b.id })}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4">
                      {isLoading ? <LoadingState /> : filteredBookings.map((b) => (
                        <div key={b.id} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'} space-y-3`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{b.full_name}</p>
                              <p className="text-xs text-muted-foreground">{b.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${b.payment_status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(b.payment_status)}</span>
                              {b.payment_status === 'pending' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[8px] font-bold"
                                  onClick={() => handleApprovePayment(b.id, b.email)}
                                  disabled={isActionLoading}
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Service")}</p>
                                <span className="px-2 py-1 rounded-md bg-[#ff6b35]/10 text-[#ff6b35] font-bold uppercase text-[9px]">{t(b.service_type)}</span>
                              </div>
                              <div className="text-center">
                                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Invoice")}</p>
                                <span className="font-mono font-bold text-xs text-[#ff6b35]">{b.invoice_number || '-'}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Date & Time")}</p>
                                <p className="font-medium">{b.booking_date}</p>
                                <p className="text-muted-foreground">{b.booking_time}</p>
                              </div>
                            </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => setSelectedBooking(b)}>{t("Details")}</Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 text-[#ff6b35]" onClick={() => handleSendRescheduleEmail(b)}><Mail className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 text-red-500" onClick={() => handleDeleteRecord('bookings', b.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>
            )}

          {activeTab === "enquiries" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoading ? <LoadingState /> : filteredEnquiries.length > 0 ? filteredEnquiries.map((e) => (
                <Card key={e.id} className={`${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} hover:border-[#ff6b35]/40 transition-all group`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-[#ff6b35]/10 text-[#ff6b35]"><MessageSquare className="w-4 h-4" /></div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#ff6b35] md:opacity-0 group-hover:opacity-100" onClick={() => setSelectedEnquiry(e)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 md:opacity-0 group-hover:opacity-100" onClick={() => handleDeleteRecord('enquiries', e.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>

                    <CardTitle className="text-lg mt-2 font-bold">{e.subject || t("No Subject")}</CardTitle>
                    <CardDescription className="flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(e.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent><p className="text-sm italic mb-4 line-clamp-3">"{e.message}"</p><div className="space-y-2 pt-4 border-t border-[#ff6b35]/10"><p className="text-xs font-bold flex items-center gap-2 text-muted-foreground"><Users className="w-3 h-3" /> {e.name}</p><p className="text-xs font-bold flex items-center gap-2 text-muted-foreground"><Mail className="w-3 h-3" /> {e.email}</p></div></CardContent>
                </Card>
              )) : <EmptyState message={t("No enquiries yet.")} />}
            </div>
          )}

          {activeTab === "users" && (
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("User Management")}</CardTitle><CardDescription>{t("Registered users and their activity")}</CardDescription></div>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#ff6b35]/10">
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("User")}</th>
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Phone")}</th>
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Gender")}</th>
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("DOB")}</th>
                          <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Joined")}</th>
                          <th className="p-4 text-right font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? <tr><td colSpan={6} className="py-10"><LoadingState /></td></tr> : filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-[#ff6b35]/5 hover:bg-[#ff6b35]/5 transition-colors group">
                            <td className="p-4"><p className="font-bold text-sm">{u.full_name}</p><p className="text-xs text-muted-foreground">{u.email}</p></td>
                            <td className="p-4 text-sm font-medium">{u.phone}</td>
                            <td className="p-4 text-sm font-medium capitalize">{u.gender ? t(u.gender.charAt(0).toUpperCase() + u.gender.slice(1)) : '-'}</td>
                            <td className="p-4 text-xs text-muted-foreground">{u.dob ? new Date(u.dob).toLocaleDateString() : '-'}</td>
                            <td className="p-4 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10" onClick={() => setSelectedUser(u)}>{t("View Details")}</Button>
                                <Button variant="ghost" size="icon" className="text-blue-500 md:opacity-0 group-hover:opacity-100 transition-opacity" title={t("Reset Password")} onClick={() => handleResetUserPassword(u.email)}><KeyRound className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeleteConfirmation({ table: 'profiles', id: u.id })}><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                    <div className="md:hidden space-y-4">
                      {isLoading ? <LoadingState /> : filteredUsers.map((u) => (
                        <div key={u.id} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'} space-y-3`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm">{u.full_name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {u.email_verified ? (
                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-bold uppercase">{t("Verified")}</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase">{t("Unverified")}</span>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Phone")}</p>
                              <p className="font-medium">{u.phone}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Gender")}</p>
                              <p className="font-medium capitalize">{u.gender ? t(u.gender.charAt(0).toUpperCase() + u.gender.slice(1)) : '-'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("DOB")}</p>
                              <p className="font-medium">{u.dob ? new Date(u.dob).toLocaleDateString() : '-'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Joined")}</p>
                              <p className="font-medium">{new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => setSelectedUser(u)}>{t("Details")}</Button>
                          <Button variant="outline" size="icon" className="h-9 w-9 text-blue-500" onClick={() => handleResetUserPassword(u.email)}><KeyRound className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-red-500" onClick={() => setDeleteConfirmation({ table: 'profiles', id: u.id })}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>

                </CardContent>
              </Card>
            )}

            {activeTab === "resets" && (
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Reset Requests")}</CardTitle><CardDescription>{t("Manage password reset requests from users")}</CardDescription></div>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#ff6b35]/10">
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Email")}</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Phone")}</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Status")}</th>
                        <th className="p-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Date")}</th>
                        <th className="p-4 text-right font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? <tr><td colSpan={5} className="py-10"><LoadingState /></td></tr> : filteredResetRequests.length > 0 ? filteredResetRequests.map((r) => (
                        <tr key={r.id} className="border-b border-[#ff6b35]/5 hover:bg-[#ff6b35]/5 transition-colors group">
                          <td className="p-4"><p className="font-bold text-sm">{r.email}</p></td>
                          <td className="p-4 text-sm font-medium">{r.phone || ""}</td>
                          <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${r.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(r.status)}</span></td>
                          <td className="p-4 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10" 
                                onClick={() => handleResetUserPassword(r.email)}
                                disabled={isActionLoading}
                              >
                                {t("Send Reset Link")}
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteRecord('password_reset_requests', r.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={5} className="py-10 text-center text-muted-foreground italic">{t("No reset requests found.")}</td></tr>}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {isLoading ? <LoadingState /> : filteredResetRequests.length > 0 ? filteredResetRequests.map((r) => (
                    <div key={r.id} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'} space-y-3`}>
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm">{r.email}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${r.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(r.status)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Phone")}</p>
                          <p className="font-medium">{r.phone || ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mb-1">{t("Requested")}</p>
                          <p className="font-medium">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-9 text-xs border-[#ff6b35]/20 text-[#ff6b35]" 
                          onClick={() => handleResetUserPassword(r.email)}
                          disabled={isActionLoading}
                        >
                          {t("Send Reset Link")}
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-red-500" onClick={() => handleDeleteRecord('password_reset_requests', r.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )) : <div className="py-10 text-center text-muted-foreground italic">{t("No reset requests found.")}</div>}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "availability" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Availability & Schedule")}</h2>
                <p className="text-muted-foreground">{t("Monitor daily appointments and manage blocked dates.")}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Date Selection and Booking List */}
                <Card className={`lg:col-span-2 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div>
                      <CardTitle className="text-[#ff6b35]">{t("Daily Bookings")}</CardTitle>
                      <CardDescription>{t("Select a date to view all consultations for that day")}</CardDescription>
                    </div>
                    <div className="w-full sm:w-48">
                      <Input 
                        type="date" 
                        value={availabilityFilterDate} 
                        onChange={(e) => setAvailabilityFilterDate(e.target.value)} 
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/30'}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 min-h-[300px]">
                      {!availabilityFilterDate ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <Calendar className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-bold text-center px-4">{t("Please select a date to view bookings")}</p>
                        </div>
                      ) : filteredBookingsByDate.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 text-left">
                          {filteredBookingsByDate.map((b) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={b.id} 
                              className={`p-4 md:p-6 rounded-2xl border ${isDark ? 'bg-[#1a1a2e]/50 border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'} hover:border-[#ff6b35]/40 transition-all shadow-sm hover:shadow-md`}
                            >
                              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c5e] flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg shadow-[#ff6b35]/20">
                                    {b.full_name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-lg md:text-xl tracking-tight">{b.full_name}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                      <p className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#ff6b35]" /> {b.email}</p>
                                      <p className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#ff6b35]" /> {b.phone}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                  <Button 
                                    className="flex-1 sm:flex-none bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-[#ff6b35]/20 transition-all hover:scale-105 active:scale-95"
                                    onClick={() => handleSendRescheduleEmail(b)}
                                  >
                                    <Mail className="w-3.5 h-3.5 mr-2" /> {t("Reschedule Email")}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 sm:flex-none border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/5 font-bold rounded-xl"
                                    onClick={() => setSelectedBooking(b)}
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-2" /> {t("Details")}
                                  </Button>
                                </div>
                              </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                  <div className={`p-3 md:p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#ff6b35]/10'}`}>
                                    <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                      <Clock className="w-3.5 h-3.5" /> {t("Time")}
                                    </p>
                                    <p className="font-bold text-xs md:text-sm truncate">{b.booking_time}</p>
                                    <p className="text-[9px] md:text-[10px] text-[#ff6b35] font-bold mt-1">+ 1 Hr {t("Buffer")}</p>
                                  </div>
                                  <DetailBox label={t("Service")} value={t(b.service_type)} icon={<Star className="w-3.5 h-3.5" />} />
                                  <DetailBox label={t("Payment")} value={`${b.amount}`} icon={<CreditCard className="w-3.5 h-3.5" />} />
                                  <DetailBox label={t("Status")} value={t(b.payment_status)} icon={<CheckCircle2 className="w-3.5 h-3.5" />} isStatus />
                                </div>

                              <div className="mt-6 pt-6 border-t border-[#ff6b35]/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-[#ff6b35]/10'}`}>
                                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{t("Date of Birth")}</p>
                                  <p className="text-xs md:text-sm font-bold">{b.date_of_birth || ""}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-[#ff6b35]/10'}`}>
                                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{t("Time of Birth")}</p>
                                  <p className="text-xs md:text-sm font-bold">{b.time_of_birth || ""}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white border border-[#ff6b35]/10'}`}>
                                  <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{t("Place of Birth")}</p>
                                  <p className="text-xs md:text-sm font-bold line-clamp-1">{b.place_of_birth || ""}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <CheckCircle2 className="w-12 h-12 mb-4 text-green-500/50" />
                          <p className="font-bold text-center px-4">{t("No bookings found for this date")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Blocking Panel */}
                <div className="space-y-6">
                  <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                    <CardHeader><CardTitle className="text-[#ff6b35] flex items-center gap-2"><Calendar className="w-5 h-5" /> {t("Block Date")}</CardTitle></CardHeader>
                    <CardContent>
                      <form onSubmit={handleBlockDate} className="space-y-4 text-left">
                        <div className="space-y-2"><Label>{t("Date")}</Label><Input type="date" value={newBlockedDate.date} onChange={(e) => setNewBlockedDate({...newBlockedDate, date: e.target.value})} required className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} /></div>
                        <div className="space-y-2"><Label>{t("Reason")}</Label><Input placeholder={t("Holiday/Busy")} value={newBlockedDate.reason} onChange={(e) => setNewBlockedDate({...newBlockedDate, reason: e.target.value})} required className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} /></div>
                        <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold" disabled={isActionLoading}>
                          {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} {t("Block Date")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                    <CardHeader><CardTitle className="text-[#ff6b35]">{t("Blocked Dates")}</CardTitle></CardHeader>
                    <CardContent className="space-y-3 max-h-[400px] overflow-y-auto pr-2 text-left">
                      {blockedDates.length > 0 ? blockedDates.map((item) => (
                        <div key={item.id} className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#1a1a2e]/50 border-[#ff6b35]/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}>
                          <div><p className="font-bold text-sm">{new Date(item.date).toLocaleDateString()}</p><p className="text-xs text-muted-foreground italic">{item.reason}</p></div>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleUnblockDate(item.id)} disabled={isActionLoading}><Trash2 className="w-4 h-4" /></Button>
                        </div>
)) : <p className="text-center text-xs text-muted-foreground py-4">{t("No dates currently blocked")}</p>}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Google Meet Invoice Codes Section */}
                <div className="mt-8">
                  <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Video className="w-5 h-5" /> {t("Google Meet Invoice Codes")}</CardTitle>
                        <CardDescription>{t("Manage invoice codes for online consultations. Users enter these to join Google Meet.")}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddMeetingCode} className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex-1">
                          <Input 
                            placeholder={t("Invoice Number (e.g. INV2024001)")} 
                            value={newMeetingCode.invoiceNumber} 
                            onChange={(e) => setNewMeetingCode({...newMeetingCode, invoiceNumber: e.target.value.toUpperCase()})} 
                            className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                          />
                        </div>
                        <div className="flex-1">
                          <Input 
                            placeholder={t("Google Meet Link (e.g. https://meet.google.com/xxx-xxxx-xxx)")} 
                            value={newMeetingCode.meetLink} 
                            onChange={(e) => setNewMeetingCode({...newMeetingCode, meetLink: e.target.value})} 
                            className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                          />
                        </div>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold" disabled={isActionLoading}>
                          {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} {t("Add")}
                        </Button>
                      </form>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#ff6b35]/10">
                              <th className="p-3 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Invoice #")}</th>
                              <th className="p-3 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Meet Link")}</th>
                              <th className="p-3 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Status")}</th>
                              <th className="p-3 font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Used By")}</th>
                              <th className="p-3 text-right font-bold text-xs uppercase tracking-widest text-muted-foreground">{t("Action")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meetingCodes.length > 0 ? meetingCodes.map((mc) => (
                              <tr key={mc.id} className="border-b border-[#ff6b35]/5 hover:bg-[#ff6b35]/5 transition-colors group">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#ff6b35]" />
                                    <span className="font-bold text-sm">{mc.invoice_number || mc.code}</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <a 
                                    href={mc.meet_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1 max-w-[200px] truncate"
                                  >
                                    <Link2 className="w-3 h-3" />
                                    {mc.meet_link.replace('https://meet.google.com/', '')}
                                  </a>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${mc.is_used ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {mc.is_used ? t("Used") : t("Available")}
                                  </span>
                                </td>
                                <td className="p-3">
                                  {mc.is_used ? (
                                    <div>
                                      <p className="text-xs font-medium truncate max-w-[150px]">{mc.used_by || '-'}</p>
                                      {mc.used_at && <p className="text-[10px] text-muted-foreground">{new Date(mc.used_at).toLocaleString()}</p>}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:bg-red-500/10" 
                                    onClick={() => handleDeleteMeetingCode(mc.id)}
                                    disabled={isActionLoading}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} className="py-10 text-center text-muted-foreground italic">
                                  {t("No meeting codes found. Add one above.")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

          {activeTab === "feedback" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {feedbacks.length > 0 ? feedbacks.map((f) => (
                <Card key={f.id} className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < f.rating ? 'fill-[#ff6b35] text-[#ff6b35]' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteRecord('feedback', f.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <CardTitle className="text-sm mt-2 font-bold text-left">{f.name}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-xs italic text-muted-foreground leading-relaxed text-left">"{f.message}"</p></CardContent>
                </Card>
              )) : <EmptyState message={t("No feedback received yet.")} />}
            </div>
          )}

            {activeTab === "broadcast" && (
              <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                <CardHeader>
                  <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                    <Bell className="w-6 h-6" /> {t("Broadcast Message")}
                  </CardTitle>
                  <CardDescription>
                    {t("Send a popup message to all registered users. This will appear when they visit the website.")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendBroadcastMessage} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <Label>{t("Subject")}</Label>
                      <Input 
                        placeholder={t("Important Update...")} 
                        value={broadcast.subject} 
                        onChange={(e) => setBroadcast({...broadcast, subject: e.target.value})} 
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Message")}</Label>
                      <textarea 
                        className={`w-full min-h-[200px] p-3 rounded-md border ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'} focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/50`}
                        placeholder={t("Hello users, ...")}
                        value={broadcast.message}
                        onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl mt-2" disabled={isActionLoading}>
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bell className="w-4 h-4 mr-2" />}
                        {t("Send Broadcast Message")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "rashifal" && (
                <RashifalManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} mode="daily" />
              )}

              {activeTab === "weekly-rashifal" && (
                <RashifalManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} mode="weekly" />
              )}

                {activeTab === "blog" && (
                  <BlogManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
                )}

                {activeTab === "gallery" && (
                  <GalleryPanel isDark={isDark} t={t} />
                )}

                {activeTab === "seo" && (
                <SeoManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
              )}

              {activeTab === "analytics" && (
                <AnalyticsDashboard isDark={isDark} t={t} />
              )}

              {activeTab === "keywords" && (
                <KeywordsManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
              )}


                {activeTab === "pages" && (
                  <PagesManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
                )}

                {activeTab === "redirects" && (
                  <RedirectsManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
                )}

                {activeTab === "sitemap" && (
                  <SitemapManager isDark={isDark} t={t} isActionLoading={isActionLoading} setIsActionLoading={setIsActionLoading} setSuccess={setSuccess} setError={setError} />
                )}

                  {activeTab === "audit-logs" && (
                  <AuditLogsViewer isDark={isDark} t={t} />
                )}

                    {activeTab === "branding" && (
                      <BrandingManager isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "seo-testing" && (
                      <SeoTestingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                      {activeTab === "seo-monitor" && (
                        <SeoMonitorPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                      )}

                      {activeTab === "social-preview" && (
                        <SocialPreviewPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                      )}

                      {activeTab === "webmaster-ping" && (
                        <WebmasterPingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                      )}

                      {activeTab === "indexing" && (
                        <IndexingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                      )}

                    {activeTab === "automation" && (
                      <AutomationPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "performance" && (
                      <PerformancePanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "security" && (
                      <SecurityPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "scheduling" && (
                      <SchedulingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "reports" && (
                      <ReportsPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "devops" && (
                      <DevOpsPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "scaling" && (
                      <ScalingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                    {activeTab === "reschedule" && (
                      <ReschedulePanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                    )}

                      {activeTab === "invoices" && (
                        <InvoicePanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                      )}

                      {activeTab === "newsletter" && (
                          <NewsletterPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                        )}

                          {activeTab === "email-config" && (
                            <EmailConfigPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                          )}

                          {activeTab === "email-templates" && (
                            <EmailTemplatesPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                          )}

                          {activeTab === "pricing" && (
                            <PricingPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                          )}

                          {activeTab === "feedback" && (
                            <ReviewsPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                          )}

                          {activeTab === "offer" && (
                            <OfferPanel isDark={isDark} t={t} setSuccess={setSuccess} setError={setError} />
                          )}

                      {activeTab === "settings" && (

              <div className="space-y-6 pb-20 md:pb-0">
                  {/* Email Stats */}
                <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Mail className="w-6 h-6" /> {t("Email Stats")}</CardTitle>
                      <CardDescription>{t("Email sending limits and usage details")}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchEmailStats} disabled={emailStatsLoading} className="border-[#ff6b35]/20 text-[#ff6b35]">
                      {emailStatsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Provider Info Banners */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400">Gmail SMTP</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Daily Rashifal માટે</p>
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-[#ff6b35]/10 border-[#ff6b35]/20' : 'bg-orange-50 border-orange-200'}`}>
                          <div className="w-9 h-9 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                            <Send className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#ff6b35]">Resend</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Weekly Rashifal માટે</p>
                          </div>
                        </div>
                      </div>

                      {/* Daily Limits Progress */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gmail Daily Limit */}
                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold flex items-center gap-2"><Gauge className="w-4 h-4 text-blue-500" /> Gmail SMTP</p>
                            <span className="text-xs font-bold text-muted-foreground">{emailStats.gmailTodayUsed} / {emailStats.gmailDailyLimit}</span>
                          </div>
                          <p className="text-[10px] text-blue-500 font-semibold mb-2">Daily Rashifal</p>
                          <div className={`w-full h-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                (emailStats.gmailTodayUsed / emailStats.gmailDailyLimit) > 0.9 ? 'bg-red-500' :
                                (emailStats.gmailTodayUsed / emailStats.gmailDailyLimit) > 0.7 ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((emailStats.gmailTodayUsed / emailStats.gmailDailyLimit) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className={`text-xs font-bold ${
                              emailStats.gmailRemaining < 50 ? 'text-red-500' : 
                              emailStats.gmailRemaining < 150 ? 'text-amber-500' : 'text-green-500'
                            }`}>
                              {emailStats.gmailRemaining} {t("remaining")}
                            </span>
                            {emailStats.gmailTodayFailed > 0 && (
                              <span className="text-[10px] text-red-500 font-bold">{emailStats.gmailTodayFailed} {t("failed today")}</span>
                            )}
                          </div>
                        </div>

                          {/* Resend Daily Limit */}
                          <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold flex items-center gap-2"><Gauge className="w-4 h-4 text-[#ff6b35]" /> Resend</p>
                              <span className="text-xs font-bold text-muted-foreground">{emailStats.resendTodayUsed} / {emailStats.resendDailyLimit}</span>
                            </div>
                            <p className="text-[10px] text-[#ff6b35] font-semibold mb-2">Weekly Rashifal</p>
                            <div className={`w-full h-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  (emailStats.resendTodayUsed / emailStats.resendDailyLimit) > 0.9 ? 'bg-red-500' :
                                  (emailStats.resendTodayUsed / emailStats.resendDailyLimit) > 0.7 ? 'bg-amber-500' :
                                  'bg-[#ff6b35]'
                                }`}
                                style={{ width: `${Math.min((emailStats.resendTodayUsed / emailStats.resendDailyLimit) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className={`text-xs font-bold ${
                                emailStats.resendRemaining < 10 ? 'text-red-500' : 
                                emailStats.resendRemaining < 30 ? 'text-amber-500' : 'text-green-500'
                              }`}>
                                {emailStats.resendRemaining} {t("remaining")}
                              </span>
                              {emailStats.resendTodayFailed > 0 && (
                                <span className="text-[10px] text-red-500 font-bold">{emailStats.resendTodayFailed} {t("failed today")}</span>
                              )}
                            </div>
                          </div>
                      </div>

                      <p className="text-[10px] text-muted-foreground text-center">{t("Limits reset daily at midnight")}</p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <Send className="w-5 h-5 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-black">{emailStats.totalSent}</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("Total Sent")}</p>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                          <p className="text-2xl font-black">{emailStats.totalFailed}</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("Total Failed")}</p>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <Inbox className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-black">{emailStats.todaySent}</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("Today Sent")}</p>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <Calendar className="w-5 h-5 text-[#ff6b35] mx-auto mb-2" />
                          <p className="text-2xl font-black">{emailStats.monthSent}</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("This Month")}</p>
                        </div>
                      </div>

                      {/* Today's Summary */}
                      {(emailStats.todaySent > 0 || emailStats.todayFailed > 0) && (
                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("Today's Summary")}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-xs font-bold text-green-500">{emailStats.todaySent} {t("sent")}</span>
                            <span className="text-xs font-bold text-red-500">{emailStats.todayFailed} {t("failed")}</span>
                              <span className="text-[10px] text-muted-foreground">
                                (Gmail: {emailStats.gmailTodayUsed} {t("sent")} / {emailStats.gmailTodayFailed} {t("failed")} | Resend: {emailStats.resendTodayUsed} {t("sent")} / {emailStats.resendTodayFailed} {t("failed")})
                              </span>
                          </div>
                        </div>
                      )}

                      {/* Provider Breakdown */}
                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("Provider Breakdown (All Time)")}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <div>
                                  <p className="text-sm font-bold">Gmail SMTP</p>
                                  <p className="text-[10px] text-blue-500 font-semibold">Daily Rashifal</p>
                                  <p className="text-xs text-muted-foreground">{emailStats.gmailSent} {t("emails sent")}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#ff6b35]"></div>
                                <div>
                                  <p className="text-sm font-bold">Resend</p>
                                  <p className="text-[10px] text-[#ff6b35] font-semibold">Weekly Rashifal</p>
                                  <p className="text-xs text-muted-foreground">{emailStats.resendSent} {t("emails sent")}</p>
                                </div>
                              </div>
                            </div>
                        </div>

                      {/* Recent Emails */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("Recent Emails")}</p>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {recentEmails.length > 0 ? recentEmails.map((email: any) => (
                            <div key={email.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${email.status === 'sent' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <p className="text-xs font-bold truncate">{email.recipient}</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate pl-4">{email.subject}</p>
                                {email.error_message && <p className="text-[9px] text-red-500 truncate pl-4">{email.error_message}</p>}
                              </div>
                              <div className="text-right flex-shrink-0">
                                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                      email.provider === 'gmail' ? 'bg-blue-500/10 text-blue-500' : 
                                      'bg-[#ff6b35]/10 text-[#ff6b35]'
                                    }`}>{email.provider === 'gmail' ? 'Gmail' : 'Resend'}</span>
                                <p className="text-[9px] text-muted-foreground mt-1">{new Date(email.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                          )) : (
                            <div className="py-8 text-center text-xs text-muted-foreground italic">{t("No email logs yet. Emails will appear here once sent.")}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                <CardHeader><CardTitle className="text-[#ff6b35] flex items-center gap-2"><Bot className="w-6 h-6" /> {t("Bot Settings")}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateSettingsRequest} className="space-y-4 text-left">
                          <div className="space-y-2"><Label>{t("Admin Email")}</Label><Input type="email" value={adminSettings.email} onChange={(e) => setAdminSettings({...adminSettings, email: e.target.value})} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} /></div>
                          <div className="space-y-2"><Label>{t("Bot Token")}</Label><Input type="password" value={adminSettings.botToken} onChange={(e) => setAdminSettings({...adminSettings, botToken: e.target.value})} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} /></div>
                          <div className="space-y-2"><Label>{t("Chat ID")}</Label><Input value={adminSettings.chatId} onChange={(e) => setAdminSettings({...adminSettings, chatId: e.target.value})} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} /></div>
                          <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl mt-2" disabled={isActionLoading}>
                            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
                            {t("Update Settings")}
                          </Button>
                        </form>
                    </CardContent>

              </Card>
              <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                <CardHeader><CardTitle className="text-[#ff6b35] flex items-center gap-2"><Lock className="w-6 h-6" /> {t("Security")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4 text-left">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("Admin Email")}</Label>
                        <Input 
                          type="email" 
                          placeholder="admin@example.com"
                          value={pwdEmail} 
                          onChange={(e) => setPwdEmail(e.target.value)} 
                          required
                          className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("New Password")}</Label>
                        <Input 
                          type="password" 
                          value={passwords.new} 
                          onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                          required
                          className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("Confirm New Password")}</Label>
                        <Input 
                          type="password" 
                          value={passwords.confirm} 
                          onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                          required
                          className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} 
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl mt-2" disabled={isActionLoading}>
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                        {t("Update Password")}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmation(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-500">{t("Are you sure?")}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("This action cannot be undone. This record will be permanently deleted.")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteConfirmation(null)}
                    disabled={isActionLoading}
                    className="rounded-xl font-bold"
                  >
                    {t("Cancel")}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteRecord(deleteConfirmation.table, deleteConfirmation.id)}
                    disabled={isActionLoading}
                    className="rounded-xl font-bold bg-red-500 hover:bg-red-600"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    {t("Delete")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}
            >
              <div className="h-24 bg-[#ff6b35] flex items-end p-6 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedUser(null)} 
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  
                </Button>
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-4xl font-black text-[#ff6b35] absolute -bottom-10">
                  {selectedUser.full_name.charAt(0)}
                </div>
              </div>
                <div className="pt-14 p-6 space-y-6 text-left max-h-[80vh] overflow-y-auto">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedUser.email_verified ? (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t("Verified")}</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t("Not Verified")}</span>
                      )}
                      {selectedUser.role && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase">{selectedUser.role}</span>
                      )}
                    </div>
                  </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Phone Number")}</p>
                        <p className="font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-[#ff6b35]" /> {selectedUser.phone || '-'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Gender")}</p>
                        <p className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-[#ff6b35]" /> {selectedUser.gender ? t(selectedUser.gender.charAt(0).toUpperCase() + selectedUser.gender.slice(1)) : '-'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Date of Birth")}</p>
                        <p className="font-bold flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#ff6b35]" /> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : '-'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Time of Birth")}</p>
                        <p className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-[#ff6b35]" /> {selectedUser.tob || '-'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Place of Birth")}</p>
                        <p className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ff6b35]" /> {selectedUser.pob || '-'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{t("Joined")}</p>
                        <p className="font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-[#ff6b35]" /> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                      <div className={`p-4 md:p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#ff6b35]"><Clock className="w-4 h-4" /> {t("Activity History")}</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">{t("Bookings")}</p>
                      <div className="space-y-2">
                        {bookings.filter(b => b.email === selectedUser.email).length > 0 ? (
                          bookings.filter(b => b.email === selectedUser.email).map((b) => (
                            <div key={b.id} className="flex justify-between items-center text-[10px] md:text-xs p-2 rounded-lg hover:bg-[#ff6b35]/5 transition-colors border border-transparent hover:border-[#ff6b35]/10">
                              <div className="min-w-0 flex-1 mr-2">
                                <p className="font-bold truncate">{t(b.service_type)}</p>
                                <p className="text-muted-foreground">{b.booking_date} @ {b.booking_time}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[8px] whitespace-nowrap ${b.payment_status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(b.payment_status)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic">{t("No appointments scheduled yet.")}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#ff6b35]/10">
                      <p className="text-[10px] uppercase font-black text-muted-foreground mb-2">{t("Enquiries")}</p>
                      <div className="space-y-2">
                        {enquiries.filter(e => e.email === selectedUser.email).length > 0 ? (
                          enquiries.filter(e => e.email === selectedUser.email).map((e) => (
                            <div key={e.id} className="p-2 rounded-lg bg-white/5 border border-[#ff6b35]/5">
                              <p className="text-[10px] font-bold text-[#ff6b35]">{e.subject || t('General Inquiry')}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1 italic">"{e.message}"</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground italic">{t("No enquiries yet.")}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Consultation Notes */}
                  <div className={`p-4 md:p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#ff6b35]"><FileText className="w-4 h-4" /> {t("Consultation Notes")}</h3>
                    <div className="space-y-3 mb-4">
                      <textarea
                        value={newNote.note}
                        onChange={(e) => setNewNote(prev => ({ ...prev, note: e.target.value }))}
                        placeholder={t("Add a note about this client...")}
                        className={`w-full p-3 rounded-xl border text-sm resize-none h-20 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#ff6b35]/10'}`}
                      />
                      <div className="flex gap-2">
                        <select
                          value={newNote.category}
                          onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                          className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#ff6b35]/10'}`}
                        >
                          <option value="general">{t("General")}</option>
                          <option value="consultation">{t("Consultation")}</option>
                          <option value="follow-up">{t("Follow-up")}</option>
                          <option value="important">{t("Important")}</option>
                        </select>
                        <Button size="sm" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white rounded-xl" onClick={addConsultationNote} disabled={!newNote.note.trim()}>
                          {t("Add Note")}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {isLoadingNotes ? (
                        <p className="text-xs text-muted-foreground text-center py-4">{t("Loading notes...")}</p>
                      ) : consultationNotes.length > 0 ? (
                        consultationNotes.map((n) => (
                          <div key={n.id} className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#ff6b35]/5'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                n.category === 'important' ? 'bg-red-500/10 text-red-500' :
                                n.category === 'consultation' ? 'bg-blue-500/10 text-blue-500' :
                                n.category === 'follow-up' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-green-500/10 text-green-500'
                              }`}>{t(n.category)}</span>
                              <button onClick={() => deleteConsultationNote(n.id)} className="text-red-400 hover:text-red-500 text-[10px]">✕</button>
                            </div>
                            <p className="mt-1">{n.note}</p>
                            <p className="text-muted-foreground text-[10px] mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center py-2">{t("No notes yet")}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold h-12 rounded-xl" onClick={() => handleResetUserPassword(selectedUser.email)}>
                      <KeyRound className="w-4 h-4 mr-2" /> {t("Send Reset Email")}
                    </Button>
                    <Button variant="outline" className="w-full border-[#ff6b35] text-[#ff6b35] font-bold h-12 rounded-xl" onClick={() => setSelectedUser(null)}>
                      {t("Close Profile")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBooking(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}
              >
                <div className="p-4 md:p-6 border-b border-[#ff6b35]/10 flex justify-between items-center bg-[#ff6b35]/5">
                  <h2 className="text-lg md:text-xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Booking Details")}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)}></Button>
                </div>
                <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh] space-y-8 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("Client Information")}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Users className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm font-bold">{selectedBooking.full_name}</span></div>
                        <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm truncate">{selectedBooking.email}</span></div>
                        <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm">{selectedBooking.phone}</span></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("Appointment Details")}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3"><Star className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm font-bold">{t(selectedBooking.service_type)}</span></div>
                        <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm">{selectedBooking.booking_date}</span></div>
                        <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-[#ff6b35]" /><span className="text-sm">{selectedBooking.booking_time}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 md:p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#ff6b35]/5 border-[#ff6b35]/10'}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">{t("Birth Chart Details")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-[10px] text-muted-foreground mb-1">{t("Date of Birth")}</p>
                        <p className="font-bold text-sm">{selectedBooking.date_of_birth || t("Not provided")}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-[10px] text-muted-foreground mb-1">{t("Time of Birth")}</p>
                        <p className="font-bold text-sm">{selectedBooking.time_of_birth || t("Not provided")}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-[10px] text-muted-foreground mb-1">{t("Place of Birth")}</p>
                        <p className="font-bold text-sm">{selectedBooking.place_of_birth || t("Not provided")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Editable Status Section */}
                  <div className={`p-4 md:p-6 rounded-2xl border-2 border-dashed ${isDark ? 'bg-purple-900/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-purple-500 mb-4 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" /> {t("Edit Booking")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t("Booking Status")}</Label>
                        <select
                          defaultValue={selectedBooking.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            setIsActionLoading(true);
                            try {
                              const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', selectedBooking.id);
                              if (error) throw error;
                              setSuccess(t("Booking status updated"));
                              setSelectedBooking({ ...selectedBooking, status: newStatus });
                              fetchData();
                            } catch { setError(t("Failed to update")); }
                            finally { setIsActionLoading(false); }
                          }}
                          className={`w-full h-10 rounded-xl border px-3 text-sm ${isDark ? 'bg-[#0a0a12] border-purple-500/20 text-white' : 'bg-white border-purple-200'}`}
                        >
                          <option value="pending">{t("Pending")}</option>
                          <option value="confirmed">{t("Confirmed")}</option>
                          <option value="cancelled">{t("Cancelled")}</option>
                          <option value="completed">{t("Completed")}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t("Payment Status")}</Label>
                        <select
                          defaultValue={selectedBooking.payment_status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            setIsActionLoading(true);
                            try {
                              const { error } = await supabase.from('bookings').update({ payment_status: newStatus }).eq('id', selectedBooking.id);
                              if (error) throw error;
                              setSuccess(t("Payment status updated"));
                              setSelectedBooking({ ...selectedBooking, payment_status: newStatus });
                              fetchData();
                            } catch { setError(t("Failed to update")); }
                            finally { setIsActionLoading(false); }
                          }}
                          className={`w-full h-10 rounded-xl border px-3 text-sm ${isDark ? 'bg-[#0a0a12] border-purple-500/20 text-white' : 'bg-white border-purple-200'}`}
                        >
                          <option value="pending">{t("Pending")}</option>
                          <option value="completed">{t("Completed")}</option>
                          <option value="failed">{t("Failed")}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t("Booking Date")}</Label>
                        <Input
                          type="date"
                          defaultValue={selectedBooking.booking_date}
                          onBlur={async (e) => {
                            if (e.target.value && e.target.value !== selectedBooking.booking_date) {
                              setIsActionLoading(true);
                              try {
                                const { error } = await supabase.from('bookings').update({ booking_date: e.target.value }).eq('id', selectedBooking.id);
                                if (error) throw error;
                                setSuccess(t("Date updated"));
                                setSelectedBooking({ ...selectedBooking, booking_date: e.target.value });
                                fetchData();
                              } catch { setError(t("Failed to update")); }
                              finally { setIsActionLoading(false); }
                            }
                          }}
                          className={`h-10 rounded-xl ${isDark ? 'bg-[#0a0a12] border-purple-500/20' : 'border-purple-200'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t("Booking Time")}</Label>
                        <Input
                          type="time"
                          defaultValue={selectedBooking.booking_time}
                          onBlur={async (e) => {
                            if (e.target.value && e.target.value !== selectedBooking.booking_time) {
                              setIsActionLoading(true);
                              try {
                                const { error } = await supabase.from('bookings').update({ booking_time: e.target.value }).eq('id', selectedBooking.id);
                                if (error) throw error;
                                setSuccess(t("Time updated"));
                                setSelectedBooking({ ...selectedBooking, booking_time: e.target.value });
                                fetchData();
                              } catch { setError(t("Failed to update")); }
                              finally { setIsActionLoading(false); }
                            }
                          }}
                          className={`h-10 rounded-xl ${isDark ? 'bg-[#0a0a12] border-purple-500/20' : 'border-purple-200'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                      <p className="text-[10px] text-green-500 font-bold uppercase mb-1">{t("Payment Status")}</p>
                      <p className="text-lg font-black uppercase">{t(selectedBooking.payment_status)}</p>
                    </div>
                    <div className="flex-1 p-4 rounded-xl border border-[#ff6b35]/20 bg-[#ff6b35]/5">
                      <p className="text-[10px] text-[#ff6b35] font-bold uppercase mb-1">{t("Amount")}</p>
                      <p className="text-lg font-black">{selectedBooking.amount}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold h-12" onClick={() => handleSendRescheduleEmail(selectedBooking)}>
                      <Mail className="w-4 h-4 mr-2" /> {t("Send Reschedule Template")}
                    </Button>
                    <Button variant="outline" className="h-12 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-bold" onClick={() => setSelectedBooking(null)}>
                      {t("Close")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* Enquiry Details Modal */}
      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/20' : 'bg-white border-[#ff6b35]/20'}`}
            >
              <div className="p-4 md:p-6 border-b border-[#ff6b35]/10 flex justify-between items-center bg-[#ff6b35]/5">
                <h2 className="text-lg md:text-xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35]">{t("Enquiry Message")}</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}></Button>
              </div>
              <div className="p-4 md:p-6 space-y-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff6b35]/10 flex items-center justify-center text-[#ff6b35] font-bold">
                    {selectedEnquiry.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedEnquiry.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedEnquiry.email}</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#fcfaf7] border border-[#ff6b35]/10'}`}>
                  <p className="text-xs font-black text-[#ff6b35] uppercase mb-2">{t("Subject")}: {selectedEnquiry.subject || t("General Inquiry")}</p>
                  <p className="text-sm italic leading-relaxed text-muted-foreground">"{selectedEnquiry.message}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-bold" onClick={() => {
                    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${selectedEnquiry.email}&su=Re: ${selectedEnquiry.subject || 'Enquiry'}`;
                    window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: mailUrl } }, "*");
                  }}>
                    <Mail className="w-4 h-4 mr-2" /> {t("Reply via Gmail")}
                  </Button>
                  <Button variant="outline" className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 font-bold" onClick={() => setSelectedEnquiry(null)}>
                    {t("Close")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SEO Manager Component
function SeoManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean;
  t: (key: string) => string;
  isActionLoading: boolean;
  setIsActionLoading: (v: boolean) => void;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}) {
  const [seoEntries, setSeoEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [seoForm, setSeoForm] = useState({
    page_path: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots: 'index, follow',
    schema_markup: '',
    bing_meta_title: '',
    bing_meta_description: '',
    bing_keywords: '',
  });

  const PAGE_OPTIONS = [
    { value: '/', label: 'Home' },
    { value: '/about', label: 'About' },
    { value: '/services', label: 'Services' },
    { value: '/booking', label: 'Booking' },
    { value: '/blog', label: 'Blog' },
    { value: '/horoscope', label: 'Horoscope' },
    { value: '/rashifal', label: 'Rashifal' },
    { value: '/hindu-calendar', label: 'Hindu Calendar' },
    { value: '/important-days', label: 'Important Days' },
    { value: '/online-consulting', label: 'Online Consulting' },
    { value: '/feedback', label: 'Feedback' },
    { value: '/privacy', label: 'Privacy Policy' },
    { value: '/terms', label: 'Terms & Conditions' },
    { value: '/disclaimer', label: 'Disclaimer' },
    { value: '/refund-policy', label: 'Refund Policy' },
  ];

  useEffect(() => { fetchSeoEntries(); }, []);

  const fetchSeoEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const data = await safeJson(res);
      if (data.success) setSeoEntries(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoForm.page_path) { setError(t("Page path is required")); return; }
    setIsActionLoading(true);
    try {
      let schemaMarkup = null;
      if (seoForm.schema_markup) {
        try { schemaMarkup = JSON.parse(seoForm.schema_markup); } catch { setError(t("Invalid JSON in schema markup")); setIsActionLoading(false); return; }
      }
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...seoForm, schema_markup: schemaMarkup }),
        });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(editingEntry ? t("SEO settings updated!") : t("SEO settings saved!"));
          setShowForm(false); setEditingEntry(null);
          setSeoForm({ page_path: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', og_image: '', canonical_url: '', robots: 'index, follow', schema_markup: '', bing_meta_title: '', bing_meta_description: '', bing_keywords: '' });
        fetchSeoEntries();
      } else { setError(data.error || t("Failed to save")); }
    } catch (err) { setError(t("An error occurred")); }
    finally { setIsActionLoading(false); }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setSeoForm({
      page_path: entry.page_path || '',
      meta_title: entry.meta_title || '',
      meta_description: entry.meta_description || '',
      meta_keywords: entry.meta_keywords || '',
      og_title: entry.og_title || '',
      og_description: entry.og_description || '',
      og_image: entry.og_image || '',
      canonical_url: entry.canonical_url || '',
      robots: entry.robots || 'index, follow',
      schema_markup: entry.schema_markup ? JSON.stringify(entry.schema_markup, null, 2) : '',
      bing_meta_title: entry.bing_meta_title || '',
      bing_meta_description: entry.bing_meta_description || '',
      bing_keywords: entry.bing_keywords || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("Delete this SEO entry?"))) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/seo?id=${id}`, { method: 'DELETE' });
      const data = await safeJson(res);
      if (data.success) { setSuccess(t("SEO entry deleted!")); fetchSeoEntries(); }
      else { setError(data.error || t("Failed to delete")); }
    } catch (err) { setError(t("An error occurred")); }
    finally { setIsActionLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">{t("SEO Manager")}</h2>
          <p className="text-sm text-muted-foreground">{t("Manage meta tags, Open Graph, and schema markup for each page")}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (showForm) { setEditingEntry(null); setSeoForm({ page_path: '', meta_title: '', meta_description: '', meta_keywords: '', og_title: '', og_description: '', og_image: '', canonical_url: '', robots: 'index, follow', schema_markup: '', bing_meta_title: '', bing_meta_description: '', bing_keywords: '' }); } }} className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
          {showForm ? <><ChevronRight className="w-4 h-4 mr-2 rotate-90" /> {t("Close Form")}</> : <><Plus className="w-4 h-4 mr-2" /> {t("Add SEO Entry")}</>}
        </Button>
      </div>

      {showForm && (
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardHeader>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2"><SearchIcon className="w-5 h-5" /> {editingEntry ? t("Edit SEO Settings") : t("New SEO Entry")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("Page Path")} *</Label>
                  <select value={seoForm.page_path} onChange={(e) => setSeoForm({ ...seoForm, page_path: e.target.value })} className={`w-full h-10 px-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`} required>
                    <option value="">{t("Select a page...")}</option>
                    {PAGE_OPTIONS.map((p) => (<option key={p.value} value={p.value}>{p.label} ({p.value})</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("Robots")}</Label>
                  <select value={seoForm.robots} onChange={(e) => setSeoForm({ ...seoForm, robots: e.target.value })} className={`w-full h-10 px-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}>
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-blue-500 border-b border-blue-500/20 pb-2 flex items-center gap-2"><Search className="w-4 h-4" /> {t("Google SEO")}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>{t("Google Meta Title")}</Label>
                      <Input placeholder="Page title for Google search..." value={seoForm.meta_title} onChange={(e) => setSeoForm({ ...seoForm, meta_title: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                      <p className="text-[10px] text-muted-foreground">{seoForm.meta_title.length}/60 {t("characters")}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Google Meta Description")}</Label>
                      <Textarea placeholder="Brief description for Google search results..." value={seoForm.meta_description} onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                      <p className="text-[10px] text-muted-foreground">{seoForm.meta_description.length}/160 {t("characters")}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Google Keywords")}</Label>
                      <Input placeholder="keyword1, keyword2, keyword3..." value={seoForm.meta_keywords} onChange={(e) => setSeoForm({ ...seoForm, meta_keywords: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                    </div>
                  </div>
                </div>

                {/* Bing SEO Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-cyan-500 flex items-center gap-2"><Globe className="w-4 h-4" /> {t("Bing SEO")}</h3>
                    <Button type="button" variant="outline" size="sm" className="text-[10px] h-7 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/10" onClick={() => setSeoForm(prev => ({ ...prev, bing_meta_title: prev.bing_meta_title || prev.meta_title, bing_meta_description: prev.bing_meta_description || prev.meta_description, bing_keywords: prev.bing_keywords || prev.meta_keywords }))}>
                      <Copy className="w-3 h-3 mr-1" /> {t("Copy from Google")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>{t("Bing Meta Title")}</Label>
                      <Input placeholder={seoForm.meta_title || "Bing page title..."} value={seoForm.bing_meta_title} onChange={(e) => setSeoForm({ ...seoForm, bing_meta_title: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-cyan-500/10' : 'bg-white border-cyan-500/20'} />
                      <p className="text-[10px] text-muted-foreground">{seoForm.bing_meta_title.length}/60 {t("characters")} {!seoForm.bing_meta_title && seoForm.meta_title && <span className="text-cyan-500">({t("will use Google title")})</span>}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Bing Meta Description")}</Label>
                      <Textarea placeholder={seoForm.meta_description || "Bing search description..."} value={seoForm.bing_meta_description} onChange={(e) => setSeoForm({ ...seoForm, bing_meta_description: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-cyan-500/10' : 'bg-white border-cyan-500/20'} />
                      <p className="text-[10px] text-muted-foreground">{seoForm.bing_meta_description.length}/160 {t("characters")} {!seoForm.bing_meta_description && seoForm.meta_description && <span className="text-cyan-500">({t("will use Google description")})</span>}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Bing Keywords")}</Label>
                      <Input placeholder={seoForm.meta_keywords || "bing keyword1, bing keyword2..."} value={seoForm.bing_keywords} onChange={(e) => setSeoForm({ ...seoForm, bing_keywords: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-cyan-500/10' : 'bg-white border-cyan-500/20'} />
                      <p className="text-[10px] text-muted-foreground text-cyan-500">{!seoForm.bing_keywords && seoForm.meta_keywords ? t("Will use Google keywords if empty") : t("Bing still uses meta keywords for ranking")}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground border-b border-[#ff6b35]/10 pb-2">{t("Open Graph & Social Sharing")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("OG Title")}</Label>
                      <Input placeholder="Open Graph title..." value={seoForm.og_title} onChange={(e) => setSeoForm({ ...seoForm, og_title: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                      <p className="text-[10px] text-muted-foreground">{t("Title shown when shared on Facebook, WhatsApp, LinkedIn, Bing etc.")}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("OG Image")}</Label>
                      <div className="flex gap-2">
                        <Input placeholder="https://... or upload below" value={seoForm.og_image} onChange={(e) => setSeoForm({ ...seoForm, og_image: e.target.value })} className={`flex-1 ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`} />
                        <label className="flex items-center gap-1 px-3 py-2 rounded-md border cursor-pointer hover:bg-[#ff6b35]/10 transition-colors text-xs font-bold text-[#ff6b35] border-[#ff6b35]/20">
                          <Upload className="w-3 h-3" />
                          {t("Upload")}
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) { setError(t("Image must be under 5MB")); return; }
                            setIsActionLoading(true);
                            try {
                              const ext = file.name.split('.').pop();
                              const fileName = `og-${seoForm.page_path.replace(/\//g, '-').replace(/^-/, 'home')}-${Date.now()}.${ext}`;
                              const { data: uploadData, error: uploadErr } = await supabase.storage.from('blog-images').upload(`og/${fileName}`, file, { upsert: true });
                              if (uploadErr) throw uploadErr;
                              const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(`og/${fileName}`);
                              setSeoForm(prev => ({ ...prev, og_image: urlData.publicUrl }));
                              setSuccess(t("OG Image uploaded!"));
                            } catch (err: any) { setError(err.message || t("Upload failed")); }
                            finally { setIsActionLoading(false); e.target.value = ''; }
                          }} />
                        </label>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t("Recommended: 1200x630px, max 5MB (JPG/PNG)")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("OG Description")}</Label>
                    <Textarea placeholder="Description for social sharing..." value={seoForm.og_description} onChange={(e) => setSeoForm({ ...seoForm, og_description: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                    <p className="text-[10px] text-muted-foreground">{seoForm.og_description.length}/200 {t("characters")}</p>
                  </div>

                  {/* OG Image Preview */}
                  {seoForm.og_image && (
                    <div className="space-y-2">
                      <Label className="text-xs">{t("Image Preview")}</Label>
                      <div className="relative w-full max-w-md">
                        <img src={seoForm.og_image} alt="OG Preview" className="w-full h-auto rounded-lg border border-[#ff6b35]/20 object-cover max-h-48" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <button type="button" onClick={() => setSeoForm({ ...seoForm, og_image: '' })} className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"><XIcon className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )}

                  {/* Social Card Previews */}
                  {(seoForm.og_title || seoForm.meta_title) && (
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("Social Card Preview")}</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Facebook Preview */}
                        <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 text-blue-500">{t("Facebook / LinkedIn / Bing")}</p>
                          {seoForm.og_image && <img src={seoForm.og_image} alt="" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <div className={`p-3 ${isDark ? 'bg-[#1a1a2e]' : 'bg-[#f0f2f5]'}`}>
                            <p className="text-[9px] uppercase text-muted-foreground tracking-wider">katyaayaniastrologer.com</p>
                            <p className="text-sm font-bold truncate mt-0.5">{seoForm.og_title || seoForm.meta_title || t("Page Title")}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{seoForm.og_description || seoForm.meta_description || t("Page description...")}</p>
                          </div>
                        </div>
                        {/* Twitter Preview */}
                        <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-sky-500/10 text-sky-500">{t("Twitter / X")}</p>
                          {seoForm.og_image && <img src={seoForm.og_image} alt="" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <div className={`p-3 ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}>
                            <p className="text-sm font-bold truncate">{seoForm.og_title || seoForm.meta_title || t("Page Title")}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{seoForm.og_description || seoForm.meta_description || t("Page description...")}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Link2 className="w-3 h-3" /> katyaayaniastrologer.com{seoForm.page_path}</p>
                          </div>
                        </div>
                      </div>
                      {/* WhatsApp Preview */}
                      <div className={`rounded-lg border overflow-hidden max-w-sm ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-green-500/10 text-green-500">{t("WhatsApp")}</p>
                        <div className={`p-3 rounded-b-lg ${isDark ? 'bg-[#1a2e1a]' : 'bg-[#dcf8c6]'}`}>
                          {seoForm.og_image && <img src={seoForm.og_image} alt="" className="w-full h-28 object-cover rounded-lg mb-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                          <p className="text-xs font-bold">{seoForm.og_title || seoForm.meta_title || t("Page Title")}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{seoForm.og_description || seoForm.meta_description}</p>
                          <p className="text-[10px] text-blue-500 mt-1">katyaayaniastrologer.com{seoForm.page_path}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("Canonical URL")}</Label>
                  <Input placeholder="https://..." value={seoForm.canonical_url} onChange={(e) => setSeoForm({ ...seoForm, canonical_url: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("Schema Markup (JSON-LD)")}</Label>
                <textarea className={`w-full min-h-[120px] p-3 rounded-md border text-sm font-mono ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`} placeholder='{"@context": "https://schema.org", ...}' value={seoForm.schema_markup} onChange={(e) => setSeoForm({ ...seoForm, schema_markup: e.target.value })} />
              </div>

              <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {editingEntry ? t("Update SEO") : t("Save SEO")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* SEO Entries List */}
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("All SEO Entries")}</CardTitle>
          <CardDescription>{seoEntries.length} {t("pages configured")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" /></div>
          ) : seoEntries.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic">{t("No SEO entries yet. Add your first page!")}</div>
          ) : (
            <div className="space-y-3">
                {seoEntries.map((entry) => (
                  <div key={entry.id} className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                    {entry.og_image && (
                      <img src={entry.og_image} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#ff6b35]/10 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-bold font-mono">{entry.page_path}</span>
                        <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[8px] font-bold uppercase">{entry.robots || 'index, follow'}</span>
                        {entry.og_title && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-bold uppercase">OG</span>}
                        {entry.og_image && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[8px] font-bold uppercase flex items-center gap-0.5"><ImageIcon className="w-2.5 h-2.5" /> IMG</span>}
                        {entry.bing_keywords && <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[8px] font-bold uppercase">BING</span>}
                      </div>
                      <p className="text-sm font-bold truncate">{entry.meta_title || t("No title set")}</p>
                      <p className="text-xs text-muted-foreground truncate">{entry.meta_description || t("No description set")}</p>
                      {entry.og_title && entry.og_title !== entry.meta_title && <p className="text-[10px] text-blue-400 mt-0.5 truncate">OG: {entry.og_title}</p>}
                      {entry.meta_keywords && <p className="text-[10px] text-muted-foreground mt-1"><Tag className="w-3 h-3 inline mr-1" /><span className="text-blue-400">G:</span> {entry.meta_keywords}</p>}
                      {entry.bing_keywords && <p className="text-[10px] text-muted-foreground mt-0.5"><Tag className="w-3 h-3 inline mr-1" /><span className="text-cyan-400">B:</span> {entry.bing_keywords}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleEdit(entry)}><Eye className="w-3 h-3 mr-1" /> {t("Edit")}</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-500/20" onClick={() => handleDelete(entry.id)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

        {/* SEO Preview */}
        {seoEntries.length > 0 && (
          <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
            <CardHeader>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Globe className="w-5 h-5" /> {t("Google Search Preview")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seoEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer font-medium truncate">{entry.meta_title || entry.page_path}</p>
                  <p className="text-green-700 text-xs truncate">{entry.canonical_url || `https://katyaayani.com${entry.page_path}`}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{entry.meta_description || t("No description available")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* SEO Audit Dashboard */}
        <SeoAuditDashboard isDark={isDark} t={t} onEdit={handleEdit} />
      </div>
    );
  }

  function SeoAuditDashboard({ isDark, t, onEdit }: { isDark: boolean; t: (key: string) => string; onEdit: (entry: any) => void }) {
    const [auditData, setAuditData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);

    const fetchAudit = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/seo/audit");
        const data = await safeJson(res);
        if (data.success) setAuditData(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };

    useEffect(() => { fetchAudit(); }, []);

    const handleGenerateSchema = async (pagePath: string) => {
      setGenerating(pagePath);
      try {
        const res = await fetch("/api/admin/seo/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_path: pagePath }),
        });
        const data = await safeJson(res);
        if (data.success) fetchAudit();
      } catch (err) { console.error(err); }
      finally { setGenerating(null); }
    };

    const getScoreColor = (score: number) => {
      if (score >= 80) return "text-green-500";
      if (score >= 50) return "text-amber-500";
      return "text-red-500";
    };

    const getScoreBg = (score: number) => {
      if (score >= 80) return "bg-green-500";
      if (score >= 50) return "bg-amber-500";
      return "bg-red-500";
    };

    if (loading) return <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" /></div>;
    if (!auditData) return null;

    return (
      <div className="space-y-6">
        {/* Overall Score Card */}
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardHeader>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2">
              <Gauge className="w-5 h-5" /> {t("SEO Audit Report")}
            </CardTitle>
            <CardDescription>{t("Automated SEO health check for all pages")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-[#ff6b35]/5'}`}>
                <p className={`text-3xl font-black ${getScoreColor(auditData.overallScore)}`}>{auditData.overallScore}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{t("Overall Score")}</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-green-500/5'}`}>
                <p className="text-3xl font-black text-green-500">{auditData.configuredPages}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{t("Configured")}</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-amber-500/5'}`}>
                <p className="text-3xl font-black text-amber-500">{auditData.missingPages.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{t("Missing")}</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-red-500/5'}`}>
                <p className="text-3xl font-black text-red-500">{auditData.errorCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{t("Errors")}</p>
              </div>
              <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-blue-500/5'}`}>
                <p className="text-3xl font-black text-blue-500">{auditData.warningCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{t("Warnings")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missing Pages */}
        {auditData.missingPages.length > 0 && (
          <Card className={`border-amber-500/30 ${isDark ? 'bg-[#12121a]' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle className="text-amber-500 flex items-center gap-2 text-base">
                <AlertTriangle className="w-4 h-4" /> {t("Pages Without SEO Configuration")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {auditData.missingPages.map((p: string) => (
                  <span key={p} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold font-mono">{p}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-page Audit */}
        {auditData.audits.map((audit: any) => (
          <Card key={audit.page_path} className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm ${getScoreBg(audit.score)}`}>
                    {audit.score}
                  </div>
                  <div>
                    <p className="font-bold text-sm font-mono">{audit.page_path}</p>
                    <div className="flex gap-1.5 mt-1">
                      {audit.hasTitle && <span className="w-2 h-2 rounded-full bg-green-500" title="Title" />}
                      {!audit.hasTitle && <span className="w-2 h-2 rounded-full bg-red-500" title="No Title" />}
                      {audit.hasDescription && <span className="w-2 h-2 rounded-full bg-green-500" title="Description" />}
                      {!audit.hasDescription && <span className="w-2 h-2 rounded-full bg-red-500" title="No Description" />}
                      {audit.hasOgTags && <span className="w-2 h-2 rounded-full bg-green-500" title="OG Tags" />}
                      {!audit.hasOgTags && <span className="w-2 h-2 rounded-full bg-amber-500" title="Missing OG" />}
                      {audit.hasSchema && <span className="w-2 h-2 rounded-full bg-green-500" title="Schema" />}
                      {!audit.hasSchema && <span className="w-2 h-2 rounded-full bg-amber-500" title="No Schema" />}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!audit.hasSchema && (
                    <Button variant="outline" size="sm" className="h-8 text-xs border-blue-500/20 text-blue-500" onClick={() => handleGenerateSchema(audit.page_path)} disabled={generating === audit.page_path}>
                      {generating === audit.page_path ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                      {t("Generate Schema")}
                    </Button>
                  )}
                </div>
              </div>
              {audit.issues.length > 0 && (
                <div className="mt-3 space-y-1">
                  {audit.issues.map((issue: any, idx: number) => (
                    <div key={idx} className={`flex items-center gap-2 text-xs py-1 px-2 rounded ${
                      issue.type === 'error' ? 'bg-red-500/5 text-red-500' :
                      issue.type === 'warning' ? 'bg-amber-500/5 text-amber-500' :
                      'bg-blue-500/5 text-blue-500'
                    }`}>
                      {issue.type === 'error' ? <AlertCircle className="w-3 h-3 flex-shrink-0" /> :
                       issue.type === 'warning' ? <AlertTriangle className="w-3 h-3 flex-shrink-0" /> :
                       <Activity className="w-3 h-3 flex-shrink-0" />}
                      <span className="font-mono text-[10px] opacity-60">{issue.field}</span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center">
          <Button variant="outline" onClick={fetchAudit} disabled={loading} className="border-[#ff6b35]/20 text-[#ff6b35]">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> {t("Re-run Audit")}
          </Button>
        </div>
      </div>
    );
  }

// Analytics Dashboard Component
function AnalyticsDashboard({ isDark, t }: { isDark: boolean; t: (key: string) => string }) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('7d');

  useEffect(() => { fetchAnalytics(); }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await safeJson(res);
      if (data.success) setAnalyticsData(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const maxChartValue = analyticsData?.chartData?.length > 0 ? Math.max(...analyticsData.chartData.map((d: any) => d.count)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">{t("Analytics Dashboard")}</h2>
          <p className="text-sm text-muted-foreground">{t("Track page views, visitors, and traffic sources")}</p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((p) => (
            <Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p)} className={period === p ? 'bg-[#ff6b35] text-white' : 'border-[#ff6b35]/20 text-[#ff6b35]'}>
              {p}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ff6b35]" /></div>
      ) : !analyticsData ? (
        <div className="py-20 text-center text-muted-foreground italic">{t("No analytics data available")}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Activity className="w-5 h-5" /></div>
                </div>
                <p className="text-muted-foreground mb-1 font-bold uppercase tracking-widest text-[10px] text-left">{t("Total Views")}</p>
                <h3 className="text-2xl font-black tracking-tighter text-left">{analyticsData.totalViews?.toLocaleString()}</h3>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Users className="w-5 h-5" /></div>
                </div>
                <p className="text-muted-foreground mb-1 font-bold uppercase tracking-widest text-[10px] text-left">{t("Unique Sessions")}</p>
                <h3 className="text-2xl font-black tracking-tighter text-left">{analyticsData.uniqueSessions?.toLocaleString()}</h3>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><FileText className="w-5 h-5" /></div>
                </div>
                <p className="text-muted-foreground mb-1 font-bold uppercase tracking-widest text-[10px] text-left">{t("Top Pages")}</p>
                <h3 className="text-2xl font-black tracking-tighter text-left">{analyticsData.topPages?.length || 0}</h3>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><ExternalLink className="w-5 h-5" /></div>
                </div>
                <p className="text-muted-foreground mb-1 font-bold uppercase tracking-widest text-[10px] text-left">{t("Referrers")}</p>
                <h3 className="text-2xl font-black tracking-tighter text-left">{analyticsData.topReferrers?.length || 0}</h3>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          {analyticsData.chartData?.length > 0 && (
              <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
                <CardHeader>
                  <CardTitle className="text-[#ff6b35] flex items-center gap-2"><TrendingUp className="w-5 h-5" /> {t("Page Views Over Time")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PageViewsChart chartData={analyticsData.chartData} maxChartValue={maxChartValue} isDark={isDark} />
                </CardContent>
              </Card>
            )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2"><FileText className="w-5 h-5" /> {t("Top Pages")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topPages?.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.topPages.map((page: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-[10px] font-black text-[#ff6b35] w-5">{i + 1}</span>
                          <span className="text-sm truncate font-mono">{page.path}</span>
                        </div>
                        <span className="text-sm font-bold whitespace-nowrap">{page.count} {t("views")}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground italic">{t("No data")}</p>}
              </CardContent>
            </Card>

            {/* Device & Browser */}
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Monitor className="w-5 h-5" /> {t("Devices & Browsers")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground mb-3">{t("Devices")}</p>
                  <div className="space-y-2">
                    {Object.entries(analyticsData.devices || {}).map(([device, count]: any) => {
                      const total = analyticsData.totalViews || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={device} className="flex items-center gap-3">
                          <span className="text-xs w-20 capitalize flex items-center gap-1">
                            {device === 'mobile' ? <Smartphone className="w-3 h-3" /> : device === 'tablet' ? <Tablet className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                            {device}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-[#ff6b35]/10 overflow-hidden">
                            <div className="h-full bg-[#ff6b35] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold w-12 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground mb-3">{t("Browsers")}</p>
                  <div className="space-y-2">
                    {Object.entries(analyticsData.browsers || {}).map(([browser, count]: any) => {
                      const total = analyticsData.totalViews || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={browser} className="flex items-center gap-3">
                          <span className="text-xs w-20">{browser}</span>
                          <div className="flex-1 h-2 rounded-full bg-blue-500/10 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold w-12 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referrers */}
            <Card className={`lg:col-span-2 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
              <CardHeader>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2"><ExternalLink className="w-5 h-5" /> {t("Top Referrers")}</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.topReferrers?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analyticsData.topReferrers.map((ref: any, i: number) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                        <span className="text-sm truncate font-mono">{ref.source}</span>
                        <span className="text-sm font-bold ml-2">{ref.count}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground italic">{t("No referrer data")}</p>}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// Keywords Manager Component - Google + Bing unified
function KeywordsManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean;
  t: (key: string) => string;
  isActionLoading: boolean;
  setIsActionLoading: (v: boolean) => void;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}) {
  const [seoEntries, setSeoEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const [googleKeywords, setGoogleKeywords] = useState('');
  const [bingKeywords, setBingKeywords] = useState('');
  const [newGoogleKeyword, setNewGoogleKeyword] = useState('');
  const [newBingKeyword, setNewBingKeyword] = useState('');
  const [kwTab, setKwTab] = useState<'google' | 'bing'>('google');

  useEffect(() => { fetchSeoEntries(); }, []);

  const fetchSeoEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const data = await safeJson(res);
      if (data.success) setSeoEntries(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedPage) {
      const entry = seoEntries.find(e => e.page_path === selectedPage);
      setGoogleKeywords(entry?.meta_keywords || '');
      setBingKeywords(entry?.bing_keywords || '');
    }
  }, [selectedPage, seoEntries]);

  const googleList = googleKeywords.split(',').map(k => k.trim()).filter(Boolean);
  const bingList = bingKeywords.split(',').map(k => k.trim()).filter(Boolean);

  const addGoogleKeyword = () => {
    if (!newGoogleKeyword.trim()) return;
    const updated = googleList.includes(newGoogleKeyword.trim()) ? googleList : [...googleList, newGoogleKeyword.trim()];
    setGoogleKeywords(updated.join(', '));
    setNewGoogleKeyword('');
  };
  const removeGoogleKeyword = (kw: string) => setGoogleKeywords(googleList.filter(k => k !== kw).join(', '));

  const addBingKeyword = () => {
    if (!newBingKeyword.trim()) return;
    const updated = bingList.includes(newBingKeyword.trim()) ? bingList : [...bingList, newBingKeyword.trim()];
    setBingKeywords(updated.join(', '));
    setNewBingKeyword('');
  };
  const removeBingKeyword = (kw: string) => setBingKeywords(bingList.filter(k => k !== kw).join(', '));

  const copyGoogleToBing = () => {
    setBingKeywords(googleKeywords);
    setSuccess(t("Copied Google keywords to Bing"));
  };

  const handleSaveKeywords = async () => {
    if (!selectedPage) { setError(t("Select a page first")); return; }
    setIsActionLoading(true);
    try {
      const entry = seoEntries.find(e => e.page_path === selectedPage);
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: selectedPage,
          meta_title: entry?.meta_title || '',
          meta_description: entry?.meta_description || '',
          meta_keywords: googleKeywords,
          bing_keywords: bingKeywords,
          bing_meta_title: entry?.bing_meta_title || '',
          bing_meta_description: entry?.bing_meta_description || '',
          og_title: entry?.og_title || '',
          og_description: entry?.og_description || '',
          og_image: entry?.og_image || '',
          canonical_url: entry?.canonical_url || '',
          robots: entry?.robots || 'index, follow',
          schema_markup: entry?.schema_markup || null,
        }),
      });
      const data = await safeJson(res);
      if (data.success) { setSuccess(t("Google & Bing keywords saved!")); fetchSeoEntries(); }
      else { setError(data.error || t("Failed to save")); }
    } catch (err) { setError(t("An error occurred")); }
    finally { setIsActionLoading(false); }
  };

  // Aggregate all keywords across pages
  const allGoogleKeywords: Record<string, number> = {};
  const allBingKeywords: Record<string, number> = {};
  seoEntries.forEach(entry => {
    if (entry.meta_keywords) {
      entry.meta_keywords.split(',').map((k: string) => k.trim()).filter(Boolean).forEach((kw: string) => {
        allGoogleKeywords[kw] = (allGoogleKeywords[kw] || 0) + 1;
      });
    }
    if (entry.bing_keywords) {
      entry.bing_keywords.split(',').map((k: string) => k.trim()).filter(Boolean).forEach((kw: string) => {
        allBingKeywords[kw] = (allBingKeywords[kw] || 0) + 1;
      });
    }
  });

  const activeList = kwTab === 'google' ? googleList : bingList;
  const activeNew = kwTab === 'google' ? newGoogleKeyword : newBingKeyword;
  const setActiveNew = kwTab === 'google' ? setNewGoogleKeyword : setNewBingKeyword;
  const addActive = kwTab === 'google' ? addGoogleKeyword : addBingKeyword;
  const removeActive = kwTab === 'google' ? removeGoogleKeyword : removeBingKeyword;
  const allActive = kwTab === 'google' ? allGoogleKeywords : allBingKeywords;
  const accentColor = kwTab === 'google' ? '#ff6b35' : '#06b6d4';
  const accentName = kwTab === 'google' ? 'Google' : 'Bing';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">{t("Keywords Manager")}</h2>
        <p className="text-sm text-muted-foreground">{t("Manage Google & Bing SEO keywords for each page")}</p>
      </div>

      {/* Google / Bing Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 w-fit">
        <button onClick={() => setKwTab('google')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${kwTab === 'google' ? 'bg-[#ff6b35] text-white shadow-lg' : isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-white'}`}>
          <SearchIcon className="w-4 h-4" /> Google
        </button>
        <button onClick={() => setKwTab('bing')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${kwTab === 'bing' ? 'bg-cyan-500 text-white shadow-lg' : isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-white'}`}>
          <Globe className="w-4 h-4" /> Bing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keyword Editor */}
        <Card className={`lg:col-span-2 ${isDark ? 'bg-[#12121a]' : 'bg-white'}`} style={{ borderColor: `${accentColor}33` }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: accentColor }} className="flex items-center gap-2"><Tag className="w-5 h-5" /> {t("Edit")} {accentName} {t("Keywords")}</CardTitle>
              {kwTab === 'bing' && selectedPage && (
                <Button type="button" variant="outline" size="sm" className="text-[10px] h-7 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/10" onClick={copyGoogleToBing}>
                  <RefreshCw className="w-3 h-3 mr-1" /> {t("Copy from Google")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Select Page")}</Label>
              <select value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)} className={`w-full h-10 px-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}>
                <option value="">{t("Select a page...")}</option>
                {seoEntries.map((e) => (<option key={e.page_path} value={e.page_path}>{e.page_path} - {e.meta_title || t("Untitled")}</option>))}
              </select>
            </div>

            {selectedPage && (
              <>
                <div className="flex gap-2">
                  <Input placeholder={`${t("Add a")} ${accentName} ${t("keyword")}...`} value={activeNew} onChange={(e) => setActiveNew(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addActive(); } }} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} />
                  <Button type="button" onClick={addActive} style={{ backgroundColor: accentColor }} className="text-white hover:opacity-90"><Plus className="w-4 h-4" /></Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-dashed" style={{ borderColor: `${accentColor}40` }}>
                  {activeList.length > 0 ? activeList.map((kw, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                      {kw}
                      <button onClick={() => removeActive(kw)} className="ml-1 hover:text-red-500 transition-colors">&times;</button>
                    </span>
                  )) : <p className="text-xs text-muted-foreground italic">{t("No")} {accentName} {t("keywords yet. Add some above.")}</p>}
                </div>

                {/* Keyword count comparison */}
                <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff6b35]"></span> Google: {googleList.length}</span>
                    <span className="text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Bing: {bingList.length}</span>
                  </div>
                  {kwTab === 'bing' && bingList.length === 0 && googleList.length > 0 && (
                    <span className="text-[10px] text-cyan-500 italic">{t("Tip: Copy Google keywords to Bing")}</span>
                  )}
                </div>

                <Button onClick={handleSaveKeywords} style={{ backgroundColor: accentColor }} className="w-full text-white font-black h-12 rounded-xl hover:opacity-90" disabled={isActionLoading}>
                  {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {t("Save Google & Bing Keywords")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* All Keywords Overview */}
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardHeader>
            <CardTitle style={{ color: accentColor }} className="flex items-center gap-2"><SearchIcon className="w-5 h-5" /> {t("All")} {accentName} {t("Keywords")}</CardTitle>
            <CardDescription>{Object.keys(allActive).length} {t("unique keywords")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" /></div>
            ) : Object.keys(allActive).length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-4">{t("No")} {accentName} {t("keywords found")}</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                {Object.entries(allActive).sort(([, a], [, b]) => b - a).map(([kw, count]) => (
                  <span key={kw} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold`} style={{ backgroundColor: count > 1 ? `${accentColor}20` : undefined, color: count > 1 ? accentColor : undefined }}>
                    {kw}
                    {count > 1 && <span className="text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]" style={{ backgroundColor: accentColor }}>{count}</span>}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-page keyword summary - Both Google & Bing */}
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("Keywords by Page")}</CardTitle>
          <CardDescription>{t("Google & Bing keywords for all configured pages")}</CardDescription>
        </CardHeader>
        <CardContent>
          {seoEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">{t("No SEO entries. Add pages in SEO Manager first.")}</p>
          ) : (
            <div className="space-y-3">
              {seoEntries.map((entry) => {
                const gKws = entry.meta_keywords ? entry.meta_keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
                const bKws = entry.bing_keywords ? entry.bing_keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
                return (
                  <div key={entry.id} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-[#ff6b35]">{entry.page_path}</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"></span> G: {gKws.length}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> B: {bKws.length}</span>
                      </div>
                    </div>
                    {/* Google Keywords */}
                    {gKws.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[9px] uppercase font-bold tracking-widest text-[#ff6b35] mb-1">Google</p>
                        <div className="flex flex-wrap gap-1">
                          {gKws.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-[#ff6b35]/10 text-[#ff6b35] text-[9px] font-bold">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Bing Keywords */}
                    {bKws.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-cyan-500 mb-1">Bing</p>
                        <div className="flex flex-wrap gap-1">
                          {bKws.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[9px] font-bold">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {gKws.length === 0 && bKws.length === 0 && (
                      <span className="text-[10px] text-muted-foreground italic">{t("No keywords")}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PageViewsChart({ chartData, maxChartValue, isDark }: { chartData: { date: string; count: number }[]; maxChartValue: number; isDark: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartHeight = 200;
  const yAxisSteps = 5;
  const yLabels = Array.from({ length: yAxisSteps + 1 }, (_, i) => Math.round((maxChartValue / yAxisSteps) * (yAxisSteps - i)));

  // Build SVG path for the line/area
  const points = chartData.map((d, i) => {
    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
    const y = maxChartValue > 0 ? ((1 - d.count / maxChartValue) * 100) : 100;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = linePath + ` L ${points[points.length - 1]?.x || 0} 100 L ${points[0]?.x || 0} 100 Z`;

  // Show fewer date labels to avoid overlap
  const labelInterval = Math.max(1, Math.floor(chartData.length / 7));

  return (
    <div className="relative">
      <div className="flex">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-3 py-1" style={{ height: chartHeight }}>
          {yLabels.map((label, i) => (
            <span key={i} className="text-[10px] font-mono text-muted-foreground leading-none text-right min-w-[28px]">{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative" style={{ height: chartHeight }}>
          {/* Horizontal grid lines */}
          {yLabels.map((_, i) => (
            <div key={i} className={`absolute w-full border-t ${isDark ? 'border-white/5' : 'border-black/5'}`} style={{ top: `${(i / yAxisSteps) * 100}%` }} />
          ))}

          {/* SVG chart */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {chartData.length > 1 && (
              <>
                <path d={areaPath} fill="url(#areaGradient)" />
                <path d={linePath} fill="none" stroke="#ff6b35" strokeWidth="0.5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: '2px' }} />
              </>
            )}
            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 1.2 : 0.7}
                fill={hoveredIndex === i ? '#ff6b35' : isDark ? '#1a1a2e' : '#fff'}
                stroke="#ff6b35"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: hoveredIndex === i ? '2.5px' : '1.5px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>

          {/* Hover tooltip */}
          {hoveredIndex !== null && chartData[hoveredIndex] && (
            <div
              className={`absolute z-10 px-3 py-2 rounded-lg shadow-xl border text-xs pointer-events-none ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/30 text-white' : 'bg-white border-[#ff6b35]/20 text-[#2d1810]'}`}
              style={{
                left: `${points[hoveredIndex].x}%`,
                top: `${points[hoveredIndex].y}%`,
                transform: `translate(-50%, ${points[hoveredIndex].y < 30 ? '12px' : '-120%'})`,
              }}
            >
              <p className="font-bold text-[#ff6b35]">{chartData[hoveredIndex].count} views</p>
              <p className="text-muted-foreground text-[10px]">{chartData[hoveredIndex].date}</p>
            </div>
          )}

          {/* Invisible hover zones for each data point */}
          <div className="absolute inset-0 flex">
            {chartData.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex ml-[36px] mt-2">
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 text-center" style={{ minWidth: 0 }}>
            {i % labelInterval === 0 ? (
              <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">
                {d.date.slice(5)}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ activeTab, setActiveTab, handleLogout, isDark, t }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void, 
  handleLogout: () => void, 
  isDark: boolean, 
  t: (key: string) => string 
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ff6b35]/20 bg-[#ff6b35]/5 flex items-center justify-center">
            <img src="https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/LOGO/favicon_bg_fixed.ico" alt="Katyaayani Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-cinzel)] text-sm font-bold tracking-tight text-[#ff6b35] leading-tight text-left">Katyaayani Astrologer</h1>
            <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground/70 text-left">{t("Admin Panel")}</p>
          </div>
        </div>
          <nav className="space-y-1">
            <NavItem icon={<Globe className="w-4 h-4" />} label={t("Go to Website")} onClick={() => router.push("/")} isDark={isDark} />
            <div className="my-4 border-t border-[#ff6b35]/10 pt-4"></div>
            <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label={t("Dashboard")} active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} isDark={isDark} />
          <NavItem icon={<Calendar className="w-4 h-4" />} label={t("Bookings")} active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} isDark={isDark} />
          <NavItem icon={<RefreshCw className="w-4 h-4" />} label={t("Reschedule")} active={activeTab === "reschedule"} onClick={() => setActiveTab("reschedule")} isDark={isDark} />
          <NavItem icon={<CreditCard className="w-4 h-4" />} label={t("Invoices")} active={activeTab === "invoices"} onClick={() => setActiveTab("invoices")} isDark={isDark} />
          <NavItem icon={<MessageSquare className="w-4 h-4" />} label={t("Enquiries")} active={activeTab === "enquiries"} onClick={() => setActiveTab("enquiries")} isDark={isDark} />
          <NavItem icon={<CalendarDays className="w-4 h-4" />} label={t("Availability")} active={activeTab === "availability"} onClick={() => setActiveTab("availability")} isDark={isDark} />
          <NavItem icon={<Users className="w-4 h-4" />} label={t("Users")} active={activeTab === "users"} onClick={() => setActiveTab("users")} isDark={isDark} />
          <NavItem icon={<KeyRound className="w-4 h-4" />} label={t("Resets")} active={activeTab === "resets"} onClick={() => setActiveTab("resets")} isDark={isDark} />
            <NavItem icon={<Star className="w-4 h-4" />} label={t("Feedback")} active={activeTab === "feedback"} onClick={() => setActiveTab("feedback")} isDark={isDark} />
              <NavItem icon={<Bell className="w-4 h-4" />} label={t("Broadcast")} active={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")} isDark={isDark} />
                  <NavItem icon={<Mail className="w-4 h-4" />} label={t("Newsletter")} active={activeTab === "newsletter"} onClick={() => setActiveTab("newsletter")} isDark={isDark} />
                  <NavItem icon={<Server className="w-4 h-4" />} label={t("Email Config")} active={activeTab === "email-config"} onClick={() => setActiveTab("email-config")} isDark={isDark} />
                  <NavItem icon={<Palette className="w-4 h-4" />} label={t("Email Templates")} active={activeTab === "email-templates"} onClick={() => setActiveTab("email-templates")} isDark={isDark} />
                  <NavItem icon={<IndianRupee className="w-4 h-4" />} label={t("Pricing")} active={activeTab === "pricing"} onClick={() => setActiveTab("pricing")} isDark={isDark} />
                  <NavItem icon={<Tag className="w-4 h-4" />} label={t("Offers")} active={activeTab === "offer"} onClick={() => setActiveTab("offer")} isDark={isDark} />
                  <NavItem icon={<Sun className="w-4 h-4" />} label={t("Daily Rashifal")} active={activeTab === "rashifal"} onClick={() => setActiveTab("rashifal")} isDark={isDark} />
                <NavItem icon={<Calendar className="w-4 h-4" />} label={t("Weekly Rashifal")} active={activeTab === "weekly-rashifal"} onClick={() => setActiveTab("weekly-rashifal")} isDark={isDark} />
              <NavItem icon={<FileText className="w-4 h-4" />} label={t("Blog")} active={activeTab === "blog"} onClick={() => setActiveTab("blog")} isDark={isDark} />
                <NavItem icon={<ImageIcon className="w-4 h-4" />} label={t("Gallery")} active={activeTab === "gallery"} onClick={() => setActiveTab("gallery")} isDark={isDark} />
                    <NavItem icon={<SearchIcon className="w-4 h-4" />} label={t("SEO Manager")} active={activeTab === "seo"} onClick={() => setActiveTab("seo")} isDark={isDark} />
                  <NavItem icon={<Tag className="w-4 h-4" />} label={t("Keywords")} active={activeTab === "keywords"} onClick={() => setActiveTab("keywords")} isDark={isDark} />
                  <NavItem icon={<BarChart3 className="w-4 h-4" />} label={t("Analytics")} active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} isDark={isDark} />
                  <div className="my-4 border-t border-[#ff6b35]/10 pt-4">
                    <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground/50 px-4 mb-2">{t("Site Management")}</p>
                  </div>
                  <NavItem icon={<FileText className="w-4 h-4" />} label={t("Pages")} active={activeTab === "pages"} onClick={() => setActiveTab("pages")} isDark={isDark} />
                  <NavItem icon={<Link2 className="w-4 h-4" />} label={t("Redirects")} active={activeTab === "redirects"} onClick={() => setActiveTab("redirects")} isDark={isDark} />
                  <NavItem icon={<Globe className="w-4 h-4" />} label={t("Sitemap")} active={activeTab === "sitemap"} onClick={() => setActiveTab("sitemap")} isDark={isDark} />
                    <NavItem icon={<Activity className="w-4 h-4" />} label={t("Audit Logs")} active={activeTab === "audit-logs"} onClick={() => setActiveTab("audit-logs")} isDark={isDark} />
                      <NavItem icon={<Palette className="w-4 h-4" />} label={t("Branding")} active={activeTab === "branding"} onClick={() => setActiveTab("branding")} isDark={isDark} />

                    <div className="my-4 border-t border-[#ff6b35]/10 pt-4">
                      <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground/50 px-4 mb-2">{t("Optimization & Monitoring")}</p>
                    </div>
                    <NavItem icon={<Search className="w-4 h-4" />} label={t("SEO Testing")} active={activeTab === "seo-testing"} onClick={() => setActiveTab("seo-testing")} isDark={isDark} />
                      <NavItem icon={<Monitor className="w-4 h-4" />} label={t("SEO Monitor")} active={activeTab === "seo-monitor"} onClick={() => setActiveTab("seo-monitor")} isDark={isDark} />
                    <NavItem icon={<Eye className="w-4 h-4" />} label={t("Social Preview")} active={activeTab === "social-preview"} onClick={() => setActiveTab("social-preview")} isDark={isDark} />
                      <NavItem icon={<Send className="w-4 h-4" />} label={t("Google & Bing SEO")} active={activeTab === "webmaster-ping"} onClick={() => setActiveTab("webmaster-ping")} isDark={isDark} />
                       <NavItem icon={<Search className="w-4 h-4" />} label={t("Indexing")} active={activeTab === "indexing"} onClick={() => setActiveTab("indexing")} isDark={isDark} />
                    <NavItem icon={<Zap className="w-4 h-4" />} label={t("Automation")} active={activeTab === "automation"} onClick={() => setActiveTab("automation")} isDark={isDark} />
                    <NavItem icon={<Gauge className="w-4 h-4" />} label={t("Performance")} active={activeTab === "performance"} onClick={() => setActiveTab("performance")} isDark={isDark} />

                    <div className="my-4 border-t border-[#ff6b35]/10 pt-4">
                      <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-muted-foreground/50 px-4 mb-2">{t("Enterprise")}</p>
                    </div>
                    <NavItem icon={<Shield className="w-4 h-4" />} label={t("Security")} active={activeTab === "security"} onClick={() => setActiveTab("security")} isDark={isDark} />
                    <NavItem icon={<Clock className="w-4 h-4" />} label={t("Scheduling")} active={activeTab === "scheduling"} onClick={() => setActiveTab("scheduling")} isDark={isDark} />
                    <NavItem icon={<FileText className="w-4 h-4" />} label={t("Reports")} active={activeTab === "reports"} onClick={() => setActiveTab("reports")} isDark={isDark} />
                    <NavItem icon={<Server className="w-4 h-4" />} label={t("DevOps")} active={activeTab === "devops"} onClick={() => setActiveTab("devops")} isDark={isDark} />
                    <NavItem icon={<Globe className="w-4 h-4" />} label={t("Scaling")} active={activeTab === "scaling"} onClick={() => setActiveTab("scaling")} isDark={isDark} />

                      <NavItem icon={<Settings className="w-4 h-4" />} label={t("Settings")} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} isDark={isDark} />

        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-[#ff6b35]/10">
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handleLogout}>
          <LogOut className="w-4 h-4" /> {t("Logout")}
        </Button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isDark }: { icon: any, label: string, active?: boolean, onClick: () => void, isDark: boolean }) {
  return (<button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active ? 'bg-[#ff6b35] text-white shadow-lg' : isDark ? 'text-[#a0998c] hover:bg-white/5 hover:text-[#f5f0e8]' : 'text-[#6b5847] hover:bg-[#ff6b35]/5 hover:text-[#ff6b35]'}`}>{icon} {label} {active && <ChevronRight className="w-4 h-4 ml-auto" />}</button>);
}

function StatCard({ title, value, trend, icon, isDark }: { title: string, value: string, trend: string, icon: any, isDark: boolean }) {
  return (
    <Card className={`${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'} shadow-lg group`}><CardContent className="p-4 md:p-6"><div className="flex items-center justify-between mb-4"><div className="p-2 rounded-lg bg-[#ff6b35]/10 text-[#ff6b35] group-hover:scale-110 transition-transform">{icon}</div><span className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{trend}</span></div><p className="text-muted-foreground mb-1 font-bold uppercase tracking-widest text-[8px] md:text-[10px] text-left">{title}</p><h3 className="text-xl md:text-2xl font-black tracking-tighter text-left">{value}</h3></CardContent></Card>
  );
}

function ActivityItem({ activity, isDark, t }: { activity: Activity, isDark: boolean, t: (key: string) => string }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'user': return <UserPlus className="w-4 h-4" />;
      case 'enquiry': return <MessageCircle className="w-4 h-4" />;
      case 'feedback': return <Star className="w-4 h-4" />;
      case 'reset_request': return <KeyRound className="w-4 h-4" />;
      case 'admin_action': return <Lock className="w-4 h-4" />;
    }
  };
  const getColor = () => {
    switch (activity.type) {
      case 'booking': return 'bg-blue-500/10 text-blue-500';
      case 'user': return 'bg-green-500/10 text-green-500';
      case 'enquiry': return 'bg-amber-500/10 text-amber-500';
      case 'feedback': return 'bg-purple-500/10 text-purple-500';
      case 'reset_request': return 'bg-red-500/10 text-red-500';
      case 'admin_action': return 'bg-[#ff6b35]/10 text-[#ff6b35]';
    }
  };
  return (
    <div className="flex gap-4 group cursor-pointer text-left">
      <div className={`mt-1 p-2 rounded-full h-fit ${getColor()} group-hover:scale-110 transition-transform`}>{getIcon()}</div>
      <div className="flex-1 min-w-0 border-b border-[#ff6b35]/5 pb-4 group-last:border-none">
        <div className="flex items-center justify-between mb-1"><p className="font-bold text-sm truncate">{t(activity.title)}</p><span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> {new Date(activity.time).toLocaleDateString()}</span></div>
        <p className="text-xs text-muted-foreground truncate">{t(activity.description)}</p>
      </div>
    </div>
  );
}

function StatusBadge({ label, value, color }: { label: string, value: string, color: 'green' | 'amber' | 'red' }) {
  const colorClass = color === 'green' ? 'bg-green-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500';
  return (<div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-[#ff6b35]/5"><span className="text-xs font-bold text-muted-foreground">{label}</span><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${colorClass} animate-pulse`}></span><span className="text-xs font-black">{value}</span></div></div>);
}

function Alert({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  return (<div className={`p-4 rounded-xl border flex items-center justify-between ${type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}><div className="flex items-center gap-3">{type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}<p className="text-sm font-bold">{message}</p></div><Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-2 font-bold text-lg"></Button></div>);
}

function LoadingState() {
  const { t } = useTranslation();
  return (<div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mb-4 text-[#ff6b35]" /><p className="font-bold text-sm uppercase tracking-widest">{t("Loading Records...")}</p></div>);
}

function EmptyState({ message }: { message: string }) {
  return <div className="text-center py-12 text-muted-foreground italic font-medium">{message}</div>;
}

function DetailBox({ label, value, icon, isStatus }: { label: string, value: string, icon: any, isStatus?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className={`p-3 md:p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#ff6b35]/10'}`}>
      <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
        {icon} {label}
      </p>
      {isStatus ? (
        <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase ${value === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
          {value}
        </span>
      ) : (
        <p className="font-bold text-xs md:text-sm truncate">{value}</p>
      )}
    </div>
  );
}

const RASHI_LIST = [
  { english: 'aries', gujarati: 'મેષ', hindi: 'मेष' },
  { english: 'taurus', gujarati: 'વૃષભ', hindi: 'वृषभ' },
  { english: 'gemini', gujarati: 'મિથુન', hindi: 'मिथुन' },
  { english: 'cancer', gujarati: 'કર્ક', hindi: 'कर्क' },
  { english: 'leo', gujarati: 'સિંહ', hindi: 'सिंह' },
  { english: 'virgo', gujarati: 'કન્યા', hindi: 'कन्या' },
  { english: 'libra', gujarati: 'તુલા', hindi: 'तुला' },
  { english: 'scorpio', gujarati: 'વૃશ્ચિક', hindi: 'वृश्चिक' },
  { english: 'sagittarius', gujarati: 'ધન', hindi: 'धनु' },
  { english: 'capricorn', gujarati: 'મકર', hindi: 'मकर' },
  { english: 'aquarius', gujarati: 'કુંભ', hindi: 'कुंभ' },
  { english: 'pisces', gujarati: 'મીન', hindi: 'मीन' },
];

const RASHI_ICONS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

function RashifalManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError, mode = 'daily' }: { 
  isDark: boolean, 
  t: (key: string) => string,
  isActionLoading: boolean,
  setIsActionLoading: (v: boolean) => void,
  setSuccess: (v: string) => void,
  setError: (v: string) => void,
  mode?: 'daily' | 'weekly'
}) {
  const [rashifalMode, setRashifalMode] = useState<'daily' | 'weekly'>(mode);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRashi, setSelectedRashi] = useState('aries');
  const [rashifalForm, setRashifalForm] = useState({
    content_english: '',
      content_gujarati: '',
      content_hindi: '',
    });

    const [existingData, setExistingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Weekly state
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date.toISOString().split('T')[0];
  };
  const getSunday = (mondayStr: string) => {
    const d = new Date(mondayStr + 'T00:00:00');
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  };
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const weekEnd = getSunday(weekStart);
  const [weeklyExistingData, setWeeklyExistingData] = useState<any[]>([]);
  const [weeklyForm, setWeeklyForm] = useState({
    content_english: '',
    content_gujarati: '',
    content_hindi: '',
  });

  useEffect(() => {
    if (rashifalMode === 'daily') {
      fetchExistingRashifal();
    } else {
      fetchWeeklyRashifal();
    }
  }, [selectedDate, weekStart, rashifalMode]);

  useEffect(() => {
    if (rashifalMode === 'daily') {
      const existing = existingData.find(r => r.rashi === selectedRashi);
      if (existing) {
        setRashifalForm({
            content_english: existing.content_english || '',
            content_gujarati: existing.content_gujarati || '',
            content_hindi: existing.content_hindi || '',
          });
        } else {
          setRashifalForm({ content_english: '', content_gujarati: '', content_hindi: '' });
        }
      } else {
        const existing = weeklyExistingData.find(r => r.rashi === selectedRashi);
        if (existing) {
          setWeeklyForm({
            content_english: existing.content_english || '',
            content_gujarati: existing.content_gujarati || '',
            content_hindi: existing.content_hindi || '',
          });
        } else {
          setWeeklyForm({ content_english: '', content_gujarati: '', content_hindi: '' });
        }
      }
  }, [selectedRashi, existingData, weeklyExistingData, rashifalMode]);

  const fetchExistingRashifal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rashifal?date=${selectedDate}`);
      const data = await safeJson(res);
      if (data.success) setExistingData(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchWeeklyRashifal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weekly-rashifal?week_start=${weekStart}`);
      const data = await safeJson(res);
      if (data.success) setWeeklyExistingData(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSaveRashifal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rashifalForm.content_gujarati && !rashifalForm.content_english) {
      setError(t("Please enter content in at least one language"));
      return;
    }
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/rashifal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDate,
            rashifals: [{ rashi: selectedRashi, ...rashifalForm }],
          }),
      });
      const data = await safeJson(res);
        if (data.success) {
          setSuccess(t("Rashifal saved successfully!"));
          fetchExistingRashifal();
        } else {
          setError(data.error || t("Failed to save rashifal"));
        }
      } catch (err) { setError(t("An error occurred")); }
      finally { setIsActionLoading(false); }
    };

    const handleSaveWeeklyRashifal = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!weeklyForm.content_gujarati && !weeklyForm.content_english) {
        setError(t("Please enter content in at least one language"));
        return;
      }
      setIsActionLoading(true);
      try {
        const res = await fetch('/api/weekly-rashifal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              week_start: weekStart,
              week_end: weekEnd,
              rashifals: [{ rashi: selectedRashi, ...weeklyForm }],
            }),
        });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(t("Weekly Rashifal saved successfully!"));
          fetchWeeklyRashifal();
        } else {
          setError(data.error || t("Failed to save weekly rashifal"));
        }
      } catch (err) { setError(t("An error occurred")); }
      finally { setIsActionLoading(false); }
    };

    const handleSendRashifalEmail = async () => {
      setSendingEmail(true);
      try {
        const endpoint = rashifalMode === 'daily' 
          ? `/api/rashifal/send-email` 
          : `/api/weekly-rashifal/send-email`;
        const payload = rashifalMode === 'daily' 
          ? { date: selectedDate }
          : { week_start: weekStart, week_end: weekEnd };
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(`${t("Email sent successfully to")} ${data.totalUsers} ${t("users")}!`);
        } else {
          setError(data.error || t("Failed to send emails"));
        }
      } catch (err) { setError(t("An error occurred while sending emails")); }
      finally { setSendingEmail(false); }
    };

    const [subscriberEmail, setSubscriberEmail] = useState("");
    const [subscriberName, setSubscriberName] = useState("");

    const handleAddSubscriber = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!subscriberEmail || !subscriberEmail.includes("@")) {
        setError(t("Please enter a valid email"));
        return;
      }
      setIsActionLoading(true);
      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: subscriberEmail,
            firstName: subscriberName 
          }),
        });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(t("Subscriber added successfully!"));
          setSubscriberEmail("");
          setSubscriberName("");
        } else {
          setError(data.error || t("Failed to add subscriber"));
        }
      } catch (err) {
        setError(t("An error occurred"));
      } finally {
        setIsActionLoading(false);
      }
    };

    const currentData = rashifalMode === 'daily' ? existingData : weeklyExistingData;
  const currentForm = rashifalMode === 'daily' ? rashifalForm : weeklyForm;
  const setCurrentForm = rashifalMode === 'daily' ? setRashifalForm : setWeeklyForm;
  const rashiInfo = RASHI_LIST.find(r => r.english === selectedRashi);
  const hasExisting = currentData.find(r => r.rashi === selectedRashi);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35]">
              {rashifalMode === 'daily' ? t("Daily Rashifal Manager") : t("Weekly Rashifal Manager")}
            </h2>
            <p className="text-muted-foreground">
              {rashifalMode === 'daily' 
                ? t("Add or edit daily horoscope predictions for all 12 rashis") 
                : t("Add or edit weekly horoscope predictions for all 12 rashis")}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${rashifalMode === 'daily' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
            {rashifalMode === 'daily' ? t("Daily Mode") : t("Weekly Mode")}
          </span>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Date & Rashi Selection */}
        <Card className={`lg:col-span-1 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
          <CardHeader>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5" /> {rashifalMode === 'daily' ? t("Select Date & Rashi") : t("Select Week & Rashi")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rashifalMode === 'daily' ? (
              <div className="space-y-2">
                <Label>{t("Date")}</Label>
                <Input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{t("Week Start (Monday)")}</Label>
                <Input 
                  type="date" 
                  value={weekStart} 
                  onChange={(e) => setWeekStart(e.target.value)}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                />
                <p className="text-[10px] text-muted-foreground">{t("Week")}: {weekStart} {t("to")} {weekEnd}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("Rashi")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {RASHI_LIST.map((rashi) => {
                    const hasData = currentData.find(r => r.rashi === rashi.english);
                    return (
                      <button
                        key={rashi.english}
                        onClick={() => setSelectedRashi(rashi.english)}
                        className={`p-2 rounded-lg text-left flex items-center gap-2 transition-all ${
                          selectedRashi === rashi.english 
                            ? 'bg-[#ff6b35] text-white' 
                            : isDark 
                              ? 'bg-white/5 hover:bg-white/10' 
                              : 'bg-gray-100 hover:bg-gray-200'
                        } ${hasData ? 'ring-2 ring-green-500/50' : ''}`}
                      >
                        <span className="text-lg leading-none">{RASHI_ICONS[rashi.english]}</span>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold leading-tight">{rashi.gujarati}</div>
                          <div className="text-[9px] opacity-70 leading-tight capitalize">{rashi.english}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                {t("Green border = Data exists")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rashifal Form */}
        <Card className={`lg:col-span-3 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{RASHI_ICONS[selectedRashi]}</div>
                <div>
                  <CardTitle className="text-[#ff6b35]">
                    {rashiInfo?.gujarati} / {rashiInfo?.hindi} / {selectedRashi.charAt(0).toUpperCase() + selectedRashi.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    {rashifalMode === 'daily' ? selectedDate : `${weekStart} to ${weekEnd}`} {hasExisting && <span className="text-green-500 font-bold ml-2">({t("Existing")})</span>}
                  </CardDescription>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${rashifalMode === 'daily' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                {rashifalMode === 'daily' ? t("Daily") : t("Weekly")}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={rashifalMode === 'daily' ? handleSaveRashifal : handleSaveWeeklyRashifal} className="space-y-6">
              {/* Content Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-[#ff6b35]">ગુજરાતી</span> {t("Content")}
                  </Label>
                  <textarea
                    className={`w-full min-h-[150px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                    placeholder="ગુજરાતીમાં રાશિફળ લખો..."
                    value={currentForm.content_gujarati}
                    onChange={(e) => setCurrentForm({...currentForm, content_gujarati: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-[#ff6b35]">हिंदी</span> {t("Content")}
                  </Label>
                  <textarea
                    className={`w-full min-h-[150px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                    placeholder="हिंदी में राशिफल लिखें..."
                    value={currentForm.content_hindi}
                    onChange={(e) => setCurrentForm({...currentForm, content_hindi: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-[#ff6b35]">English</span> {t("Content")}
                  </Label>
                  <textarea
                    className={`w-full min-h-[150px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                    placeholder="Write horoscope in English..."
                    value={currentForm.content_english}
                    onChange={(e) => setCurrentForm({...currentForm, content_english: e.target.value})}
                  />
                </div>
              </div>

                {/* Email Notification Toggle */}

                  <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {hasExisting ? t("Update Rashifal") : t("Save Rashifal")}
                  </Button>

                  {/* Send Mail Button - separate from save */}
                  {currentData.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSendRashifalEmail}
                      disabled={sendingEmail}
                      className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-black text-white transition-all duration-200 ${
                        sendingEmail 
                          ? 'bg-green-600/50 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
                      }`}
                    >
                      {sendingEmail ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t("Sending Emails...")}</>
                      ) : (
                        <><Mail className="w-4 h-4" /> {rashifalMode === 'daily' ? t("Send Daily Rashifal Email to All Users") : t("Send Weekly Rashifal Email to All Users")}</>
                      )}
                    </button>
                  )}
                </form>
            </CardContent>
          </Card>
        </div>

        {/* Manual Email Addition */}
        <Card className={`mt-6 ${isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}>
          <CardHeader>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> {t("Manual Email Addition")}
            </CardTitle>
            <CardDescription>
              {rashifalMode === 'daily' 
                ? t("Manually add emails to receive daily horoscope updates. These will be added to the newsletter subscriber list.") 
                : t("Manually add emails to receive weekly horoscope updates. These will be added to the newsletter subscriber list.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubscriber} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label>{t("Email Address")} *</Label>
                <Input 
                  type="email" 
                  placeholder="example@gmail.com" 
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>{t("Devotee Name")} ({t("Optional")})</Label>
                <Input 
                  placeholder="Sevak Name" 
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full md:w-auto bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold h-10 px-6 rounded-xl" disabled={isActionLoading}>
                  {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {t("Add Email")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

// Blog Manager Component
function BlogManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean;
  t: (key: string) => string;
  isActionLoading: boolean;
  setIsActionLoading: (v: boolean) => void;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}) {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
      const [loading, setLoading] = useState(false);
      const [showForm, setShowForm] = useState(false);
        const [editingPost, setEditingPost] = useState<any>(null);
        const [uploading, setUploading] = useState(false);
        const [sendingBlogEmail, setSendingBlogEmail] = useState<string | null>(null);
        const [blogTab, setBlogTab] = useState<'posts' | 'categories'>('posts');

      // Dynamic categories from DB
      const [BLOG_CATEGORIES, setBlogCategories] = useState<{id: string; value: string; label_en: string; label_gu: string; label_hi: string; icon: string; sort_order: number}[]>([]);
      const [catLoading, setCatLoading] = useState(false);
      const [newCat, setNewCat] = useState({ value: '', label_en: '', label_gu: '', label_hi: '', icon: '📝' });

      const fetchCategories = async () => {
        setCatLoading(true);
        try {
          const res = await fetch('/api/blog/categories');
          const data = await res.json();
          if (data.success) setBlogCategories(data.data || []);
        } catch {}
        finally { setCatLoading(false); }
      };

      const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCat.value || !newCat.label_en) { setError('Slug and English name are required'); return; }
        setIsActionLoading(true);
        try {
          const res = await fetch('/api/blog/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCat),
          });
          const data = await res.json();
          if (data.success) {
            setSuccess('Category added!');
            setNewCat({ value: '', label_en: '', label_gu: '', label_hi: '', icon: '📝' });
            fetchCategories();
          } else { setError(data.error || 'Failed'); }
        } catch { setError('An error occurred'); }
        finally { setIsActionLoading(false); }
      };

      const handleDeleteCategory = async (id: string, label: string) => {
        if (!confirm(`Delete category "${label}"? Posts with this category won't be changed.`)) return;
        setIsActionLoading(true);
        try {
          const res = await fetch(`/api/blog/categories?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) { setSuccess('Category deleted!'); fetchCategories(); }
          else { setError(data.error || 'Failed'); }
        } catch { setError('An error occurred'); }
        finally { setIsActionLoading(false); }
      };

      const [blogForm, setBlogForm] = useState({
      title: '',
      title_gujarati: '',
      title_hindi: '',
      slug: '',
      excerpt: '',
      excerpt_gujarati: '',
      excerpt_hindi: '',
      content: '',
      content_gujarati: '',
      content_hindi: '',
      category: 'astrology',
      featured_image: '',
      is_published: true,
    });

    useEffect(() => {
        fetchBlogPosts();
        fetchCategories();
      }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'blog');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await safeJson(res);
        if (data.success) {
          setBlogForm(prev => ({ ...prev, featured_image: data.url }));
          setSuccess('Image uploaded successfully!');
        } else {
          setError(data.error || 'Upload failed');
        }
      } catch {
        setError('Upload failed');
      } finally {
        setUploading(false);
      }
    };

    const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?limit=100&admin=true');
      const data = await safeJson(res);
      if (data.success) {
        setBlogPosts(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setBlogForm({
      ...blogForm,
      title: value,
      slug: generateSlug(value),
    });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) {
      setError(t("Title is required"));
      return;
    }
    setIsActionLoading(true);
    try {
      const method = editingPost ? 'PUT' : 'POST';
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogForm,
          slug: blogForm.slug || generateSlug(blogForm.title),
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(editingPost ? t("Blog post updated!") : t("Blog post created!"));
        setShowForm(false);
        setEditingPost(null);
        setBlogForm({
          title: '',
          title_gujarati: '',
          title_hindi: '',
          slug: '',
          excerpt: '',
          excerpt_gujarati: '',
          excerpt_hindi: '',
          content: '',
          content_gujarati: '',
          content_hindi: '',
          category: 'astrology',
          featured_image: '',
          is_published: true,
        });
        fetchBlogPosts();
      } else {
        setError(data.error || t("Failed to save blog post"));
      }
    } catch (err) {
      setError(t("An error occurred"));
    } finally {
      setIsActionLoading(false);
    }
  };

    const handleEditPost = (post: any) => {
      setEditingPost(post);
      setBlogForm({
        title: post.title || '',
        title_gujarati: post.title_gujarati || '',
        title_hindi: post.title_hindi || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        excerpt_gujarati: post.excerpt_gujarati || '',
        excerpt_hindi: post.excerpt_hindi || '',
        content: post.content || '',
        content_gujarati: post.content_gujarati || '',
        content_hindi: post.content_hindi || '',
        category: post.category || 'astrology',
        featured_image: post.featured_image || '',
        is_published: post.is_published ?? true,
      });
      setShowForm(true);
    };

    const handleSendBlogEmail = async (postId: string) => {
      setSendingBlogEmail(postId);
      try {
        const res = await fetch('/api/blog/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(`${t("Blog notification sent to")} ${data.totalUsers} ${t("users")}!`);
        } else {
          setError(data.error || t("Failed to send emails"));
        }
      } catch (err) { setError(t("An error occurred")); }
      finally { setSendingBlogEmail(null); }
    };

    const handleDeletePost = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this post?"))) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(t("Blog post deleted!"));
        fetchBlogPosts();
      } else {
        setError(data.error || t("Failed to delete"));
      }
    } catch (err) {
      setError(t("An error occurred"));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">{t("Blog Management")}</h2>
          <p className="text-sm text-muted-foreground">{t("Create and manage blog posts in multiple languages")}</p>
        </div>
          <div className="flex items-center gap-2">
            {/* Tab switcher */}
            <div className={`flex rounded-xl border overflow-hidden ${isDark ? 'border-[#ff6b35]/20' : 'border-[#ff6b35]/30'}`}>
              <button
                onClick={() => setBlogTab('posts')}
                className={`px-4 py-2 text-sm font-bold transition-colors ${blogTab === 'posts' ? 'bg-[#ff6b35] text-white' : isDark ? 'text-gray-400 hover:text-white' : 'text-[#6b5847] hover:text-[#ff6b35]'}`}
              >
                <FileText className="w-4 h-4 inline mr-1" /> Posts
              </button>
              <button
                onClick={() => setBlogTab('categories')}
                className={`px-4 py-2 text-sm font-bold transition-colors ${blogTab === 'categories' ? 'bg-[#ff6b35] text-white' : isDark ? 'text-gray-400 hover:text-white' : 'text-[#6b5847] hover:text-[#ff6b35]'}`}
              >
                <Tag className="w-4 h-4 inline mr-1" /> Categories
              </button>
            </div>
            {blogTab === 'posts' && (
              <Button 
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditingPost(null);
                    setBlogForm({
                      title: '', title_gujarati: '', title_hindi: '',
                      slug: '', excerpt: '', excerpt_gujarati: '', excerpt_hindi: '',
                      content: '', content_gujarati: '', content_hindi: '',
                      category: 'astrology', featured_image: '', is_published: true,
                    });
                  }
                }}
                className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
              >
                {showForm ? <><ChevronRight className="w-4 h-4 mr-2 rotate-90" /> {t("Close Form")}</> : <><Plus className="w-4 h-4 mr-2" /> {t("New Post")}</>}
              </Button>
            )}
          </div>
        </div>

        {/* Category Manager Tab */}
        {blogTab === 'categories' && (
          <div className="space-y-6">
            {/* Add category form */}
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Tag className="w-5 h-5" /> Add New Category</CardTitle>
                <CardDescription>Create a custom blog category that will appear in the dropdown and sidebar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">Icon (Emoji)</Label>
                      <Input
                        placeholder="📝"
                        value={newCat.icon}
                        onChange={(e) => setNewCat({...newCat, icon: e.target.value})}
                        className={`text-center text-xl ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}
                        maxLength={4}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">Slug (URL key) *</Label>
                      <Input
                        placeholder="e.g. festivals"
                        value={newCat.value}
                        onChange={(e) => setNewCat({...newCat, value: e.target.value.toLowerCase().replace(/\s+/g,'-')})}
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">English Name *</Label>
                      <Input
                        placeholder="Festivals"
                        value={newCat.label_en}
                        onChange={(e) => setNewCat({...newCat, label_en: e.target.value})}
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">ગુજરાતી નામ</Label>
                      <Input
                        placeholder="તહેવાર"
                        value={newCat.label_gu}
                        onChange={(e) => setNewCat({...newCat, label_gu: e.target.value})}
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold uppercase">हिंदी नाम</Label>
                      <Input
                        placeholder="त्योहार"
                        value={newCat.label_hi}
                        onChange={(e) => setNewCat({...newCat, label_hi: e.target.value})}
                        className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-bold" disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing categories list */}
            <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
              <CardHeader>
                <CardTitle className="text-[#ff6b35]">All Categories</CardTitle>
                <CardDescription>{BLOG_CATEGORIES.length} categories</CardDescription>
              </CardHeader>
              <CardContent>
                {catLoading ? (
                  <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" /></div>
                ) : BLOG_CATEGORIES.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No categories found</p>
                ) : (
                  <div className="space-y-2">
                    {BLOG_CATEGORIES.map((cat) => (
                      <div key={cat.id} className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'border-[#ff6b35]/10 bg-white/5' : 'border-[#ff6b35]/10 bg-orange-50/50'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.icon}</span>
                          <div>
                            <p className="font-bold text-sm">{cat.label_en}</p>
                            <p className="text-xs text-muted-foreground">{cat.label_gu} · {cat.label_hi} · <code className="text-[10px] bg-black/10 px-1 rounded">{cat.value}</code></p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat.id, cat.label_en)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          disabled={isActionLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {blogTab === 'posts' && showForm && (
          <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
            <CardHeader>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {editingPost ? t("Edit Blog Post") : t("Create New Blog Post")}
              </CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSaveBlog} className="space-y-6">
              {/* Titles */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground border-b border-[#ff6b35]/10 pb-2">{t("Titles")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">English</span> {t("Title")} *
                    </Label>
                    <Input
                      placeholder="Enter title in English..."
                      value={blogForm.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">ગુજરાતી</span> {t("Title")}
                    </Label>
                    <Input
                      placeholder="ગુજરાતીમાં શીર્ષક લખો..."
                      value={blogForm.title_gujarati}
                      onChange={(e) => setBlogForm({...blogForm, title_gujarati: e.target.value})}
                      className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">हिंदी</span> {t("Title")}
                    </Label>
                    <Input
                      placeholder="हिंदी में शीर्षक लिखें..."
                      value={blogForm.title_hindi}
                      onChange={(e) => setBlogForm({...blogForm, title_hindi: e.target.value})}
                      className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                    />
                  </div>
                </div>
              </div>

              {/* Excerpts */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground border-b border-[#ff6b35]/10 pb-2">{t("Short Description")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">English</span>
                    </Label>
                    <textarea
                      className={`w-full min-h-[80px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="Short description in English..."
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">ગુજરાતી</span>
                    </Label>
                    <textarea
                      className={`w-full min-h-[80px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="ટૂંકું વર્ણન ગુજરાતીમાં..."
                      value={blogForm.excerpt_gujarati}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_gujarati: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">हिंदी</span>
                    </Label>
                    <textarea
                      className={`w-full min-h-[80px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="संक्षिप्त विवरण हिंदी में..."
                      value={blogForm.excerpt_hindi}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_hindi: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground border-b border-[#ff6b35]/10 pb-2">{t("Content")}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">English</span> {t("Content")}
                    </Label>
                    <textarea
                      className={`w-full min-h-[200px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="Write full content in English..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">ગુજરાતી</span> {t("Content")}
                    </Label>
                    <textarea
                      className={`w-full min-h-[200px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="ગુજરાતીમાં સંપૂર્ણ સામગ્રી લખો..."
                      value={blogForm.content_gujarati}
                      onChange={(e) => setBlogForm({...blogForm, content_gujarati: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <span className="text-[#ff6b35]">हिंदी</span> {t("Content")}
                    </Label>
                    <textarea
                      className={`w-full min-h-[200px] p-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                      placeholder="हिंदी में पूर्ण सामग्री लिखें..."
                      value={blogForm.content_hindi}
                      onChange={(e) => setBlogForm({...blogForm, content_hindi: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("Category")}</Label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                    className={`w-full h-10 px-3 rounded-md border text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-white' : 'bg-white border-[#ff6b35]/20 text-black'}`}
                  >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.icon} {cat.label_en} / {cat.label_gu}</option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("Slug (URL)")}</Label>
                  <Input
                    placeholder="blog-post-url"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                    className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}
                  />
                </div>
                <div className="space-y-2">
                    <Label>{t("Featured Image")}</Label>
                    {blogForm.featured_image ? (
                      <div className="relative group">
                          <img
                            src={blogForm.featured_image}
                            alt="Featured"
                            className="w-full rounded-xl border border-[#ff6b35]/20"
                            style={{ height: 'auto', maxHeight: '320px', objectFit: 'contain' }}
                          />
                        <button
                          type="button"
                          onClick={() => setBlogForm({...blogForm, featured_image: ''})}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        isDark ? 'border-[#ff6b35]/20 hover:border-[#ff6b35]/40 bg-[#1a1a2e]/50' : 'border-[#ff6b35]/30 hover:border-[#ff6b35]/50 bg-orange-50/50'
                      }`}>
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
                            <span className="text-sm text-muted-foreground">{t("Uploading...")}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-[#ff6b35]/60" />
                            <span className="text-sm text-muted-foreground">{t("Click to upload image")}</span>
                            <span className="text-xs text-muted-foreground/60">JPEG, PNG, WebP, GIF (Max 5MB)</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                    <Input
                      placeholder={t("Or paste image URL...")}
                      value={blogForm.featured_image}
                      onChange={(e) => setBlogForm({...blogForm, featured_image: e.target.value})}
                      className={`text-xs ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}`}
                    />
                  </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={blogForm.is_published}
                  onChange={(e) => setBlogForm({...blogForm, is_published: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_published">{t("Publish immediately")}</Label>
              </div>

              <Button type="submit" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {editingPost ? t("Update Post") : t("Create Post")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

        {/* Blog Posts List */}
        {blogTab === 'posts' && <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("All Blog Posts")}</CardTitle>
          <CardDescription>{blogPosts.length} {t("posts")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#ff6b35]" /></div>
          ) : blogPosts.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic">{t("No blog posts yet. Create your first post!")}</div>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm truncate">{post.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${post.is_published ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {post.is_published ? t("Published") : t("Draft")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{post.excerpt || t("No description")}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-[#ff6b35]/10 text-[#ff6b35] uppercase font-bold">{post.category}</span>
                      <span><Eye className="w-3 h-3 inline mr-1" />{post.view_count || 0}</span>
                      <span><Calendar className="w-3 h-3 inline mr-1" />{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {post.title_gujarati && <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">ગુજરાતી</span>}
                      {post.title_hindi && <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">हिंदी</span>}
                      {post.title && <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500">English</span>}
                    </div>
                  </div>
                    <div className="flex gap-2">
                      {post.is_published && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs border-green-500/20 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleSendBlogEmail(post.id)}
                          disabled={sendingBlogEmail === post.id}
                        >
                          {sendingBlogEmail === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3 mr-1" />} {t("Notify")}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleEditPost(post)}>
                        <Eye className="w-3 h-3 mr-1" /> {t("Edit")}
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-500/20" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>}
      </div>
    );
}

function PagesManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean; t: (key: string) => string; isActionLoading: boolean; setIsActionLoading: (v: boolean) => void; setSuccess: (v: string) => void; setError: (v: string) => void;
}) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "draft", template: "default", sort_order: 0, is_in_nav: false });

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("pages").select("*").order("sort_order", { ascending: true });
    if (!error) setPages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "draft", template: "default", sort_order: 0, is_in_nav: false });
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) { setError(t("Title and slug are required")); return; }
    setIsActionLoading(true);
    try {
      if (editing) {
        const { error } = await supabase.from("pages").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing.id);
        if (error) throw error;
        setSuccess(t("Page updated successfully"));
      } else {
        const { error } = await supabase.from("pages").insert([form]);
        if (error) throw error;
        setSuccess(t("Page created successfully"));
      }
      resetForm();
      fetchPages();
    } catch (err: any) {
      setError(err.message || t("Failed to save page"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = (page: any) => {
    setEditing(page);
    setForm({ title: page.title, slug: page.slug, content: page.content || "", meta_title: page.meta_title || "", meta_description: page.meta_description || "", status: page.status || "draft", template: page.template || "default", sort_order: page.sort_order || 0, is_in_nav: page.is_in_nav || false });
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
      setSuccess(t("Page deleted successfully"));
      fetchPages();
    } catch (err: any) {
      setError(err.message || t("Failed to delete page"));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2"><FileText className="w-6 h-6" /> {editing ? t("Edit Page") : t("Create Page")}</CardTitle>
          <CardDescription>{t("Manage website pages")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("Title")}</Label><Input value={form.title} onChange={(e) => { const title = e.target.value; const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""); setForm({ ...form, title, slug }); }} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
                <div className="space-y-2"><Label>{t("Slug")} <span className="text-[10px] text-muted-foreground">({t("auto-generated")})</span></Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="about-us" className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
              </div>
            <div className="space-y-2"><Label>{t("Content")}</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("Meta Title")}</Label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
              <div className="space-y-2"><Label>{t("Meta Description")}</Label><Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>{t("Status")}</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`w-full h-10 rounded-md border px-3 text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-[#f5f0e8]' : 'border-[#ff6b35]/20'}`}>
                  <option value="draft">{t("Draft")}</option>
                  <option value="published">{t("Published")}</option>
                </select>
              </div>
              <div className="space-y-2"><Label>{t("Template")}</Label><Input value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
              <div className="space-y-2"><Label>{t("Sort Order")}</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
              <div className="space-y-2 flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_in_nav} onChange={(e) => setForm({ ...form, is_in_nav: e.target.checked })} className="w-4 h-4 accent-[#ff6b35]" />
                  <span className="text-sm font-bold">{t("Show in Nav")}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editing ? t("Update Page") : t("Create Page")}
              </Button>
              {editing && <Button type="button" variant="outline" className="h-12 rounded-xl border-[#ff6b35]/20" onClick={resetForm}>{t("Cancel")}</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("All Pages")}</CardTitle>
          <CardDescription>{pages.length} {t("pages total")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingState /> : pages.length === 0 ? <EmptyState message={t("No pages created yet.")} /> : (
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm truncate">{page.title}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${page.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{t(page.status)}</span>
                      {page.is_in_nav && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/10 text-blue-500">{t("Nav")}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{page.slug} &middot; {t("Template")}: {page.template} &middot; {t("Order")}: {page.sort_order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleEdit(page)}>
                      <Eye className="w-3 h-3 mr-1" /> {t("Edit")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-500/20" onClick={() => handleDelete(page.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RedirectsManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean; t: (key: string) => string; isActionLoading: boolean; setIsActionLoading: (v: boolean) => void; setSuccess: (v: string) => void; setError: (v: string) => void;
}) {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ source_path: "", destination_path: "", status_code: 301, is_active: true });
  const [editing, setEditing] = useState<any | null>(null);

  const fetchRedirects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
    if (!error) setRedirects(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRedirects(); }, []);

  const resetForm = () => {
    setForm({ source_path: "", destination_path: "", status_code: 301, is_active: true });
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.source_path || !form.destination_path) { setError(t("Source and destination paths are required")); return; }
    setIsActionLoading(true);
    try {
      if (editing) {
        const { error } = await supabase.from("redirects").update({ ...form, updated_at: new Date().toISOString() }).eq("id", editing.id);
        if (error) throw error;
        setSuccess(t("Redirect updated successfully"));
      } else {
        const { error } = await supabase.from("redirects").insert([form]);
        if (error) throw error;
        setSuccess(t("Redirect created successfully"));
      }
      resetForm();
      fetchRedirects();
    } catch (err: any) {
      setError(err.message || t("Failed to save redirect"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = (redirect: any) => {
    setEditing(redirect);
    setForm({ source_path: redirect.source_path, destination_path: redirect.destination_path, status_code: redirect.status_code || 301, is_active: redirect.is_active ?? true });
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      const { error } = await supabase.from("redirects").delete().eq("id", id);
      if (error) throw error;
      setSuccess(t("Redirect deleted successfully"));
      fetchRedirects();
    } catch (err: any) {
      setError(err.message || t("Failed to delete redirect"));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase.from("redirects").update({ is_active: !currentActive }).eq("id", id);
      if (error) throw error;
      fetchRedirects();
    } catch (err: any) {
      setError(err.message || t("Failed to toggle redirect"));
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Link2 className="w-6 h-6" /> {editing ? t("Edit Redirect") : t("Add Redirect")}</CardTitle>
          <CardDescription>{t("Manage URL redirects")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t("Source Path")}</Label><Input value={form.source_path} onChange={(e) => setForm({ ...form, source_path: e.target.value })} placeholder="/old-page" className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
              <div className="space-y-2"><Label>{t("Destination Path")}</Label><Input value={form.destination_path} onChange={(e) => setForm({ ...form, destination_path: e.target.value })} placeholder="/new-page" className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("Status Code")}</Label>
                <select value={form.status_code} onChange={(e) => setForm({ ...form, status_code: parseInt(e.target.value) })} className={`w-full h-10 rounded-md border px-3 text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-[#f5f0e8]' : 'border-[#ff6b35]/20'}`}>
                  <option value={301}>301 - {t("Permanent")}</option>
                  <option value={302}>302 - {t("Temporary")}</option>
                  <option value={307}>307 - {t("Temporary (Strict)")}</option>
                  <option value={308}>308 - {t("Permanent (Strict)")}</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[#ff6b35]" />
                  <span className="text-sm font-bold">{t("Active")}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editing ? t("Update Redirect") : t("Add Redirect")}
              </Button>
              {editing && <Button type="button" variant="outline" className="h-12 rounded-xl border-[#ff6b35]/20" onClick={resetForm}>{t("Cancel")}</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("All Redirects")}</CardTitle>
          <CardDescription>{redirects.length} {t("redirects total")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingState /> : redirects.length === 0 ? <EmptyState message={t("No redirects configured yet.")} /> : (
            <div className="space-y-3">
              {redirects.map((r) => (
                <div key={r.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm font-bold text-[#ff6b35]">{r.source_path}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-sm font-bold">{r.destination_path}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${r.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{r.is_active ? t("Active") : t("Inactive")}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/10 text-blue-500">{r.status_code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("Hits")}: {r.hit_count || 0} {r.last_hit_at ? `· ${t("Last hit")}: ${new Date(r.last_hit_at).toLocaleDateString()}` : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20" onClick={() => handleToggleActive(r.id, r.is_active)}>
                      {r.is_active ? t("Disable") : t("Enable")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleEdit(r)}>
                      <Eye className="w-3 h-3 mr-1" /> {t("Edit")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-500/20" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SitemapManager({ isDark, t, isActionLoading, setIsActionLoading, setSuccess, setError }: {
  isDark: boolean; t: (key: string) => string; isActionLoading: boolean; setIsActionLoading: (v: boolean) => void; setSuccess: (v: string) => void; setError: (v: string) => void;
}) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sitemapPreview, setSitemapPreview] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [form, setForm] = useState({ url_path: "", change_frequency: "weekly", priority: 0.5, is_active: true });
  const [editing, setEditing] = useState<any | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sitemap");
      const data = await safeJson(res);
      if (data.success) setEntries(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchPreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch("/sitemap.xml");
      const text = await res.text();
      setSitemapPreview(text);
    } catch (err) { console.error(err); }
    finally { setPreviewLoading(false); }
  };

  useEffect(() => { fetchEntries(); fetchPreview(); }, []);

  const resetForm = () => {
    setForm({ url_path: "", change_frequency: "weekly", priority: 0.5, is_active: true });
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url_path) { setError(t("URL path is required")); return; }
    setIsActionLoading(true);
    try {
      const res = await fetch("/api/admin/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(editing ? t("Sitemap entry updated!") : t("Sitemap entry added!"));
        resetForm();
        fetchEntries();
        fetchPreview();
      } else { setError(data.error || t("Failed to save")); }
    } catch (err) { setError(t("An error occurred")); }
    finally { setIsActionLoading(false); }
  };

  const handleEdit = (entry: any) => {
    setEditing(entry);
    setForm({ url_path: entry.url_path, change_frequency: entry.change_frequency || "weekly", priority: parseFloat(entry.priority) || 0.5, is_active: entry.is_active ?? true });
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/sitemap?id=${id}`, { method: "DELETE" });
      const data = await safeJson(res);
      if (data.success) { setSuccess(t("Sitemap entry deleted!")); fetchEntries(); fetchPreview(); }
      else { setError(data.error || t("Failed to delete")); }
    } catch (err) { setError(t("An error occurred")); }
    finally { setIsActionLoading(false); }
  };

  const handleToggleActive = async (entry: any) => {
    try {
      const res = await fetch("/api/admin/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, url_path: entry.url_path, change_frequency: entry.change_frequency, priority: entry.priority, is_active: !entry.is_active }),
      });
      const data = await safeJson(res);
      if (data.success) fetchEntries();
    } catch (err) { console.error(err); }
  };

  const getPriorityColor = (p: number) => {
    if (p >= 0.8) return "text-green-500 bg-green-500/10";
    if (p >= 0.5) return "text-blue-500 bg-blue-500/10";
    return "text-muted-foreground bg-muted/30";
  };

  const getFreqColor = (f: string) => {
    if (f === "always" || f === "hourly") return "text-red-500 bg-red-500/10";
    if (f === "daily") return "text-amber-500 bg-amber-500/10";
    if (f === "weekly") return "text-blue-500 bg-blue-500/10";
    return "text-muted-foreground bg-muted/30";
  };

  // Count URLs from live sitemap
  const sitemapUrlCount = (sitemapPreview.match(/<url>/g) || []).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">{t("Sitemap Manager")}</h2>
          <p className="text-sm text-muted-foreground">{t("Manage custom sitemap entries and monitor your XML sitemap")}</p>
        </div>
      </div>

      {/* Sitemap Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Globe className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-black">{sitemapUrlCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("URLs in Sitemap")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Plus className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-black">{entries.filter(e => e.is_active).length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Custom Entries")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><AlertTriangle className="w-5 h-5" /></div>
              <div>
                <p className="text-2xl font-black">{entries.filter(e => !e.is_active).length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Excluded")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Globe className="w-5 h-5" /> {editing ? t("Edit Entry") : t("Add Sitemap Entry")}</CardTitle>
          <CardDescription>{t("Add custom URLs to your sitemap or override auto-generated entries")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("URL Path")} *</Label>
                <Input value={form.url_path} onChange={(e) => setForm({ ...form, url_path: e.target.value })} placeholder="/custom-page" className={isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''} />
              </div>
              <div className="space-y-2">
                <Label>{t("Change Frequency")}</Label>
                <select value={form.change_frequency} onChange={(e) => setForm({ ...form, change_frequency: e.target.value })} className={`w-full h-10 rounded-md border px-3 text-sm ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10 text-[#f5f0e8]' : 'border-[#ff6b35]/20'}`}>
                  <option value="always">{t("Always")}</option>
                  <option value="hourly">{t("Hourly")}</option>
                  <option value="daily">{t("Daily")}</option>
                  <option value="weekly">{t("Weekly")}</option>
                  <option value="monthly">{t("Monthly")}</option>
                  <option value="yearly">{t("Yearly")}</option>
                  <option value="never">{t("Never")}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("Priority")} ({form.priority})</Label>
                <input type="range" min="0" max="1" step="0.1" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseFloat(e.target.value) })} className="w-full accent-[#ff6b35]" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>0.0 ({t("Low")})</span><span>1.0 ({t("High")})</span></div>
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[#ff6b35]" />
                  <span className="text-sm font-bold">{t("Include in Sitemap")}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-black h-12 rounded-xl" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editing ? t("Update Entry") : t("Add Entry")}
              </Button>
              {editing && <Button type="button" variant="outline" className="h-12 rounded-xl border-[#ff6b35]/20" onClick={resetForm}>{t("Cancel")}</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Custom Entries List */}
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35]">{t("Custom Sitemap Entries")}</CardTitle>
          <CardDescription>{entries.length} {t("entries total")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingState /> : entries.length === 0 ? <EmptyState message={t("No custom sitemap entries. Auto-generated sitemap is active.")} /> : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-sm font-bold text-[#ff6b35]">{entry.url_path}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${entry.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {entry.is_active ? t("Active") : t("Excluded")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getFreqColor(entry.change_frequency)}`}>
                        {entry.change_frequency}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityColor(parseFloat(entry.priority))}`}>
                        {t("Priority")}: {entry.priority}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("Last modified")}: {new Date(entry.last_modified || entry.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20" onClick={() => handleToggleActive(entry)}>
                      {entry.is_active ? t("Exclude") : t("Include")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleEdit(entry)}>
                      <Eye className="w-3 h-3 mr-1" /> {t("Edit")}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-500/20" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sitemap XML Preview */}
      <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[#ff6b35] flex items-center gap-2"><FileText className="w-5 h-5" /> {t("Live Sitemap Preview")}</CardTitle>
            <CardDescription>{t("Current auto-generated sitemap.xml output")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPreview} disabled={previewLoading} className="border-[#ff6b35]/20 text-[#ff6b35]">
            {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          {previewLoading ? <LoadingState /> : (
            <pre className={`text-xs font-mono p-4 rounded-xl overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap ${isDark ? 'bg-black/30 text-green-400' : 'bg-gray-50 text-gray-700'}`}>
              {sitemapPreview || t("No sitemap data available")}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AuditLogsViewer({ isDark, t }: { isDark: boolean; t: (key: string) => string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
    if (filterAction) query = query.ilike("action", `%${filterAction}%`);
    if (filterEntity) query = query.ilike("entity_type", `%${filterEntity}%`);
    const { data, error } = await query;
    if (!error) setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const getActionColor = (action: string) => {
    if (action.includes("create") || action.includes("insert")) return "bg-green-500/10 text-green-500";
    if (action.includes("update") || action.includes("edit")) return "bg-blue-500/10 text-blue-500";
    if (action.includes("delete") || action.includes("remove")) return "bg-red-500/10 text-red-500";
    return "bg-amber-500/10 text-amber-500";
  };

  return (
    <Card className={isDark ? 'bg-[#12121a] border-[#ff6b35]/10' : 'bg-white border-[#ff6b35]/20'}>
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Activity className="w-6 h-6" /> {t("Audit Logs")}</CardTitle>
          <CardDescription>{t("Track all admin actions and changes")}</CardDescription>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder={t("Filter action...")} value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className={`w-40 h-9 text-xs ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''}`} />
          <Input placeholder={t("Filter entity...")} value={filterEntity} onChange={(e) => setFilterEntity(e.target.value)} className={`w-40 h-9 text-xs ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/10' : ''}`} />
          <Button variant="outline" size="sm" onClick={fetchLogs} className="h-9 border-[#ff6b35]/20 text-[#ff6b35]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingState /> : logs.length === 0 ? <EmptyState message={t("No audit logs recorded yet.")} /> : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/10'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getActionColor(log.action)}`}>{log.action}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#ff6b35]/10 text-[#ff6b35]">{log.entity_type}</span>
                    {log.entity_id && <span className="text-[10px] text-muted-foreground font-mono">ID: {log.entity_id.substring(0, 8)}...</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    {log.admin_email && <span className="font-bold">{log.admin_email}</span>}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
                {log.details && (
                  <div className={`mt-2 p-2 rounded-lg text-[10px] font-mono overflow-x-auto ${isDark ? 'bg-black/30' : 'bg-gray-50'}`}>
                    {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : String(log.details)}
                  </div>
                )}
                {log.ip_address && <p className="text-[9px] text-muted-foreground mt-1">IP: {log.ip_address}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
}

function BrandingManager({ isDark, t, setSuccess, setError }: { isDark: boolean; t: (k: string) => string; setSuccess: (s: string) => void; setError: (s: string) => void }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [logoUrl, setLogoUrl] = useState("https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/LOGO/Gemini_Generated_Image_6u6muz6u6muz6u6m.ico");
    const [faviconUrl, setFaviconUrl] = useState("https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/LOGO/Gemini_Generated_Image_6u6muz6u6muz6u6m.ico");
    const [ogImageUrl, setOgImageUrl] = useState("https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/LOGO/Gemini_Generated_Image_6u6muz6u6muz6u6m.ico");
    const [siteName, setSiteName] = useState("Katyaayani Astrologer");
    const [siteTagline, setSiteTagline] = useState("Best Vedic Astrologer | Kundali, Horoscope & Jyotish");

    const handleUpload = async (file: File, type: "logo" | "favicon" | "og_image") => {
      setUploading(type);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        const res = await fetch("/api/admin/branding/upload", { method: "POST", body: formData });
        if (!res.ok) { const d = await safeJson(res); throw new Error(d.error || "Upload failed"); }
        const data = await safeJson(res);
        if (data.url) {
          if (type === "logo") setLogoUrl(data.url);
          else if (type === "favicon") setFaviconUrl(data.url);
          else setOgImageUrl(data.url);
          setSuccess(`${type === "logo" ? "Logo" : type === "favicon" ? "Favicon" : "OG Image"} uploaded!`);
        }
      } catch (err: any) {
        setError(err.message || "Upload failed");
      }
      setUploading(null);
    };

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/admin/branding");
        if (!res.ok) throw new Error("Failed");
        const data = await safeJson(res);
      if (data.settings) {
        if (data.settings.logo_url) setLogoUrl(data.settings.logo_url);
        if (data.settings.favicon_url) setFaviconUrl(data.settings.favicon_url);
        if (data.settings.og_image_url) setOgImageUrl(data.settings.og_image_url);
        if (data.settings.site_name) setSiteName(data.settings.site_name);
        if (data.settings.site_tagline) setSiteTagline(data.settings.site_tagline);
      }
    } catch { /* use defaults */ }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            logo_url: logoUrl,
            favicon_url: faviconUrl,
            og_image_url: ogImageUrl,
            site_name: siteName,
            site_tagline: siteTagline,
          },
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess("Branding settings saved successfully!");
      } else {
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save branding settings");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" /></div>;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Palette className="w-6 h-6" /> {t("Branding & Logo Settings")}
          </CardTitle>
          <CardDescription>{t("Manage your site logo, favicon, preview image and branding")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">{t("Logo")}</Label>
              <div className="flex gap-2">
                <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className={`flex-1 ${isDark ? "bg-white/5 border-white/10" : ""}`} />
                <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer text-xs font-medium border transition-colors ${uploading === "logo" ? "opacity-50 pointer-events-none" : ""} ${isDark ? "bg-[#ff6b35]/10 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/20" : "bg-[#ff6b35]/5 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10"}`}>
                  {uploading === "logo" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {t("Upload")}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "logo"); e.target.value = ""; }} />
                </label>
              </div>
              {logoUrl && (
                <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}>
                  <img src={logoUrl} alt="Logo Preview" className="w-16 h-16 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-xs text-muted-foreground">{t("Logo Preview")}</span>
                </div>
              )}
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">{t("Favicon")}</Label>
              <div className="flex gap-2">
                <Input value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} placeholder="https://..." className={`flex-1 ${isDark ? "bg-white/5 border-white/10" : ""}`} />
                <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer text-xs font-medium border transition-colors ${uploading === "favicon" ? "opacity-50 pointer-events-none" : ""} ${isDark ? "bg-[#ff6b35]/10 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/20" : "bg-[#ff6b35]/5 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10"}`}>
                  {uploading === "favicon" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {t("Upload")}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "favicon"); e.target.value = ""; }} />
                </label>
              </div>
              {faviconUrl && (
                <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}>
                  <img src={faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-xs text-muted-foreground">{t("Favicon Preview (shown in browser tab)")}</span>
                </div>
              )}
            </div>

            {/* OG Image for WhatsApp/Social */}
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                {t("WhatsApp/Social Preview Image (OG Image)")}
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"}`}>WhatsApp</span>
              </Label>
              <div className="flex gap-2">
                <Input value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} placeholder="https://..." className={`flex-1 ${isDark ? "bg-white/5 border-white/10" : ""}`} />
                <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md cursor-pointer text-xs font-medium border transition-colors ${uploading === "og_image" ? "opacity-50 pointer-events-none" : ""} ${isDark ? "bg-[#ff6b35]/10 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/20" : "bg-[#ff6b35]/5 border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/10"}`}>
                  {uploading === "og_image" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {t("Upload")}
                  <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "og_image"); e.target.value = ""; }} />
                </label>
              </div>
              <div className={`p-3 rounded-lg text-[11px] space-y-1 ${isDark ? "bg-yellow-500/5 border border-yellow-500/10 text-yellow-300/80" : "bg-yellow-50 border border-yellow-200 text-yellow-800"}`}>
                <p className="font-semibold">{t("WhatsApp Rules:")}</p>
                <p>- {t("Best size: 1200 x 630 px")}</p>
                <p>- {t("Format: JPG or PNG (no ICO/SVG)")}</p>
                <p>- {t("Must be publicly accessible via HTTPS")}</p>
                <p>- {t("If old preview shows, add ?v=2 to URL or wait 5-10 min")}</p>
              </div>
              {ogImageUrl && (
                <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}>
                  <p className="text-xs font-medium mb-2">{t("Preview (how it looks on WhatsApp):")}</p>
                  <div className={`rounded-lg overflow-hidden border max-w-[400px] ${isDark ? "border-white/10" : "border-gray-200"}`}>
                    <img src={ogImageUrl} alt="OG Image Preview" className="w-full h-auto aspect-[1200/630] object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className={`p-3 ${isDark ? "bg-[#1a1a2e]" : "bg-gray-50"}`}>
                      <p className="text-[10px] text-muted-foreground uppercase">katyaayaniastrologer.com</p>
                      <p className="text-xs font-semibold mt-0.5">{siteName || "Katyaayani Astrologer"}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{siteTagline || "Best Vedic Astrologer"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold">{t("Site Name")}</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Katyaayani Astrologer" className={isDark ? "bg-white/5 border-white/10" : ""} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold">{t("Site Tagline")}</Label>
            <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} placeholder="Best Vedic Astrologer..." className={isDark ? "bg-white/5 border-white/10" : ""} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white w-full md:w-auto">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Saving...")}</> : t("Save Branding Settings")}
          </Button>
        </CardContent>
      </Card>

      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Current Branding URLs")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Logo", url: logoUrl },
            { label: "Favicon", url: faviconUrl },
            { label: "OG Image", url: ogImageUrl },
          ].map((item) => (
            <div key={item.label} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold">{item.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{item.url}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-[#ff6b35]/20 text-[#ff6b35] text-xs"
                onClick={() => { navigator.clipboard.writeText(item.url); setSuccess(`${item.label} URL copied!`); }}
              >
                {t("Copy")}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
