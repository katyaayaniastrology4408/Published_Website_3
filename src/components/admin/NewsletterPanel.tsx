"use client";
import { useState, useEffect } from "react";
import { Loader2, Send, Mail, Users, CheckCircle2, AlertCircle, RefreshCw, Zap, Star, UserPlus, ExternalLink, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isDark: boolean;
  t: (key: string) => string;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}

const TEMPLATE_DEFS = [
  {
    id: "rashifal",
    name: "katyaayani-rashifal",
    label: "Weekly Rashifal",
    emoji: "🔯",
    description: "Rashifal Highlights",
    color: "#c45200",
    fields: [
      { key: "NAME", label: "Subscriber Name", placeholder: "Devotee", type: "text" },
      { key: "RASHIFAL_TEXT", label: "Rashifal Content", placeholder: "This week planets bring...", type: "textarea" },
      { key: "PERIOD", label: "Period", placeholder: "Feb 20 - Feb 26", type: "text" },
    ],
  },
  {
    id: "blog",
    name: "katyaayani-blog-update",
    label: "Blog Update",
    emoji: "📖",
    description: "New blog post notification + Read CTA",
    color: "#c45200",
    fields: [
      { key: "CATEGORY", label: "Category", placeholder: "Vedic Astrology / Vastu / Numerology", type: "text" },
      { key: "BLOG_TITLE", label: "Blog Title", placeholder: "Shani Sade Sati: Complete Guide 2026", type: "text" },
      { key: "BLOG_EXCERPT", label: "Blog Excerpt / Summary", placeholder: "Shani Sade Sati aek 7.5 varsh nu period che jema...", type: "textarea" },
      { key: "KEY_TAKEAWAY", label: "Key Takeaway", placeholder: "Aa period ma dairyavar focus rakhvo jaruri che...", type: "text" },
      { key: "BLOG_URL", label: "Blog Post URL", placeholder: "https://www.katyaayaniastrologer.com/blog/shani-sade-sati", type: "text" },
    ],
  },
  {
    id: "tips",
    name: "katyaayani-astro-tips",
    label: "Astrology Tips",
    emoji: "⭐",
    description: "Planetary tips + Graha + Upay (Remedy)",
    color: "#d97706",
    fields: [
      { key: "NAME", label: "Subscriber Name", placeholder: "Devotee", type: "text" },
      { key: "TIP_TITLE", label: "Tip Title", placeholder: "Shukra's Blessing This Week", type: "text" },
      { key: "TIP_CONTENT", label: "Tip Content", placeholder: "Venus is strong this week...", type: "textarea" },
      { key: "PLANET", label: "Graha (Planet)", placeholder: "Shukra (Venus)", type: "text" },
      { key: "REMEDY", label: "Upay (Remedy)", placeholder: "Wear white on Friday, donate curd...", type: "text" },
    ],
  },
];

