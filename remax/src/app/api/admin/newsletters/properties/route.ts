// ============================================================
// FILE 3: src/app/api/admin/newsletters/properties/route.ts
// GET — fetch new properties since last send
// ============================================================
import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since') || '2000-01-01'
 
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, slug, price, currency, property_type, bedrooms, bathrooms, location, images, short_description, created_at')
    .eq('status', 'active')
    .gt('created_at', since)
    .order('created_at', { ascending: false })
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}