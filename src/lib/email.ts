import { sendEmail } from "./email.config";
import { 
  otpEmailTemplate, 
  rescheduleNotificationTemplate, 
  welcomeEmailTemplate, 
  welcomeBackEmailTemplate,
  loginNotificationTemplate, 
  broadcastEmailTemplate,
  bookingNotificationTemplate,
  adminEnquiryNotificationTemplate,
  adminPasswordResetTemplate,
  adminBookingNotificationTemplate
} from "./email-templates";

// Re-export client-safe functions for backward compatibility
export { getMailtoLink, getGmailLink, getWhatsAppLink } from "./email-links";

const adminEmail = 'katyaayaniastrologer01@gmail.com';

export async function sendBroadcastEmail(subject: string, message: string, recipients: { email: string, name: string }[]) {
  try {
    const results = await Promise.allSettled(
      recipients.map(user => 
        sendEmail({
          to: user.email,
          subject: subject,
          html: broadcastEmailTemplate(subject, message, user.name)
        })
      )
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && (r as any).value.success).length;
    return { success: true, count: successCount };
  } catch (error: any) {
    console.error("Broadcast email error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendAdminPasswordResetEmail(email: string, resetLink: string, name: string = 'Valued User') {
  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Request - Katyaayani Astrologer',
      html: adminPasswordResetTemplate(name, resetLink)
    });
    return { success: true };
  } catch (error: any) {
    console.error("Reset email error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendBookingNotification(booking: any, type: 'new' | 'cancelled' | 'updated' | 'admin_cancelled' | 'payment_success' | 'payment_failed' | 'confirmed' | 'completed', customMessage?: string) {
  const subjectMap = {
    new: `Booking Received: ${booking.service_type}`,
    cancelled: `Booking Cancelled: ${booking.service_type}`,
    updated: `Booking Rescheduled: ${booking.service_type}`,
    admin_cancelled: `Booking Cancelled by Admin: ${booking.service_type}`,
    payment_success: `Payment Successful & Booking Confirmed: ${booking.service_type}`,
    payment_failed: `Payment Failed: ${booking.service_type}`,
    confirmed: `Booking Confirmed: ${booking.service_type}`,
    completed: `Consultation Completed: ${booking.service_type}`
  };

  if (booking.email) {
    try {
      await sendEmail({
        to: booking.email,
        subject: subjectMap[type],
        html: bookingNotificationTemplate(booking, type, customMessage)
      });
    } catch (error) {
      console.error('Failed to send email to user:', error);
    }
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: `Admin Alert: Booking ${type.toUpperCase()} - ${booking.full_name}`,
      html: adminBookingNotificationTemplate(booking, type)
    });
  } catch (error) {
    console.error('Failed to send email to admin:', error);
  }
}

export async function sendWelcomeEmail(user: { email: string; name: string }) {
  if (!user.email) return;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Katyaayani Astrologer ✨',
      html: welcomeEmailTemplate(user.name, user.email)
    });
  } catch (error) {
    console.error('Exception sending welcome email:', error);
  }
}

export async function sendRescheduleEmail(booking: any) {
  try {
    return await sendEmail({
      to: booking.email,
      subject: `Action Required: Reschedule Your Appointment - Katyaayani Astrologer`,
      html: rescheduleNotificationTemplate(booking)
    });
  } catch (error) {
    console.error('Failed to send reschedule email:', error);
    return { success: false, error };
  }
}

export async function sendLoginNotification(user: { email: string; name: string }) {
  if (!user.email) return;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Security Alert: New Login to Katyaayani Astrologer',
      html: loginNotificationTemplate(user.name)
    });
  } catch (error) {
    console.error('Exception sending login notification:', error);
  }
}

export async function sendWelcomeBackEmail(user: { email: string; name: string }) {
  if (!user.email) return;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome back to Katyaayani Astrologer ✨',
      html: welcomeBackEmailTemplate(user.name)
    });
  } catch (error) {
    console.error('Exception sending welcome back email:', error);
  }
}
