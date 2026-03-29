import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification } from "@/lib/email";
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // If rescheduling, check if slot is available
    if (updates.booking_date && updates.booking_time) {
      const { data: existingBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("booking_date", updates.booking_date)
        .eq("booking_time", updates.booking_time)
        .in("status", ["pending", "confirmed"])
        .neq("id", id) // Exclude current booking
        .maybeSingle();

      if (existingBooking) {
        return NextResponse.json(
          { 
            success: false, 
            message: "This time slot is already booked. Please choose another time.",
            error: "SLOT_ALREADY_BOOKED"
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      
      if (error.code === '23505' || (error.message && error.message.includes('unique_booking_slot'))) {
        return NextResponse.json(
          { 
            success: false, 
            message: "This time slot has just been booked. Please choose another time.",
            error: "SLOT_ALREADY_BOOKED"
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // Send notification if status changed
    if (updates.status) {
      let type: any = 'updated';
      
      if (updates.status === 'confirmed') type = 'confirmed';
      else if (updates.status === 'completed') type = 'completed';
      else if (updates.status === 'cancelled') {
        type = updates.isAdminAction ? 'admin_cancelled' : 'cancelled';
      }
      
      await sendBookingNotification(data, type, updates.customMessage);
    }

      return NextResponse.json({ success: true, data, message: "Booking updated successfully" });
    } catch (error: any) {
      console.error("Update booking error:", error);
      return NextResponse.json(
        { success: false, message: error?.message || "Failed to update booking" },
        { status: 500 }
      );
    }
  }

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
