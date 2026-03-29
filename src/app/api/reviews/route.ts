import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/email.config";
export const dynamic = 'force-dynamic';

// GET: Fetch approved reviews for the public website
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get('rating');
    const featuredOnly = searchParams.get('featured');

    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin
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

    const sbAdmin = getSupabaseAdmin();

    // 3. Database Insertion (Status automatically approved for 3+ stars)
    const { data: insertData, error: insertError } = await sbAdmin
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
      console.error("Reviews Database Error:", insertError);
      
      let errorMsg = insertError.message;
      if (insertError.message.includes("relation \"reviews\" does not exist") || insertError.message.includes("could not find the table")) {
        errorMsg = "Database error: table 'reviews' not found. Please contact the administrator to initialize the database from the Admin Dashboard.";
      }

      return NextResponse.json({ 
        success: false, 
        error: errorMsg
      }, { status: 500 });
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

