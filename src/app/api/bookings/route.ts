import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification } from "@/lib/email";
import { syncToSubscribers } from "@/lib/subscribers";
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear() % 100;
  
  const { data: counter, error: fetchError } = await supabase
    .from('invoice_counter')
    .select('*')
    .eq('id', 1)
    .single();

  if (fetchError || !counter) {
    await supabase.from('invoice_counter').upsert({ id: 1, current_number: 1, year: currentYear });
    return `ASTRO${currentYear}001`;
  }

  let nextNumber = counter.current_number + 1;
  let year = counter.year;

  if (year !== currentYear) {
    nextNumber = 1;
    year = currentYear;
  }

  await supabase
    .from('invoice_counter')
    .update({ current_number: nextNumber, year: year })
    .eq('id', 1);

  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `ASTRO${year}${paddedNumber}`;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Strict validation for birth details
    if (!bookingData.date_of_birth || !bookingData.time_of_birth) {
      return NextResponse.json(
        { success: false, message: "Birth date and birth time are strictly compulsory." },
        { status: 400 }
      );
    }

    // Validate business hours
    const bookingDate = new Date(bookingData.booking_date);
    const dayOfWeek = bookingDate.getDay(); // 0 = Sunday, 6 = Saturday
    const bookingTime = bookingData.booking_time;
    
    // Convert time to 24hr format for comparison
    const timeMatch = bookingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid time format" },
        { status: 400 }
      );
    }
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const timeInMinutes = hours * 60 + minutes;
    
      // Sunday: 10 AM - 7 PM (10:00 = 600 minutes, 19:00 = 1140 minutes)
      if (dayOfWeek === 0) {
        if (timeInMinutes < 600 || timeInMinutes >= 1140) {
          return NextResponse.json(
            { 
              success: false, 
              message: "Sunday slots are available from 10:00 AM to 7:00 PM.",
              error: "INVALID_TIME_SUNDAY"
            },
            { status: 400 }
          );
        }
      }
    
    // Saturday: 11 AM - 5 PM (11:00 = 660 minutes, 17:00 = 1020 minutes)
    if (dayOfWeek === 6) {
      if (timeInMinutes < 660 || timeInMinutes >= 1020) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Saturday slots are only available from 11:00 AM to 5:00 PM.",
            error: "INVALID_TIME_SATURDAY"
          },
          { status: 400 }
        );
      }
    }
    
    // Sunday-Saturday validation (existing logic) ...
    
    // Check if the date is explicitly blocked in availability table
    const { data: availabilityData } = await supabase
      .from("availability")
      .select("is_available, notes")
      .eq("date", bookingData.booking_date)
      .maybeSingle();

    if (availabilityData && availabilityData.is_available === false) {
      return NextResponse.json(
        { 
          success: false, 
          message: `This date (${bookingData.booking_date}) is not available for bookings. ${availabilityData.notes ? `Reason: ${availabilityData.notes}` : "Please choose another date."}`,
          error: "DATE_NOT_AVAILABLE"
        },
        { status: 409 }
      );
    }

    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("booking_date", bookingData.booking_date)
      .eq("booking_time", bookingData.booking_time)
      .in("status", ["pending", "confirmed", "completed"])
      .maybeSingle();

    if (existingBooking) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This time slot has already been booked by another user. Please select a different time.",
          error: "SLOT_ALREADY_BOOKED"
        },
        { status: 409 }
      );
    }

      const invoiceNumber = await generateInvoiceNumber();

        const { data, error } = await supabase
          .from("bookings")
          .insert([
            {
              full_name: bookingData.full_name,
              email: bookingData.email,
              phone: bookingData.phone,
              city: bookingData.city,
              address: bookingData.address,
              date_of_birth: bookingData.date_of_birth,
              time_of_birth: bookingData.time_of_birth,
              place_of_birth: bookingData.place_of_birth,
              service_type: bookingData.service_type,
              booking_date: bookingData.booking_date,
              booking_time: bookingData.booking_time,
              special_requests: bookingData.special_requests,
              payment_status: bookingData.payment_status || "pending",
              payment_id: bookingData.payment_intent_id,
              amount: bookingData.amount,
              status: bookingData.status || "pending",
              invoice_number: invoiceNumber,
            },
          ])
          .select();

      if (error) {
        console.error("Supabase error:", error);
        
        // Handle unique constraint violation (duplicate key)
        if (error.code === '23505' || (error.message && error.message.includes('unique_booking_slot'))) {
          return NextResponse.json(
            { 
              success: false, 
              message: "This time slot has just been booked. Please select a different time.",
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

      const booking = data[0];

      // Sync to unified mailing list
      if (booking.email) {
        await syncToSubscribers(booking.email, booking.full_name, 'booking');
      }

      // Auto-create invoice in invoices table
    try {
      await supabase.from("invoices").insert([{
        invoice_number: invoiceNumber,
        booking_id: booking.id,
        user_name: booking.full_name,
        user_email: booking.email,
        user_phone: booking.phone || '',
        user_address: booking.address || booking.city || '',
        service_type: booking.service_type,
        service_description: `${booking.service_type} - Consultation on ${booking.booking_date} at ${booking.booking_time}`,
        amount: booking.amount || 0,
        tax_amount: 0,
        total_amount: booking.amount || 0,
        notes: 'Thank you for choosing Katyaayani Astrologer.',
        disclaimer: 'This invoice is auto-generated at the time of booking. For any queries, contact us at katyaayaniastrologer01@gmail.com',
        status: 'paid',
      }]);
    } catch (invoiceErr) {
      console.error("Auto-invoice creation error:", invoiceErr);
    }

    // 1. Send Emails via Notification Helper
    await sendBookingNotification(booking, 'new');

    // 2. Telegram Notification removed from here to only fire after payment confirmation in callback

    return NextResponse.json({ success: true, data, invoiceNumber });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (date) {
      query = query.eq("booking_date", date);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
