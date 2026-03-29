import { Resend } from 'resend';
import { sendSmtpEmail } from './smtp';
import type { EmailResult } from './smtp';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Transactional emails (OTP, booking, welcome, login, password reset) → Gmail SMTP
export { sendSmtpEmail as sendEmail };
export type { EmailResult };

/**
 * Send bulk emails via SMTP in small batches to avoid Gmail rate limits
 */
export async function sendSmtpBatch(emails: { to: string; subject: string; html: string }[]) {
  const results: { email: string; success: boolean; error?: string }[] = [];
  const BATCH_SIZE = 10; // Smaller batch size for SMTP

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel but limit total concurrency
    const batchResults = await Promise.all(
      batch.map(async (e) => {
        try {
          const result = await sendSmtpEmail(e);
          return { email: e.to, success: result.success, error: result.error };
        } catch (err: any) {
          return { email: e.to, success: false, error: err.message };
        }
      })
    );

    results.push(...batchResults);

    // Pause between batches to be safe with Gmail
    if (i + BATCH_SIZE < emails.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return {
    success: true,
    total: emails.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

/**
 * Send bulk emails via Resend batch API
 */
export async function sendResendBatch(emails: { to: string; subject: string; html: string }[]) {
  if (!resend) {
    return { success: false, error: 'Resend API key not configured' };
  }

  const results: { email: string; success: boolean; error?: string }[] = [];
  const BATCH_SIZE = 100;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const resendEmails = batch.map(e => ({
      from: process.env.RESEND_FROM_EMAIL || 'Katyaayani Astrologer <noreply@katyaayaniastrologer.com>',
      to: e.to,
      subject: e.subject,
      html: e.html,
    }));

    try {
      const { data, error } = await resend.batch.send(resendEmails);
      if (error) {
        batch.forEach(e => results.push({ email: e.to, success: false, error: String(error) }));
      } else {
        batch.forEach(e => results.push({ email: e.to, success: true }));
      }
    } catch (err: any) {
      batch.forEach(e => results.push({ email: e.to, success: false, error: err.message }));
    }

    if (i + BATCH_SIZE < emails.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return {
    success: true,
    total: emails.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}
