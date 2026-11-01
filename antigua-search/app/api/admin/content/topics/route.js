// app/api/admin/content/topics/route.js
// CRUD for content_topics table

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('content_topics')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const { title, brief, urgency = 'MEDIUM' } = await request.json()
  if (!title?.trim() || !brief?.trim()) {
    return Response.json({ error: 'title and brief are required' }, { status: 400 })
  }
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('content_topics')
    .insert([{ title: title.trim(), brief: brief.trim(), urgency }])
    .select()
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(request) {
  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const supabase = getSupabase()
  const { error } = await supabase.from('content_topics').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
