import https from 'https';

const RESEND_API_KEY = 're_ZNV7bf4z_HFmbiLTrHuLGPitDdWuMdFsr';
const AUDIENCE_ID = 'e6bafd8b-5149-4862-a298-e23bd5578190';
const BASE_URL = 'https://www.katyaayaniastrologer.com';
const BLOG_URL = `${BASE_URL}/blog/holika-dahan-2026-shubh-muhurat-katha`;
const FEATURED_IMAGE = 'https://eochjxjoyibtjawzgauk.supabase.co/storage/v1/object/public/blog-images/holika-dahan-2026.jpg';
const LOGO_URL = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/749cf92f-0c06-43d7-b795-4c90a58526eb/logo_withoutname-1770224400752.png';

function resendRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.resend.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const allContacts = [
  { email: 'rudramjoshi2009@gmail.com', firstName: 'Rudram' },
  { email: 'aayushraj3505@gmail.com', firstName: 'Aayush' },
  { email: 'abhipanchal693@gmail.com', firstName: 'Abhi' },
  { email: 'rudramjoshi.r@gmail.com', firstName: 'Rudram' },
  { email: 'aarvithakkar161@gmail.com', firstName: 'Aarvi' },
  { email: 'anshcr2009@gmail.com', firstName: 'Ansh' },
  { email: 'shreechamundaxerox.1011@gmail.com', firstName: 'Jay' },
  { email: 'netra250707@gmail.com', firstName: 'Netra' },
  { email: 'thakorjimobile2024@gmail.com', firstName: 'Mehul' },
  { email: 'jayambeprint53@gmail.com', firstName: 'Jay' },
  { email: 'apurvrajsinhsolanki@gmail.com', firstName: 'Apurvrajsinh' },
  { email: 'aryanpatel20081202@gmail.com', firstName: 'Aryan' },
  { email: 'comediandancer039@gmail.com', firstName: 'Dev' },
  { email: 'dhruvsardhara08@gmail.com', firstName: 'Dhruv' },
  { email: 'fenibhanderi@gmail.com', firstName: 'Feni' },
  { email: 'gujcet2025@gmail.com', firstName: 'Neel' },
  { email: 'ibrahimhajuri07@gmail.com', firstName: 'Ibrahim' },
  { email: 'jainam2582007@gmail.com', firstName: 'Jainam' },
  { email: 'nisargshah013@gmail.com', firstName: 'Nisarg' },
  { email: 'panchaljagdishbhai825@gmail.com', firstName: 'Sahil' },
  { email: 'pareshmali262637@gmail.com', firstName: 'Jenil' },
  { email: 'parthpanchal0258@gmail.com', firstName: 'Parth' },
  { email: 'pateljoy895@gmail.com', firstName: 'Joy' },
  { email: 'patelricha810@gmail.com', firstName: 'Richa' },
  { email: 'patelsmit3082007@gmail.com', firstName: 'Smit' },
  { email: 'pritija776@gmail.com', firstName: 'Anirudh' },
  { email: 'rudramjoshi44@gmail.com', firstName: 'Manojbhai' },
  { email: 'rudraz0612@gmail.com', firstName: 'Rudra' },
  { email: 'shrimalijainam@gmail.com', firstName: 'Jainam' },
  { email: 'tnaran222@gmail.com', firstName: 'Yuvraj' },
  { email: 'xitijprajapati18@gmail.com', firstName: 'Kshitij' },
  { email: 'yogisales@gmail.com', firstName: 'Vijay' },
  { email: 'katyaayaniastrologer01@gmail.com', firstName: 'Admin' },
  { email: 'devji004455@outlook.com', firstName: 'Rudram' },
];

function buildEmailHtml(firstName) {
  const unsubUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(firstName)}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Holika Dahan 2026 – Shubh Muhurat & Sacred Katha</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0612;font-family:Georgia,'Times New Roman',serif;">

