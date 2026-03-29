import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      { count: totalSent },
      { count: totalFailed },
      { count: todaySent },
      { count: monthSent },
      { count: gmailSent },
      { count: resendSent },
      { count: gmailTodaySent },
      { count: resendTodaySent },
      { count: gmailTodayFailed },
      { count: resendTodayFailed },
      { count: todayFailed },
      { data: recentEmails },
    ] = await Promise.all([
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').gte('created_at', monthStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').eq('provider', 'gmail'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').eq('provider', 'resend'),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').eq('provider', 'gmail').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent').eq('provider', 'resend').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed').eq('provider', 'gmail').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed').eq('provider', 'resend').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', todayStart.toISOString()),
      supabase.from('email_logs').select('*').order('created_at', { ascending: false }).limit(50),
    ]);

    // Gmail: 500/day for workspace
    const gmailDailyLimit = 500;
    // Resend free plan: 100 emails/day, paid: 1000+
    const resendDailyLimit = 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalSent: totalSent || 0,
        totalFailed: totalFailed || 0,
        todaySent: todaySent || 0,
        todayFailed: todayFailed || 0,
        monthSent: monthSent || 0,
        gmailSent: gmailSent || 0,
        resendSent: resendSent || 0,
        gmailDailyLimit,
        gmailTodayUsed: gmailTodaySent || 0,
        gmailRemaining: gmailDailyLimit - (gmailTodaySent || 0),
        gmailTodayFailed: gmailTodayFailed || 0,
        resendDailyLimit,
        resendTodayUsed: resendTodaySent || 0,
        resendRemaining: resendDailyLimit - (resendTodaySent || 0),
        resendTodayFailed: resendTodayFailed || 0,
      },
      recentEmails: recentEmails || [],
    });
  } catch (error: any) {
    console.error("Email stats error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
