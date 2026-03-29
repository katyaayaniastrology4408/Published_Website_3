import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const resend = new Resend('re_ZNV7bf4z_HFmbiLTrHuLGPitDdWuMdFsr');

const SITE_URL = 'https://www.katyaayaniastrologer.com';

const POST = {
  title: 'ચંદ્ર ગ્રહણ 2026 — સૂતક, સ્નાન, ઉપાય અને 12 રાશિ ફળ',
  excerpt: 'ચંદ્ર ગ્રહણ 2026 ક્યારે? ગ્રહણ કાળ, સૂતક સમય, શું કરવું - ન કરવું, 12 રાશિ ફળ અને શ્રેષ્ઠ ઉપાય — બધ્ધું અહીં.',
  image: 'https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/chandra-grahan-1772513619159.jpg',
  slug: 'chandra-grahan-2026-kab-hai-samay-upay',
  tags: ['chandra-grahan', 'lunar-eclipse', 'grahan-2026', 'jyotish', 'upay'],
};

function buildEmail(name, email) {
  const firstName = (name || '').split(' ')[0] || 'ભક્ત';
  const blogUrl = `${SITE_URL}/blog/${POST.slug}`;
  const unsubUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  const tagPills = POST.tags.map(t =>
    `<a href="${SITE_URL}/blog?tag=${encodeURIComponent(t)}" style="display:inline-block;background:rgba(249,115,22,0.15);color:#f97316;border:1px solid rgba(249,115,22,0.4);border-radius:999px;padding:4px 14px;font-size:12px;font-weight:600;text-decoration:none;margin:3px 2px;">#${t}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="gu">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<title>${POST.title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0612;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(160deg,#0a0612 0%,#120820 50%,#0a0612 100%);">
  <div style="background:linear-gradient(135deg,#1a0a2e,#2d1054);padding:28px 32px;text-align:center;border-bottom:2px solid rgba(249,115,22,0.4);">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#f97316;text-transform:uppercase;font-weight:600;">Katyaayani Astrologer</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;font-family:Georgia,serif;">કાત્યાયની જ્યોતિષ</p>
    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Vedic Astrology • Jyotish • Spiritual Guidance</p>
  </div>
  <div style="position:relative;overflow:hidden;">
    <img src="${POST.image}" alt="Chandra Grahan 2026" width="600"
      style="width:100%;max-width:600px;display:block;object-fit:cover;max-height:320px;"/>
  </div>
  <div style="padding:32px 32px 24px;">
    <p style="margin:0 0 6px;font-size:13px;color:#f97316;font-weight:600;letter-spacing:1px;">🌑 CHANDRA GRAHAN 2026</p>
    <h1 style="margin:0 0 16px;font-size:24px;line-height:1.35;color:#fff;font-family:Georgia,serif;">${POST.title}</h1>
    <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 20px;">
      નમસ્કાર <strong style="color:#fcd34d;">${firstName} જી 🙏</strong>,<br/>
      ચંદ્ર ગ્રહણ 2026 — આ ખગોળ-ઘટના ફક્ત આકાશ ની ઘટના નથી, <strong style="color:#f97316;">આ ભગવાનનો સ્પર્શ</strong> છે.
      ગ્રહણ-કાળ, સૂતક, 12 રાશિ ફળ અને ઉપાય — સૌ ઇ-મેઇલ ખોલ્યા ની ક્ષણ.
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
      <p style="margin:0;font-size:14px;line-height:1.75;color:#e5e7eb;font-style:italic;">"${POST.excerpt}"</p>
    </div>
    <div style="text-align:center;margin:0 0 28px;">
      <a href="${blogUrl}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#dc2626);color:#fff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:50px;letter-spacing:0.5px;">
        🌕 પૂરો Blog Post વાંચો
      </a>
    </div>
    <div style="text-align:center;margin:0 0 8px;">${tagPills}</div>
  </div>
  <div style="background:rgba(0,0,0,0.4);border-top:1px solid rgba(249,115,22,0.2);padding:24px 32px;text-align:center;">
    <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#f97316;">Katyaayani Astrologer</p>
    <p style="margin:0 0 14px;font-size:12px;color:#6b7280;font-style:italic;">"ગ્રહ બદલો, ભાગ્ય બદલો"</p>
    <p style="margin:0;font-size:11px;color:#4b5563;">
      <a href="${SITE_URL}/blog" style="color:#f97316;text-decoration:none;">Blog</a> &nbsp;|&nbsp;
      <a href="${SITE_URL}/services" style="color:#f97316;text-decoration:none;">Services</a> &nbsp;|&nbsp;
      <a href="${SITE_URL}/contact" style="color:#f97316;text-decoration:none;">Contact</a> &nbsp;|&nbsp;
      <a href="${unsubUrl}" style="color:#6b7280;text-decoration:none;">Unsubscribe</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

async function getAllEmails() {
  const emailMap = new Map();
  const { data: subs } = await supabase.from('newsletter_subscribers').select('email, first_name, last_name').eq('is_active', true).not('email', 'is', null);
  (subs || []).forEach(s => { if (s.email && !emailMap.has(s.email.toLowerCase())) emailMap.set(s.email.toLowerCase(), { email: s.email, name: [s.first_name, s.last_name].filter(Boolean).join(' ') }); });
  const { data: profiles } = await supabase.from('profiles').select('email, name').not('email', 'is', null);
  (profiles || []).forEach(p => { if (p.email && !emailMap.has(p.email.toLowerCase())) emailMap.set(p.email.toLowerCase(), { email: p.email, name: p.name || '' }); });
  return [...emailMap.values()];
}

async function main() {
  const contacts = await getAllEmails();
  console.log(`Total contacts: ${contacts.length}`);
  let sent = 0, failed = 0;
  for (const c of contacts) {
    try {
      await resend.emails.send({
        from: 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>',
        to: c.email,
        subject: 'ચંદ્ર ગ્રહણ 2026 — સૂતક, ઉપાય & 12 રાશિ ફળ | Katyaayani',
        html: buildEmail(c.name, c.email),
        headers: {
          'List-Unsubscribe': `<https://www.katyaayaniastrologer.com/unsubscribe?email=${encodeURIComponent(c.email)}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'Precedence': 'bulk',
          'X-Entity-Ref-ID': `grahan-2026-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      });
      console.log(`  SENT: ${c.email}`);
      sent++;
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {
      console.log(`  FAIL: ${c.email} — ${e.message}`);
      failed++;
    }
  }
  console.log(`Done. Sent: ${sent}, Failed: ${failed}`);
}

main();
