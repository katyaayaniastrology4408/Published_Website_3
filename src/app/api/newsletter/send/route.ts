import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAdminJWT } from '@/lib/jwt';
import { getUnifiedSubscribers } from '@/lib/subscribers';
import { sendResendBatch } from '@/lib/email.config';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Require valid admin JWT cookie
    const token = request.cookies.get("admin-jwt")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyAdminJWT(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, html, templateName, variables } = body;

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
    }

    // Get ALL active users from unified subscriber list (same list for Blog, Weekly, and Newsletter)
    const validUsers = await getUnifiedSubscribers();

    if (!validUsers || validUsers.length === 0) {
      return NextResponse.json({ success: true, total: 0, sent: 0, failed: 0, results: [] });
    }

    // If templateName provided, fetch the Resend template and replace variables in HTML
    let emailHtml = html || '';
    if (templateName && !html) {
      const tmplRes = await fetch('https://api.resend.com/templates', {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      const tmplData = await tmplRes.json();
      const found = (tmplData.data || []).find((t: any) => t.name === templateName);
      if (!found) {
        return NextResponse.json({ error: `Template "${templateName}" not found on Resend.` }, { status: 400 });
      }
      emailHtml = found.html || '';
    }

    if (!emailHtml) {
      return NextResponse.json({ error: 'No email content (html or templateName) provided.' }, { status: 400 });
    }

    // Prepare emails for batch
    const emails = validUsers.map((user) => {
      const vars: Record<string, string> = {
        UNSUBSCRIBE_URL: 'https://www.katyaayaniastrologer.com/unsubscribe',
        ...variables,
        NAME: user.name || variables?.NAME || 'Devotee',
      };
      
      let finalHtml = emailHtml;
      for (const [key, val] of Object.entries(vars)) {
        finalHtml = finalHtml.split(`{{{${key}}}}`).join(String(val));
      }
      
      return {
        to: user.email,
        subject,
        html: finalHtml,
      };
    });

    // Send via Resend Batch helper
    const result = await sendResendBatch(emails);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send batch emails' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      total: result.total, 
      sent: result.sent, 
      failed: result.failed, 
      results: result.results 
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
