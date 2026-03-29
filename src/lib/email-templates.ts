// Logo URL - hosted on Supabase storage
const LOGO_URL = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/749cf92f-0c06-43d7-b795-4c90a58526eb/logo_withoutname-1770224400752.png';
const BASE_URL = 'https://www.katyaayaniastrologer.com';
const CURRENT_YEAR = new Date().getFullYear();

// Base template wrapper with consistent branding
const baseTemplate = (content: string, userName: string = 'Seeker', preheader?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Katyaayani Astrologer</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Times New Roman', serif; background-color: #0a0612;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(180deg, #0a0612 0%, #1a0f2e 50%, #0a0612 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <a href="${BASE_URL}" style="text-decoration: none;">
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="vertical-align: middle;">
                      <img src="${LOGO_URL}" alt="Katyaayani Logo" width="55" height="55" style="display: block; border-radius: 50%; border: 2px solid #ff6b35;" />
                    </td>
                    <td style="padding-left: 15px; vertical-align: middle;">
                      <span style="color: #ff6b35; font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; display: block;">KATYAAYANI</span>
                      <span style="color: #c9a87c; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; display: block; margin-top: 2px;">ASTROLOGER</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          
          <!-- Main Content Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(145deg, #12081f 0%, #0d0618 100%); border-radius: 24px; border: 1px solid rgba(255, 107, 53, 0.2); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                ${content}
              </table>
            </td>
          </tr>
          
            <!-- Footer -->
            <tr>
              <td style="padding-top: 35px; text-align: center;">
                <!-- Logo in Footer -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px;">
                  <tr>
                    <td style="vertical-align: middle;">
                      <img src="${LOGO_URL}" alt="Katyaayani Logo" width="40" height="40" style="display: block; border-radius: 50%; border: 2px solid #ff6b35;" />
                    </td>
                    <td style="padding-left: 12px; vertical-align: middle;">
                      <span style="color: #ff6b35; font-size: 16px; font-weight: 700; letter-spacing: 2px; display: block;">KATYAAYANI</span>
                      <span style="color: #c9a87c; font-size: 9px; letter-spacing: 4px; text-transform: uppercase; display: block; margin-top: 2px;">ASTROLOGER</span>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #c9a87c; font-style: italic; font-size: 14px; margin-bottom: 20px;">"The stars impel, they do not compel."</p>
                
                <!-- Contact Info -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 15px;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="color: #e8dcc8; font-size: 13px; margin: 0 0 6px;">
                        <a href="tel:+919824929588" style="color: #e8dcc8; text-decoration: none;">+91 98249 29588</a>
                      </p>
                      <p style="color: #b8a896; font-size: 12px; margin: 0 0 6px;">
                        <a href="mailto:katyaayaniastrologer01@gmail.com" style="color: #b8a896; text-decoration: none;">katyaayaniastrologer01@gmail.com</a>
                      </p>
                      <p style="margin: 8px 0 0;">
                        <a href="https://wa.me/919824929588?text=Hello! I would like to know about online astrology consultation." style="display: inline-block; padding: 6px 16px; background: rgba(37, 211, 102, 0.15); border-radius: 20px; color: #25d366; font-size: 11px; text-decoration: none; border: 1px solid rgba(37, 211, 102, 0.3); letter-spacing: 1px;">Chat on WhatsApp</a>
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Navigation Links -->
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px;">
                  <tr>
                    <td style="padding: 0 10px;"><a href="${BASE_URL}" style="color: #888; font-size: 12px; text-decoration: none;">Home</a></td>
                    <td style="color: #444;">|</td>
                    <td style="padding: 0 10px;"><a href="${BASE_URL}/services" style="color: #888; font-size: 12px; text-decoration: none;">Services</a></td>
                    <td style="color: #444;">|</td>
                    <td style="padding: 0 10px;"><a href="${BASE_URL}/booking" style="color: #888; font-size: 12px; text-decoration: none;">Book Now</a></td>
                    <td style="color: #444;">|</td>
                    <td style="padding: 0 10px;"><a href="${BASE_URL}/blog" style="color: #888; font-size: 12px; text-decoration: none;">Blog</a></td>
                    <td style="color: #444;">|</td>
                    <td style="padding: 0 10px;"><a href="${BASE_URL}/about" style="color: #888; font-size: 12px; text-decoration: none;">About</a></td>
                  </tr>
                </table>
                
                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                  <tr>
                    <td style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255, 107, 53, 0.3) 50%, transparent 100%);"></td>
                  </tr>
                </table>
                
                <!-- Copyright -->
                <p style="color: #666; font-size: 11px; margin-bottom: 8px;">
                  &copy; ${CURRENT_YEAR} <strong style="color: #ff6b35;">Katyaayani Astrologer</strong>. All rights reserved.
                </p>
                <p style="color: #555; font-size: 10px; margin-bottom: 5px;">
                  This email was sent to <span style="color: #c9a87c;">${userName}</span> as a registered user of Katyaayani Astrologer.
                </p>
                <p style="color: #444; font-size: 10px;">
                  <a href="${BASE_URL}" style="color: #ff6b35; text-decoration: none;">www.katyaayaniastrologer.com</a>
                </p>
              </td>
            </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// OTP Email Template (for Signup & Login)
