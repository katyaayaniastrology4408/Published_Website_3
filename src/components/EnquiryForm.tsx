"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function EnquiryForm({ onClose }: { onClose?: () => void }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function prefillData() {
      if (user) {
        // First set from auth metadata
        const metaName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        if (metaName) setValue("name", metaName);
        if (user.email) setValue("email", user.email);

        // Then try fetching from profiles for more accurate data (like phone)
        const { data, error } = await supabase
          .from("profiles")
          .select("name, phone")
          .eq("id", user.id)
          .maybeSingle();
        
        if (data && !error) {
          if (data.name) setValue("name", data.name);
          if (data.phone) setValue("phone", data.phone);
        }
      }
    }
    prefillData();
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        reset();
        if (onClose) {
          setTimeout(onClose, 3000);
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      setStatus('error');
    }
  };

  return (
    <Card className={`${theme === 'dark' ? 'bg-[#12121a] border-[#ff6b35]/20' : 'bg-[#fffdf9] border-[#ff6b35]/30'} w-full max-w-lg mx-auto overflow-hidden relative shadow-2xl`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#ff6b35]/10 transition-colors z-[60] group border border-[#ff6b35]/20"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-[#ff6b35] group-hover:scale-110 transition-transform" />
        </button>
      )}

      <CardHeader className="text-center">
        <CardTitle className="font-[family-name:var(--font-cinzel)] text-2xl text-gradient-ancient">Quick Enquiry</CardTitle>
        <CardDescription>How can we help you on your spiritual journey?</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enquiry Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you shortly via Email.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Your Name" 
                      {...register("name")}
                      readOnly={!!user}
                      className={`${errors.name ? "border-red-500" : ""} ${!!user ? "opacity-70 cursor-not-allowed select-none" : ""}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Email Address" 
                      type="email"
                      {...register("email")}
                      readOnly={!!user}
                      className={`${errors.email ? "border-red-500" : ""} ${!!user ? "opacity-70 cursor-not-allowed select-none" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Phone (Optional)" 
                      {...register("phone")}
                      readOnly={!!user}
                      className={!!user ? "opacity-70 cursor-not-allowed select-none" : ""}
                    />
                  </div>

                <div className="space-y-2">
                  <Input 
                    placeholder="Subject" 
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Textarea 
                  placeholder="Tell us about your concern..." 
                  className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                  {...register("message")}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </div>

              {status === 'error' && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Failed to send enquiry. Please try again.
                </div>
              )}

              <Button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5e] text-white py-6 text-lg font-semibold"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Enquiry
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
