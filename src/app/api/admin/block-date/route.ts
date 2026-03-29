import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendRescheduleEmail } from '@/lib/email';
export const dynamic = 'force-dynamic' ; 

export async function POST(req: Request) {
  try {
    const { date, reason } = await req.json();

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Block the date
    const { error: blockError } = await supabaseAdmin
      .from('blocked_dates')
      .insert([{ date, reason }]);

    if (blockError) {
      console.error('Error blocking date:', blockError);
      return NextResponse.json({ error: 'Failed to block date' }, { status: 500 });
    }

    // 2. Find all bookings on this date
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_date', date)
      .neq('status', 'cancelled');

    if (bookingsError) {
      console.error('Error fetching bookings for date:', bookingsError);
    } else if (bookings && bookings.length > 0) {
      // 3. Send reschedule emails to all affected bookings
      // Using Promise.allSettled to ensure one failure doesn't stop others
      await Promise.allSettled(
        bookings.map(booking => sendRescheduleEmail(booking))
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Date blocked and ${bookings?.length || 0} reschedule emails sent.`,
      affectedBookings: bookings?.length || 0
    });
  } catch (error: any) {
    console.error('Block Date Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