<!-- Preheader (hidden inbox preview text) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#0a0612;line-height:1px;">🔥 Holika Dahan 2026 – Shubh Muhurat 6:43 PM &amp; 11:00 PM | Puri Katha &amp; Puja Vidhi | Katyaayani Astrologer</div>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(180deg,#0a0612 0%,#1a0f2e 50%,#0a0612 100%);padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- LOGO HEADER -->
  <tr><td align="center" style="padding-bottom:28px;">
    <a href="${BASE_URL}" style="text-decoration:none;">
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="vertical-align:middle;">
            <img src="${LOGO_URL}" alt="Katyaayani" width="50" height="50" style="display:block;border-radius:50%;border:2px solid #ff6b35;"/>
          </td>
          <td style="padding-left:12px;vertical-align:middle;">
            <span style="color:#ff6b35;font-size:18px;font-weight:700;letter-spacing:3px;display:block;text-transform:uppercase;">KATYAAYANI</span>
            <span style="color:#c9a87c;font-size:9px;letter-spacing:5px;display:block;margin-top:2px;text-transform:uppercase;">ASTROLOGER</span>
          </td>
        </tr>
      </table>
    </a>
  </td></tr>

  <!-- MAIN CARD -->
  <tr><td style="background:linear-gradient(145deg,#12081f 0%,#0d0618 100%);border-radius:24px;border:1px solid rgba(255,107,53,0.2);box-shadow:0 20px 60px rgba(0,0,0,0.6);overflow:hidden;">

    <!-- BADGE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:32px 28px 16px;">
        <span style="display:inline-block;padding:7px 22px;background:rgba(255,107,53,0.12);border-radius:30px;color:#ff6b35;font-size:11px;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(255,107,53,0.3);">🔥 New Blog Post</span>
      </td></tr>
    </table>

    <!-- FEATURED IMAGE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:0 28px 0;">
        <a href="${BLOG_URL}" style="text-decoration:none;display:block;">
          <img src="${FEATURED_IMAGE}" alt="Holika Dahan 2026" width="100%" style="width:100%;border-radius:16px;display:block;"/>
        </a>
      </td></tr>
    </table>

    <!-- TITLE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:22px 28px 6px;">
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.35;font-family:Georgia,serif;">Holika Dahan 2026: Shubh Muhurat, Katha &amp; Puja Vidhi</h1>
      </td></tr>
    </table>

    <!-- DATE + CATEGORY -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:0 28px 18px;">
        <span style="display:inline-block;padding:4px 14px;background:rgba(255,107,53,0.18);border-radius:20px;color:#ff6b35;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Festivals</span>
        &nbsp;
        <span style="color:#777;font-size:12px;">2 March 2026</span>
      </td></tr>
    </table>

    <!-- GREETING -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:0 28px 12px;">
        <p style="margin:0 0 10px;color:#e8dcc8;font-size:16px;">🙏 Jai Mata Di, <strong style="color:#ff6b35;">${firstName}</strong>!</p>
        <p style="margin:0;color:#b8a896;font-size:14px;line-height:1.75;">
          Holika Dahan 2026 <strong style="color:#fff;">2 March (Monday)</strong> na roj aave che. Aaj amaro ek vishesh lekh tamara maate taiyaar che — pavitra katha, shubh muhurat ane puri puja vidhi ekatrit kareli che.
        </p>
      </td></tr>
    </table>

    <!-- MUHURAT CARDS -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:8px 28px 20px;">
        <p style="margin:0 0 12px;color:#c9a87c;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">✨ Shubh Muhurat</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:14px;border:1px solid rgba(255,107,53,0.25);overflow:hidden;">
          <tr>
            <td width="50%" align="center" style="padding:18px 12px;background:rgba(255,107,53,0.08);border-right:1px solid rgba(255,107,53,0.15);">
              <div style="font-size:11px;color:#ff6b35;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">🔥 Pradosh Kaal</div>
              <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">6:43 – 8:15 PM</div>
              <div style="color:#888;font-size:11px;margin-top:4px;">2 March 2026</div>
            </td>
            <td width="50%" align="center" style="padding:18px 12px;background:rgba(201,168,124,0.06);">
              <div style="font-size:11px;color:#c9a87c;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">🌙 Ratri Muhurat</div>
              <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">11:00 – 12:51 AM</div>
              <div style="color:#888;font-size:11px;margin-top:4px;">2/3 March 2026</div>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- EXCERPT QUOTE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:0 28px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,107,53,0.07);border-radius:12px;border-left:3px solid #ff6b35;">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0;color:#d4c4b0;font-size:14px;line-height:1.8;font-style:italic;">
              "Holika Dahan falls on March 2, 2026. Discover the sacred muhurat timings, the ancient story of Prahlad and Holika, step-by-step puja vidhi, and why this night of fire is the triumph of devotion over evil."
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <!-- HASHTAGS -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:0 28px 20px;">
        <a href="${BASE_URL}/blog?tag=holika+dahan" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.1);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#HolikaDahan2026</a>
        <a href="${BASE_URL}/blog?tag=holi+2026" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.1);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#Holi2026</a>
        <a href="${BASE_URL}/blog?tag=muhurat" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.1);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#ShubhMuhurat</a>
        <a href="${BASE_URL}/blog?tag=festival" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.1);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#KatyaayaniAstrologer</a>
        <a href="${BASE_URL}/blog?tag=vedic+astrology" style="display:inline-block;padding:5px 14px;margin:3px;background:rgba(255,152,0,0.1);border-radius:20px;color:#ff9800;text-decoration:none;font-size:12px;border:1px solid rgba(255,152,0,0.25);">#VedicAstrology</a>
      </td></tr>
    </table>

    <!-- CTA BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:8px 28px 36px;">
        <a href="${BLOG_URL}" style="display:inline-block;padding:15px 44px;background:linear-gradient(135deg,#ff6b35,#ff8c5a);color:#ffffff;text-decoration:none;border-radius:30px;font-weight:700;font-size:15px;letter-spacing:1px;box-shadow:0 10px 30px rgba(255,107,53,0.4);">
          🔥 Puri Blog Post Vaancho &rarr;
        </a>
        <p style="color:#555;font-size:11px;margin-top:10px;">
          Or visit: <a href="${BLOG_URL}" style="color:#c9a87c;text-decoration:none;">${BLOG_URL}</a>
        </p>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td align="center" style="padding-top:28px;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;">
      <tr>
        <td style="vertical-align:middle;">
          <img src="${LOGO_URL}" alt="Katyaayani" width="36" height="36" style="display:block;border-radius:50%;border:2px solid #ff6b35;"/>
        </td>
        <td style="padding-left:10px;vertical-align:middle;">
          <span style="color:#ff6b35;font-size:14px;font-weight:700;letter-spacing:2px;display:block;">KATYAAYANI</span>
          <span style="color:#c9a87c;font-size:8px;letter-spacing:4px;display:block;margin-top:1px;text-transform:uppercase;">Astrologer</span>
        </td>
      </tr>
    </table>

    <p style="color:#c9a87c;font-style:italic;font-size:13px;margin-bottom:14px;">"The stars impel, they do not compel."</p>

    <!-- Nav links -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;">
      <tr>
        <td style="padding:0 10px;"><a href="${BASE_URL}" style="color:#888;font-size:12px;text-decoration:none;">Home</a></td>
        <td style="color:#444;font-size:12px;">|</td>
        <td style="padding:0 10px;"><a href="${BASE_URL}/blog" style="color:#888;font-size:12px;text-decoration:none;">Blog</a></td>
        <td style="color:#444;font-size:12px;">|</td>
        <td style="padding:0 10px;"><a href="${BASE_URL}/booking" style="color:#888;font-size:12px;text-decoration:none;">Book Now</a></td>
        <td style="color:#444;font-size:12px;">|</td>
        <td style="padding:0 10px;"><a href="${BASE_URL}/contact" style="color:#888;font-size:12px;text-decoration:none;">Contact</a></td>
      </tr>
    </table>

    <!-- Divider -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
      <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,107,53,0.3),transparent);"></td></tr>
    </table>

    <p style="color:#555;font-size:11px;margin:0 0 6px;">&copy; 2026 <strong style="color:#ff6b35;">Katyaayani Astrologer</strong>. All rights reserved.</p>
    <p style="color:#444;font-size:10px;margin:0 0 6px;">You received this email as a registered user of Katyaayani Astrologer.</p>
      <p style="color:#333;font-size:10px;margin:0 0 5px;">
        <a href="https://wa.me/919824929588" style="color:#c9a87c;text-decoration:none;">📞 +91 98249 29588</a>
        &nbsp;|&nbsp;
        <a href="mailto:katyaayaniastrologer01@gmail.com" style="color:#c9a87c;text-decoration:none;">✉️ katyaayaniastrologer01@gmail.com</a>
      </p>
      <p style="color:#333;font-size:10px;margin:0;">
        <a href="https://www.katyaayaniastrologer.com" style="color:#c9a87c;text-decoration:none;">🌐 www.katyaayaniastrologer.com</a>
        &nbsp;|&nbsp;
        <a href="https://www.instagram.com/katyaayani_astrologer" style="color:#c9a87c;text-decoration:none;">📸 @katyaayani_astrologer</a>
      </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function addToAudience(contact) {
  const res = await resendRequest('POST', `/audiences/${AUDIENCE_ID}/contacts`, {
    email: contact.email,
    first_name: contact.firstName,
    unsubscribed: false,
  });
  return res;
}

