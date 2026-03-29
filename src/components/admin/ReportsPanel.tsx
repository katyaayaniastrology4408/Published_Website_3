"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeJson } from "@/lib/safe-json";
import { Loader2, FileText, BarChart3, Download, RefreshCw, TrendingUp, Eye, Calendar, CheckCircle2 } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function ReportsPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
        if (!res.ok) throw new Error("Failed");
        const json = await safeJson(res);
        if (json.success) { setData(json.data); setSuccess("Reports loaded!"); }
        else setError(json.error || "Failed to load reports");
      } catch { setError("Failed to fetch reports"); }
    setLoading(false);
  };

  const fetchSeo = async () => {
    setSeoLoading(true);
    try {
      const res = await fetch("/api/admin/seo/validate");
        if (!res.ok) throw new Error("Failed");
        const json = await safeJson(res);
      if (json.success) setSeoData(json.data);
    } catch {}
    setSeoLoading(false);
  };

  useEffect(() => { fetchReports(); fetchSeo(); }, []);

  const exportData = (type: string) => {
    if (!data) return;
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess(`${type} report exported!`);
  };

  const exportCSV = () => {
    if (!data) return;
    let csv = "Metric,Value\n";
    if (data.bookings) csv += `Total Bookings,${data.bookings.total || 0}\nPending Bookings,${data.bookings.pending || 0}\nConfirmed Bookings,${data.bookings.confirmed || 0}\n`;
    if (data.enquiries) csv += `Total Enquiries,${data.enquiries.total || 0}\n`;
    if (data.blogs) csv += `Total Blogs,${data.blogs.total || 0}\nPublished Blogs,${data.blogs.published || 0}\n`;
    if (data.users) csv += `Total Users,${data.users.total || 0}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccess("CSV report exported!");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <FileText className="w-6 h-6" /> {t("Reporting System")}
              </CardTitle>
              <CardDescription>{t("SEO reports, traffic analytics, and data export tools")}</CardDescription>
            </div>
            <Button onClick={fetchReports} disabled={loading} size="sm" variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && !data && <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" /></div>}

      {data && (
        <>
          {/* Traffic Analytics Overview */}
          <Card className={cardCls}>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> {t("Traffic & Analytics Overview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Bookings", value: data.bookings?.total || 0, icon: Calendar, color: "text-blue-500" },
                  { label: "Total Enquiries", value: data.enquiries?.total || 0, icon: Eye, color: "text-purple-500" },
                  { label: "Published Blogs", value: data.blogs?.published || 0, icon: FileText, color: "text-green-500" },
                  { label: "Total Users", value: data.users?.total || 0, icon: TrendingUp, color: "text-orange-500" },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-lg border text-center ${cardCls}`}>
                    <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{t(item.label)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Breakdown */}
          {data.bookings && (
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Booking Status Breakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Pending", value: data.bookings.pending || 0, color: "text-yellow-500 bg-yellow-500/10" },
                    { label: "Confirmed", value: data.bookings.confirmed || 0, color: "text-green-500 bg-green-500/10" },
                    { label: "Completed", value: data.bookings.completed || 0, color: "text-blue-500 bg-blue-500/10" },
                    { label: "Cancelled", value: data.bookings.cancelled || 0, color: "text-red-500 bg-red-500/10" },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-center ${cardCls}`}>
                      <p className={`text-xl font-bold ${item.color.split(" ")[0]}`}>{item.value}</p>
                      <p className="text-[10px] text-muted-foreground">{t(item.label)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Report */}
          {seoData && (
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> {t("SEO Health Report")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                    <p className="text-xl font-bold text-green-500">{seoData.score || seoData.overallScore || "N/A"}</p>
                    <p className="text-[10px] text-muted-foreground">{t("SEO Score")}</p>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                    <p className="text-xl font-bold">{seoData.pagesChecked || seoData.pages?.length || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{t("Pages Checked")}</p>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                    <p className="text-xl font-bold text-yellow-500">{seoData.issues?.length || seoData.warnings || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{t("Issues Found")}</p>
                  </div>
                </div>
                {seoData.issues?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {seoData.issues.slice(0, 5).map((issue: any, i: number) => (
                      <div key={i} className={`p-2 rounded-lg border ${cardCls} text-xs`}>
                        <span className="text-muted-foreground">{typeof issue === "string" ? issue : issue.message || issue.description || JSON.stringify(issue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Export Tools */}
          <Card className={cardCls}>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
                <Download className="w-5 h-5" /> {t("Export Tools")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button onClick={() => exportData("full")} variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35] h-auto py-3">
                  <div className="text-center">
                    <Download className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-medium">{t("Export Full Report")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("JSON format")}</p>
                  </div>
                </Button>
                <Button onClick={exportCSV} variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35] h-auto py-3">
                  <div className="text-center">
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-medium">{t("Export CSV")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("Spreadsheet format")}</p>
                  </div>
                </Button>
                <Button onClick={() => { if (seoData) { const b = new Blob([JSON.stringify(seoData, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `seo-report-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setSuccess("SEO report exported!"); } }} variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35] h-auto py-3">
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-medium">{t("Export SEO Report")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("JSON format")}</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
