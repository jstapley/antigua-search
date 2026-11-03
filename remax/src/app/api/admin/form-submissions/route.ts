import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'

// Run this SQL in Supabase to create the table:
// CREATE TABLE form_submissions (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   form_type text NOT NULL,
//   form_title text NOT NULL,
//   form_data jsonb NOT NULL DEFAULT '{}',
//   created_by text,
//   created_at timestamptz DEFAULT now()
// );

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id, form_type, form_title, created_by, created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { form_type, form_title, form_data, created_by } = body
  if (!form_type || !form_title || !form_data) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('form_submissions')
    .insert({ form_type, form_title, form_data, created_by: created_by || null })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