async function sendEmail(contact) {
  const html = buildEmailHtml(contact.firstName);
  const res = await resendRequest('POST', '/emails', {
    from: 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>',
    to: [contact.email],
    subject: 'Holika Dahan 2026 – Shubh Muhurat 6:43 PM & 11:00 PM | Puri Katha',
    html,
    headers: {
      // These headers help land in Primary instead of Promotions
      'Precedence': 'bulk',
      'X-Entity-Ref-ID': `holika-dahan-2026-${contact.email}`,
      'List-Unsubscribe': `<https://www.katyaayaniastrologer.com/unsubscribe?email=${encodeURIComponent(contact.email)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
  return res;
}

async function main() {
  console.log(`\n📋 Total contacts: ${allContacts.length}`);
  console.log('━'.repeat(50));

  let addedCount = 0, emailSent = 0, failed = 0;

  for (const contact of allContacts) {
    // Step 1: Add to Resend audience
    try {
      const addRes = await addToAudience(contact);
      if (addRes.status === 200 || addRes.status === 201) {
        addedCount++;
        process.stdout.write(`✅ Added to audience: ${contact.email}\n`);
      } else {
        process.stdout.write(`⚠️  Audience (${addRes.status}): ${contact.email}\n`);
      }
    } catch (e) {
      process.stdout.write(`❌ Audience error: ${contact.email} – ${e.message}\n`);
    }

    await sleep(200);

    // Step 2: Send email
    try {
      const mailRes = await sendEmail(contact);
      if (mailRes.status === 200 || mailRes.status === 201) {
        emailSent++;
        process.stdout.write(`📧 Email sent: ${contact.email}\n`);
      } else {
        failed++;
        process.stdout.write(`❌ Email failed (${mailRes.status}): ${contact.email} – ${JSON.stringify(mailRes.body)}\n`);
      }
    } catch (e) {
      failed++;
      process.stdout.write(`❌ Email error: ${contact.email} – ${e.message}\n`);
    }

    await sleep(350);
    console.log('─'.repeat(50));
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Added to Resend Audience: ${addedCount}/${allContacts.length}`);
  console.log(`📧 Emails Sent: ${emailSent}/${allContacts.length}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('═'.repeat(50) + '\n');
}

main().catch(console.error);
