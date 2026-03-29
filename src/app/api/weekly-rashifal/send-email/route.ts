import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendResendBatch } from '@/lib/email.config';
import { weeklyRashifalEmailTemplate } from '@/lib/email-templates';
import { getUnifiedSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(request: NextRequest) {
  try {
    const { week_start, week_end } = await request.json();
    if (!week_start || !week_end) {
      return NextResponse.json({ error: 'week_start and week_end are required' }, { status: 400 });
    }

    // Get all weekly rashifal data
    const { data: rashifalData, error: rashifalError } = await supabase
      .from('weekly_rashifal')
      .select('*')
      .eq('week_start', week_start);

    if (rashifalError) throw rashifalError;
    if (!rashifalData || rashifalData.length === 0) {
      return NextResponse.json({ error: 'No weekly rashifal data found. Please save rashifal first.' }, { status: 400 });
    }

    // Get all users from unified subscriber list
    const validUsers = await getUnifiedSubscribers();
    
    if (validUsers.length === 0) {
      return NextResponse.json({ error: 'No users found to send emails to' }, { status: 400 });
    }

    const formattedStart = new Date(week_start + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const formattedEnd = new Date(week_end + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const subject = `Weekly Rashifal Updated! (${formattedStart} - ${formattedEnd})`;

    // Prepare emails for batch
    const emails = validUsers.map(user => ({
      to: user.email,
      subject,
      html: weeklyRashifalEmailTemplate(user.name || 'Valued Seeker', formattedStart, formattedEnd, rashifalData),
    }));

    // Send via Resend Batch
    const result = await sendResendBatch(emails);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send batch emails' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      totalUsers: result.total, 
      sent: result.sent, 
      failed: result.failed 
    });
  } catch (error: any) {
    console.error('Error sending weekly rashifal emails:', error);
    return NextResponse.json({ error: error.message || 'Failed to send emails' }, { status: 500 });
  }
}
