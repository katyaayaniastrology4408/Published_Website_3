"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeJson } from "@/lib/safe-json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, Key, Lock, Database, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Download, Eye, EyeOff, Save } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function SecurityPanel({ isDark, t, setSuccess, setError }: Props) {
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: "" });
  const [emailLoading, setEmailLoading] = useState(false);

  const cardCls = isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20";

  const runBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      if (res.ok) {
        const data = await safeJson(res);
        if (data.success) { setBackupData(data); setSuccess("Backup created successfully!"); }
        else setError(data.error || "Backup failed");
      } else setError("Backup failed");
    } catch { setError("Failed to create backup"); }
    setBackupLoading(false);
  };

  const checkHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/admin/health-check");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success) setHealthData(json.data);
      }
    } catch {}
    setHealthLoading(false);
  };

  const fetchAdminSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await safeJson(res);
        if (json.success && json.data) {
          setEmailForm({ email: json.data.admin_email || "" });
        }
      }
    } catch {}
  };

  useEffect(() => { checkHealth(); fetchAdminSettings(); }, []);

  const changePassword = async () => {
    if (!passwordForm.current || !passwordForm.newPass) {
      setError("Please fill current and new password"); return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setError("New passwords don't match"); return;
    }
    if (passwordForm.newPass.length < 8) {
      setError("Password must be at least 8 characters"); return;
    }
    setPasswordLoading(true);
    try {
      // Verify current password first
      const verifyRes = await fetch("/api/admin/settings");
      if (verifyRes.ok) {
          const verifyJson = await safeJson(verifyRes);
        if (verifyJson.data?.admin_password !== passwordForm.current) {
          setError("Current password is incorrect");
          setPasswordLoading(false);
          return;
        }
      }
      // Update password
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "admin_password", value: passwordForm.newPass }),
      });
      if (res.ok) {
        setSuccess("Admin password changed successfully!");
        setPasswordForm({ current: "", newPass: "", confirm: "" });
      } else setError("Failed to change password");
    } catch { setError("Failed to change password"); }
    setPasswordLoading(false);
  };

  const changeEmail = async () => {
    if (!emailForm.email || !emailForm.email.includes("@")) {
      setError("Please enter a valid email"); return;
    }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "admin_email", value: emailForm.email }),
      });
      if (res.ok) setSuccess("Admin email updated!");
      else setError("Failed to update email");
    } catch { setError("Failed to update email"); }
    setEmailLoading(false);
  };

  const mask = (str: string) => showKeys ? str : str.slice(0, 8) + "••••••••••••" + str.slice(-4);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2">
            <Shield className="w-6 h-6" /> {t("Security System")}
          </CardTitle>
          <CardDescription>{t("Authentication, access control, API protection, and backup management")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Change Admin Email */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Key className="w-5 h-5" /> {t("Admin Email")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">{t("Admin Login Email")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ email: e.target.value })}
                className="h-9 text-sm"
                placeholder="admin@example.com"
              />
              <Button onClick={changeEmail} disabled={emailLoading} size="sm" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white shrink-0">
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1" /> {t("Save")}</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
              <Lock className="w-5 h-5" /> {t("Change Admin Password")}
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowPasswords(!showPasswords)} className="text-xs">
              {showPasswords ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showPasswords ? t("Hide") : t("Show")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">{t("Current Password")}</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={passwordForm.current}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
              className="mt-1 h-9 text-sm"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <Label className="text-xs">{t("New Password")}</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={passwordForm.newPass}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
              className="mt-1 h-9 text-sm"
              placeholder="Enter new password (min 8 chars)"
            />
          </div>
          <div>
            <Label className="text-xs">{t("Confirm New Password")}</Label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
              className="mt-1 h-9 text-sm"
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={changePassword} disabled={passwordLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white w-full">
            {passwordLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Changing...")}</> : <><Lock className="w-4 h-4 mr-2" /> {t("Change Password")}</>}
          </Button>
        </CardContent>
      </Card>

      {/* Auth Features */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Shield className="w-5 h-5" /> {t("Security Features")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Authentication Method", value: "Cookie-based JWT session", status: "active" },
            { label: "Session Duration", value: "7 days auto-expiry", status: "active" },
            { label: "Login Protection", value: "Rate-limited login attempts", status: "active" },
            { label: "CSRF Protection", value: "Same-origin validation via middleware", status: "active" },
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

      {/* API Protection */}
      <Card className={cardCls}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
              <Shield className="w-5 h-5" /> {t("API Protection & Keys")}
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowKeys(!showKeys)} className="text-xs">
              {showKeys ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showKeys ? t("Hide") : t("Show")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Supabase Anon Key", key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", type: "public" },
            { label: "API Middleware", key: "Same-origin + admin-token cookie validation", type: "info" },
            { label: "CORS Policy", key: "Restricted to katyaayaniastrologer.com + localhost", type: "info" },
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-lg border ${cardCls}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium">{item.label}</p>
                <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono break-all">{item.type === "info" ? item.key : mask(item.key)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Backup System */}
      <Card className={cardCls}>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#ff6b35] flex items-center gap-2">
            <Database className="w-5 h-5" /> {t("Backup System")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">{t("Create a full database backup of all tables, bookings, enquiries, blogs, and settings.")}</p>
          <Button onClick={runBackup} disabled={backupLoading} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
            {backupLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("Creating Backup...")}</> : <><Database className="w-4 h-4 mr-2" /> {t("Create Backup Now")}</>}
          </Button>
          {backupData && (
            <div className={`p-4 rounded-xl border ${cardCls}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">{t("Backup Created Successfully")}</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>{t("Tables backed up")}: {backupData.tables?.join(", ") || "All"}</p>
                <p>{t("Total records")}: {backupData.totalRecords || 0}</p>
                <p>{t("Created at")}: {new Date(backupData.timestamp || Date.now()).toLocaleString()}</p>
              </div>
              {backupData.downloadUrl && (
                <a href={backupData.downloadUrl} download className="inline-flex items-center gap-1 text-xs text-[#ff6b35] hover:underline mt-2">
                  <Download className="w-3 h-3" /> {t("Download Backup")}
                </a>
              )}
            </div>
          )}

          {healthData?.services && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-medium">{t("System Health")}</p>
              <div className="grid grid-cols-2 gap-2">
                {healthData.services.map((svc: any) => (
                  <div key={svc.name} className={`flex items-center gap-2 p-2 rounded-lg border ${cardCls}`}>
                    {svc.status === "healthy" || svc.status === "ok" || svc.status === "connected" ?
                      <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                    <span className="text-[10px]">{svc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
