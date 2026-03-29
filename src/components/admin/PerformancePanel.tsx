"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeJson } from "@/lib/safe-json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Gauge, CheckCircle2, AlertTriangle, RefreshCw, Image, HardDrive, Zap, Save } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function PerformancePanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState({
    cache_ttl_static: "60",
    cache_ttl_api: "30",
    cache_ttl_browser: "31536000",
    lazy_loading: "true",
    image_optimization: "true",
  });

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health-check");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success) { setData(json.data); }
      }
    } catch {}
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site-settings");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success && json.data) {
          setSettings(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(json.data).filter(([k]) => k in prev)
            )
          }));
        }
      }
    } catch {}
  };

  useEffect(() => { fetchHealth(); fetchSettings(); }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success) setSuccess("Performance settings saved!");
        else setError("Failed to save settings");
      } else setError("Failed to save settings");
    } catch { setError("Failed to save settings"); }
    setSaving(false);
  };

  const statusIcon = (status: string) => {
    if (status === "healthy" || status === "ok" || status === "connected") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "warning" || status === "degraded") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <Gauge className="w-6 h-6" /> {t("Performance Optimization")}
              </CardTitle>
              <CardDescription>{t("Image optimization, caching, and Core Web Vitals monitoring")}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchHealth} disabled={loading} size="sm" variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              <Button onClick={saveSettings} disabled={saving} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> {t("Save")}</>}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Status */}
      {data?.services && (
        <Card className={cardCls}>
          <CardHeader><CardTitle className="text-sm font-bold text-[#ff6b35]">{t("System Status")}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.services.map((svc: any) => (
                <div key={svc.name} className={`p-3 rounded-lg border ${cardCls} flex items-center gap-2`}>
                  {statusIcon(svc.status)}
                  <div>
                    <p className="text-xs font-medium">{svc.name}</p>
                    <Badge variant="outline" className="text-[10px]">{svc.status}</Badge>
                    {svc.latency && <p className="text-[10px] text-muted-foreground">{svc.latency}ms</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Optimization - Editable */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Image className="w-5 h-5" /> {t("Image Optimization")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#ff6b35]/10">
            <div>
              <p className="text-xs font-medium">{t("Image Optimization")}</p>
              <p className="text-[10px] text-muted-foreground">{t("WebP/AVIF conversion, responsive sizes, CDN caching")}</p>
            </div>
            <Switch
              checked={settings.image_optimization === "true"}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, image_optimization: v ? "true" : "false" }))}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#ff6b35]/10">
            <div>
              <p className="text-xs font-medium">{t("Lazy Loading")}</p>
              <p className="text-[10px] text-muted-foreground">{t("Load images below the fold on scroll")}</p>
            </div>
            <Switch
              checked={settings.lazy_loading === "true"}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, lazy_loading: v ? "true" : "false" }))}
            />
          </div>
          {[
            { label: "Next.js Image Component", desc: "Automatic format conversion & responsive serving", status: "active" },
            { label: "Supabase CDN", desc: "Images served from Supabase Storage CDN with edge caching", status: "active" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cardCls}`}>
              <div>
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <Badge className="text-[10px] bg-green-500/10 text-green-500">{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Caching System - Editable */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <HardDrive className="w-5 h-5" /> {t("Caching System")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">{t("Static Page Cache (seconds)")}</Label>
              <Input
                type="number"
                value={settings.cache_ttl_static}
                onChange={(e) => setSettings(prev => ({ ...prev, cache_ttl_static: e.target.value }))}
                className="mt-1 h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t("ISR revalidation time for homepage etc.")}</p>
            </div>
            <div>
              <Label className="text-xs">{t("API Response Cache (seconds)")}</Label>
              <Input
                type="number"
                value={settings.cache_ttl_api}
                onChange={(e) => setSettings(prev => ({ ...prev, cache_ttl_api: e.target.value }))}
                className="mt-1 h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t("In-memory cache for API endpoints")}</p>
            </div>
            <div>
              <Label className="text-xs">{t("Browser Cache (seconds)")}</Label>
              <Input
                type="number"
                value={settings.cache_ttl_browser}
                onChange={(e) => setSettings(prev => ({ ...prev, cache_ttl_browser: e.target.value }))}
                className="mt-1 h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{t("Static assets (1yr = 31536000)")}</p>
            </div>
          </div>
          <div className={`p-3 rounded-lg border border-[#ff6b35]/20 ${cardCls}`}>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              {t("Changes will apply after saving. Lower cache values = fresher content but more server load.")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Zap className="w-5 h-5" /> {t("Core Web Vitals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { metric: "LCP (Largest Contentful Paint)", target: "< 2.5s", tip: "Hero images preloaded, fonts optimized, critical CSS inlined" },
              { metric: "FID (First Input Delay)", target: "< 100ms", tip: "Minimal JS bundle, code splitting, deferred non-critical scripts" },
              { metric: "CLS (Cumulative Layout Shift)", target: "< 0.1", tip: "All images have explicit width/height, font-display: swap" },
              { metric: "INP (Interaction to Next Paint)", target: "< 200ms", tip: "React concurrent features, optimized event handlers" },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg border ${cardCls}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium">{item.metric}</p>
                  <Badge className="text-[10px] bg-green-500/10 text-green-500">Target: {item.target}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">{item.tip}</p>
              </div>
            ))}
            <div className={`p-3 rounded-lg border border-[#ff6b35]/20 ${cardCls}`}>
              <p className="text-xs font-medium mb-1">{t("Run Detailed Audit")}</p>
              <a href="https://pagespeed.web.dev/analysis?url=https://www.katyaayaniastrologer.com" target="_blank" rel="noopener"
                className="text-xs text-[#ff6b35] hover:underline">PageSpeed Insights → katyaayaniastrologer.com</a>
            </div>
          </div>
        </CardContent>
      </Card>

      {data?.checkedAt && <p className="text-[10px] text-muted-foreground text-right">{t("Last checked")}: {new Date(data.checkedAt).toLocaleString()}</p>}
    </div>
  );
}
