"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeJson } from "@/lib/safe-json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, CalendarDays, Clock, User, Mail, MessageSquare } from "lucide-react";

interface Props {
  isDark: boolean;
  t: (k: string) => string;
  setSuccess: (s: string) => void;
  setError: (s: string) => void;
}

export default function ReschedulePanel({ isDark, setSuccess, setError }: Props) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [newDate, setNewDate] = useState<Record<string, string>>({});
  const [newTime, setNewTime] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "cancelled">("all");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/reschedule");
      const data = await safeJson(res);
      if (data.success) setRequests(data.data || []);
    } catch {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, status: "approved" | "cancelled") => {
    setProcessing(id);
    try {
      const res = await fetch("/api/admin/reschedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          admin_note: adminNote[id] || "",
          new_date: newDate[id] || null,
          new_time: newTime[id] || null,
        }),
      });
      const data = await safeJson(res);
      if (data.success) {
        setSuccess(`Request ${status} successfully`);
        fetchRequests();
      } else {
        setError(data.error || "Action failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    cancelled: requests.filter(r => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["all", "pending", "approved", "cancelled"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              filter === f
                ? f === "pending" ? "border-amber-500 bg-amber-500/10" 
                : f === "approved" ? "border-green-500 bg-green-500/10"
                : f === "cancelled" ? "border-red-500 bg-red-500/10"
                : "border-blue-500 bg-blue-500/10"
                : isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="text-2xl font-black">{counts[f]}</div>
            <div className="text-xs font-bold opacity-60 capitalize">{f}</div>
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
      ) : filtered.length === 0 ? (
        <Card className={`${isDark ? "bg-[#12121a] border-white/10" : ""}`}>
          <CardContent className="py-12 text-center">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold opacity-50">No reschedule requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <Card key={req.id} className={`${isDark ? "bg-[#12121a] border-white/10" : ""} overflow-hidden`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    {req.user_name}
                  </CardTitle>
                  <Badge variant={req.status === "pending" ? "secondary" : req.status === "approved" ? "default" : "destructive"}
                    className={`${req.status === "pending" ? "bg-amber-500/20 text-amber-400" : req.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {req.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-50" />
                    <span className="opacity-70">{req.user_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 opacity-50" />
                    <span className="opacity-70">Original: {req.original_date} at {req.original_time}</span>
                  </div>
                  {req.requested_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-amber-500">Requested: {req.requested_date} {req.requested_time && `at ${req.requested_time}`}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-50" />
                    <span className="opacity-70">{new Date(req.created_at).toLocaleDateString()} {new Date(req.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                {req.reason && (
                  <div className={`p-3 rounded-xl text-sm ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3 h-3 opacity-50" />
                      <span className="font-bold text-xs opacity-50">REASON</span>
                    </div>
                    <p className="opacity-80">{req.reason}</p>
                  </div>
                )}

                {req.admin_note && (
                  <div className={`p-3 rounded-xl text-sm ${isDark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"}`}>
                    <span className="font-bold text-xs text-green-500">ADMIN NOTE: </span>
                    <span className="opacity-80">{req.admin_note}</span>
                  </div>
                )}

                {req.status === "pending" && (
                  <div className={`p-4 rounded-xl border-2 border-dashed space-y-3 ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold opacity-50 block mb-1">New Date</label>
                        <Input
                          type="date"
                          value={newDate[req.id] || ""}
                          onChange={e => setNewDate(p => ({ ...p, [req.id]: e.target.value }))}
                          className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold opacity-50 block mb-1">New Time</label>
                        <Input
                          type="time"
                          value={newTime[req.id] || ""}
                          onChange={e => setNewTime(p => ({ ...p, [req.id]: e.target.value }))}
                          className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-50 block mb-1">Admin Note</label>
                      <Input
                        value={adminNote[req.id] || ""}
                        onChange={e => setAdminNote(p => ({ ...p, [req.id]: e.target.value }))}
                        placeholder="Add a note for the user..."
                        className={`rounded-xl ${isDark ? "bg-[#0a0a0f] border-white/10" : ""}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAction(req.id, "approved")}
                        disabled={processing === req.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-10 font-bold"
                      >
                        {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Approve</>}
                      </Button>
                      <Button
                        onClick={() => handleAction(req.id, "cancelled")}
                        disabled={processing === req.id}
                        variant="destructive"
                        className="flex-1 rounded-xl h-10 font-bold"
                      >
                        {processing === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1" /> Cancel</>}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
