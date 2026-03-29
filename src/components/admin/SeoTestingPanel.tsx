"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { safeJson } from "@/lib/safe-json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Info, Search, Globe, Smartphone } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function SeoTestingPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [singleUrl, setSingleUrl] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<any>(null);

  const runFullValidation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/validate");
      const data = await safeJson(res);
      if (data.success) {
        setResults(data.data);
        setSuccess("SEO validation complete!");
      } else setError(data.error || "Validation failed");
    } catch { setError("Failed to run validation"); }
    setLoading(false);
  };

  const validateSingleUrl = async () => {
    if (!singleUrl) return;
    setSingleLoading(true);
    try {
      const res = await fetch("/api/admin/seo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: singleUrl }),
      });
      const data = await safeJson(res);
      if (data.success) setSingleResult(data.data);
      else setError(data.error || "Validation failed");
    } catch { setError("Failed to validate URL"); }
    setSingleLoading(false);
  };

  const getScoreColor = (score: number) => score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";
  const getScoreBg = (score: number) => score >= 80 ? "bg-green-500/10" : score >= 50 ? "bg-yellow-500/10" : "bg-red-500/10";
  const issueIcon = (type: string) => {
    if (type === "error") return <XCircle className="w-3 h-3 text-red-500" />;
    if (type === "warning") return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    return <Info className="w-3 h-3 text-blue-400" />;
  };

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Full Site Validation */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Search className="w-6 h-6" /> {t("SEO Testing & Validation")}
          </CardTitle>
          <CardDescription>{t("Run comprehensive SEO checks on all pages - meta tags, OG tags, schema, mobile compatibility")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runFullValidation} disabled={loading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Running Full Scan...")}</> : <><Globe className="w-4 h-4 mr-2" /> {t("Run Full Site Validation")}</>}
          </Button>

          {results && (
            <div className="space-y-4 mt-4">
              {/* Overall Score */}
              <div className={`p-6 rounded-xl border ${cardCls}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Overall SEO Score")}</p>
                    <p className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>{results.overallScore}/100</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs"><span className="text-red-500 font-bold">{results.totalErrors}</span> {t("errors")}</p>
                    <p className="text-xs"><span className="text-yellow-500 font-bold">{results.totalWarnings}</span> {t("warnings")}</p>
                    <p className="text-xs"><span className="text-blue-400 font-bold">{results.totalPages}</span> {t("pages tested")}</p>
                  </div>
                </div>
              </div>

              {/* Per-Page Results */}
              {results.results?.map((r: any) => (
                <div key={r.path} className={`p-4 rounded-xl border ${cardCls}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${getScoreBg(r.score)} ${getScoreColor(r.score)}`}>{r.score}</span>
                      <span className="font-medium text-sm">{r.path}</span>
                    </div>
                    <Badge variant={r.status === 200 ? "default" : "destructive"} className="text-[10px]">{r.status}</Badge>
                  </div>
                  {r.title && <p className="text-xs text-muted-foreground mb-1 truncate">Title: {r.title}</p>}
                  {r.issues?.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {r.issues.map((issue: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          {issueIcon(issue.type)}
                          <span>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Single URL Validation */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Smartphone className="w-5 h-5" /> {t("Test Single URL")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={singleUrl} onChange={(e) => setSingleUrl(e.target.value)} placeholder="https://www.katyaayaniastrologer.com/about" className={isDark ? "bg-white/5 border-white/10" : ""} />
            <Button onClick={validateSingleUrl} disabled={singleLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white whitespace-nowrap">
              {singleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Test")}
            </Button>
          </div>
          {singleResult && (
            <div className={`p-4 rounded-xl border ${cardCls}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl font-bold ${getScoreColor(singleResult.score)}`}>{singleResult.score}/100</span>
                <Badge variant={singleResult.status === 200 ? "default" : "destructive"}>{singleResult.status}</Badge>
              </div>
              {singleResult.title && <p className="text-xs text-muted-foreground truncate">Title: {singleResult.title}</p>}
              {singleResult.issues?.map((issue: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs mt-1">
                  {issueIcon(issue.type)}
                  <span>{issue.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile & Speed Tips */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Mobile & Speed Audit Tips")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            {[
              { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "Viewport meta tag configured for mobile responsiveness" },
              { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "Next.js Image optimization enabled for all images" },
              { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "Font preloading configured for faster text rendering" },
              { icon: <CheckCircle2 className="w-3 h-3 text-green-500" />, text: "Code splitting with Next.js dynamic imports" },
              { icon: <Info className="w-3 h-3 text-blue-400" />, text: "Run Google PageSpeed Insights for detailed Core Web Vitals" },
              { icon: <Info className="w-3 h-3 text-blue-400" />, text: "Use Google Mobile-Friendly Test tool for detailed mobile audit" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">{item.icon} <span>{item.text}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
