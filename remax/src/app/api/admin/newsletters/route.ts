// ============================================================
// FILE 1: src/app/api/admin/newsletters/route.ts
// GET — fetch newsletter history
// ============================================================
import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function GET() {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('newsletters')
    .select('*')
    .eq('status', 'sent')
    .order('sent_at', { ascending: false })
    .limit(10)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}