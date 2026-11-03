import { getServiceSupabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, email')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}