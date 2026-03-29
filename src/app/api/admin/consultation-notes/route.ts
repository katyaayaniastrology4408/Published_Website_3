import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const userEmail = searchParams.get('user_email');
    
    const supabase = getSupabase();
    let query = supabase.from('consultation_notes').select('*').order('created_at', { ascending: false });
    
    if (userId) query = query.eq('user_id', userId);
    if (userEmail) query = query.eq('user_email', userEmail);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, user_email, note, category } = body;
    
    if (!user_id || !user_email || !note) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('consultation_notes')
      .insert({ user_id, user_email, note, category: category || 'general' })
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    
    const supabase = getSupabase();
    const { error } = await supabase.from('consultation_notes').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
