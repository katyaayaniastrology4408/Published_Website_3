import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL || 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

function applyVars(html: string, vars: Record<string, string>) {
  let out = html;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`{{{${key}}}}`).join(String(val));
  }
  return out;
}

type Subscriber = { email: string; name: string };

// Merge DB subscribers + Resend audience contacts into one unique list
async function getAllSubscribers(): Promise<Subscriber[]> {
  const map = new Map<string, Subscriber>();

  // 1. DB newsletter_subscribers
  const { data: dbSubs } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('email, first_name, last_name')
    .eq('is_active', true);

  for (const s of dbSubs || []) {
    const email = (s.email || '').toLowerCase().trim();
    if (!email || !email.includes('@')) continue;
    const name = [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || 'Devotee';
    map.set(email, { email, name });
  }

  // 2. Resend audience contacts
  try {
    const res = await resend.contacts.list({ audienceId: AUDIENCE_ID });
    const contacts = (res as any)?.data?.data || [];
    for (const c of contacts) {
      const email = (c.email || '').toLowerCase().trim();
      if (!email || !email.includes('@')) continue;
      if (!map.has(email)) {
        const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim() || 'Devotee';
        map.set(email, { email, name });
      }
    }
  } catch {
    // If Resend list fails, continue with DB only
  }

  return Array.from(map.values());
}

export async function GET() {
  try {
    const subs = await getAllSubscribers();
    return NextResponse.json({ count: subs.length });
  } catch (err: any) {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { templateId, sendTo, testEmail } = await req.json();
    if (!templateId) return NextResponse.json({ error: 'templateId is required' }, { status: 400 });

    // Fetch template
    const { data: tmpl, error: tmplErr } = await supabaseAdmin
      .from('custom_email_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    if (tmplErr || !tmpl) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    // --- Test email ---
    if (sendTo === 'test') {
      if (!testEmail?.trim()) return NextResponse.json({ error: 'testEmail is required' }, { status: 400 });
      const html = applyVars(tmpl.html, {
        NAME: 'Test User',
        UNSUBSCRIBE_URL: 'https://www.katyaayaniastrologer.com/unsubscribe',
      });
      const { error } = await resend.emails.send({
        from: FROM,
        to: testEmail.trim(),
        subject: `[TEST] ${tmpl.subject}`,
        html,
      });
      if (error) return NextResponse.json({ error: String(error) }, { status: 500 });
      return NextResponse.json({ success: true, sent: 1, failed: 0 });
    }

    // --- Send to all (DB + Resend audience merged) ---
    const subscribers = await getAllSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, failed: 0, total: 0 });
    }

    let sent = 0;
    let failed = 0;
    const BATCH = 50;

    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      const emails = batch.map((sub) => ({
        from: FROM,
        to: sub.email,
        subject: tmpl.subject,
        html: applyVars(tmpl.html, {
          NAME: sub.name,
          UNSUBSCRIBE_URL: `https://www.katyaayaniastrologer.com/unsubscribe?email=${encodeURIComponent(sub.email)}`,
        }),
      }));

      try {
        const { error: batchErr } = await resend.batch.send(emails);
        if (batchErr) {
          failed += batch.length;
        } else {
          sent += batch.length;
        }
      } catch {
        failed += batch.length;
      }

      if (i + BATCH < subscribers.length) await new Promise((r) => setTimeout(r, 500));
    }

    return NextResponse.json({ success: true, total: subscribers.length, sent, failed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
