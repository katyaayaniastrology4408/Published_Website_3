"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { showAuthModal } = useAuth();

  useEffect(() => {
    router.push("/");
    setTimeout(() => {
      showAuthModal("signin");
    }, 500);
  }, [router, showAuthModal]);

  return null;
}
