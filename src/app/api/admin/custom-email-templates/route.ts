import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
export const dynamic = 'force-dynamic';

// GET - list all custom templates
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('custom_email_templates')
      .select('id, name, subject, html, created_at')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ templates: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - create new template
export async function POST(req: NextRequest) {
  try {
    const { name, subject, html } = await req.json();
    if (!name?.trim() || !subject?.trim() || !html?.trim()) {
      return NextResponse.json({ error: 'name, subject, and html are required' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('custom_email_templates')
      .insert([{ name: name.trim(), subject: subject.trim(), html }])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, template: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - update existing template
export async function PUT(req: NextRequest) {
  try {
    const { id, name, subject, html } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('custom_email_templates')
      .update({ name: name?.trim(), subject: subject?.trim(), html, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, template: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE - remove template
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('custom_email_templates')
      .delete()
      .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
