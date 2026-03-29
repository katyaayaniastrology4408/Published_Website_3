"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { safeJson } from "@/lib/safe-json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Database, Bell, CheckCircle2, AlertTriangle, RefreshCw, Play, Calendar } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function SchedulingPanel({ isDark, t, setSuccess, setError }: Props) {
  const [backupLoading, setBackupLoading] = useState(false);
  const [sitemapLoading, setSitemapLoading] = useState(false);

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const runBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      const data = await safeJson(res);
      if (data.success) setSuccess("Auto backup completed successfully!");
      else setError(data.error || "Backup failed");
    } catch { setError("Failed to run backup"); }
    setBackupLoading(false);
  };

  const runSitemap = async () => {
    setSitemapLoading(true);
    try {
      const res = await fetch("/api/admin/sitemap", { method: "POST" });
      const data = await safeJson(res);
      if (data.success) setSuccess("Sitemap regenerated successfully!");
      else setError(data.error || "Sitemap generation failed");
    } catch { setError("Failed to regenerate sitemap"); }
    setSitemapLoading(false);
  };

  const cronJobs = [
    { name: "Sitemap Regeneration", schedule: "On blog publish / manual trigger", lastRun: "On demand", status: "active", action: runSitemap, loading: sitemapLoading },
    { name: "Database Backup", schedule: "Manual trigger / On demand", lastRun: "On demand", status: "active", action: runBackup, loading: backupLoading },
    { name: "Broken Link Scan", schedule: "Manual trigger via Automation tab", lastRun: "On demand", status: "active", action: null, loading: false },
    { name: "SEO Health Check", schedule: "Auto on page load / Manual trigger", lastRun: "On demand", status: "active", action: null, loading: false },
  ];

  const alerts = [
    { type: "Booking Notification", channel: "Telegram Bot", status: "active", desc: "Instant alerts for new bookings" },
    { type: "Enquiry Notification", channel: "Telegram Bot", status: "active", desc: "Instant alerts for new enquiries" },
    { type: "Email Notification", channel: "Brevo SMTP", status: "active", desc: "Email confirmations for bookings" },
    { type: "Error Monitoring", channel: "Console + Admin Dashboard", status: "active", desc: "Runtime error tracking" },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Clock className="w-6 h-6" /> {t("Automation & Scheduling")}
          </CardTitle>
          <CardDescription>{t("Cron jobs, auto backups, and error alert management")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Cron Jobs */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Calendar className="w-5 h-5" /> {t("Scheduled Jobs")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cronJobs.map((job, i) => (
            <div key={i} className={`p-4 rounded-lg border ${cardCls}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-medium">{job.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-[10px] bg-green-500/10 text-green-500">{job.status}</Badge>
                  {job.action && (
                    <Button size="sm" variant="outline" onClick={job.action} disabled={job.loading}
                      className="text-xs border-[#ff6b35]/20 text-[#ff6b35] h-7">
                      {job.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                      {t("Run Now")}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-[10px] text-muted-foreground">
                <span>{t("Schedule")}: {job.schedule}</span>
                <span>{t("Last Run")}: {job.lastRun}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Auto Backups */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Database className="w-5 h-5" /> {t("Auto Backup Configuration")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Backup Method", value: "Full database export (all tables)", status: "configured" },
            { label: "Backup Format", value: "JSON data dump via API", status: "configured" },
            { label: "Tables Included", value: "bookings, enquiries, blogs, rashifal, site_settings, audit_logs", status: "configured" },
            { label: "Supabase Auto Backup", value: "Managed by Supabase (daily point-in-time recovery)", status: "active" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cardCls}`}>
              <div>
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.value}</p>
              </div>
              <Badge className="text-[10px] bg-green-500/10 text-green-500">{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Error Alerts */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Bell className="w-5 h-5" /> {t("Error Alerts & Notifications")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${cardCls}`}>
              <div>
                <p className="text-xs font-medium">{alert.type}</p>
                <p className="text-[10px] text-muted-foreground">{alert.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{alert.channel}</Badge>
                <Badge className="text-[10px] bg-green-500/10 text-green-500">{alert.status}</Badge>
              </div>
            </div>
          ))}
          <div className={`p-3 rounded-lg border border-yellow-500/20 ${cardCls}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
              <p className="text-xs font-medium text-yellow-500">{t("Telegram Bot Integration")}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">{t("All booking and enquiry notifications are sent instantly via Telegram bot. Configure bot tokens in environment variables.")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
