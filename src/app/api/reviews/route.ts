import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email.config";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Fetch approved reviews for the public website
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get('rating');
    const featuredOnly = searchParams.get('featured');

    let query = supabase
      .from("reviews")
      .select("id, name, rating, message, is_featured, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (rating) {
      query = query.eq("rating", Number(rating));
    }
    if (featuredOnly === 'true') {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, reviews: data });
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req: NextRequest) {
  try {
    const { name, rating, message, captchaAnswer, captchaExpected } = await req.json();

    // 1. Math Captcha Validation
    if (!name || !rating || !message || captchaAnswer === undefined || captchaExpected === undefined) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    if (Number(captchaAnswer) !== Number(captchaExpected)) {
      return NextResponse.json({ success: false, error: "Incorrect Math Captcha answer" }, { status: 400 });
    }

    // 2. Rating Validation
    const numericRating = Number(rating);
    if (![3, 4, 5].includes(numericRating)) {
      return NextResponse.json({ success: false, error: "Only 3, 4, or 5 star ratings are allowed" }, { status: 400 });
    }

    // 3. Database Insertion (Status automatically approved for 3+ stars)
    const { data: insertData, error: insertError } = await supabase
      .from("reviews")
      .insert({
        name,
        rating: numericRating,
        message,
        status: "approved"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insertion error:", insertError.message);
      return NextResponse.json({ success: false, error: insertError.message || "Database error" }, { status: 500 });
    }

    // 4. Send Email Notification to Admin (Informational only)
    const adminEmail = 'katyaayaniastrologer01@gmail.com';
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Requires Approval: New ${numericRating}-Star Review from ${name}`,
        html: `
          <h2>New Review Submitted</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Rating:</strong> ${numericRating} Stars</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>This review has been <b>auto-approved</b> and is now visible on the website. You can manage it in the <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">Admin Dashboard</a>.</p>
        `
      });
    } catch (emailErr) {
      console.error("Failed to send admin notification for new review:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Review submitted successfully and is now active." });
  } catch (error: any) {
    console.error("Submit review error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}

