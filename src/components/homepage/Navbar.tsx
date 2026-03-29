"use client";

import Link from "next/link";
import { 
  Menu, 
  X, 
  LogOut, 
  Moon, 
  Sun, 
  Bell 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useMenu } from "@/contexts/MenuContext";
import GoogleTranslateWidget from "@/components/GoogleTranslateWidget";
import { useTranslation } from "@/components/GoogleTranslateWidget";
import { contentData } from "@/data/homepage";
import { useState, useEffect } from "react";

import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  hasNotification?: boolean;
}

export default function Navbar({ hasNotification = false }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const { language, t } = useTranslation();
  const { user, signOut, showAuthModal } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function getProfile() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setProfile(data);
    }
    getProfile();
  }, [user]);

  const profileName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Seeker";
  const profileGender = profile?.gender || user?.user_metadata?.gender;
  const defaultBoyPic = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/08a15695-f57b-4aed-b5f6-2cbce14746cf/image-1770399458068.png?width=80&height=80&resize=contain";
    const defaultGirlPic = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-25-000158-1766601181550.png?width=80&height=80&resize=contain";
  const profilePic = profile?.profile_pic || user?.user_metadata?.profile_pic || 
    (profileGender?.toLowerCase() === 'female' ? defaultGirlPic : defaultBoyPic);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${
      theme === 'dark' 
        ? 'bg-[#0a0a0f]/95 border-[#ff6b35]/20'
        : 'bg-[#f5f0e8]/95 border-[#ff6b35]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/c601c1cc-61c8-474d-bbc9-2026bfe37c34/logo_withoutname-removebg-1767251276652.png?width=112&height=112&resize=contain"
              alt="Katyaayani Astrologer"
              width={56}
              height={56}
              priority
              loading="eager"
            className="object-contain"
          />
          <span
              className="font-[family-name:var(--font-cinzel)] text-xs md:text-sm lg:text-base font-bold text-gradient-ancient leading-tight whitespace-nowrap notranslate"
              translate="no"
            >
              KATYAAYANI<br />ASTROLOGER
            </span>
        </Link>

            <div className="hidden md:flex flex-1 justify-center gap-3 lg:gap-6 mx-4">
              <Link href="/" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("Home")}</Link>
                  <Link href="/services" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("Services")}</Link>
                    <Link href="/booking" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("Book")}</Link>
                  <Link href="/blog" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("Blog")}</Link>
                  <Link href="/reviews" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("Feedback")}</Link>
                <Link href="/about" className="hover:text-[#ff6b35] transition-colors text-sm lg:text-lg">{t("About")}</Link>
              </div>

          <div className="flex items-center gap-2">
                <GoogleTranslateWidget />
                
                {/* Notification Bell */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                        onClick={() => {
                          const banner = document.getElementById('new-blog-banner');
                          if (banner) {
                            banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            banner.classList.add('scale-110', 'ring-8', 'ring-[#ff6b35]/20', 'rotate-2');
                            setTimeout(() => {
                              banner.classList.remove('scale-110', 'ring-8', 'ring-[#ff6b35]/20', 'rotate-2');
                            }, 1500);
                          } else {
                            window.location.href = '/blog';
                          }
                        }}

                    title={t("New Notifications")}
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  {hasNotification && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white dark:border-[#0a0a0f] rounded-full animate-pulse" />
                  )}
                </div>
                
                <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex h-8 w-8 text-[#ff6b35] hover:bg-[#ff6b35]/10"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              {isMounted && user ? (
              <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-full bg-[#ff6b35]/5 border border-[#ff6b35]/10">
                <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-[#ff6b35]">
                  <Image src={profilePic} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
                </Link>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-bold truncate max-w-[80px]">{profileName.split(' ')[0]}</span>
                  <button onClick={() => signOut()} className="text-[10px] text-red-600 hover:text-red-500 uppercase font-bold">
                    {t("Log Out")}
                  </button>
                </div>
              </div>
            ) : isMounted && !user ? (
              <Button 
                variant="outline" 
                onClick={() => showAuthModal('signin')}
                className="hidden md:flex border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10 h-8 text-xs"
              >
                {t("Login")}
              </Button>
              ) : null}

  
            <Button
              variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#ff6b35] h-8 w-8"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
          <div
            className={`md:hidden border-t ${theme === 'dark' ? 'border-[#ff6b35]/20 bg-[#0a0a0f]' : 'border-[#ff6b35]/20 bg-[#f5f0e8]'}`}
          >
              <div className="px-6 py-4 space-y-3">
<Link href="/" className="block py-2 text-[#ff6b35]" onClick={() => setIsMenuOpen(false)}>{t("Home")}</Link>
                      <Link href="/services" className="block py-2" onClick={() => setIsMenuOpen(false)}>{t("Services")}</Link>
                      <Link href="/booking" className="block py-2" onClick={() => setIsMenuOpen(false)}>{t("Book")}</Link>
                      <Link href="/blog" className="block py-2" onClick={() => setIsMenuOpen(false)}>{t("Blog")}</Link>
                      <Link href="/reviews" className="block py-2" onClick={() => setIsMenuOpen(false)}>{t("Feedback")}</Link>
                    <Link href="/about" className="block py-2" onClick={() => setIsMenuOpen(false)}>{t("About")}</Link>

                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-3 py-2 w-full text-left"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-[#ff6b35]" /> : <Moon className="w-5 h-5 text-[#ff6b35]" />}
                  <span>{theme === 'dark' ? t("Light Mode") : t("Dark Mode")}</span>
                </button>

                {user ? (
                  <div className="pt-2 border-t border-[#ff6b35]/20 mt-2 space-y-2">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 py-3 px-3 rounded-lg bg-[#ff6b35]/5 hover:bg-[#ff6b35]/10 transition-colors cursor-pointer" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff6b35]">
                        <Image src={profilePic} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#ff6b35]">{profileName}</span>
                        <span className="text-xs opacity-70">{t("View Profile")}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => { signOut(); setIsMenuOpen(false); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 font-bold uppercase text-xs cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("Log Out")}
                    </button>
                  </div>
                ) : (
                  <Button onClick={() => { showAuthModal('signin'); setIsMenuOpen(false); }} className="w-full bg-[#ff6b35] text-white">
                    {t("Login / Sign Up")}
                  </Button>
                )}
            </div>
          </div>
      )}
    </nav>
  );
}