export const otpEmailTemplate = (otp: string, name: string = 'Seeker', type: 'signup' | 'login' = 'signup') => {
  const isSignup = type === 'signup';
  const title = isSignup ? 'Verify Your Email' : 'Login Verification';
  const message = isSignup 
    ? 'To begin your journey into the celestial wisdom of the stars, please use the verification code below to complete your registration.'
    : 'Someone is trying to access your account. Use this verification code to confirm your identity and complete the login.';

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(255, 107, 53, 0.15); border-radius: 30px; color: #ff6b35; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(255, 107, 53, 0.3);">
                ${isSignup ? '✨ Email Verification' : '🔐 Security Code'}
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0;">${title}</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">${message}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); border-radius: 16px; padding: 25px 40px; display: inline-block; box-shadow: 0 10px 40px rgba(255, 107, 53, 0.3);">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 35px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 15px 20px;">
          <tr>
            <td style="text-align: center; padding: 15px;">
              <p style="color: #888; font-size: 13px; margin: 0;">⏱️ This code expires in <strong style="color: #ff6b35;">10 minutes</strong></p>
              <p style="color: #666; font-size: 12px; margin-top: 8px;">If you didn't request this, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, `Your verification code is ${otp}`);
};

// Welcome Email Template
export const welcomeEmailTemplate = (name: string = 'Divine Soul', email?: string) => {
  const credentialsBlock = (email) ? `
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 107, 53, 0.08); border-radius: 16px; border: 1px solid rgba(255, 107, 53, 0.25);">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #ff6b35; font-size: 14px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Your Account Details:</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Registered Email</span>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #fff; font-size: 14px; font-weight: 600;">${email}</span>
                  </td>
                </tr>
              </table>
              <p style="color: #666; font-size: 11px; margin-top: 15px; text-align: center;">You can use this email to log in to your account anytime. For security, we never send passwords in emails.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : '';

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(139, 92, 246, 0.15); border-radius: 30px; color: #a78bfa; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(139, 92, 246, 0.3);">
                ✨ Welcome to the Cosmos
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 600; margin: 0;">Welcome, ${name}!</h1>
              <p style="color: #c9a87c; font-size: 16px; margin-top: 10px; font-style: italic;">Your cosmic journey begins now</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; line-height: 1.8;">
          We are truly honored to welcome you to the <strong style="color: #ff6b35;">Katyaayani Astrologer</strong> family. Today marks a new beginning in your karmic journey.
        </p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.8; margin-top: 15px;">
          Through the ancient wisdom of Vedic astrology, you will receive personalized guidance for your life path, career, relationships, health, and spiritual growth.
        </p>
      </td>
    </tr>
    ${credentialsBlock}
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 107, 53, 0.08); border-radius: 16px; border: 1px solid rgba(255, 107, 53, 0.15);">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #ff6b35; font-size: 16px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">What awaits you:</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="padding: 8px 0; color: #d4c4b0; font-size: 14px;">🌟 Personalized birth chart analysis</td></tr>
                <tr><td style="padding: 8px 0; color: #d4c4b0; font-size: 14px;">💫 One-on-one consultations with expert astrologers</td></tr>
                <tr><td style="padding: 8px 0; color: #d4c4b0; font-size: 14px;">🔮 Remedies and guidance for life challenges</td></tr>
                <tr><td style="padding: 8px 0; color: #d4c4b0; font-size: 14px;">📿 Spiritual insights for your soul's journey</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Explore Your Journey
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 15px;">Start your journey by exploring your personalized profile</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, `Welcome to Katyaayani Astrologer, ${name}!`);
};

// Enquiry Confirmation Email Template
export const enquiryConfirmationTemplate = (name: string, subject: string, message: string) => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(34, 197, 94, 0.15); border-radius: 30px; color: #22c55e; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(34, 197, 94, 0.3);">
                ✅ Enquiry Received
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">We've Received Your Message</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          Thank you for reaching out to Katyaayani Astrologer. We have received your cosmic enquiry and our astrologer will connect with you shortly.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; border-left: 4px solid #ff6b35;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #ff6b35; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">📌 Subject</p>
              <p style="color: #e8dcc8; font-size: 15px; margin-bottom: 15px;">${subject || 'General Consultation'}</p>
              <p style="color: #ff6b35; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">💬 Your Message</p>
              <p style="color: #b8a896; font-size: 14px; font-style: italic; line-height: 1.6;">"${message}"</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px;">
        <p style="color: #888; font-size: 13px; text-align: center;">
          We typically respond within <strong style="color: #ff6b35;">24-48 hours</strong>. In the meantime, feel free to explore our services.
        </p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, `Thank you for your enquiry, ${name}!`);
};

// Admin Enquiry Notification Template
export const adminEnquiryNotificationTemplate = (name: string, email: string, phone: string, subject: string, message: string) => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(59, 130, 246, 0.15); border-radius: 30px; color: #3b82f6; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(59, 130, 246, 0.3);">
                🌌 New Enquiry Alert
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0;">New Cosmic Enquiry Received</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Name</span><br>
                    <span style="color: #e8dcc8; font-size: 15px; font-weight: 600;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Email</span><br>
                    <a href="mailto:${email}" style="color: #ff6b35; font-size: 15px; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Phone</span><br>
                    <span style="color: #e8dcc8; font-size: 15px;">${phone || 'Not provided'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Subject</span><br>
                    <span style="color: #e8dcc8; font-size: 15px;">${subject || 'General Enquiry'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Message</span><br>
                    <span style="color: #b8a896; font-size: 14px; line-height: 1.6;">${message}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px 40px; text-align: center;">
        <p style="color: #666; font-size: 12px;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, 'Admin');
};

// Forgot Password Request Template
export const forgotPasswordRequestTemplate = (name: string = 'Seeker', email: string) => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(251, 191, 36, 0.15); border-radius: 30px; color: #fbbf24; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(251, 191, 36, 0.3);">
                🔑 Password Reset Request
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Request Received</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          We have received your password reset request for the account associated with <strong style="color: #fbbf24;">${email}</strong>.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(251, 191, 36, 0.08); border-radius: 12px; border: 1px solid rgba(251, 191, 36, 0.2);">
          <tr>
            <td style="padding: 20px; text-align: center;">
                <p style="color: #fbbf24; font-size: 14px; margin: 0;">⏳ Our team is reviewing your request</p>
                <p style="color: #b8a896; font-size: 13px; margin-top: 10px;">You will receive another email with a reset link or further instructions within 24 hours.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px;">
        <p style="color: #888; font-size: 13px; text-align: center;">
          If you did not request this, please contact us immediately at<br>
          <a href="mailto:katyaayaniastrologer01@gmail.com" style="color: #ff6b35; text-decoration: none;">katyaayaniastrologer01@gmail.com</a>
        </p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, 'Password reset request received');
};

// Password Reset Complete Template
export const passwordResetCompleteTemplate = (name: string = 'Seeker') => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(34, 197, 94, 0.15); border-radius: 30px; color: #22c55e; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(34, 197, 94, 0.3);">
                ✅ Password Reset Successful
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Password Has Been Reset</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          Your account password has been successfully reset by our support team. You can now log in to your account using your new password.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(34, 197, 94, 0.08); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="color: #22c55e; font-size: 14px; margin: 0; font-weight: 600;">✅ Your password has been updated</p>
              <p style="color: #b8a896; font-size: 13px; margin-top: 10px; line-height: 1.6;">
                Our team has shared your new password with you separately. Please use it to login and change it immediately from your profile settings for security.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 35px 15px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(239, 68, 68, 0.08); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
          <tr>
            <td style="padding: 15px 20px; text-align: center;">
              <p style="color: #ef4444; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Important Security Notice</p>
              <p style="color: #b8a896; font-size: 12px; margin-top: 5px;">If you did not request a password reset, please contact us immediately.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Login Now
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 15px;">After logging in, please update your password from Profile → Settings</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, 'Your password has been reset');
};

// Login Notification Template
export const loginNotificationTemplate = (name: string = 'Seeker') => {
  const currentTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(59, 130, 246, 0.15); border-radius: 30px; color: #3b82f6; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(59, 130, 246, 0.3);">
                🔐 Security Alert
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">New Login Detected</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          Your account was just accessed. If this was you, no action is needed.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(59, 130, 246, 0.08); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2);">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px;">🕒 Time</span><br>
                    <span style="color: #e8dcc8; font-size: 14px;">${currentTime} (IST)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px;">📍 Location</span><br>
                    <span style="color: #e8dcc8; font-size: 14px;">India (Detected)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px;">✅ Status</span><br>
                    <span style="color: #22c55e; font-size: 14px; font-weight: 600;">Successful Login</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 15px;">
        <p style="color: #b8a896; font-size: 14px; text-align: center;">
          If you don't recognize this activity, please change your password immediately.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/profile" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Secure My Account
        </a>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, 'New login to your account');
};

// Reschedule Notification Template
export const rescheduleNotificationTemplate = (booking: { full_name?: string; name?: string; booking_date: string; booking_time: string; service_type?: string }) => {
  const name = booking.full_name || booking.name || 'Seeker';
  
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(251, 191, 36, 0.15); border-radius: 30px; color: #fbbf24; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(251, 191, 36, 0.3);">
                ⚠️ Action Required
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Reschedule Your Appointment</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          We regret to inform you that the astrologer is currently unavailable for your scheduled appointment. Please reschedule your consultation at your earliest convenience.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(251, 191, 36, 0.08); border-radius: 12px; border-left: 4px solid #fbbf24;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #fbbf24; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Original Booking Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 6px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">📅 Date:</strong> ${booking.booking_date}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">🕒 Time:</strong> ${booking.booking_time}
                  </td>
                </tr>
                ${booking.service_type ? `
                <tr>
                  <td style="padding: 6px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">✨ Service:</strong> ${booking.service_type}
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/booking" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Reschedule Now
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 15px;">We apologize for any inconvenience caused.</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, 'Please reschedule your appointment');
};

