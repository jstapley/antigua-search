import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}
