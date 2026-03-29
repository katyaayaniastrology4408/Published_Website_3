import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);
const resend = new Resend(process.env.RESEND_API_KEY!);
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.katyaayaniastrologer.com';

function buildEmail(post: any, name: string, email: string) {
  const firstName = (name || '').split(' ')[0] || 'ભક્ત';
  const blogUrl = `${SITE_URL}/blog/${post.slug}`;
  const unsubUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  const tags: string[] = post.tags || [];

  const tagPills = tags.map((t: string) =>
    `<a href="${SITE_URL}/blog?tag=${encodeURIComponent(t)}" style="display:inline-block;background:rgba(249,115,22,0.15);color:#f97316;border:1px solid rgba(249,115,22,0.4);border-radius:999px;padding:4px 14px;font-size:12px;font-weight:600;text-decoration:none;margin:3px 2px;">#${t}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="gu">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<title>${post.title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0612;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(160deg,#0a0612 0%,#120820 50%,#0a0612 100%);">
  <div style="background:linear-gradient(135deg,#1a0a2e,#2d1054);padding:28px 32px;text-align:center;border-bottom:2px solid rgba(249,115,22,0.4);">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#f97316;text-transform:uppercase;font-weight:600;">Katyaayani Astrologer</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;font-family:Georgia,serif;">કાત્યાયની જ્યોતિષ</p>
    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Vedic Astrology • Jyotish • Spiritual Guidance</p>
  </div>
  ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" width="600" style="width:100%;max-width:600px;display:block;object-fit:cover;max-height:320px;"/>` : ''}
  <div style="padding:32px 32px 24px;">
    <p style="margin:0 0 6px;font-size:13px;color:#f97316;font-weight:600;letter-spacing:1px;">🌑 CHANDRA GRAHAN 2026</p>
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.35;color:#fff;font-family:Georgia,serif;">${post.title}</h1>
    <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 20px;">
      નમસ્કાર <strong style="color:#fcd34d;">${firstName} જી 🙏</strong>,<br/>
      ચંદ્ર ગ્રહણ 2026 — ગ્રહણ-કાળ, સૂતક, 12 રાશિ ફળ અને ઉપાય — સૌ અહીં.
    </p>
    <div style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.25);border-radius:12px;padding:20px 24px;margin:0 0 24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#fcd34d;letter-spacing:1px;text-transform:uppercase;">📌 Blog Highlights</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;color:#d1d5db;font-size:14px;">🌑 ગ્રહણ ક્યારે &amp; ક્યાં?</td><td style="padding:6px 0;color:#f97316;font-size:14px;font-weight:600;text-align:right;">2026</td></tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr><td style="padding:6px 0;color:#d1d5db;font-size:14px;">🕐 સૂતક &amp; ગ્રહણ-કાળ</td><td style="padding:6px 0;color:#f97316;font-size:14px;font-weight:600;text-align:right;">9 કલાક</td></tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr><td style="padding:6px 0;color:#d1d5db;font-size:14px;">🪬 12 રાશિ ફળ &amp; ઉપાય</td><td style="padding:6px 0;color:#10b981;font-size:14px;font-weight:600;text-align:right;">✓ Included</td></tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr><td style="padding:6px 0;color:#d1d5db;font-size:14px;">📿 ખાસ ઉપાય</td><td style="padding:6px 0;color:#10b981;font-size:14px;font-weight:600;text-align:right;">✓ Included</td></tr>
      </table>
    </div>
    <div style="border-left:3px solid #f97316;padding:14px 20px;background:rgba(249,115,22,0.06);border-radius:0 10px 10px 0;margin:0 0 28px;">
      <p style="margin:0;font-size:14px;line-height:1.75;color:#e5e7eb;font-style:italic;">"${post.excerpt}"</p>
    </div>
    <div style="text-align:center;margin:0 0 28px;">
      <a href="${blogUrl}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#dc2626);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:50px;">
        🌕 પૂરો Blog Post વાંચો
      </a>
    </div>
    ${tagPills ? `<div style="text-align:center;margin:0 0 8px;">${tagPills}</div>` : ''}
  </div>
  <div style="background:rgba(0,0,0,0.4);border-top:1px solid rgba(249,115,22,0.2);padding:24px 32px;text-align:center;">
    <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#f97316;">Katyaayani Astrologer</p>
    <p style="margin:0 0 14px;font-size:12px;color:#6b7280;font-style:italic;">"ગ્રહ બદલો, ભાગ્ય બદલો"</p>
    <p style="margin:0;font-size:11px;color:#4b5563;">
      <a href="${SITE_URL}/blog" style="color:#f97316;text-decoration:none;">Blog</a> &nbsp;|&nbsp;
      <a href="${SITE_URL}/services" style="color:#f97316;text-decoration:none;">Services</a> &nbsp;|&nbsp;
      <a href="${unsubUrl}" style="color:#6b7280;text-decoration:none;">Unsubscribe</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

export async function GET() {
  try {
    // Find pending scheduled emails that are due
    const { data: jobs, error } = await supabase
      .from('scheduled_emails')
      .select('*, blog_posts(*)')
      .eq('status', 'pending')
      .lte('send_at', new Date().toISOString());

    if (error) throw error;
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs', ran: 0 });
    }

    let totalSent = 0;
    for (const job of jobs) {
      const post = job.blog_posts;
      if (!post) continue;

      // Mark as running to prevent double-send
      await supabase.from('scheduled_emails').update({ status: 'running' }).eq('id', job.id);

      // Get all subscribers
      const emailMap = new Map<string, { email: string; name: string }>();
      const { data: subs } = await supabase.from('newsletter_subscribers').select('email, first_name, last_name').eq('is_active', true).not('email', 'is', null);
      (subs || []).forEach((s: any) => { if (s.email && !emailMap.has(s.email.toLowerCase())) emailMap.set(s.email.toLowerCase(), { email: s.email, name: [s.first_name, s.last_name].filter(Boolean).join(' ') }); });
      const { data: profiles } = await supabase.from('profiles').select('email, name').not('email', 'is', null);
      (profiles || []).forEach((p: any) => { if (p.email && !emailMap.has(p.email.toLowerCase())) emailMap.set(p.email.toLowerCase(), { email: p.email, name: p.name || '' }); });

      const contacts = [...emailMap.values()];
      let sent = 0;

      for (const c of contacts) {
        try {
          await resend.emails.send({
            from: 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>',
            to: c.email,
            subject: `${post.title} | Katyaayani Astrologer`,
            html: buildEmail(post, c.name, c.email),
            headers: {
              'List-Unsubscribe': `<${SITE_URL}/unsubscribe?email=${encodeURIComponent(c.email)}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              'Precedence': 'bulk',
              'X-Entity-Ref-ID': `scheduled-${job.id}-${Math.random().toString(36).slice(2)}`,
            },
          });
          sent++;
          await new Promise(r => setTimeout(r, 300));
        } catch {}
      }

      await supabase.from('scheduled_emails').update({ status: 'done', sent_count: sent }).eq('id', job.id);
      totalSent += sent;
    }

    return NextResponse.json({ success: true, jobsRan: jobs.length, emailsSent: totalSent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