// Booking Notification Template
export const bookingNotificationTemplate = (
  booking: { full_name: string; booking_date: string; booking_time: string; service_type: string; amount: number | string; status: string; email?: string; phone?: string },
  type: 'new' | 'cancelled' | 'updated' | 'admin_cancelled' | 'payment_success' | 'payment_failed' | 'confirmed' | 'completed',
  customMessage?: string
) => {
  const configMap = {
    new: { color: '#ff6b35', icon: '📅', title: 'Booking Received', badge: 'New Booking' },
    cancelled: { color: '#ef4444', icon: '❌', title: 'Booking Cancelled', badge: 'Cancelled' },
    updated: { color: '#3b82f6', icon: '🔄', title: 'Booking Rescheduled', badge: 'Updated' },
    admin_cancelled: { color: '#ef4444', icon: '⚠️', title: 'Booking Cancelled', badge: 'Admin Action' },
    payment_success: { color: '#22c55e', icon: '✅', title: 'Payment Confirmed!', badge: 'Payment Success' },
    payment_failed: { color: '#ef4444', icon: '❌', title: 'Payment Failed', badge: 'Payment Issue' },
    confirmed: { color: '#22c55e', icon: '✅', title: 'Booking Confirmed', badge: 'Confirmed' },
    completed: { color: '#8b5cf6', icon: '🎉', title: 'Consultation Completed', badge: 'Completed' }
  };
  
  const messageMap = {
    new: `We have received your booking request for ${booking.service_type}. Please complete the payment if you haven't already to confirm your slot.`,
    cancelled: `Your booking for ${booking.service_type} has been cancelled as per your request.`,
    updated: customMessage || `Your booking for ${booking.service_type} has been rescheduled to a new time slot.`,
    admin_cancelled: `Your booking for ${booking.service_type} has been cancelled by our team. Please contact us for more information.`,
    payment_success: `Your payment has been successfully processed. Your astrological consultation is now confirmed.`,
    payment_failed: `Unfortunately, your payment for ${booking.service_type} could not be processed. Please try again or contact support.`,
    confirmed: `Your booking for ${booking.service_type} has been confirmed. We look forward to our session.`,
    completed: `Thank you for your consultation. Your session for ${booking.service_type} has been marked as completed.`
  };
  
  const config = configMap[type];
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
  };
  
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: ${config.color}20; border-radius: 30px; color: ${config.color}; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid ${config.color}40;">
                ${config.icon} ${config.badge}
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">${config.title}</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${booking.full_name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">${messageMap[type]}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #ff6b35; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 10px;">Consultation Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 8px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">📅 Date:</strong> ${booking.booking_date}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">🕒 Time:</strong> ${booking.booking_time}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">✨ Service:</strong> ${booking.service_type}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">💰 Amount:</strong> ₹${formatCurrency(booking.amount)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b8a896; font-size: 14px;">
                    <strong style="color: #e8dcc8;">📌 Status:</strong> <span style="color: ${config.color}; font-weight: 600; text-transform: uppercase;">${booking.status}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/profile" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          View Booking Details
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 15px;">Login to your profile to see more details and join the session.</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, booking.full_name);
};

