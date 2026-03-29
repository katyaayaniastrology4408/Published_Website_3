import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendRescheduleEmail } from "@/lib/email";
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const emailResult = await sendRescheduleEmail(booking);

    return NextResponse.json({
      success: true,
      message: "Reschedule email sent successfully",
    });
  } catch (error: any) {
    console.error("Reschedule email error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send reschedule email" },
      { status: 500 }
    );
  }
}
