import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Plus, RefreshCw, Save, Trash2, Tag, Calendar, BellRing, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface OfferSettings {
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  original_price: number;
  offer_price: number;
  title: string;
  urgency_text: string;
  popup_text: string;
  max_slots: number;
  used_slots: number;
  payment_link: string | null;
}

export default function OfferPanel({ isDark, t, setSuccess, setError }: any) {
  const [settings, setSettings] = useState<OfferSettings>({
    is_active: true,
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    original_price: 501,
    offer_price: 501,
    title: "First 50 Users Special Offer",
    urgency_text: "Only 50 Slots Available",
    popup_text: "🎉 First 50 Users Offer – Book Now at ₹501 Only!",
    max_slots: 50,
    used_slots: 0,
    payment_link: "https://urpy.link/D9kGay"
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/offer");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Format dates for datetime-local input
          const formattedData = { ...data.data };
          if (formattedData.start_date) {
            formattedData.start_date = new Date(formattedData.start_date).toISOString().slice(0, 16);
          }
          if (formattedData.end_date) {
            formattedData.end_date = new Date(formattedData.end_date).toISOString().slice(0, 16);
          }
          setSettings(formattedData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch offer settings:", err);
      setError(t("Failed to load offer settings"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate dates
      if (settings.is_active && (!settings.start_date || !settings.end_date)) {
        setError(t("Start and End dates are required when offer is active"));
        setIsSaving(false);
        return;
      }
      
      if (settings.start_date && settings.end_date && new Date(settings.start_date) >= new Date(settings.end_date)) {
        setError(t("End date must be after start date"));
        setIsSaving(false);
        return;
      }

      // Format payload dates to ISO strings for Supabase matching timestamptz
      const payload = {
        ...settings,
        start_date: settings.start_date ? new Date(settings.start_date).toISOString() : null,
        end_date: settings.end_date ? new Date(settings.end_date).toISOString() : null,
      };

      const res = await fetch("/api/admin/offer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess(t("Offer settings updated successfully"));
        fetchSettings(); // Refresh to get proper formatted dates
      } else {
        setError(data.error || t("Failed to update offer settings"));
      }
    } catch (err) {
      console.error("Failed to save offer settings:", err);
      setError(t("An error occurred while saving"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  if (isLoading) {
    return (
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardContent className="p-10 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={isDark ? "bg-[#12121a] border-[#ff6b35]/10" : "bg-white border-[#ff6b35]/20"}>
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#ff6b35]/10 pb-4">
          <div>
            <CardTitle className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-[#ff6b35] flex items-center gap-2">
              <Tag className="w-5 h-5" /> 
              {t("Limited Time Offer Settings")}
            </CardTitle>
            <CardDescription>{t("Manage the special festive offers, countdowns, and dynamic pricing site-wide.")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="offer-active" className="font-bold text-sm cursor-pointer border px-3 py-1.5 rounded-lg flex items-center gap-2" style={{ borderColor: settings.is_active ? '#22c55e' : 'transparent' }}>
              {settings.is_active ? <span className="text-green-500">{t("Active")}</span> : <span className="text-muted-foreground">{t("Inactive")}</span>}
              <Switch 
                id="offer-active" 
                checked={settings.is_active} 
                onCheckedChange={(c) => setSettings(s => ({ ...s, is_active: c }))} 
              />
            </Label>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing Details */}
            <div className={`p-5 rounded-xl border space-y-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}>
              <h3 className="font-bold text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-[#ff6b35]"/> {t("Pricing & Slot Rules")}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Original Price")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number" 
                      name="original_price" 
                      value={settings.original_price} 
                      onChange={handleChange}
                      className={`pl-8 ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-green-500">{t("Offer Price")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input 
                      type="number" 
                      name="offer_price" 
                      value={settings.offer_price} 
                      onChange={handleChange}
                      className={`pl-8 border-green-500 focus-visible:ring-green-500 ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Max Offer Slots")}</Label>
                  <Input 
                    type="number" 
                    name="max_slots" 
                    value={settings.max_slots} 
                    onChange={handleChange}
                    className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}
                  />
                  <p className="text-[10px] text-muted-foreground">{t("Offer automatically stops when slots are full.")}</p>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Used Slots")}</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      disabled 
                      readOnly 
                      value={settings.used_slots} 
                      className={`flex-1 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gray-100'}`}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setSettings(s => ({...s, used_slots: 0}))}
                      className="text-xs px-3 py-0 h-10 border-red-500/50 text-red-500 hover:bg-red-500/10"
                      title={t("Reset used slots to 0")}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      {t("Reset")}
                    </Button>
                  </div>
                </div>

              </div>
            </div>

            {/* Timing */}
            <div className={`p-5 rounded-xl border space-y-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}>
              <h3 className="font-bold text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-[#ff6b35]"/> {t("Schedule & Countdown")}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Start Date & Time")}</Label>
                  <Input 
                    type="datetime-local" 
                    name="start_date" 
                    value={settings.start_date || ""} 
                    onChange={handleChange}
                    className={isDark ? 'bg-[#1a1a2e] [color-scheme:dark]' : 'bg-white'}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("End Date & Time")}</Label>
                  <Input 
                    type="datetime-local" 
                    name="end_date" 
                    value={settings.end_date || ""} 
                    onChange={handleChange}
                    className={isDark ? 'bg-[#1a1a2e] [color-scheme:dark]' : 'bg-white'}
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                <BellRing className="w-3 h-3 inline mr-1"/>
                {t("Offer will automatically hide when end date is passed.")}
              </p>
            </div>
            
            {/* Dynamic Link Configuration */}
            <div className={`p-5 rounded-xl border space-y-4 col-span-1 md:col-span-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}>
              <h3 className="font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-[#ff6b35]"/> {t("Direct Payment Link")}</h3>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">{t("UROPay Direct Payment Link")}</Label>
                <Input 
                  name="payment_link" 
                  value={settings.payment_link || ""} 
                  onChange={handleChange}
                  placeholder="https://urpy.link/..."
                  className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}
                />
                <p className="text-[10px] text-muted-foreground">
                  {t("When set, clicking 'Pay' during offer will redirect user here immediately.")}
                </p>
              </div>
            </div>
          </div>

          {/* Texts & Copy */}
          <div className={`p-5 rounded-xl border space-y-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#fcfaf7] border-[#ff6b35]/20'}`}>
            <h3 className="font-bold text-sm flex items-center gap-2"><Type className="w-4 h-4 text-[#ff6b35]"/> {t("Display Texts")}</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Offer/Popup Title")}</Label>
                <Input 
                  name="title" 
                  value={settings.title} 
                  onChange={handleChange}
                  placeholder="e.g. 🎉 Special Festival Offer"
                  className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Popup Action Text")}</Label>
                  <Input 
                    name="popup_text" 
                    value={settings.popup_text} 
                    onChange={handleChange}
                    placeholder="e.g. Book Now at ₹501 Only!"
                    className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">{t("Urgency Text (below pricing)")}</Label>
                  <Input 
                    name="urgency_text" 
                    value={settings.urgency_text} 
                    onChange={handleChange}
                    placeholder="e.g. Only Few Slots Left"
                    className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-bold px-8 shadow-lg shadow-[#ff6b35]/20"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2"/>}
              {t("Save Offer Settings")}
            </Button>
          </div>

        </CardContent>
      </Card>
      
      {/* Preview Section */}
      <Card className={`border-2 ${settings.is_active ? 'border-green-500/30' : 'border-gray-200 dark:border-white/10'}`}>
        <CardHeader className={`${settings.is_active ? 'bg-green-500/5' : isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            {t("Live Preview (Homepage & Services views)")}
            {!settings.is_active && <span className="text-xs text-muted-foreground ml-2 font-normal italic">({t("Currently inactive")})</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Context 1: Booking Button Display */}
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-4 ${isDark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-[#ff6b35]/10 shadow-sm'}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff6b35] mb-2">{t("Services Page Pricing")}</span>
              
              {settings.is_active ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
                      ₹{settings.offer_price}
                    </span>
                    <span className="bg-red-500/10 text-red-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center border border-red-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
                      🔥 Limited Time Offer
                    </span>
                  </div>
                  {settings.urgency_text && (
                    <p className="text-xs font-bold text-red-500/80 animate-pulse">{settings.urgency_text}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground italic">Offer valid for limited time only.</p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#ff6b35]">₹{settings.original_price}</span>
                </div>
              )}
            </div>

            {/* Context 2: The Popup Layout */}
            {settings.is_active && (
              <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center relative overflow-hidden ${isDark ? 'bg-[#1a1a2e] border-[#ff6b35]/30' : 'bg-white border-[#ff6b35] shadow-xl shadow-[#ff6b35]/10'}`}>
                <div className="absolute top-0 right-0 p-3 opacity-20"><Tag className="w-12 h-12" /></div>
                
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t("Homepage Popup")}</span>
                
                <h3 className="font-bold text-lg md:text-xl text-[#ff6b35] font-[family-name:var(--font-cinzel)] mb-2">
                  {settings.title}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-red-500">₹{settings.offer_price}</span>
                </div>
                
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 px-4">
                  {settings.popup_text}
                </p>
                
                <div className="w-full flex justify-center gap-2 mb-4">
                  {['02', '14', '35', '12'].map((n, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="bg-[#ff6b35]/10 border border-[#ff6b35]/20 text-[#ff6b35] font-black font-mono w-10 h-10 flex items-center justify-center rounded-lg text-sm">
                        {n}
                      </div>
                      <span className="text-[8px] uppercase mt-1 opacity-50">
                        {['Days', 'Hrs', 'Min', 'Sec'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-[#ff6b35] text-white rounded-xl h-10 font-bold shadow-lg opacity-80 pointer-events-none">
                  Book Consultation Now
                </Button>
              </div>
            )}
            
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
