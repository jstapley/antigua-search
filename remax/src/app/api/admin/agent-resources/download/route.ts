import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
 
  const supabase = getServiceSupabase()
 
  const { data: resource, error: fetchError } = await supabase
    .from('agent_resources')
    .select('file_path, name')
    .eq('id', id)
    .single()
 
  if (fetchError || !resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
 
  const { data, error } = await supabase.storage
    .from('agent-resources')
    .createSignedUrl(resource.file_path, 60)
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ url: data.signedUrl })
}
 