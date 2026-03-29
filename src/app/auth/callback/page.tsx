"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Auth callback: Exchanging session...");
        
        // Wait a small moment for cookies to be set
        await new Promise(r => setTimeout(r, 500));

        // Get user is more reliable than getSession in some environments
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Auth callback error (User):", userError?.message);
          // Try getSession as fallback
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            console.error("Auth callback error (Session fallback):", sessionError?.message);
            router.replace("/signin?error=" + encodeURIComponent(sessionError?.message || "User session not found"));
            return;
          }
          // If session found, continue with session.user
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session && !user) {
          router.replace("/signin?error=No%20session%20found");
          return;
        }

        const activeUser = user || session?.user;
        if (!activeUser) return;

        const provider = activeUser.app_metadata?.provider;
        console.log("Auth callback: User identified", { id: activeUser.id, provider });

        if (provider === "google") {
          // Step 1: Ensure profile row exists (insert if new user)
          try {
            const res = await fetch("/api/auth/google-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: activeUser.id,
                email: activeUser.email,
                name: activeUser.user_metadata?.full_name || activeUser.user_metadata?.name || "",
                avatar: activeUser.user_metadata?.avatar_url || "",
                isNew: true // Assume new if coming from callback
              }),
            });
            if (!res.ok) {
              const errData = await res.json();
              console.error("Google login API error:", errData.error);
            }
          } catch (fetchErr) {
            console.error("Google login API fetch failed:", fetchErr);
          }

          // Step 2: Check if profile is complete (has dob + pob filled)
          const { data: profile, error: profileError } = await (supabase as any)
            .from("profiles")
            .select("dob, pob, phone, gender, tob")
            .eq("id", activeUser.id)
            .maybeSingle();

          if (profileError) {
            console.error("Profile fetch error:", profileError.message);
          }

          const isComplete =
            profile?.dob && profile?.pob && profile?.phone && profile?.gender;

          console.log("Auth callback: Profile completeness check", { isComplete });

            if (!isComplete) {
              // New user or incomplete profile — go fill details
              router.replace("/complete-profile");
            } else {
              // Returning user — go straight to homepage
              router.replace("/");
            }
          } else {
            // Email/password login — go to homepage
            router.replace("/");
          }

      } catch (err: any) {
        console.error("Auth callback unexpected error:", err);
        router.replace("/signin?error=" + encodeURIComponent(err.message || "Unknown error"));
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0014]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-semibold">Signing you in...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
      </div>
    </div>
  );
}
