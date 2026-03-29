"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function generateSessionId() {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("_pv_sid");
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("_pv_sid", sid);
  }
  return sid;
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string>("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;

    // Skip admin pages
    if (pathname.startsWith("/admin")) return;

    const sessionId = generateSessionId();

    fetch("/api/admin/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        session_id: sessionId,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