// Broadcast Email Template
export const broadcastEmailTemplate = (subject: string, message: string, name: string) => {
  const content = `
    <tr>
      <td style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); padding: 40px 35px; border-radius: 24px 24px 0 0;">
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; text-align: center; text-transform: uppercase; letter-spacing: 2px;">${subject}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 35px;">
        <p style="color: #e8dcc8; font-size: 18px; margin-bottom: 20px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <div style="color: #b8a896; font-size: 15px; line-height: 1.8;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 35px 40px; text-align: center;">
        <p style="color: #888; font-size: 13px; font-style: italic;">With cosmic blessings from the Katyaayani Astrologer</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name);
};

// Admin Password Reset Template (with reset link)
export const adminPasswordResetTemplate = (name: string = 'Seeker', resetLink: string) => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(251, 191, 36, 0.15); border-radius: 30px; color: #fbbf24; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(251, 191, 36, 0.3);">
                🔑 Password Reset
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Reset Your Password</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          We received a request to reset your password for your Katyaayani Astrologer account. Click the button below to set a new password.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px 30px; text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Reset My Password
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 35px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 15px 20px;">
          <tr>
            <td style="text-align: center; padding: 15px;">
              <p style="color: #888; font-size: 13px; margin: 0;">⏱️ This link expires in <strong style="color: #ff6b35;">24 hours</strong></p>
              <p style="color: #666; font-size: 12px; margin-top: 8px;">If you didn't request this, please ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, 'Password reset request');
};

// Admin Booking Notification Template (for admin dashboard notifications)
export const adminBookingNotificationTemplate = (
  booking: { full_name: string; email?: string; phone?: string; booking_date: string; booking_time: string; service_type: string; status: string },
  type: string
) => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(59, 130, 246, 0.15); border-radius: 30px; color: #3b82f6; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(59, 130, 246, 0.3);">
                📋 Admin Alert
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0;">Booking ${type.replace('_', ' ').toUpperCase()}</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Customer Name</span><br>
                    <span style="color: #e8dcc8; font-size: 15px; font-weight: 600;">${booking.full_name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Email</span><br>
                    <a href="mailto:${booking.email}" style="color: #ff6b35; font-size: 15px; text-decoration: none;">${booking.email || 'Not provided'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Phone</span><br>
                    <span style="color: #e8dcc8; font-size: 15px;">${booking.phone || 'Not provided'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Service</span><br>
                    <span style="color: #e8dcc8; font-size: 15px;">${booking.service_type}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Date & Time</span><br>
                    <span style="color: #e8dcc8; font-size: 15px;">${booking.booking_date} at ${booking.booking_time}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Status</span><br>
                    <span style="color: #ff6b35; font-size: 15px; font-weight: 600; text-transform: uppercase;">${booking.status}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/admin" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          View in Admin Panel
        </a>
          <p style="color: #666; font-size: 12px; margin-top: 15px;">Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </td>
      </tr>
    `;
    
    return baseTemplate(content, 'Admin');
};

