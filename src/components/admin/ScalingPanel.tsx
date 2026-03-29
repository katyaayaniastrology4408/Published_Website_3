"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { safeJson } from "@/lib/safe-json";
import { Loader2, Globe, Languages, BarChart3, Brain, RefreshCw, CheckCircle2, Lightbulb, Save, ExternalLink } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function ScalingPanel({ isDark, t, setSuccess, setError }: Props) {
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [settings, setSettings] = useState({
    gtm_id: "GTM-MQDMP2SL",
    google_verification: "",
    bing_verification: "",
    lang_english: "true",
    lang_hindi: "true",
    lang_gujarati: "true",
    contact_email: "",
    contact_phone: "",
    whatsapp_number: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
  });

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const fetchSeoAdvanced = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/seo/advanced");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success) setSeoData(json.data);
      }
    } catch {}
    setAiLoading(false);
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

  useEffect(() => { fetchSeoAdvanced(); fetchSettings(); }, []);

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
        if (json.success) setSuccess("Scaling settings saved!");
        else setError("Failed to save");
      } else setError("Failed to save");
    } catch { setError("Failed to save"); }
    setSaving(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <Globe className="w-6 h-6" /> {t("Scaling Features")}
              </CardTitle>
              <CardDescription>{t("Analytics IDs, verification codes, languages, contact info, and social links")}</CardDescription>
            </div>
            <Button onClick={saveSettings} disabled={saving} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> {t("Save All")}</>}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics & Verification Codes */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> {t("Analytics & Verification")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">{t("Google Tag Manager ID")}</Label>
            <Input
              value={settings.gtm_id}
              onChange={(e) => setSettings(prev => ({ ...prev, gtm_id: e.target.value }))}
              className="mt-1 h-9 text-sm font-mono"
              placeholder="GTM-XXXXXXX"
            />
            <p className="text-[10px] text-muted-foreground mt-1">{t("Used for tracking page views, events, and conversions")}</p>
          </div>
          <div>
            <Label className="text-xs">{t("Google Search Console Verification")}</Label>
            <Input
              value={settings.google_verification}
              onChange={(e) => setSettings(prev => ({ ...prev, google_verification: e.target.value }))}
              className="mt-1 h-9 text-sm font-mono"
              placeholder="Verification code from Google Search Console"
            />
          </div>
          <div>
            <Label className="text-xs">{t("Bing Webmaster Verification")}</Label>
            <Input
              value={settings.bing_verification}
              onChange={(e) => setSettings(prev => ({ ...prev, bing_verification: e.target.value }))}
              className="mt-1 h-9 text-sm font-mono"
              placeholder="Verification code from Bing Webmaster Tools"
            />
          </div>
          <div className={`p-3 rounded-lg border border-[#ff6b35]/10 ${cardCls}`}>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {t("Structured data (JSON-LD), Core Web Vitals monitoring, and rich snippets are auto-configured.")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Multi-language SEO */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Languages className="w-5 h-5" /> {t("Multi-Language SEO")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "lang_english", label: "English (en)", hreflang: "en-IN", isDefault: true },
            { key: "lang_hindi", label: "Hindi (hi)", hreflang: "hi-IN", isDefault: false },
            { key: "lang_gujarati", label: "Gujarati (gu)", hreflang: "gu-IN", isDefault: false },
          ].map((lang) => (
            <div key={lang.key} className="flex items-center justify-between p-3 rounded-lg border border-[#ff6b35]/10">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium">{lang.label}</p>
                  {lang.isDefault && <Badge className="text-[10px] bg-[#ff6b35]/10 text-[#ff6b35]">Default</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground">hreflang: {lang.hreflang} | Google Translate</p>
              </div>
              <Switch
                checked={settings[lang.key as keyof typeof settings] === "true"}
                onCheckedChange={(v) => setSettings(prev => ({ ...prev, [lang.key]: v ? "true" : "false" }))}
                disabled={lang.isDefault}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact & Social */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Globe className="w-5 h-5" /> {t("Contact & Social Links")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">{t("Contact Email")}</Label>
              <Input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label className="text-xs">{t("Contact Phone")}</Label>
              <Input
                value={settings.contact_phone}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div>
              <Label className="text-xs">{t("WhatsApp Number")}</Label>
              <Input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>
          <div className="border-t border-[#ff6b35]/10 pt-4 space-y-4">
            <p className="text-xs font-medium text-muted-foreground">{t("Social Media Links")}</p>
            <div>
              <Label className="text-xs">{t("Facebook URL")}</Label>
              <Input
                value={settings.social_facebook}
                onChange={(e) => setSettings(prev => ({ ...prev, social_facebook: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label className="text-xs">{t("Instagram URL")}</Label>
              <Input
                value={settings.social_instagram}
                onChange={(e) => setSettings(prev => ({ ...prev, social_instagram: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label className="text-xs">{t("YouTube URL")}</Label>
              <Input
                value={settings.social_youtube}
                onChange={(e) => setSettings(prev => ({ ...prev, social_youtube: e.target.value }))}
                className="mt-1 h-9 text-sm"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI SEO Suggestions */}
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
              <Brain className="w-5 h-5" /> {t("AI SEO Suggestions")}
            </CardTitle>
            <Button onClick={fetchSeoAdvanced} disabled={aiLoading} size="sm" variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35]">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiLoading && !seoData && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" /></div>}
          {seoData?.suggestions && seoData.suggestions.map((s: any, i: number) => (
            <div key={i} className={`p-3 rounded-lg border ${cardCls}`}>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">{typeof s === "string" ? s : s.title || s.suggestion}</p>
                  {s.description && <p className="text-[10px] text-muted-foreground mt-1">{s.description}</p>}
                  {s.priority && <Badge variant="outline" className="text-[10px] mt-1">{s.priority}</Badge>}
                </div>
              </div>
            </div>
          ))}
          {seoData?.recommendations && seoData.recommendations.map((r: any, i: number) => (
            <div key={i} className={`p-3 rounded-lg border ${cardCls}`}>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">{typeof r === "string" ? r : r.title || r.recommendation}</p>
                  {r.impact && <Badge variant="outline" className="text-[10px] mt-1">{r.impact}</Badge>}
                </div>
              </div>
            </div>
          ))}
          {!seoData?.suggestions && !seoData?.recommendations && !aiLoading && (
            <div className="text-center py-6">
              <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">{t("Click refresh to generate AI SEO suggestions")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
