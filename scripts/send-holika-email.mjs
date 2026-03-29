import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = 'https://eochjxjoyibtjawzgauk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvY2hqeGpveWlidGphd3pnYXVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5MjUyNywiZXhwIjoyMDg1NzY4NTI3fQ.9uJ4vHwOZwBfDjzJmgOV6BbrhQi9f0B9CKCRAgjFbQc';
const RESEND_API_KEY = 're_ZNV7bf4z_HFmbiLTrHuLGPitDdWuMdFsr';
const BASE_URL = 'https://www.katyaayaniastrologer.com';
const FROM_EMAIL = 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>';
const LOGO_URL = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/749cf92f-0c06-43d7-b795-4c90a58526eb/logo_withoutname-1770224400752.png';

const POST = {
  title: 'Holika Dahan 2026: Shubh Muhurat, Katha and the Night of Triumph',
  slug: 'holika-dahan-2026-shubh-muhurat-katha',
  excerpt: 'Holika Dahan falls on March 2, 2026. Discover the sacred muhurat timings (6:43 PM – 8:15 PM and 11:00 PM – 12:51 AM), the ancient story of Prahlad, and how to perform this ritual correctly.',
  featured_image: 'https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/holika-dahan-2026.jpg',
  tags: ['holika dahan', 'holi 2026', 'muhurat', 'festival', 'vedic astrology'],
  category: 'festivals',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const resend = new Resend(RESEND_API_KEY);

// Collect all unique emails from all tables
async function getAllEmails() {
  const emailMap = new Map(); // email -> name

  const { data: subs } = await supabase
    .from('newsletter_subscribers')
    .select('email, name')
    .eq('is_active', true);
  (subs || []).forEach(r => {
    if (r.email) emailMap.set(r.email.toLowerCase().trim(), r.name || '');
  });

  const { data: profiles } = await supabase
    .from('profiles')
    .select('email, full_name');
  (profiles || []).forEach(r => {
    if (r.email && !emailMap.has(r.email.toLowerCase().trim()))
      emailMap.set(r.email.toLowerCase().trim(), r.full_name || '');
  });

  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('email, name');
  (enquiries || []).forEach(r => {
    if (r.email && !emailMap.has(r.email.toLowerCase().trim()))
      emailMap.set(r.email.toLowerCase().trim(), r.name || '');
  });

  const { data: bookings } = await supabase
    .from('bookings')
    .select('email, full_name');
  (bookings || []).forEach(r => {
    if (r.email && !emailMap.has(r.email.toLowerCase().trim()))
      emailMap.set(r.email.toLowerCase().trim(), r.full_name || '');
  });

  return Array.from(emailMap.entries()).map(([email, name]) => ({ email, name }));
}

function buildEmail(userName) {
  const postUrl = `${BASE_URL}/blog/${POST.slug}`;
  const firstName = (userName || '').split(' ')[0] || 'Friend';
  const tagLinks = POST.tags
    .map(t => `<a href="${BASE_URL}/blog?tag=${encodeURIComponent(t)}" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#${t}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${POST.title}</title>
</head>
<body style="margin:0;padding:0;background:#0a0612;font-family:Georgia,serif;">
<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#0a0612;">🔥 Holika Dahan 2026 | Shubh Muhurat: 6:43 PM &amp; 11:00 PM | Sacred Story &amp; Puja Vidhi — Read Now</div>

<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0a0612 0%,#1a0f2e 60%,#0a0612 100%);padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- LOGO HEADER -->
  <tr><td align="center" style="padding-bottom:28px;">
    <a href="${BASE_URL}" style="text-decoration:none;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
        <td><img src="${LOGO_URL}" alt="Katyaayani" width="48" height="48" style="border-radius:50%;border:2px solid #ff6b35;display:block;"/></td>
        <td style="padding-left:12px;vertical-align:middle;">
          <span style="color:#ff6b35;font-size:17px;font-weight:700;letter-spacing:3px;display:block;text-transform:uppercase;">Katyaayani</span>
          <span style="color:#c9a87c;font-size:9px;letter-spacing:4px;display:block;margin-top:2px;text-transform:uppercase;">Astrologer</span>
        </td>
      </tr></table>
    </a>
  </td></tr>

  <!-- MAIN CARD -->
  <tr><td style="background:linear-gradient(145deg,#13091f,#0d0618);border-radius:24px;border:1px solid rgba(255,107,53,0.2);box-shadow:0 24px 60px rgba(0,0,0,0.6);overflow:hidden;">

    <!-- BADGE -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 32px 16px;">
      <span style="display:inline-block;padding:7px 22px;background:rgba(255,152,0,0.13);border-radius:30px;color:#ff9800;font-size:11px;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(255,152,0,0.3);">🔥 New Blog Post</span>
    </td></tr></table>

    <!-- FEATURED IMAGE -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 0;">
      <a href="${postUrl}">
        <img src="${POST.featured_image}" alt="Holika Dahan 2026" width="100%" style="width:100%;max-width:536px;border-radius:16px;display:block;"/>
      </a>
    </td></tr></table>

    <!-- TITLE -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:22px 32px 8px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.35;font-family:Georgia,serif;">${POST.title}</h1>
    </td></tr></table>

    <!-- CATEGORY + DATE -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 32px 16px;">
      <span style="display:inline-block;padding:4px 16px;background:rgba(255,107,53,0.2);border-radius:20px;color:#ff6b35;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Festivals</span>
      &nbsp;
      <span style="color:#777;font-size:12px;">2nd March 2026</span>
    </td></tr></table>

    <!-- GREETING -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 12px;">
      <p style="margin:0 0 8px;color:#e8dcc8;font-size:15px;">Namaste <strong style="color:#ff6b35;">${firstName}</strong>,</p>
      <p style="margin:0;color:#b8a896;font-size:14px;line-height:1.7;">Tonight the sacred fire rises. We've written a special article for this auspicious occasion — the complete story, shubh muhurat, and puja vidhi for <strong style="color:#fff;">Holika Dahan 2026</strong>.</p>
    </td></tr></table>

    <!-- EXCERPT BLOCK -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,107,53,0.07);border-radius:12px;border-left:3px solid #ff6b35;"><tr><td style="padding:16px 18px;">
        <p style="margin:0;color:#d4c4b0;font-size:14px;line-height:1.75;font-style:italic;">"${POST.excerpt}"</p>
      </td></tr></table>
    </td></tr></table>

    <!-- MUHURAT QUICK PREVIEW -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:14px;border:1px solid rgba(255,152,0,0.2);overflow:hidden;">
        <tr style="background:rgba(255,152,0,0.1);">
          <td align="center" style="padding:14px 16px;border-right:1px solid rgba(255,152,0,0.15);">
            <div style="font-size:11px;color:#ff9800;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">🔥 Muhurat 1</div>
            <div style="color:#fff;font-size:18px;font-weight:700;">6:43 – 8:15 PM</div>
            <div style="color:#999;font-size:11px;margin-top:2px;">Pradosh Kaal</div>
          </td>
          <td align="center" style="padding:14px 16px;">
            <div style="font-size:11px;color:#c9a87c;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">🌙 Muhurat 2</div>
            <div style="color:#fff;font-size:18px;font-weight:700;">11:00 – 12:51 AM</div>
            <div style="color:#999;font-size:11px;margin-top:2px;">Night Muhurat</div>
          </td>
        </tr>
      </table>
    </td></tr></table>

    <!-- TAGS -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 20px;">
      <div style="font-size:12px;color:#888;margin-bottom:6px;">Related Topics:</div>
      <div>${tagLinks}</div>
    </td></tr></table>

    <!-- CTA BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 32px 36px;">
      <a href="${postUrl}" style="display:inline-block;padding:15px 44px;background:linear-gradient(135deg,#ff6b35,#ff8c5a);color:#fff;text-decoration:none;border-radius:30px;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;box-shadow:0 10px 30px rgba(255,107,53,0.4);">
        Read Full Article &rarr;
      </a>
      <p style="color:#555;font-size:12px;margin-top:10px;">Or copy this link: <a href="${postUrl}" style="color:#c9a87c;word-break:break-all;">${postUrl}</a></p>
    </td></tr></table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td align="center" style="padding-top:28px;">
    <p style="color:#c9a87c;font-style:italic;font-size:13px;margin-bottom:12px;">"The stars impel, they do not compel."</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;"><tr>
      <td style="padding:0 10px;"><a href="${BASE_URL}" style="color:#888;font-size:12px;text-decoration:none;">Home</a></td>
      <td style="color:#444;font-size:12px;">|</td>
      <td style="padding:0 10px;"><a href="${BASE_URL}/blog" style="color:#888;font-size:12px;text-decoration:none;">Blog</a></td>
      <td style="color:#444;font-size:12px;">|</td>
      <td style="padding:0 10px;"><a href="${BASE_URL}/contact" style="color:#888;font-size:12px;text-decoration:none;">Contact</a></td>
    </tr></table>
    <p style="color:#444;font-size:11px;margin:0;">© 2026 Katyaayani Astrologer &nbsp;|&nbsp; Rudram Joshi</p>
    <p style="color:#333;font-size:10px;margin-top:8px;">You received this because you subscribed or enquired on our website.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function main() {
  console.log('Fetching all subscribers...');
  const recipients = await getAllEmails();
  console.log(`Total unique emails: ${recipients.length}`);

  let sent = 0, failed = 0;
  const errors = [];

  for (const { email, name } of recipients) {
    try {
      const html = buildEmail(name);
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `🔥 Holika Dahan 2026 – Shubh Muhurat & Sacred Katha`,
        html,
        headers: {
          'List-Unsubscribe': `<${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}>`,
        },
      });

      if (error) {
        failed++;
        errors.push({ email, error: error.message });
        console.log(`✗ ${email} — ${error.message}`);
      } else {
        sent++;
        console.log(`✓ ${email} (${name || 'no name'})`);
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 120));
    } catch (err) {
      failed++;
      errors.push({ email, error: err.message });
      console.log(`✗ ${email} — ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`✅ Sent: ${sent}`);
  console.log(`❌ Failed: ${failed}`);
  if (errors.length > 0) {
    console.log('\nFailed emails:');
    errors.forEach(e => console.log(`  ${e.email}: ${e.error}`));
  }
  console.log('========================================');
}

main();
