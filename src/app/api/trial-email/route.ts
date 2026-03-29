import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email.config';
import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(req: Request) {
    try {
          const { email, sendToAll, targetEmail } = await req.json();

        const subject = "Appointment Date Unavailable/Busy – Kindly Reschedule";

        if (sendToAll) {

          const { data: bookings, error: dbError } = await supabase
            .from('bookings')
            .select('*')
            .not('email', 'is', null)
            .order('created_at', { ascending: false });
            
          if (dbError) throw dbError;
          
          const latestBookingsMap = new Map();
          bookings?.forEach(b => {
            const emailKey = b.email.toLowerCase().trim();
            if (!latestBookingsMap.has(emailKey)) {
              latestBookingsMap.set(emailKey, b);
            }
          });

          const distinctBookings = Array.from(latestBookingsMap.values());
          const results = [];
          
          if (distinctBookings.length === 0) {
            return NextResponse.json({ success: true, message: "No users found to notify.", results: [] });
          }

          for (const booking of distinctBookings) {
            if (!booking.email || !booking.email.includes('@')) continue;
            
            const emailResult = await sendEmail({
              to: booking.email,
              subject: subject,
              html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      content="telephone=no,address=no,email=no,date=no,url=no"
      name="format-detection" />
  </head>
  <body>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:1.0769230769230769em;min-height:100%;line-height:155%">
              <tbody>
                <tr>
                  <td>
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="align:left;width:100%;padding-left:0px;padding-right:0px;line-height:155%;max-width:600px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif">
                      <tbody>
                        <tr>
                          <td>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em"><br /></p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em"><span>Dear Sir/Madam,</span></p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em"><span>Thank you for your booking.</span></p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Please note that I am currently busy and the selected </span>
                              <span><strong>appointment date and time</strong></span>
                              <span> have already been blocked.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span><strong>Client Name:</strong></span>
                              <span> ${booking.full_name || '____________________'}</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span><strong>Booked Appointment Details:</strong></span><br />
                              <span>Date: ${booking.booking_date || '____________________'}</span><br />
                              <span>Time: ${booking.booking_time || '____________________'}</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span><strong>Birth Details (Required for Consultation):</strong></span><br />
                              <span>Date of Birth: ${booking.date_of_birth || '____________________'}</span><br />
                              <span>Time of Birth: ${booking.time_of_birth || '____________________'}</span><br />
                              <span>Place of Birth: ${booking.place_of_birth || '____________________'}</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>I kindly request you to reschedule your appointment to an available date and time.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>While making the payment, please ensure that you clearly mention the </span>
                              <span><strong>payment reference number</strong></span>
                              <span> for confirmation.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>For any assistance regarding rescheduling, feel free to contact us.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Thank you for your understanding and cooperation.</span>
                            </p>
                            <p style="margin:0;padding:0;font-size:1em;padding-top:0.5em;padding-bottom:0.5em">
                              <span>Warm regards,</span><br />
                              <span>Katyaayani Astrologer</span>
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
              `,
            });
            results.push({ email: booking.email, success: emailResult.success, error: emailResult.error });
          }
          
          return NextResponse.json({ success: true, results });
        }
        
          const emailResult = await sendEmail({
            to: email || 'katyaayaniastrologer01@gmail.com',
            subject: subject,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #4a3f35; background-color: #fdfbf7; border: 2px solid #ff6b35; border-radius: 12px;">
              <h2 style="color: #ff6b35; text-align: center;">TRIAL NOTIFICATION</h2>
              <p>Namaste,</p>
                <p>Your email notification system is now active and ready.</p>
                <p>This is a test message to verify your configuration.</p>
            </div>
          `,
        });

    if (!emailResult.success) {
      return NextResponse.json({ success: false, error: emailResult.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: emailResult });
  } catch (err: any) {
    console.error('Trial email error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
