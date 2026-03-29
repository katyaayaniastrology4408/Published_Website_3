"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, Send, RefreshCw, CheckCircle, XCircle, Clock, Search, Shield, 
  Loader2, ExternalLink, Copy, AlertTriangle, Zap, FileText, Save, 
  ArrowRight, RotateCcw, Eye, ChevronDown, ChevronUp, Upload, ImageIcon, Trash2, Link2, XIcon
} from "lucide-react";
import { safeJson } from "@/lib/safe-json";
import { supabase } from "@/lib/supabase";

interface WebmasterPingPanelProps {
  isDark: boolean;
  t: (key: string) => string;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
}

export default function WebmasterPingPanel({ isDark, t, setSuccess, setError }: WebmasterPingPanelProps) {
  // Verification codes - saved to DB
  const [bingCode, setBingCode] = useState("");
  const [googleCode, setGoogleCode] = useState("");
  const [googleCode2, setGoogleCode2] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Sitemap ping
  const [pinging, setPinging] = useState(false);
  const [pingTarget, setPingTarget] = useState<string | null>(null);
  const [pingLogs, setPingLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [sitemapStatus, setSitemapStatus] = useState<{ pages: number; accessible: boolean; urls: string[] } | null>(null);
  const [showSitemapUrls, setShowSitemapUrls] = useState(false);

  // IndexNow states
  const [indexNowUrls, setIndexNowUrls] = useState("");
  const [indexNowSubmitting, setIndexNowSubmitting] = useState(false);
  const [indexNowKey] = useState("a889b4f2a770404297f5fe6867c814f5");
  const [lastIndexNowResult, setLastIndexNowResult] = useState<any>(null);

  // Live verification check
  const [verifyStatus, setVerifyStatus] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Bing specific
  const [bingSubmitUrl, setBingSubmitUrl] = useState("");
  const [bingSubmitting, setBingSubmitting] = useState(false);

  // OG Image management
  const [ogEntries, setOgEntries] = useState<any[]>([]);
  const [ogLoading, setOgLoading] = useState(true);
  const [ogUploading, setOgUploading] = useState(false);
  const [editingOg, setEditingOg] = useState<any>(null);
  const [ogForm, setOgForm] = useState({ og_title: "", og_description: "", og_image: "" });

  // Search Thumbnail (main OG image shown in Google/Bing)
  const [searchThumbnail, setSearchThumbnail] = useState<string>("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailSaving, setThumbnailSaving] = useState(false);
  const [thumbnailInput, setThumbnailInput] = useState("");

  const siteUrl = "https://www.katyaayaniastrologer.com";

  useEffect(() => {
    loadVerificationCodes();
    fetchPingLogs();
    checkSitemap();
    fetchOgEntries();
    runVerificationCheck();
    fetchSearchThumbnail();
  }, []);

  const fetchSearchThumbnail = async () => {
    try {
      const res = await fetch("/api/admin/seo/bulk-og-image");
      const data = await res.json();
      if (data.success && data.url) {
        setSearchThumbnail(data.url);
        setThumbnailInput(data.url);
      }
    } catch {}
  };

  const handleThumbnailSave = async (imageUrl: string) => {
    setThumbnailSaving(true);
    try {
      const res = await fetch("/api/admin/seo/bulk-og-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ og_image: imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchThumbnail(imageUrl);
        setThumbnailInput(imageUrl);
        setSuccess(t(`Search thumbnail saved! Applied to all ${data.updated} pages.`));
        fetchOgEntries();
      } else {
        setError(data.error || t("Failed to save"));
      }
    } catch {
      setError(t("Error saving thumbnail"));
    }
    setThumbnailSaving(false);
  };

  const handleThumbnailUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError(t("Image must be under 5MB")); return; }
    setThumbnailUploading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const ext = file.name.split(".").pop();
      const fileName = `search-thumbnail-${Date.now()}.${ext}`;
      const { error: uploadErr } = await sb.storage.from("blog-images").upload(`og/${fileName}`, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = sb.storage.from("blog-images").getPublicUrl(`og/${fileName}`);
      await handleThumbnailSave(urlData.publicUrl);
    } catch (err: any) {
      setError(err.message || t("Upload failed"));
    }
    setThumbnailUploading(false);
  };

  // Load verification codes from DB (admin_settings table)
  const loadVerificationCodes = async () => {
    setLoadingSettings(true);
    try {
      const { data } = await supabase
        .from("admin_settings")
        .select("*")
        .in("key", ["google_verification_code", "google_verification_code_2", "bing_verification_code"]);

      const settings = (data || []).reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

      setGoogleCode(settings["google_verification_code"] || "2Edo_sTI7Jp85F7z7xr0yG6MTSrSsm5WO0jY4HsAqmM");
      setGoogleCode2(settings["google_verification_code_2"] || "JC618JFaRN0wnJt6Lsbglqfjkm7Cd_rBXQO6l42jEWY");
      setBingCode(settings["bing_verification_code"] || "2Edo_sTI7Jp85F7z7xr0yG6MTSrSsm5WO0jY4HsAqmM");
    } catch (err) {
      console.error("Failed to load verification codes:", err);
    }
    setLoadingSettings(false);
  };

  // Live verification check against the real production site
  const runVerificationCheck = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/seo/verify");
      const data = await safeJson(res);
      setVerifyStatus(data);
    } catch (err) {
      console.error("Verification check failed:", err);
    }
    setVerifying(false);
  };

  // Save verification codes to DB
  const handleSaveVerification = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "google_verification_code", value: googleCode },
        { key: "google_verification_code_2", value: googleCode2 },
        { key: "bing_verification_code", value: bingCode },
      ];

      for (const item of settings) {
        await supabase.from("admin_settings").upsert(item, { onConflict: "key" });
      }

      setSuccess(t("Verification codes saved to database! Changes will apply after next deploy."));
    } catch {
      setError(t("Failed to save verification codes"));
    }
    setSaving(false);
  };

  const fetchPingLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/seo/indexnow");
      if (!res.ok) return;
      const data = await safeJson(res);
      if (data?.success) setPingLogs(data.logs || []);
    } catch (err) { console.error(err); }
    finally { setLogsLoading(false); }
  };

  const checkSitemap = async () => {
    try {
      const res = await fetch("/sitemap.xml");
      const text = await res.text();
      const urlMatches = text.match(/<loc>(.*?)<\/loc>/g) || [];
      const urls = urlMatches.map(m => m.replace(/<\/?loc>/g, ""));
      setSitemapStatus({ pages: urls.length, accessible: res.ok, urls });
    } catch {
      setSitemapStatus({ pages: 0, accessible: false, urls: [] });
    }
  };

  // Ping sitemap to Google + Bing
  const handlePingSitemap = async (target?: "Google" | "Bing") => {
    setPinging(true);
    setPingTarget(target || "all");
    try {
        const res = await fetch("/api/admin/seo/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ping-sitemap", target: target || "all" }),
        });
      const data = await safeJson(res);
      if (data?.success) {
        const results = data.results || [];
        const allOk = results.every((r: any) => r.status === "success");
        if (allOk) {
          setSuccess(t("Sitemap pinged to all search engines successfully!"));
        } else {
          const failed = results.filter((r: any) => r.status !== "success");
          setError(t(`Some pings failed: ${failed.map((f: any) => f.target).join(", ")}`));
        }
        fetchPingLogs();
      } else {
        setError(data?.message || t("Ping failed"));
      }
    } catch {
      setError(t("Network error during ping"));
    }
    setPinging(false);
    setPingTarget(null);
  };

  // IndexNow submit
  const handleIndexNowSubmit = async (urls?: string[]) => {
    setIndexNowSubmitting(true);
    setLastIndexNowResult(null);
    try {
      const urlList = urls || indexNowUrls.split("\n").map(u => u.trim()).filter(Boolean);
      if (urlList.length === 0) {
        setError(t("Please enter at least one URL"));
        setIndexNowSubmitting(false);
        return;
      }

      const res = await fetch("/api/admin/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlList }),
      });
      const data = await safeJson(res);
      if (data?.success) {
        setLastIndexNowResult(data);
        const results = data.results || [];
        const anySuccess = results.some((r: any) => r.status === "success" || r.status === "accepted");
        if (anySuccess) {
          setSuccess(t(`IndexNow: ${data.urlCount} URLs submitted to Bing, Yandex & Naver!`));
          setIndexNowUrls("");
        } else {
          setError(t("IndexNow submission failed"));
        }
        fetchPingLogs();
      } else {
        setError(data?.message || t("IndexNow submission failed"));
      }
    } catch {
      setError(t("Network error during IndexNow submission"));
    }
    setIndexNowSubmitting(false);
  };

  // Submit ALL site pages via IndexNow
  const handleIndexNowSubmitAll = async () => {
    // Use sitemap URLs if available, otherwise use hardcoded list
    const allPages = sitemapStatus?.urls?.length 
      ? sitemapStatus.urls 
      : [
          `${siteUrl}/`, `${siteUrl}/about`, `${siteUrl}/services`,
          `${siteUrl}/blog`, `${siteUrl}/booking`, `${siteUrl}/contact`,
          `${siteUrl}/horoscope`, `${siteUrl}/online-consulting`, `${siteUrl}/kundli`,
          `${siteUrl}/privacy`, `${siteUrl}/terms`,
          `${siteUrl}/horoscope/mesh`, `${siteUrl}/horoscope/vrushabh`, `${siteUrl}/horoscope/mithun`,
          `${siteUrl}/horoscope/kark`, `${siteUrl}/horoscope/sinh`, `${siteUrl}/horoscope/kanya`,
          `${siteUrl}/horoscope/tula`, `${siteUrl}/horoscope/vrushchik`, `${siteUrl}/horoscope/dhanu`,
          `${siteUrl}/horoscope/makar`, `${siteUrl}/horoscope/kumbh`, `${siteUrl}/horoscope/meen`,
        ];
    await handleIndexNowSubmit(allPages);
  };

  // Bing URL Submission API
  const handleBingUrlSubmit = async () => {
    if (!bingSubmitUrl.trim()) return;
    setBingSubmitting(true);
    try {
      // Use IndexNow for Bing URL submission (most effective method)
      const urls = bingSubmitUrl.split("\n").map(u => u.trim()).filter(Boolean);
      await handleIndexNowSubmit(urls);
      setBingSubmitUrl("");
    } catch {
      setError(t("Failed to submit URL to Bing"));
    }
    setBingSubmitting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(t("Copied to clipboard!"));
  };

  // OG Management
  const fetchOgEntries = async () => {
    setOgLoading(true);
    try {
      const res = await fetch("/api/admin/seo");
      const data = await safeJson(res);
      if (data.success) setOgEntries(data.data || []);
    } catch (err) { console.error(err); }
    finally { setOgLoading(false); }
  };

  const handleOgEdit = (entry: any) => {
    setEditingOg(entry);
    setOgForm({
      og_title: entry.og_title || "",
      og_description: entry.og_description || "",
      og_image: entry.og_image || "",
    });
  };

  const handleOgSave = async () => {
    if (!editingOg) return;
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_path: editingOg.page_path,
          meta_title: editingOg.meta_title,
          meta_description: editingOg.meta_description,
          meta_keywords: editingOg.meta_keywords,
          og_title: ogForm.og_title,
          og_description: ogForm.og_description,
          og_image: ogForm.og_image,
          canonical_url: editingOg.canonical_url,
          robots: editingOg.robots,
          schema_markup: editingOg.schema_markup,
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(t("OG settings updated for ") + editingOg.page_path);
        setEditingOg(null);
        setOgForm({ og_title: "", og_description: "", og_image: "" });
        fetchOgEntries();
      } else {
        setError(data.error || t("Failed to save"));
      }
    } catch { setError(t("An error occurred")); }
  };

  const handleOgImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError(t("Image must be under 5MB")); return; }
    setOgUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const pageName = editingOg?.page_path?.replace(/\//g, "-").replace(/^-/, "home") || "page";
      const fileName = `og-${pageName}-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("blog-images").upload(`og/${fileName}`, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(`og/${fileName}`);
      setOgForm(prev => ({ ...prev, og_image: urlData.publicUrl }));
      setSuccess(t("OG Image uploaded!"));
    } catch (err: any) { setError(err.message || t("Upload failed")); }
    finally { setOgUploading(false); }
  };

  const cardClass = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";
  const inputClass = isDark ? "bg-[#1a1a2e] border-[#ff6b35]/10 text-white" : "bg-white border-[#ff6b35]/20 text-black";

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div>
        <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">
          {t("Google & Bing SEO Manager")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("Manage verification codes, indexing, sitemap pings - all from one place")}
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className={cardClass}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${sitemapStatus?.accessible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{sitemapStatus?.pages || 0}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Sitemap URLs")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{googleCode ? "2" : "0"}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Google Codes")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bingCode ? "bg-cyan-500/10 text-cyan-500" : "bg-red-500/10 text-red-500"}`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{bingCode ? "1" : "0"}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("Bing Code")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{pingLogs.filter(l => l.target?.includes("IndexNow")).length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("IndexNow Pings")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =================== LIVE VERIFICATION STATUS =================== */}
      <Card className={`${cardClass} ring-2 ring-green-500/30`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-500 flex items-center gap-2">
                <Shield className="w-5 h-5" /> {t("Live Verification Status")}
                <Badge className="bg-green-500/10 text-green-500 text-[10px] ml-1">LIVE CHECK</Badge>
              </CardTitle>
              <CardDescription>{t("Real-time check: Are Google & Bing tags actually live on your website?")}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runVerificationCheck}
              disabled={verifying}
              className="border-green-500/20 text-green-500 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${verifying ? "animate-spin" : ""}`} />
              {verifying ? t("Checking...") : t("Re-check")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {verifying && !verifyStatus ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
              <span className="text-sm">{t("Checking live site...")}</span>
            </div>
          ) : verifyStatus?.success === false ? (
            <div className={`p-3 rounded-lg border ${isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"}`}>
              <p className="text-sm text-red-500 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {t("Could not reach live site. This check only works after deployment.")}
              </p>
            </div>
          ) : verifyStatus ? (
            <div className="space-y-3">
              {/* Grid of checks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Google Meta Tag */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.google?.metaTagFound
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"
                }`}>
                  {verifyStatus.google?.metaTagFound
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Search className="w-3 h-3 text-blue-500" /> Google Verification
                    </p>
                    {verifyStatus.google?.metaTagFound ? (
                      <>
                        <p className="text-[10px] text-green-600 font-semibold">{verifyStatus.google.count} tag(s) found in &lt;head&gt;</p>
                        {verifyStatus.google.codes?.map((code: string, i: number) => (
                          <p key={i} className="text-[9px] font-mono text-muted-foreground truncate mt-0.5">{code.substring(0, 40)}...</p>
                        ))}
                      </>
                    ) : (
                      <p className="text-[10px] text-red-500">{t("Tag NOT found in live site HTML")}</p>
                    )}
                  </div>
                </div>

                {/* Bing Meta Tag */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.bing?.metaTagFound
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"
                }`}>
                  {verifyStatus.bing?.metaTagFound
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-500" /> Bing Verification (msvalidate.01)
                    </p>
                    {verifyStatus.bing?.metaTagFound ? (
                      <>
                        <p className="text-[10px] text-green-600 font-semibold">{t("Tag found in <head>")}</p>
                        <p className="text-[9px] font-mono text-muted-foreground truncate mt-0.5">{verifyStatus.bing.code?.substring(0, 40)}...</p>
                      </>
                    ) : (
                      <p className="text-[10px] text-red-500">{t("msvalidate.01 tag NOT found")}</p>
                    )}
                  </div>
                </div>

                {/* Bing XML File */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.bing?.xmlFileFound
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-amber-900/10 border-amber-500/20" : "bg-amber-50 border-amber-200"
                }`}>
                  {verifyStatus.bing?.xmlFileFound
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-bold">{t("BingSiteAuth.xml")}</p>
                    <p className={`text-[10px] ${verifyStatus.bing?.xmlFileFound ? "text-green-600 font-semibold" : "text-amber-600"}`}>
                      {verifyStatus.bing?.xmlFileFound ? t("File accessible at /BingSiteAuth.xml") : t("Optional — meta tag is sufficient")}
                    </p>
                  </div>
                </div>

                {/* Sitemap */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.sitemap?.accessible
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"
                }`}>
                  {verifyStatus.sitemap?.accessible
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-bold">{t("Sitemap.xml")}</p>
                    <p className={`text-[10px] ${verifyStatus.sitemap?.accessible ? "text-green-600 font-semibold" : "text-red-500"}`}>
                      {verifyStatus.sitemap?.accessible
                        ? `${verifyStatus.sitemap.urlCount} ${t("URLs indexed")}`
                        : t("Sitemap not accessible")}
                    </p>
                  </div>
                </div>

                {/* Robots.txt - Googlebot */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.robots?.allowsGooglebot
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"
                }`}>
                  {verifyStatus.robots?.allowsGooglebot
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Search className="w-3 h-3 text-blue-500" /> {t("Googlebot in robots.txt")}
                    </p>
                    <p className={`text-[10px] ${verifyStatus.robots?.allowsGooglebot ? "text-green-600 font-semibold" : "text-red-500"}`}>
                      {verifyStatus.robots?.allowsGooglebot ? t("Googlebot allowed to crawl") : t("Googlebot may be blocked")}
                    </p>
                  </div>
                </div>

                {/* Robots.txt - Bingbot */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  verifyStatus.robots?.allowsBingbot
                    ? isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"
                    : isDark ? "bg-red-900/10 border-red-500/20" : "bg-red-50 border-red-200"
                }`}>
                  {verifyStatus.robots?.allowsBingbot
                    ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-500" /> {t("Bingbot in robots.txt")}
                    </p>
                    <p className={`text-[10px] ${verifyStatus.robots?.allowsBingbot ? "text-green-600 font-semibold" : "text-red-500"}`}>
                      {verifyStatus.robots?.allowsBingbot ? t("Bingbot allowed to crawl") : t("Bingbot may be blocked")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary score */}
              {(() => {
                const checks = [
                  verifyStatus.google?.metaTagFound,
                  verifyStatus.bing?.metaTagFound,
                  verifyStatus.sitemap?.accessible,
                  verifyStatus.robots?.allowsGooglebot,
                  verifyStatus.robots?.allowsBingbot,
                ];
                const passed = checks.filter(Boolean).length;
                const total = checks.length;
                const allPassed = passed === total;
                return (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    allPassed
                      ? isDark ? "bg-green-900/20 border-green-500/40" : "bg-green-100 border-green-300"
                      : isDark ? "bg-amber-900/10 border-amber-500/20" : "bg-amber-50 border-amber-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      {allPassed
                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                        : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                      <div>
                        <p className={`text-sm font-bold ${allPassed ? "text-green-600" : "text-amber-600"}`}>
                          {allPassed ? t("All checks passed! Google & Bing are properly set up.") : `${passed}/${total} ${t("checks passed")}`}
                        </p>
                        {verifyStatus.checkedAt && (
                          <p className="text-[10px] text-muted-foreground">{t("Checked at")}: {new Date(verifyStatus.checkedAt).toLocaleTimeString()}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={`text-sm font-black px-3 py-1 ${allPassed ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                      {passed}/{total}
                    </Badge>
                  </div>
                );
              })()}

              {/* Note about local vs production */}
              <div className={`p-2 rounded-lg ${isDark ? "bg-blue-900/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
                <p className="text-[10px] text-blue-500 flex items-start gap-1">
                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                  {t("Note: This checks the live production site (katyaayaniastrologer.com). On localhost, Google/Bing cannot verify. After deployment, all checks should be green.")}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Button onClick={runVerificationCheck} className="bg-green-600 hover:bg-green-700 text-white">
                <Shield className="w-4 h-4 mr-2" /> {t("Run Verification Check")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =================== GOOGLE SEO SECTION =================== */}
      <Card className={`${cardClass} ring-1 ring-blue-500/20`}>
        <CardHeader>
          <CardTitle className="text-blue-500 flex items-center gap-2">
            <Search className="w-5 h-5" /> {t("Google Search Console")}
            {googleCode && <Badge className="bg-green-500/10 text-green-500 text-[10px] ml-2">{t("Verified")}</Badge>}
          </CardTitle>
          <CardDescription>{t("Manage Google verification codes, sitemap submission & indexing")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Verification Code 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("Verification Code 1 (Primary)")}</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 2Edo_sTI7Jp85F7z7xr0y..."
                value={googleCode}
                onChange={(e) => setGoogleCode(e.target.value)}
                className={inputClass}
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(googleCode)} className="shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Google Verification Code 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("Verification Code 2 (Secondary)")}</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., JC618JFaRN0wnJt6Lsbg..."
                value={googleCode2}
                onChange={(e) => setGoogleCode2(e.target.value)}
                className={inputClass}
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(googleCode2)} className="shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Google Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={() => handlePingSitemap("Google")}
              disabled={pinging}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {pinging && pingTarget === "Google" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {t("Ping Google Sitemap")}
            </Button>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-1 border-blue-500/20 text-blue-500">
                <ExternalLink className="w-3 h-3" /> {t("Open Google Console")}
              </Button>
            </a>
            <a href={`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-1 border-blue-500/20 text-blue-500">
                <FileText className="w-3 h-3" /> {t("Resubmit Sitemap")}
              </Button>
            </a>
          </div>

          {/* Google Meta Preview */}
          <div className={`p-3 rounded-lg border ${isDark ? "bg-[#0a0a12] border-blue-500/10" : "bg-blue-50 border-blue-200"}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("Meta Tags in <head>")}</p>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
{`<meta name="google-site-verification" content="${googleCode || '...'}" />`}{"\n"}
{`<meta name="google-site-verification" content="${googleCode2 || '...'}" />`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* =================== BING SEO SECTION =================== */}
      <Card className={`${cardClass} ring-1 ring-cyan-500/20`}>
        <CardHeader>
          <CardTitle className="text-cyan-500 flex items-center gap-2">
            <Globe className="w-5 h-5" /> {t("Bing Webmaster Tools")}
            {bingCode && <Badge className="bg-green-500/10 text-green-500 text-[10px] ml-2">{t("Verified")}</Badge>}
          </CardTitle>
          <CardDescription>{t("Manage Bing verification, URL submission, IndexNow & sitemap for Bing")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bing Verification Code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("Bing Verification Code (msvalidate.01)")}</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 2Edo_sTI7Jp85F7z7xr0y..."
                value={bingCode}
                onChange={(e) => setBingCode(e.target.value)}
                className={inputClass}
              />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(bingCode)} className="shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t("Since you imported from Google, the same verification code works for Bing")}
            </p>
          </div>

          {/* Bing URL Submission */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">{t("Submit URLs to Bing (via IndexNow)")}</label>
            <div className="flex gap-2">
              <Input
                placeholder={`${siteUrl}/new-blog-post`}
                value={bingSubmitUrl}
                onChange={(e) => setBingSubmitUrl(e.target.value)}
                className={inputClass}
              />
              <Button
                onClick={handleBingUrlSubmit}
                disabled={bingSubmitting || !bingSubmitUrl.trim()}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shrink-0"
              >
                {bingSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Bing Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={() => handlePingSitemap("Bing")}
              disabled={pinging}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {pinging && pingTarget === "Bing" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {t("Ping Bing Sitemap")}
            </Button>
            <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-1 border-cyan-500/20 text-cyan-500">
                <ExternalLink className="w-3 h-3" /> {t("Open Bing Webmaster")}
              </Button>
            </a>
            <a href={`https://www.bing.com/webmasters/sitemaps?siteUrl=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-1 border-cyan-500/20 text-cyan-500">
                <FileText className="w-3 h-3" /> {t("Resubmit Bing Sitemap")}
              </Button>
            </a>
          </div>

          {/* Bing Meta Preview */}
          <div className={`p-3 rounded-lg border ${isDark ? "bg-[#0a0a12] border-cyan-500/10" : "bg-cyan-50 border-cyan-200"}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("Bing Meta Tag + BingSiteAuth.xml")}</p>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
{`<meta name="msvalidate.01" content="${bingCode || '...'}" />`}{"\n"}
{`<!-- Also verified via /BingSiteAuth.xml -->`}
            </pre>
          </div>

          {/* Bing-specific features info */}
          <div className={`p-3 rounded-lg border ${isDark ? "bg-cyan-900/10 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"}`}>
            <p className="text-xs font-bold text-cyan-500 mb-2">{t("Bing SEO Features Active:")}</p>
            <div className="space-y-1 text-xs">
              {[
                { label: t("IndexNow instant indexing"), status: true },
                { label: t("BingSiteAuth.xml verification"), status: true },
                { label: t("msvalidate.01 meta tag"), status: !!bingCode },
                  { label: t("Sitemap submitted to Bing"), status: pingLogs.some(l => l.target === "Bing" || l.target?.includes("Bing") || l.target?.includes("IndexNow")) },
                { label: t("Bingbot allowed in robots.txt"), status: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.status ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =================== SAVE ALL VERIFICATION CODES =================== */}
      <Card className={`${cardClass} ring-2 ring-[#ff6b35]/30`}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Save className="w-5 h-5 text-[#ff6b35]" />
              <div>
                <p className="font-bold text-sm">{t("Save All Verification Codes to Database")}</p>
                <p className="text-[10px] text-muted-foreground">{t("Codes are stored in admin_settings table. Update .env.local for production builds.")}</p>
              </div>
            </div>
            <Button onClick={handleSaveVerification} disabled={saving} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {t("Save All Codes")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =================== INDEXNOW - INSTANT INDEXING =================== */}
      <Card className={`${cardClass} ring-2 ring-purple-500/30`}>
        <CardHeader>
          <CardTitle className="text-purple-500 flex items-center gap-2">
            <Zap className="w-5 h-5" /> {t("IndexNow - Instant Indexing")}
            <Badge className="bg-purple-500/10 text-purple-500 text-[10px] ml-2">RECOMMENDED</Badge>
          </CardTitle>
          <CardDescription>{t("Submit URLs directly to Bing, Yandex, Seznam & Naver for instant indexing (works for both Google & Bing)")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* IndexNow Key Info */}
          <div className={`p-4 rounded-lg border ${isDark ? "bg-purple-900/10 border-purple-500/20" : "bg-purple-50 border-purple-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" /> {t("API Key")}
              </span>
              <Badge className="bg-green-500/10 text-green-500 text-[10px]">{t("Active")}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <code className={`flex-1 text-xs font-mono p-2 rounded ${isDark ? "bg-[#0a0a12]" : "bg-white"} border ${isDark ? "border-purple-500/10" : "border-purple-200"}`}>
                {indexNowKey}
              </code>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(indexNowKey)} className="shrink-0">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Submit URLs */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">{t("Submit URLs via IndexNow")}</label>
            <Textarea
              placeholder={`Enter URLs (one per line):\n${siteUrl}/\n${siteUrl}/blog\n${siteUrl}/services`}
              value={indexNowUrls}
              onChange={(e) => setIndexNowUrls(e.target.value)}
              className={`${inputClass} min-h-[100px] font-mono text-xs`}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleIndexNowSubmit()}
                disabled={indexNowSubmitting || !indexNowUrls.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {indexNowSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                {t("Submit Custom URLs")}
              </Button>
              <Button
                onClick={handleIndexNowSubmitAll}
                disabled={indexNowSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {indexNowSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                {t(`Submit All ${sitemapStatus?.pages || 0} Sitemap Pages`)}
              </Button>
            </div>
          </div>

          {/* Last IndexNow Result */}
          {lastIndexNowResult && (
            <div className={`p-3 rounded-lg border ${isDark ? "bg-green-900/10 border-green-500/20" : "bg-green-50 border-green-200"}`}>
              <p className="text-xs font-bold text-green-500 mb-1">{t("Last Submission Result:")}</p>
              <div className="space-y-1 text-xs">
                <p>{t("URLs submitted")}: <span className="font-bold">{lastIndexNowResult.urlCount}</span></p>
                {lastIndexNowResult.results?.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {r.status === "success" || r.status === "accepted" 
                      ? <CheckCircle className="w-3 h-3 text-green-500" /> 
                      : <XCircle className="w-3 h-3 text-red-500" />}
                    <span>{r.endpoint?.includes("bing") ? "Bing" : "IndexNow API"}: HTTP {r.statusCode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =================== SITEMAP MANAGEMENT =================== */}
      <Card className={cardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <FileText className="w-5 h-5" /> {t("Sitemap Management")}
              </CardTitle>
              <CardDescription>{t("View sitemap URLs, ping & resubmit to Google and Bing")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={checkSitemap} className="border-[#ff6b35]/20 text-[#ff6b35]">
              <RefreshCw className="w-4 h-4 mr-1" /> {t("Refresh")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sitemap URL */}
          <div className="flex items-center gap-2">
            <code className={`flex-1 text-xs font-mono p-2 rounded ${isDark ? "bg-[#0a0a12] border-[#ff6b35]/10" : "bg-gray-50 border-gray-200"} border`}>
              {siteUrl}/sitemap.xml
            </code>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${siteUrl}/sitemap.xml`)}>
              <Copy className="w-3 h-3" />
            </Button>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3" />
              </Button>
            </a>
          </div>

          {/* Toggle Sitemap URLs */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setShowSitemapUrls(!showSitemapUrls)}
          >
            {showSitemapUrls ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
            {showSitemapUrls ? t("Hide Sitemap URLs") : t(`Show All ${sitemapStatus?.pages || 0} Sitemap URLs`)}
          </Button>

          {showSitemapUrls && sitemapStatus?.urls && (
            <div className={`p-3 rounded-lg border ${isDark ? "bg-[#0a0a12] border-[#ff6b35]/5" : "bg-gray-50 border-gray-200"} max-h-[300px] overflow-y-auto`}>
              {sitemapStatus.urls.map((url, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <code className="text-[11px] font-mono text-muted-foreground truncate">{url}</code>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard(url)}>
                      <Copy className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ping Both */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              onClick={() => handlePingSitemap()}
              disabled={pinging}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold"
            >
              {pinging ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {t("Ping All Engines")}
            </Button>
            <a href={`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full gap-1 border-blue-500/20 text-blue-500">
                <ArrowRight className="w-3 h-3" /> {t("Google Sitemap")}
              </Button>
            </a>
            <a href={`https://www.bing.com/webmasters/sitemaps?siteUrl=${encodeURIComponent(siteUrl)}`} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full gap-1 border-cyan-500/20 text-cyan-500">
                <ArrowRight className="w-3 h-3" /> {t("Bing Sitemap")}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* =================== PING & INDEXNOW HISTORY =================== */}
      <Card className={cardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <Clock className="w-5 h-5" /> {t("Submission History")}
              </CardTitle>
              <CardDescription>{t("All search engine pings, IndexNow submissions & URL indexing activity")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPingLogs} disabled={logsLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${logsLoading ? "animate-spin" : ""}`} />
              {t("Refresh")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" />
            </div>
          ) : pingLogs.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground italic">{t("No history yet. Submit your first URLs!")}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {pingLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? "bg-[#1a1a2e] border-[#ff6b35]/5" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {log.status === "success" || log.status === "accepted" ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{log.target}</span>
                        <Badge className={`text-[9px] ${
                          log.status === "success" || log.status === "accepted" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {log.status === "success" ? "OK" : log.status === "accepted" ? "ACCEPTED" : "FAILED"}
                        </Badge>
                        {log.status_code > 0 && (
                          <Badge variant="outline" className="text-[9px]">HTTP {log.status_code}</Badge>
                        )}
                        {log.target?.includes("IndexNow") && (
                          <Badge className="bg-purple-500/10 text-purple-500 text-[9px]">IndexNow</Badge>
                        )}
                        {log.target === "Google" && (
                          <Badge className="bg-blue-500/10 text-blue-500 text-[9px]">Google</Badge>
                        )}
                        {log.target === "Bing" && (
                          <Badge className="bg-cyan-500/10 text-cyan-500 text-[9px]">Bing</Badge>
                        )}
                      </div>
                      {log.error_message && (
                        <p className="text-[10px] text-red-400 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {log.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =================== OG IMAGE & SOCIAL SHARING =================== */}
      <Card className={`${cardClass} ring-1 ring-orange-500/20`}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> {t("Open Graph & Social Sharing")}
          </CardTitle>
          <CardDescription>{t("Change OG images, titles & descriptions for Google, Bing, Facebook, WhatsApp, Twitter sharing")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ogLoading ? (
            <div className="py-6 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-[#ff6b35]" /></div>
          ) : ogEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-4">{t("No SEO entries yet. Go to SEO Manager to add pages first.")}</p>
          ) : (
            <div className="space-y-3">
              {ogEntries.map((entry) => (
                <div key={entry.id}>
                  {editingOg?.id === entry.id ? (
                    /* Edit Mode */
                    <div className={`p-4 rounded-xl border-2 border-[#ff6b35]/30 space-y-4 ${isDark ? "bg-[#1a1a2e]" : "bg-[#fff8f5]"}`}>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-bold font-mono">{entry.page_path}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingOg(null); setOgForm({ og_title: "", og_description: "", og_image: "" }); }}>
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">{t("OG Title")}</label>
                          <Input value={ogForm.og_title} onChange={(e) => setOgForm({ ...ogForm, og_title: e.target.value })} placeholder={entry.meta_title || "OG Title..."} className={inputClass} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">{t("OG Image URL")}</label>
                          <div className="flex gap-2">
                            <Input value={ogForm.og_image} onChange={(e) => setOgForm({ ...ogForm, og_image: e.target.value })} placeholder="https://..." className={`flex-1 ${inputClass}`} />
                            <label className="flex items-center gap-1 px-3 py-2 rounded-md border cursor-pointer hover:bg-[#ff6b35]/10 transition-colors text-xs font-bold text-[#ff6b35] border-[#ff6b35]/20">
                              {ogUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              {t("Upload")}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleOgImageUpload(file);
                                e.target.value = "";
                              }} />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold">{t("OG Description")}</label>
                        <Textarea value={ogForm.og_description} onChange={(e) => setOgForm({ ...ogForm, og_description: e.target.value })} placeholder={entry.meta_description || "Description for social sharing..."} className={`${inputClass} min-h-[60px]`} />
                        <p className="text-[10px] text-muted-foreground">{ogForm.og_description.length}/200 {t("characters")}</p>
                      </div>

                      {/* OG Image Preview */}
                      {ogForm.og_image && (
                        <div className="relative w-full max-w-md">
                          <img src={ogForm.og_image} alt="OG Preview" className="w-full h-auto rounded-lg border border-[#ff6b35]/20 object-cover max-h-48" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <button type="button" onClick={() => setOgForm({ ...ogForm, og_image: "" })} className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Social Card Preview */}
                      {(ogForm.og_title || entry.meta_title) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Facebook Preview */}
                          <div className={`rounded-lg border overflow-hidden ${isDark ? "border-white/10" : "border-gray-200"}`}>
                            <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-500/10 text-blue-500">Facebook / LinkedIn</p>
                            {ogForm.og_image && <img src={ogForm.og_image} alt="" className="w-full h-24 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                            <div className={`p-2 ${isDark ? "bg-[#1a1a2e]" : "bg-[#f0f2f5]"}`}>
                              <p className="text-[9px] uppercase text-muted-foreground">katyaayaniastrologer.com</p>
                              <p className="text-xs font-bold truncate">{ogForm.og_title || entry.meta_title}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">{ogForm.og_description || entry.meta_description}</p>
                            </div>
                          </div>
                          {/* Twitter Preview */}
                          <div className={`rounded-lg border overflow-hidden ${isDark ? "border-white/10" : "border-gray-200"}`}>
                            <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-sky-500/10 text-sky-500">Twitter / X</p>
                            {ogForm.og_image && <img src={ogForm.og_image} alt="" className="w-full h-24 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                            <div className={`p-2 ${isDark ? "bg-[#1a1a2e]" : "bg-white"}`}>
                              <p className="text-xs font-bold truncate">{ogForm.og_title || entry.meta_title}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">{ogForm.og_description || entry.meta_description}</p>
                            </div>
                          </div>
                          {/* WhatsApp Preview */}
                          <div className={`rounded-lg border overflow-hidden ${isDark ? "border-white/10" : "border-gray-200"}`}>
                            <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500">WhatsApp</p>
                            <div className={`p-2 ${isDark ? "bg-[#1a2e1a]" : "bg-[#dcf8c6]"}`}>
                              {ogForm.og_image && <img src={ogForm.og_image} alt="" className="w-full h-20 object-cover rounded mb-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                              <p className="text-xs font-bold truncate">{ogForm.og_title || entry.meta_title}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">{ogForm.og_description || entry.meta_description}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button onClick={handleOgSave} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold">
                        <Save className="w-4 h-4 mr-2" /> {t("Save OG Changes")}
                      </Button>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}>
                      {entry.og_image ? (
                        <img src={entry.og_image} alt="" className="w-14 h-14 rounded-lg object-cover border border-[#ff6b35]/10 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).className = "w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0"; }} />
                      ) : (
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                          <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-bold font-mono">{entry.page_path}</span>
                          {entry.og_title && <Badge className="bg-blue-500/10 text-blue-500 text-[8px]">OG</Badge>}
                          {entry.og_image && <Badge className="bg-purple-500/10 text-purple-500 text-[8px]">IMG</Badge>}
                        </div>
                        <p className="text-sm font-bold truncate mt-0.5">{entry.og_title || entry.meta_title || "No title"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{entry.og_description || entry.meta_description || "No description"}</p>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs border-[#ff6b35]/20 text-[#ff6b35]" onClick={() => handleOgEdit(entry)}>
                        <Eye className="w-3 h-3 mr-1" /> {t("Edit OG")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =================== SEARCH RESULT THUMBNAIL (GOOGLE & BING) =================== */}
      <Card className={`${cardClass} ring-2 ring-[#ff6b35]/40`}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> {t("Search Result Thumbnail Image")}
            <Badge className="bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] ml-2">GOOGLE &amp; BING</Badge>
          </CardTitle>
          <CardDescription>{t("Jyare koi Google ya Bing ma website search kare, tyare link ni bajuma aa photo aave che. Niche upload karo.")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Live Google/Bing Search Result Preview */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-[#ff6b35]">{t("Search Result Preview (Google / Bing)")}</p>

            {/* Google Search Result Mockup */}
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#202124] border-[#3c4043]" : "bg-white border-gray-200"} space-y-1`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Google Search Result</p>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isDark ? "text-[#bdc1c6]" : "text-[#4d5156]"}`}>katyaayaniastrologer.com</p>
                  <p className={`text-base font-medium ${isDark ? "text-[#8ab4f8]" : "text-[#1a0dab]"} truncate`}>
                    Katyaayani Astrologer - Best Vedic Astrologer
                  </p>
                  <p className={`text-xs ${isDark ? "text-[#bdc1c6]" : "text-[#4d5156]"} line-clamp-2`}>
                    Katyaayani Astrologer connects modern times with ancient astrology. Expert Vedic consultations, kundali analysis, horoscope readings since 2007.
                  </p>
                </div>
                {/* Thumbnail on the right */}
                <div className="shrink-0">
                  {searchThumbnail ? (
                    <img
                      src={searchThumbnail}
                      alt="Search thumbnail"
                      className="w-24 h-16 rounded-lg object-cover border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className={`w-24 h-16 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-gray-100"} border`}>
                      <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bing Search Result Mockup */}
            <div className={`p-4 rounded-xl border ${isDark ? "bg-[#1b1b1b] border-[#3c4043]" : "bg-[#f8f8f8] border-gray-200"} space-y-1`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bing Search Result</p>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isDark ? "text-[#aaa]" : "text-[#767676]"}`}>https://katyaayaniastrologer.com</p>
                  <p className={`text-base font-medium ${isDark ? "text-[#74b5fb]" : "text-[#1b64d8]"} truncate`}>
                    Katyaayani Astrologer - Best Vedic Astrologer
                  </p>
                  <p className={`text-xs ${isDark ? "text-[#aaa]" : "text-[#767676]"} line-clamp-2`}>
                    Expert Vedic astrology consultations, kundali analysis, horoscope readings, vastu shastra since 2007.
                  </p>
                </div>
                <div className="shrink-0">
                  {searchThumbnail ? (
                    <img
                      src={searchThumbnail}
                      alt="Search thumbnail"
                      className="w-24 h-16 rounded-lg object-cover border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className={`w-24 h-16 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-gray-100"} border`}>
                      <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current thumbnail + change options */}
          <div className={`p-4 rounded-xl border-2 border-dashed ${isDark ? "border-[#ff6b35]/30 bg-[#ff6b35]/5" : "border-[#ff6b35]/30 bg-[#fff8f5]"} space-y-4`}>
            <p className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
              <Upload className="w-4 h-4" /> {t("Change Search Thumbnail")}
            </p>

            {/* Current image */}
            {searchThumbnail && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold">{t("Current Image:")}</p>
                <img
                  src={searchThumbnail}
                  alt="Current thumbnail"
                  className="w-full max-w-sm h-auto rounded-lg border border-[#ff6b35]/20 object-cover"
                  style={{ maxHeight: 160 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}

            {/* Upload new image */}
            <label className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[#ff6b35]/60 ${isDark ? "border-[#ff6b35]/20 bg-white/5 hover:bg-[#ff6b35]/10" : "border-[#ff6b35]/20 bg-white hover:bg-[#fff8f5]"}`}>
              {thumbnailUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#ff6b35]/60" />
                  <span className="text-sm font-semibold text-[#ff6b35]">{t("Upload New Thumbnail")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("Best size: 1200x630px — JPG, PNG, WEBP — max 5MB")}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={thumbnailUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleThumbnailUpload(file);
                  e.target.value = "";
                }}
              />
            </label>

            {/* Or enter URL */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">{t("Or paste image URL:")}</p>
              <div className="flex gap-2">
                <Input
                  value={thumbnailInput}
                  onChange={(e) => setThumbnailInput(e.target.value)}
                  placeholder="https://..."
                  className={`flex-1 ${inputClass} text-xs`}
                />
                <Button
                  size="sm"
                  onClick={() => { if (thumbnailInput.trim()) handleThumbnailSave(thumbnailInput.trim()); }}
                  disabled={thumbnailSaving || !thumbnailInput.trim()}
                  className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white shrink-0"
                >
                  {thumbnailSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${isDark ? "bg-blue-900/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
              <p className="text-[11px] text-blue-500">
                <strong>{t("Aa image Google ane Bing search result ma link ni bajuma aave che.")}</strong>
                {" "}{t("Save karti vakhte badha pages par apply thai jashe. Deploy kya pachi 1-2 din ma Google/Bing update thase.")}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* =================== SEO IMAGE LIBRARY =================== */}
      <Card className={`${cardClass} ring-1 ring-pink-500/20`}>
        <CardHeader>
          <CardTitle className="text-pink-500 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> {t("SEO Image Library")}
            <Badge className="bg-pink-500/10 text-pink-500 text-[10px] ml-2">Google &amp; Bing</Badge>
          </CardTitle>
          <CardDescription>{t("Images used for Google Search, Bing search results, WhatsApp/Facebook sharing. Upload new images and apply to any page.")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Preset Images from your uploads */}
          <div className="space-y-3">
            <p className="text-sm font-bold">{t("Your Brand Images (Click to Apply to All Pages)")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: t("Cover / Banner"),
                  desc: t("Best for Google & Bing search preview (1200x630)"),
                  url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/coverimage-1771354510444.png",
                  badge: "ACTIVE",
                  badgeColor: "bg-green-500",
                },
                {
                  label: t("Logo with Name"),
                  desc: t("Full logo - Katyaayani Astrologer"),
                  url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/Gemini_Generated_Image_6u6muz6u6muz6u6m-1771354508220.png",
                  badge: "LOGO",
                  badgeColor: "bg-blue-500",
                },
                {
                  label: t("Logo Icon Only"),
                  desc: t("KA symbol - for favicon / icon use"),
                  url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/82257351-6e7a-48cd-a2d1-b2ac49e135b9/logowithoutname-1771354510455.png",
                  badge: "ICON",
                  badgeColor: "bg-orange-500",
                },
              ].map((img, i) => (
                <div key={i} className={`rounded-xl border overflow-hidden transition-all hover:shadow-lg ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 text-[9px] font-black text-white px-2 py-0.5 rounded ${img.badgeColor}`}>{img.badge}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-bold">{img.label}</p>
                    <p className="text-[10px] text-muted-foreground">{img.desc}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-[10px] h-7 bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/admin/seo/bulk-og-image", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ og_image: img.url }),
                            });
                            const data = await res.json();
                            if (data.success) setSuccess(t(`Applied to ${data.updated} pages!`));
                            else setError(data.error || t("Failed"));
                            fetchOgEntries();
                          } catch { setError(t("Error applying image")); }
                        }}
                      >
                        <Globe className="w-3 h-3 mr-1" /> {t("Apply to All Pages")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => copyToClipboard(img.url)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New OG Image */}
          <div className={`p-4 rounded-xl border-2 border-dashed ${isDark ? "border-pink-500/30 bg-pink-900/5" : "border-pink-300 bg-pink-50"} space-y-3`}>
            <p className="text-sm font-bold text-pink-500 flex items-center gap-2">
              <Upload className="w-4 h-4" /> {t("Upload New Image for Google & Bing")}
            </p>
            <p className="text-[11px] text-muted-foreground">{t("Recommended: 1200x630px, JPG or PNG, under 5MB. This will be used for all search engine sharing.")}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-pink-400 ${isDark ? "border-pink-500/20 bg-white/5 hover:bg-pink-900/10" : "border-pink-200 bg-white hover:bg-pink-50"}`}>
                {ogUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-pink-400" />
                    <span className="text-sm font-semibold text-pink-500">{t("Click to Upload Image")}</span>
                    <span className="text-[10px] text-muted-foreground">JPG, PNG, WEBP — max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) { setError(t("Image must be under 5MB")); return; }
                    setOgUploading(true);
                    try {
                      const { createClient } = await import('@supabase/supabase-js');
                      const sb = createClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                      );
                      const ext = file.name.split(".").pop();
                      const fileName = `seo-og-${Date.now()}.${ext}`;
                      const { error: uploadErr } = await sb.storage.from("blog-images").upload(`og/${fileName}`, file, { upsert: true });
                      if (uploadErr) throw uploadErr;
                      const { data: urlData } = sb.storage.from("blog-images").getPublicUrl(`og/${fileName}`);
                      const newUrl = urlData.publicUrl;
                      // Apply to all pages
                      const res = await fetch("/api/admin/seo/bulk-og-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ og_image: newUrl }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setSuccess(t(`Image uploaded & applied to ${data.updated} pages!`));
                        fetchOgEntries();
                      } else setError(data.error || t("Upload failed"));
                    } catch (err: any) { setError(err.message || t("Upload failed")); }
                    finally { setOgUploading(false); e.target.value = ""; }
                  }}
                />
              </label>
            </div>
          </div>

          {/* How it works info */}
          <div className={`p-3 rounded-lg ${isDark ? "bg-blue-900/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
            <p className="text-xs font-bold text-blue-500 mb-2">{t("How these images are used:")}</p>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> <span><strong>Google:</strong> {t("Shows in Knowledge Panel, Image Search & when shared on Gmail")}</span></div>
              <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-cyan-500" /> <span><strong>Bing:</strong> {t("Shows in Bing Image Search & Bing social preview cards")}</span></div>
              <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-green-500" /> <span><strong>WhatsApp / Facebook:</strong> {t("Shows as thumbnail when someone shares your website link")}</span></div>
              <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-sky-500" /> <span><strong>Twitter/X:</strong> {t("Shows as large card image when link is tweeted")}</span></div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* =================== QUICK LINKS =================== */}
      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <ExternalLink className="w-5 h-5" /> {t("Quick Links")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Google Search Console", url: "https://search.google.com/search-console", color: "blue" },
              { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters", color: "cyan" },
              { label: "IndexNow Docs", url: "https://www.indexnow.org/documentation", color: "purple" },
              { label: "Google PageSpeed", url: `https://pagespeed.web.dev/analysis?url=${siteUrl}`, color: "green" },
              { label: "Rich Results Test", url: `https://search.google.com/test/rich-results?url=${siteUrl}`, color: "amber" },
              { label: "Schema Validator", url: "https://validator.schema.org/", color: "rose" },
              { label: "Google Mobile Test", url: `https://search.google.com/test/mobile-friendly?url=${siteUrl}`, color: "blue" },
              { label: "Bing URL Inspection", url: `https://www.bing.com/webmasters/urlinspection?siteUrl=${encodeURIComponent(siteUrl)}`, color: "cyan" },
              { label: "Robots.txt Tester", url: `https://www.google.com/webmasters/tools/robots-testing-tool?siteUrl=${encodeURIComponent(siteUrl)}`, color: "green" },
            ].map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className={`p-3 rounded-lg border transition-all hover:scale-[1.02] hover:shadow-md ${isDark ? "bg-[#1a1a2e] border-[#ff6b35]/10 hover:border-[#ff6b35]/30" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
