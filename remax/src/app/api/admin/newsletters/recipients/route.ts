// ============================================================
// FILE 2: src/app/api/admin/newsletters/recipients/route.ts
// GET — count eligible recipients
// ============================================================
import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function GET() {
  const supabase = getServiceSupabase()
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .not('email', 'is', null)
    .eq('newsletter_unsubscribed', false)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ count })
}