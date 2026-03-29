import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email.config';
import { newBlogPostTemplate, blogPostUpdatedTemplate } from '@/lib/email-templates';
import { autoIndexUrl } from '@/lib/auto-index';
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

async function sendBlogNotificationToAllUsers(post: { title: string; excerpt?: string; slug: string; category?: string; featured_image?: string }) {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('email, name');

    if (error || !profiles || profiles.length === 0) return;

    const results = await Promise.allSettled(
      profiles.map(user => {
        const userName = user.name || 'Seeker';
        return sendEmail({
          to: user.email,
          subject: `New Blog Post: ${post.title} - Katyaayani Astrologer`,
          html: newBlogPostTemplate(post, userName),
        });
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && (r as any).value?.success).length;
    console.log(`Blog notification emails sent: ${successCount}/${profiles.length}`);
  } catch (err) {
    console.error('Error sending blog notification emails:', err);
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: string) {
  return UUID_REGEX.test(value);
}

// GET single blog post by slug or id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const column = isUUID(slug) ? 'id' : 'slug';

  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq(column, slug);

    // Only filter published posts for slug-based (public) lookups
    if (!isUUID(slug)) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count for public (slug-based) requests
    if (!isUUID(slug)) {
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const column = isUUID(slug) ? 'id' : 'slug';

    try {
      const body = await request.json();
      const {
        title,
        title_gujarati,
        title_hindi,
        slug: newSlug,
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
        is_published,
      } = body;

      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      let isNewlyPublished = false;

      if (title !== undefined) updateData.title = title;
      if (title_gujarati !== undefined) updateData.title_gujarati = title_gujarati;
      if (title_hindi !== undefined) updateData.title_hindi = title_hindi;
      if (newSlug !== undefined) updateData.slug = newSlug;
      if (content !== undefined) updateData.content = content;
      if (content_gujarati !== undefined) updateData.content_gujarati = content_gujarati;
      if (content_hindi !== undefined) updateData.content_hindi = content_hindi;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (excerpt_gujarati !== undefined) updateData.excerpt_gujarati = excerpt_gujarati;
      if (excerpt_hindi !== undefined) updateData.excerpt_hindi = excerpt_hindi;
      if (featured_image !== undefined) updateData.featured_image = featured_image;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (meta_title !== undefined) updateData.meta_title = meta_title;
      if (meta_description !== undefined) updateData.meta_description = meta_description;
      if (is_published !== undefined) {
        updateData.is_published = is_published;
        if (is_published) {
          const { data: existingPost } = await supabase
            .from('blog_posts')
            .select('published_at, is_published')
            .eq(column, slug)
            .single();

          if (!existingPost?.published_at) {
            updateData.published_at = new Date().toISOString();
            isNewlyPublished = true;
          }
        }
      }

      // Auto-generate slug from title if not provided and title was given
      if (title && newSlug === undefined) {
        updateData.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq(column, slug)
        .select()
        .single();

      if (error) throw error;

          // Send admin notification email
          const adminEmail = process.env.ADMIN_EMAIL;
          if (adminEmail && data) {
            sendEmail({
              to: adminEmail,
              subject: `Blog Updated: ${data.title}`,
              html: blogPostUpdatedTemplate(
                { title: data.title, excerpt: data.excerpt, slug: data.slug, category: data.category, featured_image: data.featured_image },
                'Admin'
              ),
            }).catch(err => console.error('Failed to send admin blog update notification:', err));
          }

          // Send email notification to all users if blog is newly published
          if (isNewlyPublished && data) {
          sendBlogNotificationToAllUsers({
            title: data.title,
            excerpt: data.excerpt,
            slug: data.slug,
            category: data.category,
            featured_image: data.featured_image,
          });
          // Auto-index newly published blog post
          autoIndexUrl(`/blog/${data.slug}`);
        } else if (!isNewlyPublished && data && data.is_published) {
            // Re-index updated published post (no email to users on update)
            autoIndexUrl(`/blog/${data.slug}`);
          }

      return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const column = isUUID(slug) ? 'id' : 'slug';

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq(column, slug);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
