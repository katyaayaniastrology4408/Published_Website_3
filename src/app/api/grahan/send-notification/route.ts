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
const FROM = process.env.RESEND_FROM_EMAIL || 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>';
const LOGO_URL = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/749cf92f-0c06-43d7-b795-4c90a58526eb/logo_withoutname-1770224400752.png';

function buildGrahanEmail(name: string, email: string): string {
  const firstName = (name || '').split(' ')[0] || 'Devotee';
  const unsubUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Chandra Grahan 2026 | Katyaayani Astrologer</title>
</head>
<body style="margin:0;padding:0;background:#0a0612;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:linear-gradient(160deg,#0a0612 0%,#120820 50%,#0a0612 100%);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1a0a2e,#2d1054);padding:28px 32px;text-align:center;border-bottom:2px solid rgba(249,115,22,0.4);">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 12px;">
      <tr>
        <td><img src="${LOGO_URL}" alt="Katyaayani Logo" width="48" height="48" style="display:block;border-radius:50%;border:2px solid #ff6b35;"/></td>
        <td style="padding-left:12px;">
          <span style="color:#ff6b35;font-size:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;display:block;">KATYAAYANI</span>
          <span style="color:#c9a87c;font-size:10px;letter-spacing:5px;text-transform:uppercase;display:block;margin-top:2px;">ASTROLOGER</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:3px;color:#f97316;text-transform:uppercase;font-weight:700;">🌑 CHANDRA GRAHAN ALERT</p>
    <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;font-family:Georgia,serif;line-height:1.3;">
      चंद्र ग्रहण 2026
    </h1>
    <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">साल का पहला चंद्र ग्रहण — 3 मार्च 2026</p>
  </div>

  <!-- Body -->
  <div style="padding:32px 32px 24px;">
    <!-- Greeting -->
    <p style="color:#d1d5db;font-size:16px;line-height:1.7;margin:0 0 20px;">
      नमस्कार <strong style="color:#fcd34d;">${firstName} जी 🙏</strong>,<br/>
      आज <strong style="color:#f97316;">3 मार्च 2026</strong> को साल का <strong>पहला चंद्र ग्रहण</strong> लग रहा है।
      यह <strong style="color:#fcd34d;">सिंह राशि</strong> में लगेगा और भारत में <strong>पूर्ण रूप से दिखाई देगा</strong>।
      आसमान में चांद <strong style="color:#ef4444;">लाल रंग (Blood Moon)</strong> का नजर आएगा!
    </p>

    <!-- Timing Box -->
    <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.3);border-radius:14px;padding:20px 24px;margin:0 0 24px;">
      <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#fcd34d;letter-spacing:1px;text-transform:uppercase;">🕐 ग्रहण का समय (IST)</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:7px 0;color:#d1d5db;font-size:14px;">🌑 ग्रहण प्रारंभ</td>
          <td style="padding:7px 0;color:#f97316;font-size:14px;font-weight:700;text-align:right;">दोपहर 3:20 बजे</td>
        </tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr>
          <td style="padding:7px 0;color:#d1d5db;font-size:14px;">🔴 खग्रास (पूर्ण) प्रारंभ</td>
          <td style="padding:7px 0;color:#ef4444;font-size:14px;font-weight:700;text-align:right;">शाम 4:34 बजे</td>
        </tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr>
          <td style="padding:7px 0;color:#d1d5db;font-size:14px;">🌕 ग्रहण मध्य</td>
          <td style="padding:7px 0;color:#fcd34d;font-size:14px;font-weight:700;text-align:right;">शाम 5:33 बजे</td>
        </tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr>
          <td style="padding:7px 0;color:#d1d5db;font-size:14px;">✅ ग्रहण समाप्त</td>
          <td style="padding:7px 0;color:#10b981;font-size:14px;font-weight:700;text-align:right;">शाम 6:47 बजे</td>
        </tr>
        <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.06);"></td></tr>
        <tr>
          <td style="padding:7px 0;color:#d1d5db;font-size:14px;">⚠️ सूतक काल प्रारंभ</td>
          <td style="padding:7px 0;color:#fb923c;font-size:14px;font-weight:700;text-align:right;">सुबह 6:20 बजे से</td>
        </tr>
      </table>
    </div>

    <!-- Sutak Alert -->
    <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:12px;padding:16px 20px;margin:0 0 20px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fca5a5;text-transform:uppercase;letter-spacing:1px;">⚠️ सूतक काल</p>
      <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.6;">
        सूतक काल सुबह 6:20 बजे से शुरू हो चुका है। इस दौरान कोई नया काम, पूजा-पाठ या यात्रा न करें।
      </p>
    </div>

    <!-- Do Not Do -->
    <div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px 22px;margin:0 0 24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#fcd34d;text-transform:uppercase;letter-spacing:1px;">🚫 ग्रहण में न करें</p>
      <ul style="margin:0;padding:0;list-style:none;">
        ${[
          'ग्रहण के समय सोने से बचें',
          'भोजन न करें',
          'रसोई का काम न करें',
          'पूजा-पाठ और शुभ कार्य शुरू न करें',
          'कोई नई वस्तु न खरीदें',
          'सिलाई-कढ़ाई या नुकीले औजारों का उपयोग न करें',
        ].map(item => `<li style="color:#d1d5db;font-size:13px;padding:4px 0;display:flex;align-items:flex-start;gap:8px;"><span style="color:#ef4444;font-weight:700;">✗</span> ${item}</li>`).join('')}
      </ul>
    </div>

    <!-- Gujarati Section -->
    <div style="background:rgba(249,115,22,0.06);border-left:3px solid #f97316;padding:16px 20px;border-radius:0 10px 10px 0;margin:0 0 24px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#f97316;text-transform:uppercase;letter-spacing:1px;">ગુજરાતી</p>
      <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.7;">
        આજે <strong style="color:#fcd34d;">3 માર્ચ 2026</strong> ના રોજ ચંદ્ર ગ્રહણ 
        <strong>બપોરે 3:20</strong> વાગ્યે શરૂ થઈ <strong>સાંજે 6:47</strong> સુધી ચાલશે.
        સૂતક કાળ <strong>સવારે 6:20</strong> થી. ગ્રહણ દરમ્યાન ભોજન, પૂજા, 
        મુસાફરી ટાળો.
      </p>
    </div>

    <!-- English Section -->
    <div style="background:rgba(16,185,129,0.06);border-left:3px solid #10b981;padding:16px 20px;border-radius:0 10px 10px 0;margin:0 0 28px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:1px;">English</p>
      <p style="margin:0;color:#d1d5db;font-size:14px;line-height:1.7;">
        Today's <strong style="color:#fcd34d;">Lunar Eclipse (Blood Moon)</strong> begins at <strong>3:20 PM</strong> and ends at <strong>6:47 PM</strong> IST.
        Sutak Kaal started from <strong>6:20 AM</strong>. Avoid eating, cooking, worship, and travel during the eclipse period.
        Visible across India, Asia, Australia & Americas.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:0 0 8px;">
      <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#dc2626);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:50px;">
        🌕 ज्योतिष परामर्श बुक करें
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:rgba(0,0,0,0.4);border-top:1px solid rgba(249,115,22,0.2);padding:20px 32px;text-align:center;">
    <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#f97316;">Katyaayani Astrologer</p>
    <p style="margin:0 0 12px;font-size:11px;color:#6b7280;font-style:italic;">"ग्रह बदलो, भाग्य बदलो"</p>
    <p style="margin:0;font-size:11px;color:#4b5563;">
      <a href="${SITE_URL}" style="color:#f97316;text-decoration:none;">Home</a> &nbsp;|&nbsp;
      <a href="${SITE_URL}/services" style="color:#f97316;text-decoration:none;">Services</a> &nbsp;|&nbsp;
      <a href="${SITE_URL}/booking" style="color:#f97316;text-decoration:none;">Book Now</a> &nbsp;|&nbsp;
      <a href="${unsubUrl}" style="color:#6b7280;text-decoration:none;">Unsubscribe</a>
    </p>
    <p style="margin:10px 0 0;font-size:10px;color:#374151;">
      यहां दी गई जानकारी ज्योतिष और सामान्य मान्यताओं पर आधारित है।
    </p>
  </div>
