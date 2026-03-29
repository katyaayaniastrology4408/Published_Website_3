"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function GoogleCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finish = async () => {
      const isNew = searchParams.get("isNew") === "true";
      const target = searchParams.get("target"); // "home" or "complete-profile"

      // Wait a moment for magic link session to be set by Supabase
      await new Promise(r => setTimeout(r, 1000));

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin?error=Session+not+found");
        return;
      }

      // If server already determined the target, use it directly
      if (target === "home") {
        router.replace("/");
        return;
      }

      if (target === "complete-profile" || isNew) {
        router.replace("/complete-profile");
        return;
      }

      // Fallback: check profile completeness client-side
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("dob, pob, phone, gender, address")
        .eq("id", user.id)
        .maybeSingle();

      const isComplete = profile?.dob && profile?.pob && profile?.phone && profile?.gender && profile?.address;

      if (!isComplete) {
        router.replace("/complete-profile");
      } else {
        router.replace("/");
      }
    };

    finish();
  }, [router, searchParams]);

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

export default function GoogleCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0014]">
        <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <GoogleCompleteInner />
    </Suspense>
  );
}
