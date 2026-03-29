"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { Sparkles } from "lucide-react";
import { calculatePanchang, PanchangData } from "@/lib/panchang";
import { RASHI_ICONS } from "@/components/RashiIcons";

export default function ZodiacSignForm() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const [formData, setFormData] = useState({
    dob: "",
    tob: "08:00",
    pob: "",
    email: ""
  });
  const [result, setResult] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const [year, month, day] = formData.dob.split('-').map(Number);
        const [hours, minutes] = formData.tob.split(':').map(Number);
        
        // Assume IST (+5:30) for birth details as most users are in India.
        // We use Date.UTC to get a fixed reference point, then subtract 5.5 hours to get the actual UTC time of the birth.
        const utcTimestamp = Date.UTC(year, month - 1, day, hours, minutes) - (5.5 * 60 * 60 * 1000);
        const utcBirth = new Date(utcTimestamp);
        
        const panchang = calculatePanchang(utcBirth);
        setResult(panchang);

      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Zodiac Checker User",
          email: formData.email,
          subject: "Know Your Zodiac Sign Lead",
          message: `User checked zodiac sign.\nDOB: ${formData.dob}\nTOB: ${formData.tob}\nPOB: ${formData.pob}\nSurya Rashi: ${panchang.sunRashi.english}\nChandra Rashi: ${panchang.moonRashi.english}`
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedValue = (item: { english: string; hindi: string; gujarati: string }) => {
    if (language === 'gu') return item.gujarati;
    if (language === 'hi') return item.hindi;
    // Remove (Mesh), (Vrishabh) etc for clean English display
    return item.english.split(' (')[0];
  };

  const getRashiIndex = (englishName: string) => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.findIndex(s => englishName.includes(s));
  };

  return (
    <section className={`py-24 px-6 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-[#fdfbf7]'}`}>
      {/* Astrological Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 border border-[#ff6b35] rounded-full" />
        <div className="absolute top-20 left-20 w-72 h-72 border border-[#ff6b35] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-[#ff6b35] rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#ff6b35] rounded-full animate-spin-slow" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#ff6b35]/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#ff6b35]/10 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-[#ff6b35]" />
          </div>
        </div>
        
        <h2 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl font-bold mb-6 text-gradient-ancient leading-tight">
          {language === 'gu' ? 'તમારી રાશિ જાણો' : language === 'hi' ? 'अपनी राशि जानें' : 'Know Your Zodiac Sign'}
        </h2>
        <p className={`mb-12 text-lg leading-relaxed opacity-80 ${theme === 'dark' ? 'text-[#c4bdb3]' : 'text-[#5a4f44]'}`}>
          {language === 'gu' 
            ? 'તમારી જન્મ તારીખ અને સમય દાખલ કરો અને તમારી સૂર્ય અને ચંદ્ર રાશિ શોધો.' 
            : language === 'hi' 
            ? 'अपनी जन्म तिथि और समय दर्ज करें और अपनी सूर्य और चंद्र राशि जानें।' 
            : 'Enter your birth details to discover your Sun and Moon signs.'}
        </p>

          <Card className={`${theme === 'dark' ? 'bg-[#12121a]/80 backdrop-blur-md border-[#ff6b35]/20' : 'bg-[#fffdf9]/80 backdrop-blur-md border-[#ff6b35]/30'} p-8 md:p-12 rounded-[3rem] shadow-[0_25px_60px_rgba(255,107,53,0.15)] border-t-4 border-t-[#ff6b35] transition-all duration-500`}>
            <form onSubmit={handleSubmit} className="space-y-10 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#ff6b35] ml-1">
                    {language === 'gu' ? 'જન્મ તારીખ' : language === 'hi' ? 'जन्म तिथि' : 'Date Of Birth'}
                  </label>
                  <Input 
                    type="date" 
                    required
                    className={`bg-transparent border-[#ff6b35]/30 focus:border-[#ff6b35] rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-[#ff6b35]/20 transition-all ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#ff6b35] ml-1">
                    {language === 'gu' ? 'જન્મ સમય' : language === 'hi' ? 'जन्म समय' : 'Time Of Birth'}
                  </label>
                  <Input 
                    type="time" 
                    defaultValue="08:00"
                    required
                    className={`bg-transparent border-[#ff6b35]/30 focus:border-[#ff6b35] rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-[#ff6b35]/20 transition-all ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onChange={(e) => setFormData({...formData, tob: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#ff6b35] ml-1">
                  {language === 'gu' ? 'જન્મ સ્થળ' : language === 'hi' ? 'जन्म स्थान' : 'Place Of Birth'}
                </label>
                <Input 
                  placeholder={language === 'gu' ? 'શહેરનું નામ દાખલ કરો' : language === 'hi' ? 'शहर का नाम दर्ज करें' : 'Enter City Name'}
                  required
                  className={`bg-transparent border-[#ff6b35]/30 focus:border-[#ff6b35] rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-[#ff6b35]/20 transition-all ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                  onChange={(e) => setFormData({...formData, pob: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-[#ff6b35] ml-1">
                  {language === 'gu' ? 'ઈમેઈલ આઈડી' : language === 'hi' ? 'ईमेल आईडी' : 'Email ID'}
                </label>
                  <Input 
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className={`bg-transparent border-[#ff6b35]/40 focus:border-[#ff6b35] rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-[#ff6b35]/20 transition-all ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white font-black py-8 rounded-[1.5rem] text-2xl shadow-[0_15px_30px_rgba(255,107,53,0.3)] active:scale-[0.98] transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>CALCULATING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 tracking-[0.1em]">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                    {language === 'gu' ? 'હમણાં જ ગણો' : language === 'hi' ? 'अभी गणना करें' : 'CALCULATE NOW'}
                  </div>
                )}
              </Button>
            </form>

            {result && (
              <div className="mt-12 p-8 md:p-10 rounded-[3rem] bg-gradient-to-br from-[#ff6b35]/20 via-[#ff8c5e]/10 to-transparent border-2 border-[#ff6b35]/40 text-center animate-in fade-in zoom-in duration-1000 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6b35]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
                
                <div className="relative z-10 space-y-10">
                  {/* Moon Sign Section - MORE PROMINENT */}
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#ff6b35] opacity-80">
                      {language === 'gu' ? 'તમારી સાચી ચંદ્ર રાશિ (Real Moon Sign)' : language === 'hi' ? 'आपकी असली चंद्र राशि' : 'YOUR REAL MOON SIGN (CHANDRA RASHI)'}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4">
                        {(() => {
                            const idx = getRashiIndex(result.moonRashi.english);
                            const Icon = RASHI_ICONS[idx >= 0 ? idx : 0];
                            return (
                              <div className="w-24 h-24 rounded-[2rem] bg-[#ff6b35]/10 flex items-center justify-center shadow-lg border border-[#ff6b35]/20">
                                <Icon color="#ff6b35" size={64} className="opacity-90" />
                              </div>
                            );
                        })()}
                        <h3 className="text-6xl md:text-7xl font-[family-name:var(--font-cinzel)] font-black text-gradient-ancient">
                          {getTranslatedValue(result.moonRashi)}
                        </h3>
                    </div>
                    <p className="text-xs font-bold text-[#ff6b35] opacity-90 max-w-sm mx-auto">
                        {language === 'gu' 
                            ? 'નામ પાડવા અને સચોટ ભવિષ્ય માટે ચંદ્ર રાશિ સૌથી મહત્વની છે.' 
                            : 'Moon sign is the most important for naming and accurate predictions.'}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-full flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#ff6b35]/20" />
                    <Sparkles className="w-4 h-4 text-[#ff6b35]/40" />
                    <div className="flex-1 h-px bg-[#ff6b35]/20" />
                  </div>

                  {/* Sun Sign Section - LESS PROMINENT */}
                  <div className="space-y-4 opacity-70 scale-95">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#ff6b35]">
                      {language === 'gu' ? 'તમારી સૂર્ય રાશિ (Surya Rashi)' : language === 'hi' ? 'आपकी सूर्य राशि' : 'YOUR SUN SIGN (SURYA RASHI)'}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        {(() => {
                            const idx = getRashiIndex(result.sunRashi.english);
                            const Icon = RASHI_ICONS[idx >= 0 ? idx : 0];
                            return <Icon color="#ff6b35" size={32} className="opacity-60" />;
                        })()}
                        <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-black text-[#ff6b35]">
                          {getTranslatedValue(result.sunRashi)}
                        </h3>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <div className="pt-10 border-t border-[#ff6b35]/10">
                    <p className="text-lg font-bold text-[#ff6b35] mb-6">
                      {language === 'gu' 
                          ? 'વધુ વિગતવાર કુંડળી વિશ્લેષણ માટે અત્યારે જ પૂછો.' 
                          : 'Ask for detailed Kundali analysis now.'}
                    </p>
                    <a 
                      href={`https://wa.me/919824929588?text=${encodeURIComponent(`Namaste, I checked my Rashi on your website.\n\nDetails:\nDOB: ${formData.dob}\nTOB: ${formData.tob}\nPOB: ${formData.pob}\nSurya Rashi: ${result.sunRashi.english}\nChandra Rashi: ${result.moonRashi.english}\n\nI want a detailed consultation.`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-black px-10 py-5 rounded-3xl transition-all shadow-[0_20px_40px_rgba(37,211,102,0.4)] active:scale-95 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-7 h-7 invert relative z-10 animate-bounce-slow" />
                      <span className="text-lg relative z-10 tracking-wider">{language === 'gu' ? 'વોટ્સએપ પર પૂછો' : 'ASK ON WHATSAPP'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

        </Card>

      </div>
    </section>
  );
}
