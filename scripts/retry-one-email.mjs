import { Resend } from 'resend';

const RESEND_API_KEY = 're_ZNV7bf4z_HFmbiLTrHuLGPitDdWuMdFsr';
const FROM_EMAIL = 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>';
const BASE_URL = 'https://www.katyaayaniastrologer.com';
const POST_URL = `${BASE_URL}/blog/holika-dahan-2026-shubh-muhurat-katha`;
const LOGO_URL = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/749cf92f-0c06-43d7-b795-4c90a58526eb/logo_withoutname-1770224400752.png';

const resend = new Resend(RESEND_API_KEY);

await new Promise(r => setTimeout(r, 2000));

const { data, error } = await resend.emails.send({
  from: FROM_EMAIL,
  to: 'devji004455@outlook.com',
  subject: '🔥 Holika Dahan 2026 – Shubh Muhurat & Sacred Katha',
  html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Holika Dahan 2026</title></head><body style="margin:0;padding:0;background:#0a0612;font-family:Georgia,serif;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#0a0612;">🔥 Holika Dahan 2026 | Shubh Muhurat: 6:43 PM & 11:00 PM | Sacred Story & Puja Vidhi — Read Now</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0a0612 0%,#1a0f2e 60%,#0a0612 100%);padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td align="center" style="padding-bottom:28px;">
    <a href="${BASE_URL}" style="text-decoration:none;">
      <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
        <td><img src="${LOGO_URL}" alt="Katyaayani" width="48" height="48" style="border-radius:50%;border:2px solid #ff6b35;display:block;"/></td>
        <td style="padding-left:12px;vertical-align:middle;">
          <span style="color:#ff6b35;font-size:17px;font-weight:700;letter-spacing:3px;display:block;">KATYAAYANI</span>
          <span style="color:#c9a87c;font-size:9px;letter-spacing:4px;display:block;margin-top:2px;">ASTROLOGER</span>
        </td>
      </tr></table>
    </a>
  </td></tr>
  <tr><td style="background:linear-gradient(145deg,#13091f,#0d0618);border-radius:24px;border:1px solid rgba(255,107,53,0.2);box-shadow:0 24px 60px rgba(0,0,0,0.6);">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 32px 16px;">
      <span style="display:inline-block;padding:7px 22px;background:rgba(255,152,0,0.13);border-radius:30px;color:#ff9800;font-size:11px;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(255,152,0,0.3);">🔥 New Blog Post</span>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px;">
      <a href="${POST_URL}"><img src="https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/holika-dahan-2026.jpg" alt="Holika Dahan 2026" width="100%" style="width:100%;border-radius:16px;display:block;"/></a>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:22px 32px 8px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;line-height:1.35;font-family:Georgia,serif;">Holika Dahan 2026: Shubh Muhurat, Katha and the Night of Triumph</h1>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0 32px 16px;">
      <span style="display:inline-block;padding:4px 16px;background:rgba(255,107,53,0.2);border-radius:20px;color:#ff6b35;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Festivals</span>
      &nbsp;<span style="color:#777;font-size:12px;">2nd March 2026</span>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 12px;">
      <p style="margin:0 0 8px;color:#e8dcc8;font-size:15px;">Namaste <strong style="color:#ff6b35;">Friend</strong>,</p>
      <p style="margin:0;color:#b8a896;font-size:14px;line-height:1.7;">Tonight the sacred fire rises. We've written a special article — the complete story, shubh muhurat, and puja vidhi for <strong style="color:#fff;">Holika Dahan 2026</strong>.</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,107,53,0.07);border-radius:12px;border-left:3px solid #ff6b35;"><tr><td style="padding:16px 18px;">
        <p style="margin:0;color:#d4c4b0;font-size:14px;line-height:1.75;font-style:italic;">"Holika Dahan falls on March 2, 2026. Discover the sacred muhurat timings (6:43 PM – 8:15 PM and 11:00 PM – 12:51 AM), the ancient story of Prahlad, and how to perform this ritual correctly."</p>
      </td></tr></table>
    </td></tr></table>
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
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:0 32px 20px;">
      <div style="font-size:12px;color:#888;margin-bottom:6px;">Related Topics:</div>
      <div>
        <a href="${BASE_URL}/blog?tag=holika+dahan" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#holika dahan</a>
        <a href="${BASE_URL}/blog?tag=holi+2026" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#holi 2026</a>
        <a href="${BASE_URL}/blog?tag=muhurat" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#muhurat</a>
        <a href="${BASE_URL}/blog?tag=festival" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#festival</a>
        <a href="${BASE_URL}/blog?tag=vedic+astrology" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.12);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#vedic astrology</a>
      </div>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 32px 36px;">
      <a href="${POST_URL}" style="display:inline-block;padding:15px 44px;background:linear-gradient(135deg,#ff6b35,#ff8c5a);color:#fff;text-decoration:none;border-radius:30px;font-weight:700;font-size:14px;letter-spacing:1px;text-transform:uppercase;box-shadow:0 10px 30px rgba(255,107,53,0.4);">Read Full Article &rarr;</a>
    </td></tr></table>
  </td></tr>
  <tr><td align="center" style="padding-top:28px;">
    <p style="color:#c9a87c;font-style:italic;font-size:13px;margin-bottom:12px;">"The stars impel, they do not compel."</p>
    <p style="color:#444;font-size:11px;margin:0;">© 2026 Katyaayani Astrologer | Rudram Joshi</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`,
});

if (error) {
  console.log('Failed:', error.message);
} else {
  console.log('✓ Sent to devji004455@outlook.com');
}