export default function NewsletterPanel({ isDark, t, setSuccess, setError }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("rashifal");
  const [subject, setSubject] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);

  // Unified subscribers state
  const [unifiedSubscribers, setUnifiedSubscribers] = useState<any[]>([]);
  const [unifiedStats, setUnifiedStats] = useState<any>(null);
    const [loadingUnified, setLoadingUnified] = useState(false);
    const [syncingProfiles, setSyncingProfiles] = useState(false);
    const [manualEmail, setManualEmail] = useState("");
    const [manualName, setManualName] = useState("");
    const [addingManual, setAddingManual] = useState(false);

    // Resend contacts state
  const [resendContacts, setResendContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; failed: number; total: number } | null>(null);

  const activeDef = TEMPLATE_DEFS.find((t) => t.id === selectedTemplate)!;

  useEffect(() => {
    fetchTemplates();
    fetchSubscriberCount();
    fetchResendContacts();
    fetchUnifiedSubscribers();
  }, []);

  // Reset variables when template changes
  useEffect(() => {
    setVariables({});
    setSendResult(null);
  }, [selectedTemplate]);

    const safeJson = async (res: Response) => {
      try { const t = await res.text(); return t ? JSON.parse(t) : {}; } catch { return {}; }
    };

    const fetchUnifiedSubscribers = async () => {
      setLoadingUnified(true);
      try {
        const res = await fetch("/api/admin/unified-subscribers");
        const data = await safeJson(res);
        if (data.success) {
          setUnifiedSubscribers(data.data || []);
          setUnifiedStats(data.stats);
        }
      } catch (err) { console.error(err); }
      finally { setLoadingUnified(false); }
    };

    const syncProfilesToNewsletter = async () => {
      setSyncingProfiles(true);
      try {
        const res = await fetch("/api/admin/unified-subscribers", { method: "POST" });
        const data = await safeJson(res);
        if (data.success) {
          setSuccess(`${data.synced} users synced to newsletter list!`);
          fetchUnifiedSubscribers();
          fetchSubscriberCount();
        } else {
          setError(data.error || "Sync failed");
        }
      } catch (err: any) { setError(err.message); }
      finally { setSyncingProfiles(false); }
    };

    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch("/api/newsletter/templates");
        const data = await safeJson(res);
        setTemplates(data.templates || []);
      } catch { /* ignore */ }
      finally { setLoadingTemplates(false); }
    };

    const fetchSubscriberCount = async () => {
      try {
        const res = await fetch("/api/newsletter/subscribers/count");
        const data = await safeJson(res);
        if (data.count !== undefined) setSubscriberCount(data.count);
      } catch { /* ignore */ }
    };

    const fetchResendContacts = async () => {
      setLoadingContacts(true);
      try {
        const res = await fetch("/api/admin/resend-sync");
        const data = await safeJson(res);
        if (data.contacts) setResendContacts(data.contacts);
      } catch { /* ignore */ }
      finally { setLoadingContacts(false); }
    };

  const syncAllToResend = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/resend-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: localStorage.getItem("admin_auth") }),
      });
      const data = await safeJson(res);
      if (data.success) {
          setSyncResult({ synced: data.synced, failed: data.failed, total: data.total });
        setSuccess(`${data.synced} subscribers synced to Resend!`);
        fetchResendContacts();
      } else {
        setError(data.error || "Sync failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const setupTemplates = async () => {
    setSettingUp(true);
    try {
      const res = await fetch("/api/newsletter/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup" }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess("All 3 templates created & published on Resend!");
        fetchTemplates();
      } else {
        setError(data.error || "Setup failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSettingUp(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) { setError("Subject is required"); return; }

    const templateName = activeDef.name;
    const resendTemplates = templates.filter((t) => t.name === templateName);
    if (resendTemplates.length === 0) {
      setError("Template not found on Resend. Please click 'Setup Templates' first.");
      return;
    }

    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          templateName,
          variables,
          secretKey: localStorage.getItem("admin_auth"),
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSendResult({ sent: data.sent, failed: data.failed });
        setSuccess(`Newsletter sent! ${data.sent} delivered, ${data.failed} failed.`);
        setSubject("");
        setVariables({});
      } else {
        setError(data.error || "Send failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const knownNames = TEMPLATE_DEFS.map((t) => t.name);
  const publishedTemplates = templates.filter((t) => knownNames.includes(t.name));
  const allSetup = publishedTemplates.length >= 3;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border text-center ${isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}`}>
          <Users className="w-5 h-5 text-[#ff6b35] mx-auto mb-2" />
          <p className="text-2xl font-black text-[#ff6b35]">{subscriberCount ?? "—"}</p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Subscribers</p>
        </div>
        <div className={`p-4 rounded-xl border text-center ${isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}`}>
          <Mail className="w-5 h-5 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-amber-500">100</p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Daily Limit</p>
        </div>
        <div className={`p-4 rounded-xl border text-center ${isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}`}>
          <Star className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-black text-green-500">{loadingTemplates ? "..." : publishedTemplates.length}/3</p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Templates Ready</p>
        </div>
      </div>

      {/* Setup Banner */}
      {!loadingTemplates && !allSetup && (
        <div className={`p-4 rounded-xl border-2 border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isDark ? "border-amber-500/30 bg-amber-500/5" : "border-amber-400/40 bg-amber-50"}`}>
          <div>
            <p className="font-bold text-amber-500 text-sm flex items-center gap-2"><Zap className="w-4 h-4" /> Templates not setup yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Setup Templates" to create all 3 Resend templates once.</p>
          </div>
          <Button
            onClick={setupTemplates}
            disabled={settingUp}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold whitespace-nowrap"
          >
            {settingUp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            Setup Templates
          </Button>
        </div>
      )}

      {allSetup && (
        <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? "border-green-500/20 bg-green-500/5" : "border-green-400/30 bg-green-50"}`}>
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-xs text-green-600 font-medium">All 3 templates are live on Resend.</p>
          <button onClick={() => { fetchTemplates(); fetchSubscriberCount(); }} className="ml-auto text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Template Selector */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2"><Mail className="w-5 h-5" /> Send Newsletter</CardTitle>
          <CardDescription>Choose a template, fill content, and send to all subscribers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Cards */}
          <div>
            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-3 block">Choose Template</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TEMPLATE_DEFS.map((tmpl) => {
                const isActive = selectedTemplate === tmpl.id;
                const isOnResend = templates.some((t) => t.name === tmpl.name);
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? "border-[#ff6b35] bg-[#ff6b35]/10"
                        : isDark
                        ? "border-white/10 bg-white/5 hover:border-[#ff6b35]/40"
                        : "border-gray-200 bg-gray-50 hover:border-[#ff6b35]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{tmpl.emoji}</span>
                      {isOnResend ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold">LIVE</span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">NOT SET</span>
                      )}
                    </div>
                    <p className="font-bold text-sm">{tmpl.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{tmpl.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Subject</Label>
              <Input
                placeholder={`e.g. Your ${activeDef.label} - Feb 2026`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className={isDark ? "bg-[#1a1a2e] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground block">
                {activeDef.label} Content Variables
              </Label>
              {activeDef.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    {field.label}
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground opacity-60">{`{{{${field.key}}}}`}</span>
                  </Label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={variables[field.key] || ""}
                      onChange={(e) => setVariables({ ...variables, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={3}
                      className={`w-full p-3 rounded-md border text-sm resize-none ${isDark ? "bg-[#1a1a2e] border-[#ff6b35]/10 text-white" : "bg-white border-[#ff6b35]/20 text-black"} focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/30`}
                    />
                  ) : (
                    <Input
                      value={variables[field.key] || ""}
                      onChange={(e) => setVariables({ ...variables, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className={isDark ? "bg-[#1a1a2e] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Send Result */}
            {sendResult && (
              <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? "border-green-500/20 bg-green-500/5" : "border-green-400/30 bg-green-50"}`}>
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-600 text-sm">Newsletter sent successfully!</p>
                  <p className="text-xs text-muted-foreground">{sendResult.sent} delivered · {sendResult.failed} failed</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={sending || !allSetup}
              className="w-full h-12 font-black rounded-xl text-white"
              style={{ background: allSetup ? `linear-gradient(135deg, ${activeDef.color}, #ff6b35)` : undefined }}
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending to all subscribers...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Send {activeDef.label} Newsletter</>
              )}
            </Button>
            {!allSetup && (
              <p className="text-xs text-amber-500 text-center">Setup templates first before sending.</p>
            )}
          </form>
        </CardContent>
        </Card>

        {/* Unified Seeker List Section */}
        <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Unified Seeker List
                </CardTitle>
                <CardDescription className="mt-1">
                  Daily, Weekly, and Blog emails aa badha j users ne SMTP (Gmail) dvara jay che.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUnifiedSubscribers}
                  disabled={loadingUnified}
                  className="h-8 text-xs"
                >
                  {loadingUnified ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  <span className="ml-1">Refresh</span>
                </Button>
                <Button
                  size="sm"
                  onClick={syncProfilesToNewsletter}
                  disabled={syncingProfiles}
                  className="h-8 text-xs bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                >
                  {syncingProfiles ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                  Sync Profiles
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0d0d15] border-[#ff6b35]/10" : "bg-gray-50 border-[#ff6b35]/15"}`}>
                <p className="text-xl font-black text-[#ff6b35]">{loadingUnified ? "..." : unifiedStats?.total ?? 0}</p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">Total Seekers</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0d0d15] border-[#ff6b35]/10" : "bg-gray-50 border-[#ff6b35]/15"}`}>
                <p className="text-xl font-black text-amber-500">{loadingUnified ? "..." : unifiedStats?.profiles ?? 0}</p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">From Profiles</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0d0d15] border-[#ff6b35]/10" : "bg-gray-50 border-[#ff6b35]/15"}`}>
                <p className="text-xl font-black text-green-500">{loadingUnified ? "..." : unifiedSubscribers.filter(u => u.isNewsletterSub).length}</p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">Newsletter Opt-in</p>
              </div>
            </div>

            {/* List */}
            {loadingUnified ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {unifiedSubscribers.map((user: any, idx: number) => (
                  <div
                    key={user.email + idx}
                    className={`flex items-center justify-between p-3 rounded-lg border text-sm ${isDark ? "bg-[#0d0d15] border-white/5" : "bg-gray-50 border-gray-100"}`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.email}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {user.name} • {user.source}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-500`}>
                        DAILY/WEEKLY
                      </span>
                      {user.isNewsletterSub && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-green-500/10 text-green-500`}>
                          NEWSLETTER
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resend Contacts Section */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Resend Contacts
              </CardTitle>
              <CardDescription className="mt-1">
                User newsletter subscribe kare tyare automatically Resend audience ma save thay che.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchResendContacts}
                disabled={loadingContacts}
                className="h-8 text-xs"
              >
                {loadingContacts ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                <span className="ml-1">Refresh</span>
              </Button>
              <Button
                size="sm"
                onClick={syncAllToResend}
                disabled={syncing}
                className="h-8 text-xs bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
              >
                {syncing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <UserPlus className="w-3 h-3 mr-1" />}
                Sync All to Resend
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sync result banner */}
          {syncResult && (
            <div className={`p-3 rounded-lg border flex items-center gap-3 ${isDark ? "border-green-500/20 bg-green-500/5" : "border-green-400/30 bg-green-50"}`}>
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-600 font-medium">
                {syncResult.total} subscribers ma thi {syncResult.synced} Resend ma sync thayu · {syncResult.failed} failed
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0d0d15] border-[#ff6b35]/10" : "bg-gray-50 border-[#ff6b35]/15"}`}>
              <p className="text-xl font-black text-[#ff6b35]">{loadingContacts ? "..." : resendContacts.length}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Resend Contacts</p>
            </div>
            <div className={`p-3 rounded-xl border text-center ${isDark ? "bg-[#0d0d15] border-[#ff6b35]/10" : "bg-gray-50 border-[#ff6b35]/15"}`}>
              <p className="text-xl font-black text-green-500">{loadingContacts ? "..." : resendContacts.filter(c => !c.unsubscribed).length}</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Subscribed</p>
            </div>
          </div>

          {/* Info box */}
          <div className={`p-3 rounded-lg border text-xs ${isDark ? "border-blue-500/20 bg-blue-500/5 text-blue-300" : "border-blue-400/30 bg-blue-50 text-blue-700"}`}>
            <p className="font-semibold mb-1">Auto-sync thay che:</p>
            <ul className="space-y-0.5 list-disc list-inside text-[11px]">
              <li>Footer newsletter form fill kare tyare</li>
              <li>New user website par register kare tyare</li>
            </ul>
          </div>

          {/* Contact list */}
          {loadingContacts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" />
            </div>
          ) : resendContacts.length === 0 ? (
            <div className={`text-center py-8 rounded-xl border-2 border-dashed ${isDark ? "border-white/10 text-white/40" : "border-gray-200 text-gray-400"}`}>
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Koi contacts nathi</p>
              <p className="text-xs mt-1">Newsletter subscribe karva devo ya "Sync All" click karo</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {resendContacts.map((contact: any, idx: number) => (
                <div
                  key={contact.id || idx}
                  className={`flex items-center justify-between p-3 rounded-lg border text-sm ${isDark ? "bg-[#0d0d15] border-white/5" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{contact.email}</p>
                    {(contact.first_name || contact.last_name) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {[contact.first_name, contact.last_name].filter(Boolean).join(' ')}
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${contact.unsubscribed ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                    {contact.unsubscribed ? "UNSUB" : "ACTIVE"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center">
            Audience ID: e6bafd8b-5149-4862-a298-e23bd5578190
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
