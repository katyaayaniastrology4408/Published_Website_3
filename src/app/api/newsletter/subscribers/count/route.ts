import { NextResponse } from 'next/server';
import { getUnifiedSubscribers } from '@/lib/subscribers';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subscribers = await getUnifiedSubscribers();
    return NextResponse.json({ success: true, count: subscribers.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ success: false, count: 0 });
  }
}
