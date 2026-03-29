import nodemailer from 'nodemailer';

// Gmail SMTP only - for all transactional emails
export const sendEmailViaSMTP = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const fromName = 'Katyaayani Astrologer';
  const fromEmail = process.env.GMAIL_USER || 'katyaayaniastrologer01@gmail.com';

  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      console.error('Gmail SMTP: credentials missing. GMAIL_USER and GMAIL_APP_PASSWORD are required.');
      return { success: false, error: 'Gmail credentials missing' };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent via Gmail SMTP:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Gmail SMTP Error:', error.message);
    return { success: false, error: error.message };
  }
};
