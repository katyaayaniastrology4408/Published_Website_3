"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, Globe, Share2, Eye, RefreshCw, ExternalLink, Image as ImageIcon, Code2, AlertTriangle, Copy } from "lucide-react";
import { safeJson } from "@/lib/safe-json";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

const SITE_URL = "https://www.katyaayaniastrologer.com";

interface OGData {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaName: string;
  schemaFounder: string;
  schemaLogo: string;
  schemaImage: string;
}

export default function SocialPreviewPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [ogData, setOgData] = useState<OGData>({
    ogTitle: "A Journey Within - Katyayani Ancient Astrology",
    ogDescription: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom. Expert kundali analysis, horoscope readings, vastu consultation & personalized remedies since 2007.",
    ogImage: "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png",
    ogUrl: SITE_URL,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "A Journey Within - Katyayani Ancient Astrology",
    twitterDescription: "Step into the timeless legacy of Katyayani Ancient Astrology 'KVA', where centuries-old Brahmin traditions meet 21st-century wisdom.",
    twitterImage: "https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png",
    schemaName: "Katyayani Ancient Astrology",
    schemaFounder: "Rudram Joshi",
    schemaLogo: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=256&height=256&resize=contain",
    schemaImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=256&height=256&resize=contain",
  });
  const [liveCheck, setLiveCheck] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [previewTab, setPreviewTab] = useState<"google" | "facebook" | "twitter" | "schema">("google");
  const [ogImageTs, setOgImageTs] = useState(Date.now());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field: keyof OGData, value: string) => {
    setOgData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to seo_settings table via API
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_path: "/",
          og_title: ogData.ogTitle,
          og_description: ogData.ogDescription,
          og_image: ogData.ogImage,
          meta_title: ogData.ogTitle,
          meta_description: ogData.ogDescription,
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess("Social preview settings saved!");
        setEditing(false);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save social preview settings");
    }
    setSaving(false);
  };

  // Fetch live meta tags from the site
  const fetchLiveMeta = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/admin/social-preview");
      const data = await safeJson(res);
      if (data.success) {
        setLiveCheck(data.data);
        setSuccess("Live meta tags fetched successfully!");
      } else {
        setError(data.error || "Failed to fetch meta tags");
      }
    } catch {
      setError("Failed to fetch live meta tags");
    }
    setChecking(false);
  };

  const refreshOgImage = () => {
    setOgImageTs(Date.now());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
  };

  const ogImagePreviewUrl = `https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/og/og-home-1771646111561.png?_t=${ogImageTs}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-6 h-6 text-blue-500" />
            Social Preview & Meta Tags
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Preview how your website appears on Google, Facebook, Twitter/X and verify Schema markup
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setEditing(!editing)} variant={editing ? "default" : "outline"} size="sm" className={editing ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}>
            <Eye className="w-4 h-4 mr-2" />
            {editing ? "Preview Mode" : "Edit Fields"}
          </Button>
          <Button onClick={fetchLiveMeta} disabled={checking} variant="outline" size="sm">
            {checking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Verify Live Tags
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={isDark ? "bg-green-950/30 border-green-800/50" : "bg-green-50 border-green-200"}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20"><Globe className="w-5 h-5 text-green-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Open Graph</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className={isDark ? "bg-blue-950/30 border-blue-800/50" : "bg-blue-50 border-blue-200"}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20"><Share2 className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Twitter Card</p>
              <p className="font-semibold text-blue-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className={isDark ? "bg-purple-950/30 border-purple-800/50" : "bg-purple-50 border-purple-200"}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20"><Code2 className="w-5 h-5 text-purple-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Schema JSON-LD</p>
              <p className="font-semibold text-purple-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className={isDark ? "bg-orange-950/30 border-orange-800/50" : "bg-orange-50 border-orange-200"}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20"><ImageIcon className="w-5 h-5 text-orange-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">OG Image</p>
              <p className="font-semibold text-orange-600">Dynamic</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Fields */}
      {editing && (
        <Card className={isDark ? "border-orange-800/50 bg-orange-950/10" : "border-orange-200 bg-orange-50/50"}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-500" />
              Edit Social Preview Fields
            </CardTitle>
            <CardDescription>Changes here update the preview below. Click Save to persist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">OG Title</label>
                <Input value={ogData.ogTitle} onChange={e => handleFieldChange("ogTitle", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter Title</label>
                <Input value={ogData.twitterTitle} onChange={e => handleFieldChange("twitterTitle", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">OG Description</label>
                <Textarea value={ogData.ogDescription} onChange={e => handleFieldChange("ogDescription", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Twitter Description</label>
                <Textarea value={ogData.twitterDescription} onChange={e => handleFieldChange("twitterDescription", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schema Organization Name</label>
                <Input value={ogData.schemaName} onChange={e => handleFieldChange("schemaName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schema Founder Name</label>
                <Input value={ogData.schemaFounder} onChange={e => handleFieldChange("schemaFounder", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Schema Logo URL</label>
                <Input value={ogData.schemaLogo} onChange={e => handleFieldChange("schemaLogo", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Schema Image URL (shown in Google search right panel)</label>
                <Input value={ogData.schemaImage} onChange={e => handleFieldChange("schemaImage", e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["google", "facebook", "twitter", "schema"] as const).map(tab => (
          <Button
            key={tab}
            variant={previewTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewTab(tab)}
            className={previewTab === tab ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
          >
            {tab === "google" && <Globe className="w-4 h-4 mr-1" />}
            {tab === "facebook" && <Share2 className="w-4 h-4 mr-1" />}
            {tab === "twitter" && <Share2 className="w-4 h-4 mr-1" />}
            {tab === "schema" && <Code2 className="w-4 h-4 mr-1" />}
            {tab === "google" ? "Google Search" : tab === "facebook" ? "Facebook" : tab === "twitter" ? "Twitter/X" : "Schema Markup"}
          </Button>
        ))}
      </div>

      {/* Google Search Preview */}
      {previewTab === "google" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Google Search Preview
            </CardTitle>
            <CardDescription>This is how your website appears in Google search results (right side Knowledge Panel + main result)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Search Result */}
            <div className={`p-6 rounded-xl border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              <p className="text-sm text-muted-foreground mb-1">Google Search Result</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <img src={ogData.schemaLogo} alt="favicon" className="w-5 h-5 rounded-full" />
                  <span>www.katyaayaniastrologer.com</span>
                </div>
                <h3 className="text-xl text-blue-600 hover:underline cursor-pointer font-medium">
                  {ogData.ogTitle}
                </h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {ogData.ogDescription.substring(0, 160)}...
                </p>
              </div>
            </div>

            {/* Knowledge Panel (Right Side) Preview */}
            <div className={`p-6 rounded-xl border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              <p className="text-sm text-muted-foreground mb-3">Knowledge Panel (Right Side)</p>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-orange-400">
                    <img
                      src={ogImagePreviewUrl}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = ogData.schemaLogo; }}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold">{ogData.schemaName}</h3>
                    <p className="text-xs text-muted-foreground">Ancient Astrology Organization</p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {ogData.ogDescription.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Founder: <strong>{ogData.schemaFounder}</strong></span>
                    <span>|</span>
                    <span>Founded: 2007</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chrome Browser Tab Preview */}
            <div className={`p-4 rounded-xl border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              <p className="text-sm text-muted-foreground mb-3">Chrome Browser Tab</p>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${isDark ? "bg-gray-700" : "bg-white"} flex-1 max-w-md`}>
                  <img src={ogData.schemaLogo} alt="" className="w-4 h-4 rounded" />
                  <span className="truncate">{ogData.ogTitle}</span>
                </div>
              </div>
              <div className={`px-3 py-2 ${isDark ? "bg-gray-800" : "bg-white"} rounded-b-lg border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-green-500">🔒</span>
                  <span>www.katyaayaniastrologer.com</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facebook Preview */}
      {previewTab === "facebook" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              Facebook / WhatsApp Share Preview
            </CardTitle>
            <CardDescription>This is how your link appears when shared on Facebook, WhatsApp, LinkedIn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`max-w-lg rounded-lg overflow-hidden border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              {/* OG Image */}
              <div className="aspect-[1200/630] bg-gray-100 relative overflow-hidden">
                <img
                  src={ogImagePreviewUrl}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Card content */}
              <div className={`p-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <p className="text-[10px] uppercase text-muted-foreground tracking-wider">katyaayaniastrologer.com</p>
                <h3 className="font-bold text-sm mt-1 line-clamp-2">{ogData.ogTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ogData.ogDescription}</p>
              </div>
            </div>

            {/* Meta Tags Code */}
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"} border`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Open Graph Meta Tags
                </h4>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`<meta property="og:title" content="${ogData.ogTitle}" />\n<meta property="og:description" content="${ogData.ogDescription}" />\n<meta property="og:image" content="${ogData.ogImage}" />\n<meta property="og:url" content="${ogData.ogUrl}" />\n<meta property="og:type" content="${ogData.ogType}" />`)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </div>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-green-400">
{`<meta property="og:title" content="${ogData.ogTitle}" />
<meta property="og:description" content="${ogData.ogDescription}" />
<meta property="og:image" content="${ogData.ogImage}" />
<meta property="og:url" content="${ogData.ogUrl}" />
<meta property="og:type" content="${ogData.ogType}" />`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Twitter/X Preview */}
      {previewTab === "twitter" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-500" />
              Twitter/X Card Preview
            </CardTitle>
            <CardDescription>How your link appears when shared on Twitter/X</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`max-w-lg rounded-2xl overflow-hidden border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              {/* Image */}
              <div className="aspect-[2/1] bg-gray-100 relative overflow-hidden">
                <img
                  src={ogImagePreviewUrl}
                  alt="Twitter Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Content */}
              <div className={`p-3 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <h3 className="font-bold text-sm line-clamp-2">{ogData.twitterTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ogData.twitterDescription}</p>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> katyaayaniastrologer.com
                </p>
              </div>
            </div>

            {/* Twitter Meta Tags Code */}
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"} border`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Twitter Card Meta Tags
                </h4>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`<meta name="twitter:card" content="${ogData.twitterCard}" />\n<meta name="twitter:title" content="${ogData.twitterTitle}" />\n<meta name="twitter:description" content="${ogData.twitterDescription}" />\n<meta name="twitter:image" content="${ogData.twitterImage}" />`)}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </div>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-sky-400">
{`<meta name="twitter:card" content="${ogData.twitterCard}" />
<meta name="twitter:title" content="${ogData.twitterTitle}" />
<meta name="twitter:description" content="${ogData.twitterDescription}" />
<meta name="twitter:image" content="${ogData.twitterImage}" />`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema Markup Preview */}
      {previewTab === "schema" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-500" />
              Schema Markup (JSON-LD)
            </CardTitle>
            <CardDescription>Structured data that helps Google understand your website and show rich results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Organization Schema */}
            <div className={`p-4 rounded-lg border-2 ${isDark ? "bg-purple-950/20 border-purple-800/50" : "bg-purple-50 border-purple-200"}`}>
              <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Organization</Badge>
                Schema
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{ogData.schemaName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">URL</p>
                  <p className="font-medium text-blue-500">{SITE_URL}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Founder</p>
                  <p className="font-medium">{ogData.schemaFounder}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-medium">2007</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Logo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={ogData.schemaLogo} alt="Logo" className="w-8 h-8 rounded" />
                    <span className="text-xs text-muted-foreground truncate">{ogData.schemaLogo.substring(0, 60)}...</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Services</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                      {["Ancient Astrology", "Kundali Analysis", "Horoscope Reading", "Vastu Shastra", "Marriage Matching"].map(s => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* JSON-LD Code */}
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-900" : "bg-gray-50"} border`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> JSON-LD Code
                </h4>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: ogData.schemaName,
                  url: SITE_URL,
                  logo: ogData.schemaLogo,
                  image: ogData.schemaImage,
                  founder: { "@type": "Person", name: ogData.schemaFounder, image: ogData.schemaImage },
                }, null, 2))}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </div>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-purple-400">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ogData.schemaName,
  url: SITE_URL,
  logo: ogData.schemaLogo,
  image: ogData.schemaImage,
  founder: {
    "@type": "Person",
    name: ogData.schemaFounder,
    image: ogData.schemaImage,
  },
}, null, 2)}
              </pre>
            </div>

            {/* Verification Links */}
            <div className={`p-4 rounded-lg border ${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <h4 className="text-sm font-semibold mb-3">Verify Implementation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Google Rich Results Test
                </a>
                <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Facebook Debugger
                </a>
                <a href="https://www.bing.com/webmasters/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Bing Webmaster Tools
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OG Image Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-500" />
            OG Image Preview
            <Badge variant="outline" className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/30">1200x630</Badge>
          </CardTitle>
          <CardDescription>Dynamic image auto-generated with your logo and branding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border-2 border-orange-500/30 max-w-2xl">
              <img
                src={ogImagePreviewUrl}
                alt="OG Image Preview"
                className="w-full"
                onError={(e) => { (e.target as HTMLImageElement).alt = 'Failed to load OG image'; }}
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                onClick={refreshOgImage}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Refresh
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              Image is dynamically generated at <code className="px-1 py-0.5 rounded bg-muted">/opengraph-image</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Meta Tags Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Active Meta Tags</CardTitle>
          <CardDescription>Summary of all OG, Twitter, and Schema tags currently on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OG Tags */}
            <div className={`p-4 rounded-lg border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Open Graph Tags
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { key: "og:title", value: ogData.ogTitle },
                  { key: "og:description", value: ogData.ogDescription.substring(0, 80) + "..." },
                  { key: "og:image", value: ogData.ogImage },
                  { key: "og:url", value: ogData.ogUrl },
                  { key: "og:type", value: ogData.ogType },
                ].map(tag => (
                  <div key={tag.key} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-[9px] shrink-0">{tag.key}</Badge>
                    <span className="text-muted-foreground truncate">{tag.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Twitter Tags */}
            <div className={`p-4 rounded-lg border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                Twitter Card Tags
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { key: "twitter:card", value: ogData.twitterCard },
                  { key: "twitter:title", value: ogData.twitterTitle },
                  { key: "twitter:description", value: ogData.twitterDescription.substring(0, 80) + "..." },
                  { key: "twitter:image", value: ogData.twitterImage },
                ].map(tag => (
                  <div key={tag.key} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-[9px] shrink-0">{tag.key}</Badge>
                    <span className="text-muted-foreground truncate">{tag.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Check Results */}
      {liveCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Live Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(liveCheck).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {value ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground truncate">{String(value) || "Not found"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
