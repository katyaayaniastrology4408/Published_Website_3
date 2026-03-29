"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  showAuthModal: (view?: 'signin' | 'signup') => void;
  hideAuthModal: () => void;
  authView: 'signin' | 'signup';
  isEnquiryModalOpen: boolean;
  showEnquiryModal: () => void;
  hideEnquiryModal: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isAuthModalOpen: false,
  showAuthModal: () => {},
  hideAuthModal: () => {},
  authView: 'signin',
  isEnquiryModalOpen: false,
  showEnquiryModal: () => {},
  hideEnquiryModal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

    useEffect(() => {
    let listener: { subscription: { unsubscribe: () => void } } | null = null;

    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth session error:", error.message);
          setLoading(false);
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    try {
      const authObj = supabase.auth;
      if (authObj && typeof authObj.onAuthStateChange === 'function') {
        const { data } = authObj.onAuthStateChange(
          (_event: AuthChangeEvent, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session) {
              setIsAuthModalOpen(false);
            }
          }
        );
        listener = data;
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth listener error:", err);
      setLoading(false);
    }

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const showAuthModal = (view: 'signin' | 'signup' = 'signin') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  const hideAuthModal = () => setIsAuthModalOpen(false);

  const showEnquiryModal = () => setIsEnquiryModalOpen(true);
  const hideEnquiryModal = () => setIsEnquiryModalOpen(false);

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthModalOpen,
    showAuthModal,
    hideAuthModal,
    authView,
    isEnquiryModalOpen,
    showEnquiryModal,
    hideEnquiryModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
