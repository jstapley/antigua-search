import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from('showings').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServiceSupabase()
  const { error } = await supabase.from('showings').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}