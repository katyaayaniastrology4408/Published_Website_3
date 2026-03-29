import nodemailer from 'nodemailer';

export type EmailResult = { success: boolean; messageId?: string; error?: string };

// SMTP Configuration — Gmail TLS (port 587)
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SMTP_USER = process.env.GMAIL_USER;
const SMTP_PASS = process.env.GMAIL_APP_PASSWORD || 'iouxxvogkvvvyurd';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // TLS via STARTTLS on port 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendSmtpEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> => {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"Katyaayani Astrologer" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[SMTP] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[SMTP] Send error:', {
      message: err.message,
      code: err.code,
      command: err.command,
      response: err.response,
      responseCode: err.responseCode,
    });
    return { success: false, error: err.message };
  }
};

export const testSmtpConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('[SMTP] Connection verified successfully');
    return { success: true };
  } catch (err: any) {
    console.error('[SMTP] Connection verification failed:', {
      message: err.message,
      code: err.code,
    });
    return { success: false, error: err.message };
  }
};
