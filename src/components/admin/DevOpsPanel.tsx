"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeJson } from "@/lib/safe-json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Server, Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Cloud, GitBranch, Save } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function DevOpsPanel({ isDark, t, setSuccess, setError }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState({
    maintenance_mode: "false",
    maintenance_message: "We are currently performing scheduled maintenance. Please check back soon.",
  });

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const fetchMonitoring = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/monitoring");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success) setData(json.data);
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

  useEffect(() => { fetchMonitoring(); fetchSettings(); }, []);

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
        if (json.success) setSuccess("DevOps settings saved!");
        else setError("Failed to save");
      } else setError("Failed to save");
    } catch { setError("Failed to save"); }
    setSaving(false);
  };

  const statusIcon = (status: string) => {
    if (status === "healthy" || status === "ok" || status === "connected" || status === "active" || status === "running") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "warning" || status === "degraded") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#ff6b35] flex items-center gap-2">
                <Server className="w-6 h-6" /> {t("Deployment & DevOps")}
              </CardTitle>
              <CardDescription>{t("Maintenance mode, deployment settings, and monitoring")}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchMonitoring} disabled={loading} size="sm" variant="outline" className="border-[#ff6b35]/20 text-[#ff6b35]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              <Button onClick={saveSettings} disabled={saving} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> {t("Save")}</>}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Maintenance Mode */}
      <Card className={`${cardCls} ${settings.maintenance_mode === "true" ? "border-red-500/30" : ""}`}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {t("Maintenance Mode")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#ff6b35]/10">
            <div>
              <p className="text-sm font-medium">{t("Enable Maintenance Mode")}</p>
              <p className="text-[10px] text-muted-foreground">{t("Website will show maintenance page to visitors when enabled")}</p>
            </div>
            <Switch
              checked={settings.maintenance_mode === "true"}
              onCheckedChange={(v) => setSettings(prev => ({ ...prev, maintenance_mode: v ? "true" : "false" }))}
            />
          </div>
          {settings.maintenance_mode === "true" && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-xs font-medium text-red-500">{t("Website is in maintenance mode!")}</p>
              </div>
              <p className="text-[10px] text-muted-foreground">{t("Visitors will see the maintenance message. Admin panel remains accessible.")}</p>
            </div>
          )}
          <div>
            <Label className="text-xs">{t("Maintenance Message")}</Label>
            <Textarea
              value={settings.maintenance_message}
              onChange={(e) => setSettings(prev => ({ ...prev, maintenance_message: e.target.value }))}
              className="mt-1 text-sm min-h-[80px]"
              placeholder="Enter maintenance message..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Cloud Deployment Info */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Cloud className="w-5 h-5" /> {t("Cloud Deployment")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Hosting Platform", value: "Vercel (Next.js optimized)", status: "active" },
            { label: "Database", value: "Supabase PostgreSQL (AWS us-west-2)", status: "active" },
            { label: "Storage", value: "Supabase Storage (S3-compatible CDN)", status: "active" },
            { label: "Domain", value: "katyaayaniastrologer.com (SSL/HTTPS)", status: "active" },
            { label: "CDN", value: "Vercel Edge Network (global)", status: "active" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cardCls}`}>
              <div>
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.value}</p>
              </div>
              {statusIcon(item.status)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CI/CD Pipeline */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <GitBranch className="w-5 h-5" /> {t("CI/CD Pipeline")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { step: "1. Code Push", desc: "Push to main branch triggers deployment", status: "configured" },
            { step: "2. Build", desc: "Next.js production build with TypeScript check", status: "configured" },
            { step: "3. Deploy", desc: "Automatic deployment to Vercel edge network", status: "configured" },
            { step: "4. DNS & SSL", desc: "Auto SSL certificate renewal and DNS propagation", status: "configured" },
            { step: "5. Health Check", desc: "Post-deploy health check via /api/admin/health-check", status: "configured" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${cardCls}`}>
              <div className="w-8 h-8 rounded-full bg-[#ff6b35]/10 flex items-center justify-center text-xs font-bold text-[#ff6b35]">{i + 1}</div>
              <div className="flex-1">
                <p className="text-xs font-medium">{item.step}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <Badge className="text-[10px] bg-green-500/10 text-green-500">{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monitoring */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Activity className="w-5 h-5" /> {t("Monitoring & Logging")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.services ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.services.map((svc: any) => (
                <div key={svc.name} className={`p-3 rounded-lg border text-center ${cardCls}`}>
                  {statusIcon(svc.status)}
                  <p className="text-xs font-medium mt-1">{svc.name}</p>
                  <Badge variant="outline" className="text-[10px] mt-1">{svc.status}</Badge>
                  {svc.latency && <p className="text-[10px] text-muted-foreground">{svc.latency}ms</p>}
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#ff6b35]" /></div>
          ) : null}

          <div className="mt-4 space-y-3">
            {[
              { label: "Application Logs", value: "Vercel Runtime Logs (real-time)", link: "https://vercel.com/dashboard" },
              { label: "Database Logs", value: "Supabase Dashboard (query logs)", link: "https://supabase.com/dashboard" },
              { label: "Error Tracking", value: "Console errors + Telegram alerts" },
              { label: "Audit Logs", value: "Admin actions tracked in audit_logs table" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cardCls}`}>
                <div>
                  <p className="text-xs font-medium">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.value}</p>
                </div>
                {'link' in item && item.link && (
                  <a href={item.link} target="_blank" rel="noopener" className="text-[10px] text-[#ff6b35] hover:underline">{t("Open")} →</a>
                )}
              </div>
            ))}
          </div>

          {data?.uptime && (
            <div className={`p-3 rounded-lg border border-green-500/20 ${cardCls} mt-3`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-green-500">{t("System Uptime")}: {data.uptime}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
