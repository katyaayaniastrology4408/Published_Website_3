import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
export const dynamic = 'force-dynamic';

const RESEND_AUDIENCE_ID = 'e6bafd8b-5149-4862-a298-e23bd5578190';

// GET - list Resend contacts
export async function GET(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.contacts.list({ audienceId: RESEND_AUDIENCE_ID });
    if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
    return NextResponse.json({ contacts: data?.data || [], total: data?.data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - sync all Supabase subscribers to Resend
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.secretKey !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });

  try {
    // Fetch all active subscribers from Supabase who opted in for the newsletter
    const { data: subscribers, error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email, first_name, last_name')
      .eq('is_active', true)
      .eq('is_newsletter_subscriber', true);

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, synced: 0, failed: 0, message: 'No subscribers found' });
    }

    const resend = new Resend(resendApiKey);
    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    // Sync each subscriber to Resend (upsert via create - duplicates are handled by Resend)
    for (const sub of subscribers) {
      try {
        await resend.contacts.create({
          audienceId: RESEND_AUDIENCE_ID,
          email: sub.email,
          firstName: sub.first_name || undefined,
          lastName: sub.last_name || undefined,
          unsubscribed: false,
        });
        synced++;
      } catch (err: any) {
        // If contact already exists, Resend returns an error but that's okay
        if (err.message?.includes('already exists') || err.statusCode === 409) {
          synced++; // already synced
        } else {
          failed++;
          errors.push(`${sub.email}: ${err.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: subscribers.length,
      synced,
      failed,
      errors: errors.slice(0, 5),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