// Password Changed Notification Template
export const passwordChangedNotificationTemplate = (name: string = 'Seeker') => {
  const changedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(34, 197, 94, 0.15); border-radius: 30px; color: #22c55e; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(34, 197, 94, 0.3);">
                🔒 Security Notice
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Password Changed</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${name}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          Your account password has been successfully changed. Below are the details of this change.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(34, 197, 94, 0.08); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px;">📅 Date & Time</span><br>
                    <span style="color: #e8dcc8; font-size: 14px;">${changedAt} (IST)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px;">✅ Status</span><br>
                    <span style="color: #22c55e; font-size: 14px; font-weight: 600;">Password Changed Successfully</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(239, 68, 68, 0.08); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
          <tr>
            <td style="padding: 15px 20px; text-align: center;">
              <p style="color: #ef4444; font-size: 13px; margin: 0; font-weight: 600;">⚠️ Didn't make this change?</p>
              <p style="color: #b8a896; font-size: 12px; margin-top: 5px;">If you did not change your password, please contact us immediately at <a href="mailto:katyaayaniastrologer01@gmail.com" style="color: #ff6b35; text-decoration: none;">katyaayaniastrologer01@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/profile" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          View My Account
        </a>
      </td>
    </tr>
  `;

  return baseTemplate(content, name, 'Your password has been changed');
};

// New Blog Post Notification Template
export const newBlogPostTemplate = (post: { title: string; excerpt?: string; slug: string; category?: string; featured_image?: string }, userName: string = 'Seeker') => {
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  
  const imageBlock = post.featured_image ? `
    <tr>
      <td style="padding: 0;">
        <img src="${post.featured_image}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px 16px 0 0; display: block;" />
      </td>
    </tr>
  ` : '';

  const categoryBadge = post.category ? `<span style="display: inline-block; padding: 4px 12px; background: rgba(255, 107, 53, 0.2); border-radius: 20px; color: #ff6b35; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">${post.category}</span>` : '';

  const excerptBlock = post.excerpt ? `<p style="color: #b8a896; font-size: 14px; line-height: 1.7; margin: 0;">${post.excerpt}</p>` : '';

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(139, 92, 246, 0.15); border-radius: 30px; color: #a78bfa; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(139, 92, 246, 0.3);">
                📝 New Blog Post
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">New Article Published!</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${userName}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          We have published a new article on <strong style="color: #ff6b35;">Katyaayani Astrologer</strong> that we think you'll find insightful.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 107, 53, 0.08); border-radius: 16px; border: 1px solid rgba(255, 107, 53, 0.15);">
          ${imageBlock}
          <tr>
            <td style="padding: 25px;">
              ${categoryBadge}
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 10px 0 15px; line-height: 1.4;">${post.title}</h2>
              ${excerptBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${postUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Read Full Article
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 15px;">Stay connected with cosmic wisdom and insights</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, userName, `New blog post: ${post.title}`);
};

// Blog Post Updated Notification Template
export const blogPostUpdatedTemplate = (post: { title: string; excerpt?: string; slug: string; category?: string; featured_image?: string }, userName: string = 'Seeker') => {
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  
  const imageBlock = post.featured_image ? `
    <tr>
      <td style="padding: 0;">
        <img src="${post.featured_image}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px 16px 0 0; display: block;" />
      </td>
    </tr>
  ` : '';

  const categoryBadge = post.category ? `<span style="display: inline-block; padding: 4px 12px; background: rgba(255, 107, 53, 0.2); border-radius: 20px; color: #ff6b35; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">${post.category}</span>` : '';

  const excerptBlock = post.excerpt ? `<p style="color: #b8a896; font-size: 14px; line-height: 1.7; margin: 0;">${post.excerpt}</p>` : '';

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(59, 130, 246, 0.15); border-radius: 30px; color: #3b82f6; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(59, 130, 246, 0.3);">
                Blog Updated
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 600; margin: 0;">Article Updated!</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${userName}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          We have updated an article on <strong style="color: #ff6b35;">Katyaayani Astrologer</strong>. Check out the latest changes!
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px 35px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 107, 53, 0.08); border-radius: 16px; border: 1px solid rgba(255, 107, 53, 0.15);">
          ${imageBlock}
          <tr>
            <td style="padding: 25px;">
              ${categoryBadge}
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 10px 0 15px; line-height: 1.4;">${post.title}</h2>
              ${excerptBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${postUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Read Updated Article
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 15px;">Stay connected with cosmic wisdom and insights</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, userName, `Blog updated: ${post.title}`);
};

// Daily Rashifal Email Template
export const dailyRashifalEmailTemplate = (userName: string, formattedDate: string, rashifals: any[] = []) => {
  const RASHI_EMOJI: Record<string, string> = {
    aries: '\u2648', taurus: '\u2649', gemini: '\u264A', cancer: '\u264B',
    leo: '\u264C', virgo: '\u264D', libra: '\u264E', scorpio: '\u264F',
    sagittarius: '\u2650', capricorn: '\u2651', aquarius: '\u2652', pisces: '\u2653',
  };

  const rashiPreviewRows = rashifals.map(r => {
    const emoji = RASHI_EMOJI[r.rashi] || '';
    const name = r.rashi_gujarati ? `${r.rashi.charAt(0).toUpperCase() + r.rashi.slice(1)} (${r.rashi_gujarati})` : r.rashi.charAt(0).toUpperCase() + r.rashi.slice(1);
    const rawContent = r.content_english || r.content_gujarati || '';
    const fullContent = rawContent.length > 120 ? rawContent.substring(0, 120).trim() + '...' : rawContent;
    const dateParam = r.date || '';
    return `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:40px;vertical-align:top;">
              <span style="font-size:24px;">${emoji}</span>
            </td>
            <td style="vertical-align:top;">
              <p style="color:#ff6b35;font-size:15px;font-weight:700;margin:0 0 6px;">${name}</p>
              <p style="color:#e8dcc8;font-size:13px;line-height:1.6;margin:0;">${fullContent}</p>
              <a href="${BASE_URL}/rashifal?date=${dateParam}" style="color:#ff6b35;font-size:12px;text-decoration:none;font-weight:600;display:inline-block;margin-top:8px;">See More &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join('');

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px; text-align: center;">
        <span style="display: inline-block; padding: 8px 20px; background: rgba(255, 107, 53, 0.15); border-radius: 30px; color: #ff6b35; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(255, 107, 53, 0.3);">
          Daily Rashifal Updated
        </span>
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 20px 0 0;">Today's Horoscope is Ready!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${userName}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          The daily rashifal for <strong style="color: #ff6b35;">${formattedDate}</strong> has been uploaded. Here's a preview of each sign:
        </p>
      </td>
    </tr>
    ${rashifals.length > 0 ? `
    <tr>
      <td style="padding: 0 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,107,53,0.1);">
          ${rashiPreviewRows}
        </table>
      </td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/rashifal" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          View Full Rashifal
        </a>
      </td>
    </tr>
  `;

  return baseTemplate(content, userName, `Daily Rashifal for ${formattedDate}`);
};

// Weekly Rashifal Email Template
export const weeklyRashifalEmailTemplate = (userName: string, startDate: string, endDate: string, rashifals: any[] = []) => {
  const RASHI_EMOJI: Record<string, string> = {
    aries: '\u2648', taurus: '\u2649', gemini: '\u264A', cancer: '\u264B',
    leo: '\u264C', virgo: '\u264D', libra: '\u264E', scorpio: '\u264F',
    sagittarius: '\u2650', capricorn: '\u2651', aquarius: '\u2652', pisces: '\u2653',
  };

  const rashiPreviewRows = rashifals.map(r => {
    const emoji = RASHI_EMOJI[r.rashi] || '';
    const name = r.rashi_gujarati ? `${r.rashi.charAt(0).toUpperCase() + r.rashi.slice(1)} (${r.rashi_gujarati})` : r.rashi.charAt(0).toUpperCase() + r.rashi.slice(1);
    const rawContent = r.content_english || r.content_gujarati || '';
    const fullContent = rawContent.length > 120 ? rawContent.substring(0, 120).trim() + '...' : rawContent;
    return `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:40px;vertical-align:top;">
              <span style="font-size:24px;">${emoji}</span>
            </td>
            <td style="vertical-align:top;">
              <p style="color:#ff6b35;font-size:15px;font-weight:700;margin:0 0 6px;">${name}</p>
              <p style="color:#e8dcc8;font-size:13px;line-height:1.6;margin:0;">${fullContent}</p>
              <a href="${BASE_URL}/rashifal?tab=weekly" style="color:#ff6b35;font-size:12px;text-decoration:none;font-weight:600;display:inline-block;margin-top:8px;">See More &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join('');

  const content = `
    <tr>
      <td style="padding: 40px 35px 20px; text-align: center;">
        <span style="display: inline-block; padding: 8px 20px; background: rgba(139, 92, 246, 0.15); border-radius: 30px; color: #a78bfa; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(139, 92, 246, 0.3);">
          Weekly Rashifal Updated
        </span>
        <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 20px 0 0;">This Week's Horoscope is Ready!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; margin-bottom: 15px;">Namaste <strong style="color: #ff6b35;">${userName}</strong>,</p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.7;">
          The weekly rashifal for <strong style="color: #ff6b35;">${startDate} - ${endDate}</strong> has been uploaded. Here's a preview of each sign:
        </p>
      </td>
    </tr>
    ${rashifals.length > 0 ? `
    <tr>
      <td style="padding: 0 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,107,53,0.1);">
          ${rashiPreviewRows}
        </table>
      </td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/rashifal?tab=weekly" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);">
          View Weekly Rashifal
        </a>
      </td>
    </tr>
  `;

  return baseTemplate(content, userName, `Weekly Rashifal: ${startDate} - ${endDate}`);
};

// Welcome Back Email Template (for existing users)
export const welcomeBackEmailTemplate = (name: string = 'Divine Soul') => {
  const content = `
    <tr>
      <td style="padding: 40px 35px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background: rgba(255, 107, 53, 0.15); border-radius: 30px; color: #ff6b35; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(255, 107, 53, 0.3);">
                ✨ Welcome Back
              </span>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 25px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 600; margin: 0;">Namaste, ${name}!</h1>
              <p style="color: #c9a87c; font-size: 16px; margin-top: 10px; font-style: italic;">Welcome back to your cosmic sanctuary</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 35px;">
        <p style="color: #e8dcc8; font-size: 16px; line-height: 1.8;">
          It is wonderful to have you back at <strong style="color: #ff6b35;">Katyaayani Astrologer</strong>. The stars have continued their eternal dance since your last visit.
        </p>
        <p style="color: #b8a896; font-size: 15px; line-height: 1.8; margin-top: 15px;">
          Your personalized dashboard is ready with your current bookings and astrological insights. Let's see what the heavens have in store for you today.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 25px 35px 40px; text-align: center;">
        <a href="${BASE_URL}/" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(255, 107, 53, 0.4);">
          Continue to Homepage
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 15px;">We are glad you're back on your spiritual path</p>
      </td>
    </tr>
  `;
  
  return baseTemplate(content, name, `Welcome back to Katyaayani Astrologer, ${name}!`);
};
