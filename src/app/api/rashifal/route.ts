import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

const RASHI_DATA = [
  { english: 'aries', gujarati: 'મેષ', hindi: 'मेष' },
  { english: 'taurus', gujarati: 'વૃષભ', hindi: 'वृषभ' },
  { english: 'gemini', gujarati: 'મિથુન', hindi: 'मिथुन' },
  { english: 'cancer', gujarati: 'કર્ક', hindi: 'कर्क' },
  { english: 'leo', gujarati: 'સિંહ', hindi: 'सिंह' },
  { english: 'virgo', gujarati: 'કન્યા', hindi: 'कन्या' },
  { english: 'libra', gujarati: 'તુલા', hindi: 'तुला' },
  { english: 'scorpio', gujarati: 'વૃશ્ચિક', hindi: 'वृश्चिक' },
  { english: 'sagittarius', gujarati: 'ધન', hindi: 'धनु' },
  { english: 'capricorn', gujarati: 'મકર', hindi: 'मकर' },
  { english: 'aquarius', gujarati: 'કુંભ', hindi: 'कुंभ' },
  { english: 'pisces', gujarati: 'મીન', hindi: 'मीन' },
];

// GET daily rashifal
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rashi = searchParams.get('rashi');
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  try {
    if (rashi) {
      // Get specific rashi
      const { data, error } = await supabase
        .from('daily_rashifal')
        .select('*')
        .eq('date', dateStr)
        .eq('rashi', rashi.toLowerCase())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return NextResponse.json({ success: true, data });
    } else {
      // Get all rashis for the date
      const { data, error } = await supabase
        .from('daily_rashifal')
        .select('*')
        .eq('date', dateStr)
        .order('rashi');
      
      if (error) throw error;
      
      return NextResponse.json({ success: true, data, rashiList: RASHI_DATA });
    }
  } catch (error) {
    console.error('Error fetching rashifal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rashifal' },
      { status: 500 }
    );
  }
}

// POST create/update daily rashifal (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, rashifals } = body;
    
    if (!date || !rashifals || !Array.isArray(rashifals)) {
      return NextResponse.json(
        { error: 'Date and rashifals array required' },
        { status: 400 }
      );
    }
    
    // Upsert all rashifals for the date
    const upsertData = rashifals.map((r: any) => {
      const rashiInfo = RASHI_DATA.find(rd => rd.english === r.rashi.toLowerCase());
      return {
        date,
        rashi: r.rashi.toLowerCase(),
        rashi_gujarati: rashiInfo?.gujarati || '',
        rashi_hindi: rashiInfo?.hindi || '',
        content_english: r.content_english,
        content_gujarati: r.content_gujarati || '',
        content_hindi: r.content_hindi || '',
        overall_rating: r.overall_rating || 3,
        love_rating: r.love_rating || 3,
        career_rating: r.career_rating || 3,
        health_rating: r.health_rating || 3,
      };
    });
    
      const { data, error } = await supabase
        .from('daily_rashifal')
        .upsert(upsertData, { onConflict: 'date,rashi' })
        .select();
      
      if (error) throw error;
      
      return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving rashifal:', error);
    return NextResponse.json(
      { error: 'Failed to save rashifal' },
      { status: 500 }
    );
  }
}
