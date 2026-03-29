"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IndianRupee,
  RefreshCw,
  Loader2,
  Edit3,
  CheckCircle2,
  Home,
  Video,
  Clock,
  Save,
  AlertTriangle,
} from "lucide-react";

interface ServicePrice {
  id: string;
  title: string;
  price: number;
  price_display: string;
  duration: string;
  description: string;
  updated_at: string;
}

interface Props {
  isDark: boolean;
  t: (key: string) => string;
  setSuccess: (v: string) => void;
  setError: (v: string) => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "home-outside": <Home className="w-5 h-5 text-[#ff6b35]" />,
  "home-within": <Home className="w-5 h-5 text-green-500" />,
  "online": <Video className="w-5 h-5 text-blue-500" />,
};

export default function PricingPanel({ isDark, t, setSuccess, setError }: Props) {
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<ServicePrice>>({});

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.prices) setPrices(data.prices);
    } catch {
      setError("Failed to load prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  const startEdit = (p: ServicePrice) => {
    setEditing(p.id);
    setForm({ ...p });
  };

  const handleSave = async () => {
    if (!editing || !form.price) return;
    setSaving(true);

    // Auto-generate price_display from price (price is in paise, display in rupees)
    const rupees = Math.round(form.price / 100);
    const formatted = `₹ ${new Intl.NumberFormat("en-IN").format(rupees)}`;

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing,
          price: form.price,
          price_display: formatted,
          duration: form.duration,
          description: form.description,
          title: form.title,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Price updated for "${form.title}"`);
        setEditing(null);
        fetchPrices();
      } else {
        setError(data.error || "Failed to update price");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const card = `rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#ff6b35]">
            {t("Service Pricing")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("Update consultation prices — changes reflect on website & booking page instantly")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchPrices}
          disabled={loading}
          className="border-[#ff6b35]/20 text-[#ff6b35]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("Refresh")}
        </Button>
      </div>

      {/* Info Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDark ? "bg-amber-500/5 border-amber-500/15 text-amber-300/80" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <p className="text-sm">
          {t("Price changes take effect immediately on the booking page. Enter price in rupees (e.g. 501 for ₹501).")}
        </p>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {prices.map((p) => (
          <Card key={p.id} className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {SERVICE_ICONS[p.id]}
                <CardTitle className="text-sm font-bold leading-tight">{p.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing === p.id ? (
                <>
                  {/* Edit Form */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">{t("Price (₹ in Rupees)")}</Label>
                      <div className="relative mt-1">
                        <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          value={Math.round((form.price || 0) / 100)}
                          onChange={(e) => setForm({ ...form, price: Number(e.target.value) * 100 })}
                          className={`pl-9 ${isDark ? "bg-white/5 border-white/10" : ""}`}
                          placeholder="e.g. 501"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">{t("Duration")}</Label>
                      <Input
                        value={form.duration || ""}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className={`mt-1 ${isDark ? "bg-white/5 border-white/10" : ""}`}
                        placeholder="e.g. 45 minutes"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">{t("Description")}</Label>
                      <Textarea
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={`mt-1 text-sm ${isDark ? "bg-white/5 border-white/10" : ""}`}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold"
                    >
                      {saving ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t("Saving...")}</>
                      ) : (
                        <><Save className="w-4 h-4 mr-2" />{t("Save Changes")}</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(null)}
                      className="border-red-500/20 text-red-500 hover:bg-red-500/5"
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display */}
                  <div className={`p-4 rounded-xl text-center ${isDark ? "bg-white/5" : "bg-[#ff6b35]/5"}`}>
                    <p className="text-3xl font-black text-[#ff6b35]">{p.price_display}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{p.duration}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  <div className="text-[10px] text-muted-foreground/50">
                    {t("Last updated")}: {new Date(p.updated_at).toLocaleDateString("en-IN")}
                  </div>
                  <Button
                    onClick={() => startEdit(p)}
                    className="w-full border-[#ff6b35]/20 text-[#ff6b35] hover:bg-[#ff6b35]/5"
                    variant="outline"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {t("Edit Price")}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview note */}
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader>
          <CardTitle className="text-[#ff6b35] flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5" /> {t("Where prices appear")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🌐", label: "Services Page", url: "/services" },
              { icon: "📅", label: "Booking Page", url: "/booking" },
              { icon: "📧", label: "Booking Emails", url: null },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? "bg-white/5 border-white/10" : "bg-[#fcfaf7] border-[#ff6b35]/10"}`}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold">{t(item.label)}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#ff6b35] underline">
                      {item.url}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
