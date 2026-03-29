import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendResendBatch } from '@/lib/email.config';
import { newBlogPostTemplate } from '@/lib/email-templates';
import { getUnifiedSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // Get blog post data
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Get all users from unified subscriber list
    const validUsers = await getUnifiedSubscribers();
    
    if (validUsers.length === 0) {
      return NextResponse.json({ error: 'No users found to send emails to' }, { status: 400 });
    }

    // Prepare emails for batch
    const emails = validUsers.map(user => ({
      to: user.email,
      subject: `New Article: ${post.title}`,
      html: newBlogPostTemplate(post, user.name || 'Valued Seeker'),
    }));

    // Send via Resend Batch
    const result = await sendResendBatch(emails);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send batch emails' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      totalUsers: result.total, 
      sent: result.sent, 
      failed: result.failed 
    });
  } catch (error: any) {
    console.error('Error sending blog notification emails:', error);
    return NextResponse.json({ error: error.message || 'Failed to send emails' }, { status: 500 });
  }
}
