"use client";

import { Component, type ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TranslationProvider } from "@/components/GoogleTranslateWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import { MenuProvider } from "@/contexts/MenuContext";
import AuthModal from "@/components/auth/AuthModal";
import LoginNudge from "@/components/auth/LoginNudge";
import { Toaster } from "sonner";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: "#666", marginBottom: 20 }}>{this.state.error?.message}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{ padding: "10px 24px", background: "#ff6b35", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <TranslationProvider>
        <AuthProvider>
          <ThemeProvider>
            <MenuProvider>
              {children}
              <AuthModal />
              <Toaster position="top-center" richColors />
            </MenuProvider>
          </ThemeProvider>
        </AuthProvider>
      </TranslationProvider>
    </ErrorBoundary>
  );
}
