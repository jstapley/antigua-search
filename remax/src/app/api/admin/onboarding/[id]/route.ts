import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { getServiceSupabase } from '@/lib/supabase'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('onboarding_submissions')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
