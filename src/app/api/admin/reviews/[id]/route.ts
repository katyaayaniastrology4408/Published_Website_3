import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // We can update status or is_featured
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;

    const { data, error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, review: data });
  } catch (error: any) {
    console.error("Update review error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Delete review error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
