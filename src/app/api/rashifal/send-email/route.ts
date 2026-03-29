import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSmtpBatch } from '@/lib/email.config';
import { dailyRashifalEmailTemplate } from '@/lib/email-templates';
import { getUnifiedSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get all rashifal data for this date
    const { data: rashifalData, error: rashifalError } = await supabase
      .from('daily_rashifal')
      .select('*')
      .eq('date', date);

    if (rashifalError) throw rashifalError;
    if (!rashifalData || rashifalData.length === 0) {
      return NextResponse.json({ error: 'No rashifal data found for this date. Please save rashifal first.' }, { status: 400 });
    }

    // Get all users from unified subscriber list
    const validUsers = await getUnifiedSubscribers();
    
    if (validUsers.length === 0) {
      return NextResponse.json({ error: 'No users found to send emails to' }, { status: 400 });
    }

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const subject = `Today's Rashifal Has Been Updated! - ${formattedDate}`;

    // Prepare emails for batch
    const emails = validUsers.map(user => ({
      to: user.email,
      subject,
      html: dailyRashifalEmailTemplate(user.name || 'Valued Seeker', formattedDate, rashifalData),
    }));

    // Send via SMTP Batch (User requested SMTP for Daily)
    const result = await sendSmtpBatch(emails);

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
    console.error('Error sending daily rashifal emails:', error);
    return NextResponse.json({ error: error.message || 'Failed to send emails' }, { status: 500 });
  }
}
