import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const supabase = getServiceSupabase()
    const { data: existing } = await supabase.from('properties').select('id').eq('slug', body.slug).single()
    if (existing) return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 })
    const { data, error } = await supabase.from('properties').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}