"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Link2, Globe, Zap, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Code, Save } from "lucide-react";
import { safeJson } from "@/lib/safe-json";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function AutomationPanel({ isDark, t, setSuccess, setError }: Props) {
  const [brokenLinks, setBrokenLinks] = useState<any>(null);
  const [brokenLoading, setBrokenLoading] = useState(false);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapResult, setSitemapResult] = useState<any>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaResult, setSchemaResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    auto_sitemap: "true",
    auto_sitemap_interval: "daily",
  });

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

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

  useEffect(() => { fetchSettings(); }, []);

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
        if (json.success) setSuccess("Automation settings saved!");
        else setError("Failed to save");
      } else setError("Failed to save");
    } catch { setError("Failed to save"); }
    setSaving(false);
  };

  const scanBrokenLinks = async () => {
    setBrokenLoading(true);
    try {
      const res = await fetch("/api/admin/seo/broken-links");
      if (res.ok) {
        const data = await safeJson(res);
        if (data.success) { setBrokenLinks(data.data); setSuccess(`Scan complete! Found ${data.data.brokenLinks?.length || 0} broken links`); }
        else setError(data.error || "Scan failed");
      } else setError("Scan failed");
    } catch { setError("Failed to scan broken links"); }
    setBrokenLoading(false);
  };

  const regenerateSitemap = async () => {
    setSitemapLoading(true);
    try {
      const res = await fetch("/api/admin/sitemap", { method: "POST" });
      if (res.ok) {
        const data = await safeJson(res);
        if (data.success) { setSitemapResult(data); setSuccess("Sitemap regenerated!"); }
        else setError(data.error || "Sitemap generation failed");
      } else setError("Sitemap generation failed");
    } catch { setError("Failed to regenerate sitemap"); }
    setSitemapLoading(false);
  };

  const generateSchema = async () => {
    setSchemaLoading(true);
    try {
      const res = await fetch("/api/admin/seo/advanced");
      if (res.ok) {
        const data = await safeJson(res);
        if (data.success) { setSchemaResult(data.data); setSuccess("Schema data generated!"); }
        else setError(data.error || "Schema generation failed");
      } else setError("Schema generation failed");
    } catch { setError("Failed to generate schema"); }
    setSchemaLoading(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <Zap className="w-6 h-6" /> {t("Advanced Automation")}
              </CardTitle>
              <CardDescription>{t("Auto sitemap, broken link scanner, and schema generation")}</CardDescription>
            </div>
            <Button onClick={saveSettings} disabled={saving} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> {t("Save")}</>}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Auto Sitemap Settings */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Globe className="w-5 h-5" /> {t("Auto Sitemap Scheduler")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-[#ff6b35]/10">
            <div>
              <p className="text-xs font-medium">{t("Auto Sitemap Generation")}</p>
              <p className="text-[10px] text-muted-foreground">{t("Automatically regenerate sitemap when blog/page changes happen")}</p>
            </div>
            <Switch
              checked={settings.auto_sitemap === "true"}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, auto_sitemap: v ? "true" : "false" }))}
            />
          </div>

          <div>
            <Label className="text-xs">{t("Regeneration Interval")}</Label>
            <select
              value={settings.auto_sitemap_interval}
              onChange={(e) => setSettings(prev => ({ ...prev, auto_sitemap_interval: e.target.value }))}
              className={`w-full mt-1 h-9 rounded-md border px-3 text-sm ${isDark ? "bg-[#12121a] border-[#ff6b35]/20 text-white" : "bg-white border-gray-300"}`}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="on_change">On Content Change Only</option>
            </select>
          </div>

          <Button onClick={regenerateSitemap} disabled={sitemapLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            {sitemapLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Generating...")}</> : <><RefreshCw className="w-4 h-4 mr-2" /> {t("Regenerate Sitemap Now")}</>}
          </Button>
          {sitemapResult && (
            <div className={`p-4 rounded-xl border ${cardCls}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">{t("Sitemap Generated Successfully")}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t("URLs included")}: {sitemapResult.urlCount || "All pages"}</p>
              <a href="/sitemap.xml" target="_blank" className="text-xs text-[#ff6b35] hover:underline mt-1 inline-block">{t("View Sitemap →")}</a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Broken Link Scanner */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Link2 className="w-5 h-5" /> {t("Broken Link Scanner")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">{t("Scan all internal and external links for 404s and broken references.")}</p>
          <Button onClick={scanBrokenLinks} disabled={brokenLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            {brokenLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Scanning...")}</> : <><Link2 className="w-4 h-4 mr-2" /> {t("Scan Broken Links")}</>}
          </Button>
          {brokenLinks && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold">{brokenLinks.totalLinks || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Total Links")}</p>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold text-green-500">{brokenLinks.healthyLinks || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Healthy")}</p>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold text-red-500">{brokenLinks.brokenLinks?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Broken")}</p>
                </div>
              </div>
              {brokenLinks.brokenLinks?.length > 0 && (
                <div className="space-y-2">
                  {brokenLinks.brokenLinks.map((link: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${cardCls}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <XCircle className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="text-xs font-mono truncate">{link.url}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="destructive" className="text-[10px]">{link.status || "timeout"}</Badge>
                        <span className="text-[10px] text-muted-foreground">{t("on")} {link.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {brokenLinks.brokenLinks?.length === 0 && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> {t("No broken links found!")}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Schema Generation */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Code className="w-5 h-5" /> {t("Auto Schema Generation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">{t("Generate structured data (JSON-LD) schemas for all pages automatically.")}</p>
          <Button onClick={generateSchema} disabled={schemaLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            {schemaLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Generating...")}</> : <><Code className="w-4 h-4 mr-2" /> {t("Generate Schema Data")}</>}
          </Button>
          {schemaResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle2 className="w-4 h-4" /> {t("Schema data generated for all pages")}
              </div>
              {schemaResult.schemas?.map((s: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg border ${cardCls}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{s.page}</span>
                    <Badge className="text-[10px]">{s.type}</Badge>
                  </div>
                  <pre className={`text-[10px] p-2 rounded overflow-x-auto max-h-32 ${isDark ? "bg-black/30" : "bg-gray-50"}`}>
                    {JSON.stringify(s.schema, null, 2).slice(0, 500)}...
                  </pre>
                </div>
              ))}
              <div className={`p-3 rounded-lg border ${cardCls}`}>
                <p className="text-xs font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-500" /> {t("Active Schemas")}</p>
                <p className="text-[10px] text-muted-foreground">{t("Organization, LocalBusiness, WebSite, BreadcrumbList, and Article schemas are embedded automatically.")}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
