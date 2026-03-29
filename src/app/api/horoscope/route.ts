import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export const dynamic = 'force-dynamic' ; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get('sign');
  const type = searchParams.get('type') || 'daily';
  const day = searchParams.get('day') || 'today';

  if (!sign) {
    return NextResponse.json({ error: 'Sign is required' }, { status: 400 });
  }

  try {
    if (type === 'yearly') {
      const currentYear = new Date().getFullYear();
      
      // Check database for current year horoscope
      const { data: existing, error: dbError } = await supabase
        .from('yearly_horoscopes')
        .select('*')
        .eq('sign', sign.toLowerCase())
        .eq('year', currentYear)
        .single();

      if (existing) {
        return NextResponse.json({ 
          success: true, 
          data: JSON.parse(existing.horoscope_data),
          source: 'database'
        });
      }

      // If not in DB, fetch monthly as a fallback/yearly base
      // Since no free yearly API found, we use monthly but mark it for the year
      const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${sign}`;
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`External API responded with status ${response.status}`);
      }

      const externalData = await response.json();
      
      // Store in DB
      await supabase.from('yearly_horoscopes').upsert({
        sign: sign.toLowerCase(),
        year: currentYear,
        horoscope_data: JSON.stringify(externalData.data),
        updated_at: new Date().toISOString()
      }, { onConflict: 'sign,year' });

      return NextResponse.json({ 
        success: true, 
        data: externalData.data,
        source: 'external'
      });
    }

    // Default daily/monthly logic
    const url = type === 'monthly' 
      ? `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/monthly?sign=${sign}`
      : `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=${day}`;

    const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Horoscope error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
