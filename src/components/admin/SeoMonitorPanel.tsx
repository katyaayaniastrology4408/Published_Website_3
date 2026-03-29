"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { safeJson } from "@/lib/safe-json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, Globe, CheckCircle2, XCircle, Users, Calendar, MessageSquare, FileText, RefreshCw } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function SeoMonitorPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/monitor");
      const json = await safeJson(res);
      if (json.success) { setData(json.data); setSuccess("Monitor data refreshed!"); }
      else setError(json.error || "Failed to load");
    } catch { setError("Failed to fetch monitoring data"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";
  const statCard = (icon: React.ReactNode, label: string, value: string | number, sub?: string) => (
    <div className={`p-4 rounded-xl border ${cardCls} flex items-center gap-3`}>
      <div className="p-2 rounded-lg bg-[#ff6b35]/10 text-[#ff6b35]">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <BarChart3 className="w-6 h-6" /> {t("SEO Monitoring Dashboard")}
              </CardTitle>
              <CardDescription>{t("Real-time site health, traffic overview, and index status")}</CardDescription>
            </div>
            <Button onClick={fetchData} disabled={loading} size="sm" variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && !data && <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" /></div>}

      {data && (
        <>
          {/* Traffic Overview */}
          <Card className={cardCls}>
            <CardHeader><CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Traffic Overview")}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCard(<Users className="w-5 h-5" />, t("Total Users"), data.traffic?.totalUsers || 0, `${data.traffic?.weeklyUsers || 0} this week`)}
                {statCard(<Calendar className="w-5 h-5" />, t("Total Bookings"), data.traffic?.totalBookings || 0, `${data.traffic?.weeklyBookings || 0} this week`)}
                {statCard(<MessageSquare className="w-5 h-5" />, t("Total Enquiries"), data.traffic?.totalEnquiries || 0)}
                {statCard(<FileText className="w-5 h-5" />, t("Total Blogs"), data.traffic?.totalBlogs || 0)}
              </div>
            </CardContent>
          </Card>

          {/* Index Status */}
          <Card className={cardCls}>
            <CardHeader><CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Index Status")}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold text-green-500">{data.indexStatus?.healthyPages || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Healthy Pages")}</p>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold text-red-500">{data.indexStatus?.errorPages || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Error Pages")}</p>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <p className="text-xl font-bold">{data.indexStatus?.totalPages || 0}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Total Pages")}</p>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <Badge variant={data.indexStatus?.sitemapStatus === "accessible" ? "default" : "destructive"} className="text-[10px]">
                    Sitemap: {data.indexStatus?.sitemapStatus}
                  </Badge>
                </div>
                <div className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  <Badge variant={data.indexStatus?.robotsStatus === "accessible" ? "default" : "destructive"} className="text-[10px]">
                    Robots: {data.indexStatus?.robotsStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crawl Results */}
          <Card className={cardCls}>
            <CardHeader><CardTitle className="text-sm font-bold text-[#ff6b35]">{t("Crawl Results")}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.crawlResults?.map((r: any) => (
                  <div key={r.path} className={`flex items-center justify-between p-2 rounded-lg border ${cardCls}`}>
                    <div className="flex items-center gap-2">
                      {r.ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-xs font-mono">{r.path}</span>
                    </div>
                    <Badge variant={r.ok ? "default" : "destructive"} className="text-[10px]">{r.status || "timeout"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crawl Errors */}
          {data.crawlErrors?.length > 0 && (
            <Card className={`${cardCls} border-red-500/20`}>
              <CardHeader><CardTitle className="text-sm font-bold text-red-500">{t("Crawl Errors")}</CardTitle></CardHeader>
              <CardContent>
                {data.crawlErrors.map((e: any) => (
                  <div key={e.path} className="flex items-center gap-2 text-xs p-2">
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span className="font-mono">{e.path}</span>
                    <Badge variant="destructive" className="text-[10px]">{e.status || "unreachable"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="text-[10px] text-muted-foreground text-right">{t("Last checked")}: {new Date(data.checkedAt).toLocaleString()}</p>
        </>
      )}
    </div>
  );
}
