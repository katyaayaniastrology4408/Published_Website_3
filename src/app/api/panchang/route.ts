import { NextRequest, NextResponse } from 'next/server';
import { calculatePanchang } from '@/lib/panchang';
export const dynamic = 'force-dynamic' ; 

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // If month & year provided, return tithi data for entire month
    if (month !== null && year !== null) {
      const m = parseInt(month);
      const y = parseInt(year);
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const tithis = [];

        for (let day = 1; day <= daysInMonth; day++) {
            // 6 AM IST = 00:30 UTC — use UTC constructor for consistent results
            const date = new Date(Date.UTC(y, m, day, 0, 30));
          const panchang = calculatePanchang(date);
          tithis.push({
            date: `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            tithi: panchang.tithi,
            paksha: panchang.paksha,
            nakshatra: panchang.nakshatra,
            yoga: panchang.yoga,
            karana: panchang.karana,
            moonRashi: panchang.moonRashi,
            sunRashi: panchang.sunRashi,
            hinduMonth: panchang.hinduMonth,
            vaara: panchang.vaara,
          });
        }

      return NextResponse.json(
        { success: true, data: tithis },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
          },
        }
      );
    }

    // Default: today's panchang — calculate at sunrise (~7 AM IST = 01:30 UTC)
    // Hindu panchang convention: tithi/nakshatra at sunrise governs the day
    const now = new Date();
    // Get today's IST date
    const istMs = now.getTime() + 5.5 * 60 * 60 * 1000;
    const istNow = new Date(istMs);
    const y = istNow.getUTCFullYear();
    const m = istNow.getUTCMonth();
    const d = istNow.getUTCDate();
    // Sunrise in Ahmedabad is ~7:00 AM IST = 01:30 UTC
    const sunriseUTC = new Date(Date.UTC(y, m, d, 1, 30));
    const panchang = calculatePanchang(sunriseUTC);
    return NextResponse.json(
      { success: true, data: panchang },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error calculating panchang:', error);
    return NextResponse.json(
      { error: 'Failed to calculate panchang' },
      { status: 500 }
    );
  }
}
