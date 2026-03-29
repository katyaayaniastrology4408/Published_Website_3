import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email.config';
import { newBlogPostTemplate } from '@/lib/email-templates';
import { autoIndexUrl } from '@/lib/auto-index';
import { getUnifiedSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// Blog/Rashifal notifications → Gmail SMTP (unified for all seekers)
async function sendBlogNotificationViaSmtp(post: {
  title: string;
  excerpt?: string;
  slug: string;
  category?: string;
  featured_image?: string;
}) {
  try {
    // Get unified list of all users
    const validUsers = await getUnifiedSubscribers();
    
    if (validUsers.length === 0) return;

    // Send via SMTP
    for (const user of validUsers) {
      try {
        await sendEmail({
          to: user.email,
          subject: `New Blog Post: ${post.title} - Katyaayani Astrologer`,
          html: newBlogPostTemplate(post, user.name || 'Seeker'),
        });
      } catch (e) {
        console.error(`Error sending blog notification to ${user.email}:`, e);
      }
      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`Blog notification sent via SMTP to ${validUsers.length} total users`);
  } catch (err) {
    console.error('Error sending blog notification via SMTP:', err);
  }
}

// GET all blog posts (published only by default, all if admin=true)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const isAdmin = searchParams.get('admin') === 'true';
  
  try {
    let query = supabase
      .from('blog_posts')
      .select('*');
    
    if (!isAdmin) {
      query = query.eq('is_published', true);
    }
    
    query = query.order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data, count });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST create new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      title_gujarati,
      title_hindi,
      slug,
      content, 
      content_gujarati,
      content_hindi,
      excerpt, 
      excerpt_gujarati,
      excerpt_hindi,
      featured_image, 
      category, 
      tags, 
      meta_title, 
      meta_description, 
      is_published 
    } = body;
    
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        title_gujarati,
        title_hindi,
        slug: finalSlug,
        content,
        content_gujarati,
        content_hindi,
        excerpt,
        excerpt_gujarati,
        excerpt_hindi,
        featured_image,
        category: category || 'general',
        tags: tags || [],
        meta_title,
        meta_description,
        is_published: is_published || false,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select()
      .single();
    
    if (error) throw error;

      // Send notification via SMTP if published
      if (is_published && data) {
        sendBlogNotificationViaSmtp({
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          category: data.category,
          featured_image: data.featured_image,
        });
        // Auto-index new published blog post
        autoIndexUrl(`/blog/${data.slug}`);
      }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