</div>
</body>
</html>`;
}

async function sendToAllUsers(): Promise<{ total: number; sent: number; failed: number }> {
  const emailMap = new Map<string, { email: string; name: string }>();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('email, name')
    .not('email', 'is', null);

  (profiles || []).forEach((p: any) => {
    const em = (p.email || '').toLowerCase().trim();
    if (em && em.includes('@') && !emailMap.has(em)) {
      emailMap.set(em, { email: p.email, name: p.name || '' });
    }
  });

  const { data: subs } = await supabase
    .from('newsletter_subscribers')
    .select('email, first_name, last_name')
    .eq('is_active', true)
    .not('email', 'is', null);

  (subs || []).forEach((s: any) => {
    const em = (s.email || '').toLowerCase().trim();
    if (em && em.includes('@') && !emailMap.has(em)) {
      const name = [s.first_name, s.last_name].filter(Boolean).join(' ').trim();
      emailMap.set(em, { email: s.email, name });
    }
  });

  const contacts = [...emailMap.values()];
  if (contacts.length === 0) return { total: 0, sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const c of contacts) {
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: c.email,
        subject: 'चंद्र ग्रहण 2026 🌑 आज शाम — ग्रहण समय, सूतक काल और उपाय | Katyaayani Astrologer',
        html: buildGrahanEmail(c.name, c.email),
        headers: {
          'List-Unsubscribe': `<${SITE_URL}/unsubscribe?email=${encodeURIComponent(c.email)}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'Precedence': 'bulk',
        },
      });
      if (error) { failed++; } else { sent++; }
    } catch {
      failed++;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  return { total: contacts.length, sent, failed };
}

export async function POST(req: Request) {
  try {
    const { secret } = await req.json().catch(() => ({}));
    if (secret && secret !== process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const result = await sendToAllUsers();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET for easy cron trigger
export async function GET() {
  try {
    const result = await sendToAllUsers();
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
