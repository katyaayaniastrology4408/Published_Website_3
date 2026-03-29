"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function UserAlertsPopup() {
  const { user, session } = useAuth();
  const { theme } = useTheme();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && session?.access_token) {
      fetchAlerts();
      
      // Polling for new alerts every 30 seconds
      const interval = setInterval(fetchAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [user, session]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/user-alerts", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
        if (!response.ok) return;
          let data;
          try { data = await response.json(); } catch { return; }
          if (data.success && data.data) {
        const unreadAlerts = data.data.filter((a: Alert) => !a.is_read);
        setAlerts(unreadAlerts);
        if (unreadAlerts.length > 0) {
          setCurrentAlert(unreadAlerts[0]);
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await fetch("/api/user-alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ alertId }),
      });
      
      const remaining = alerts.filter((a) => a.id !== alertId);
      setAlerts(remaining);
      
      if (remaining.length > 0) {
        setCurrentAlert(remaining[0]);
      } else {
        setIsOpen(false);
        setCurrentAlert(null);
      }
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const handleClose = () => {
    if (currentAlert) {
      markAsRead(currentAlert.id);
    }
  };

  if (!user || !currentAlert) return null;

  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {isOpen && currentAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? "bg-[#12121a]" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5e] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">New Message</h3>
                  <p className="text-white/80 text-xs">
                    {alerts.length > 1 ? `${alerts.length} unread alerts` : "1 unread alert"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6">
              <h4 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                {currentAlert.title}
              </h4>
              <p className={`text-base leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {currentAlert.message}
              </p>
              
              <div className={`mt-4 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {new Date(currentAlert.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <Button
                onClick={handleClose}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Got it
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
