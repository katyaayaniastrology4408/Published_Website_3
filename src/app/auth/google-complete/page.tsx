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
      await new Promise(r => setTimeout(r, 500));

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Fallback: try one more time if it's very slow
        await new Promise(r => setTimeout(r, 500));
        const { data: { user: user2 } } = await supabase.auth.getUser();
        if (!user2) {
          window.location.href = "/signin?error=Session+not+found";
          return;
        }
      }

      // Always redirect to home for Google auth to reduce friction.
      window.location.href = "/";
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
