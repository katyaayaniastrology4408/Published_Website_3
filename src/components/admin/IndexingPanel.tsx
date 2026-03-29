"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe, Send, RefreshCw, CheckCircle, XCircle, Clock, Loader2,
  ExternalLink, Zap, FileText, Info, Search, Settings
} from "lucide-react";
import { safeJson } from "@/lib/safe-json";

interface IndexingPanelProps {
  isDark: boolean;
  t: (key: string) => string;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
}

const SITE_URL = "https://www.katyaayaniastrologer.com";

// Fallback static list (always include these)
const STATIC_PAGES = [
  `${SITE_URL}/`,
  `${SITE_URL}/about`,
  `${SITE_URL}/services`,
  `${SITE_URL}/booking`,
  `${SITE_URL}/online-consulting`,
  `${SITE_URL}/contact`,
  `${SITE_URL}/feedback`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/rashifal`,
  `${SITE_URL}/hindu-calendar`,
  `${SITE_URL}/important-days`,
  `${SITE_URL}/horoscope`,
  `${SITE_URL}/kundli`,
  `${SITE_URL}/privacy`,
  `${SITE_URL}/terms`,
  `${SITE_URL}/refund-policy`,
  `${SITE_URL}/disclaimer`,
];

type LogEntry = {
  id: string;
  target: string;
  sitemap_url: string;
  status: string;
  response_code: number | null;
  response_body: string | null;
  error_message: string | null;
  created_at: string;
};

type SubmitResult = {
  target: string;
  status: string;
  statusCode?: number;
  body?: string;
};

type SubmitMode = "all" | "bing" | "google" | "custom" | null;

function statusColor(s: string) {
  if (s === "success") return "bg-green-500/10 text-green-500 border-green-500/20";
  if (s === "partial") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  if (s === "failed" || s === "error") return "bg-red-500/10 text-red-500 border-red-500/20";
  if (s === "not_configured") return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  if (s === "info") return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  return "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

function statusIcon(s: string) {
  if (s === "success") return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
  if (s === "partial") return <CheckCircle className="w-3.5 h-3.5 text-yellow-500" />;
  if (s === "failed" || s === "error") return <XCircle className="w-3.5 h-3.5 text-red-500" />;
  if (s === "not_configured") return <Settings className="w-3.5 h-3.5 text-orange-500" />;
  if (s === "info") return <Info className="w-3.5 h-3.5 text-blue-500" />;
  return <Clock className="w-3.5 h-3.5 text-gray-400" />;
}

function statusLabel(s: string) {
  if (s === "not_configured") return "Not Configured";
  if (s === "success") return "Success";
  if (s === "partial") return "Partial";
  if (s === "failed") return "Failed";
  if (s === "error") return "Error";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Parse all <loc> URLs from sitemap XML
function parseUrlsFromSitemap(xml: string): string[] {
  const matches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches
    .map(m => m.replace(/<\/?loc>/g, "").trim())
    .filter(u => u.startsWith("https://www.katyaayaniastrologer.com"));
}

export default function IndexingPanel({ isDark, setSuccess, setError }: IndexingPanelProps) {
  const [customUrls, setCustomUrls] = useState("");
  const [submitting, setSubmitting] = useState<SubmitMode>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [allPages, setAllPages] = useState<string[]>(STATIC_PAGES);
  const [sitemapOk, setSitemapOk] = useState<boolean | null>(null);
  const [lastResults, setLastResults] = useState<SubmitResult[] | null>(null);
  const [lastUrlCount, setLastUrlCount] = useState(0);
  const [googleConfigured, setGoogleConfigured] = useState<boolean | null>(null);

  const card = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  useEffect(() => {
    fetchLogs();
    fetchSitemapUrls();
    checkGoogleConfig();
  }, []);

  // Fetch all URLs from the live sitemap
  const fetchSitemapUrls = async () => {
    try {
      const res = await fetch("/sitemap.xml");
      if (!res.ok) { setSitemapOk(false); return; }
      const xml = await res.text();
      const urls = parseUrlsFromSitemap(xml);
      setSitemapOk(true);
      if (urls.length > 0) {
        // Merge with static pages to ensure nothing is missed
        const merged = Array.from(new Set([...urls, ...STATIC_PAGES]));
        setAllPages(merged);
      }
    } catch {
      setSitemapOk(false);
    }
  };

  // Just check if Google service account is configured — no submission
  const checkGoogleConfig = async () => {
    try {
      const res = await fetch("/api/admin/seo/indexnow?check=google");
      const data = await safeJson(res);
      setGoogleConfigured(data?.configured === true);
    } catch {
      setGoogleConfigured(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/seo/indexnow");
      if (!res.ok) return;
      const data = await safeJson(res);
      if (data?.success) setLogs(data.logs || []);
    } catch {}
    finally { setLogsLoading(false); }
  };

  const submit = async (urls: string[], mode: SubmitMode, engines: "all" | "bing" | "google") => {
    setSubmitting(mode);
    setLastResults(null);
    try {
      const res = await fetch("/api/admin/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, engines }),
      });
      const data = await safeJson(res);
      if (data?.success) {
        const results: SubmitResult[] = data.results || [];
        setLastResults(results);
        setLastUrlCount(data.urlCount || urls.length);
        const ok = results.filter(r => r.status === "success" || r.status === "partial").length;
        const total = results.filter(r => r.status !== "not_configured").length;
        if (ok > 0) {
          setSuccess(`${urls.length} URLs submitted to ${ok}/${total || results.length} engines!`);
        } else {
          const errMsg = results.map(r => `${r.target}: ${r.body || r.status}`).join(" | ");
          setError(errMsg || "Submission failed");
        }
        if (mode === "custom") setCustomUrls("");
        fetchLogs();
      } else {
        setError(data?.message || "Submission failed");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setSubmitting(null);
  };

  const handleCustomSubmit = (engines: "all" | "bing" | "google") => {
    const urls = customUrls.split("\n").map(u => u.trim()).filter(u => u.startsWith("http"));
    if (!urls.length) { setError("Enter at least one valid URL starting with http"); return; }
    submit(urls, "custom", engines);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-0">

      {/* Header */}
      <div className={`p-5 rounded-2xl border ${card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-[#ff6b35] flex items-center gap-2">
              <Search className="w-5 h-5" /> Google &amp; Bing Indexing
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Submit all pages to Google Indexing API &amp; Bing via IndexNow
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              sitemapOk === null ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
              : sitemapOk ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
            }`}>
              {sitemapOk ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {sitemapOk === null ? "Loading..." : sitemapOk ? `${allPages.length} pages` : "Sitemap error"}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              googleConfigured === null ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
              : googleConfigured ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
            }`}>
              <Globe className="w-3 h-3" />
              Google API {googleConfigured === null ? "..." : googleConfigured ? "Ready" : "Setup needed"}
            </span>
          </div>
        </div>
      </div>

      {/* Google not configured banner */}
      {googleConfigured === false && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? "bg-orange-500/5 border-orange-500/20" : "bg-orange-50 border-orange-200"}`}>
          <Settings className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-600">Google Indexing API — Setup Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              Google indexing needs a service account. Bing IndexNow works without any extra setup.
              To enable Google: add <code className="bg-orange-500/10 px-1 rounded text-orange-600 text-[11px]">GOOGLE_SERVICE_ACCOUNT_JSON</code> to your environment variables.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline">
                1. Create Service Account <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline">
                2. Add as Owner in Search Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Google configured but needs Search Console ownership */}
      {googleConfigured === true && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}>
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-600">Google Indexing API — One Step Remaining</p>
            <p className="text-xs text-muted-foreground mt-1">
              Service account is configured. For indexing to work, add the service account as <strong>Owner</strong> in Google Search Console:
            </p>
            <div className="mt-2 p-2 rounded-lg font-mono text-[11px] bg-blue-500/10 text-blue-700 break-all select-all">
              indexing-bot@katyaayani-astrologer.iam.gserviceaccount.com
            </div>
            <a href="https://search.google.com/search-console/users" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-2">
              Open Search Console Users &amp; Permissions <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Submit Buttons */}
      <Card className={card}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ff6b35]" />
                Submit All {allPages.length} Pages
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submits all sitemap URLs to Google &amp; Bing simultaneously
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Google + Bing */}
              <Button
                className="bg-[#ff6b35] hover:bg-[#e55a25] text-white font-bold text-sm"
                disabled={!!submitting}
                onClick={() => submit(allPages, "all", "all")}
              >
                {submitting === "all"
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</>
                  : <><Send className="w-4 h-4 mr-2" />Submit to Google + Bing</>}
              </Button>
              {/* Google only */}
              <Button
                variant="outline"
                className="border-[#4285f4]/40 text-[#4285f4] font-bold text-sm hover:bg-[#4285f4]/10"
                disabled={!!submitting}
                onClick={() => submit(allPages, "google", "google")}
                title={!googleConfigured ? "Setup Google service account first" : ""}
              >
                {submitting === "google"
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</>
                  : <><Globe className="w-4 h-4 mr-2" />Google Only</>}
              </Button>
              {/* Bing only */}
              <Button
                variant="outline"
                className="border-[#00b4d8]/40 text-[#00b4d8] font-bold text-sm hover:bg-[#00b4d8]/10"
                disabled={!!submitting}
                onClick={() => submit(allPages, "bing", "bing")}
              >
                {submitting === "bing"
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</>
                  : <><Zap className="w-4 h-4 mr-2" />Bing Only</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Submission Result */}
      {lastResults && lastResults.length > 0 && (
        <Card className={card}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Last Submission Result
              <span className="font-normal text-muted-foreground">— {lastUrlCount} URLs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {lastResults.map((r, i) => (
                <div key={i} className={`p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm">{r.target}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${statusColor(r.status)}`}>
                      {statusIcon(r.status)} {statusLabel(r.status)}
                      {r.statusCode ? ` · ${r.statusCode}` : ""}
                    </span>
                  </div>
                  {r.body && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed break-words">{r.body}</p>
                  )}
                  {r.status === "not_configured" && (
                    <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-orange-500 font-semibold hover:underline mt-1">
                      Setup Guide <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages List Preview */}
      <Card className={card}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Pages Tracked for Indexing ({allPages.length})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchSitemapUrls}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
          <CardDescription>Pulled live from sitemap.xml — includes all blog posts &amp; dynamic pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`rounded-xl border p-3 max-h-40 overflow-y-auto ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
            {allPages.map((url, i) => (
              <div key={i} className="flex items-center gap-2 py-0.5">
                <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-muted-foreground hover:text-[#ff6b35] hover:underline truncate">
                  {url.replace("https://www.katyaayaniastrologer.com", "")}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom URL submit */}
      <Card className={card}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-500" />
            </div>
            Submit Specific URLs
          </CardTitle>
          <CardDescription>One URL per line — submit newly added pages instantly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={customUrls}
            onChange={e => setCustomUrls(e.target.value)}
            placeholder={`${SITE_URL}/blog/your-new-post\n${SITE_URL}/services`}
            rows={4}
            className={`font-mono text-xs ${isDark ? "bg-white/5 border-white/10" : ""}`}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
              disabled={!!submitting || !customUrls.trim()}
              onClick={() => handleCustomSubmit("all")}
            >
              {submitting === "custom"
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</>
                : <><Send className="w-4 h-4 mr-2" />Submit to Google + Bing</>}
            </Button>
            <Button
              variant="outline"
              className="border-[#4285f4]/40 text-[#4285f4] font-bold hover:bg-[#4285f4]/10"
              disabled={!!submitting || !customUrls.trim()}
              onClick={() => handleCustomSubmit("google")}
            >
              <Globe className="w-4 h-4 mr-2" />Google
            </Button>
            <Button
              variant="outline"
              className="border-[#00b4d8]/40 text-[#00b4d8] font-bold hover:bg-[#00b4d8]/10"
              disabled={!!submitting || !customUrls.trim()}
              onClick={() => handleCustomSubmit("bing")}
            >
              <Zap className="w-4 h-4 mr-2" />Bing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Indexing History */}
      <Card className={card}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Indexing History
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchLogs} disabled={logsLoading}>
              <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" /></div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No indexing submissions yet
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 30).map((log) => (
                <div key={log.id} className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold">{log.target}</span>
                      {log.response_body && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-white/10 text-white/60" : "bg-gray-200 text-gray-600"}`}>
                          {log.response_body}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {log.sitemap_url?.substring(0, 70)}{(log.sitemap_url?.length || 0) > 70 ? "..." : ""}
                    </p>
                    {log.error_message && log.status !== "not_configured" && (
                      <p className="text-[10px] text-red-400 mt-0.5 truncate">{log.error_message}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(log.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${statusColor(log.status)}`}>
                      {statusIcon(log.status)} {statusLabel(log.status)}
                    </span>
                    {log.response_code && (
                      <span className="text-[9px] text-muted-foreground">HTTP {log.response_code}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className={card}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">SEO Webmaster Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "Google Search Console", url: "https://search.google.com/search-console", color: "text-[#4285f4]" },
              { label: "Google — Submit Sitemap", url: `https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Akatyaayaniastrologer.com`, color: "text-[#4285f4]" },
              { label: "Google — Request Indexing", url: `https://search.google.com/search-console/inspect?resource_id=sc-domain%3Akatyaayaniastrologer.com`, color: "text-[#4285f4]" },
              { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters", color: "text-[#00b4d8]" },
              { label: "Google PageSpeed Insights", url: `https://pagespeed.web.dev/analysis?url=${SITE_URL}`, color: "text-orange-500" },
              { label: "Google Rich Results Test", url: `https://search.google.com/test/rich-results?url=${SITE_URL}`, color: "text-green-500" },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.01] ${isDark ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
                <span className={`text-sm font-semibold ${link.color}`}>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
