import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification, sendRescheduleEmail } from "@/lib/email";
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

// All time slots
const allSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

// Helper function to get blocked slots - blocks current slot + 1 hour buffer after
const getBlockedSlotsForBooking = (bookingTime: string): string[] => {
  const currentIndex = allSlots.indexOf(bookingTime);
  if (currentIndex === -1) return [bookingTime];
  
  const blockedSlots: string[] = [bookingTime];
  
  // Block 1 additional slot after for 1 hour buffer
  const nextIndex = currentIndex + 1;
  if (nextIndex < allSlots.length) {
    blockedSlots.push(allSlots[nextIndex]);
  }
  
  return blockedSlots;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (date) {
      const { data: availabilityData, error } = await supabase
        .from("availability")
        .select("*")
        .eq("date", date)
        .maybeSingle();

      const { data: blockedDateData } = await supabase
        .from("blocked_dates")
        .select("*")
        .eq("date", date)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 }
        );
      }

        const { data: bookings } = await supabase
          .from("bookings")
          .select("booking_time, service_type")
          .eq("booking_date", date)
          .in("status", ["pending", "confirmed", "completed"]);

        const bookedTimes: string[] = [];
        
        // Block booking slot + 1 hour buffer
        bookings?.forEach(booking => {
          const blockedSlots = getBlockedSlotsForBooking(booking.booking_time);
          bookedTimes.push(...blockedSlots);
        });

      const blockedTimes = availabilityData?.blocked_times || [];
      const allBlockedTimes = [...new Set([...bookedTimes, ...blockedTimes])];

      return NextResponse.json({
        success: true,
        data: {
          date,
          is_available: (availabilityData?.is_available !== false) && !blockedDateData,
          blocked_times: allBlockedTimes,
          notes: availabilityData?.notes || blockedDateData?.reason,
        },
      });
    }

    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const availabilityData = await request.json();

    // 1. Update or Insert availability
    const { data, error } = await supabase
      .from("availability")
      .upsert(
        {
          date: availabilityData.date,
          is_available: availabilityData.is_available,
          blocked_times: availabilityData.blocked_times,
          notes: availabilityData.notes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "date" }
      )
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // 2. If the date is blocked (is_available: false), notify users with existing bookings
    let emailStatus = "not_configured";
    if (availabilityData.is_available === false) {
      const { data: affectedBookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_date", availabilityData.date)
        .in("status", ["pending", "confirmed"]);

      if (affectedBookings && affectedBookings.length > 0) {
          emailStatus = "sent";

          for (const booking of affectedBookings) {
            // Send notification about rescheduling due to unavailability
            await sendRescheduleEmail(booking);
            
            // Always update booking status to cancelled in DB if blocking date
            await supabase
              .from("bookings")
              .update({ status: 'cancelled' })
              .eq("id", booking.id);
          }
      }
    }

    return NextResponse.json({ 
      success: true, 
      data,
      emailStatus,
      message: availabilityData.is_available === false 
        ? (emailStatus === "sent" ? "Availability updated and affected users notified via email." : "Availability updated. Automated emails skipped (API key missing). Please use manual Draft Mail or WhatsApp links.") 
        : "Availability updated."
    });
  } catch (error) {
    console.error("Availability update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update availability" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("date", date);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Availability deleted" });
  } catch (error) {
    console.error("Availability delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete availability" },
      { status: 500 }
    );
  }
}
