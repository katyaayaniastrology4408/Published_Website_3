import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic' ; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  const upcoming = searchParams.get('upcoming') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('important_days')
      .select('*')
      .order('date', { ascending: true });

    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('date', today).limit(limit);
    } else {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching important days:', error);
    return NextResponse.json(
      { error: 'Failed to fetch important days' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, title_gujarati, title_hindi, title_english, description_gujarati, description_hindi, description_english, category, is_holiday } = body;

    if (!date || !title_gujarati) {
      return NextResponse.json(
        { error: 'Date and Gujarati title are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('important_days')
      .insert({
        date,
        title_gujarati,
        title_hindi,
        title_english,
        description_gujarati,
        description_hindi,
        description_english,
        category: category || 'festival',
        is_holiday: is_holiday || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating important day:', error);
    return NextResponse.json(
      { error: 'Failed to create important day' },
      { status: 500 }
    );
  }
}
