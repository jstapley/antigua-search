import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
 
  const { data: resource, error: fetchError } = await supabase
    .from('agent_resources')
    .select('file_path')
    .eq('id', params.id)
    .single()
 
  if (fetchError || !resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
 
  if (resource.file_path) {
    await supabase.storage.from('agent-resources').remove([resource.file_path])
  }
 
  const { error } = await supabase.from('agent_resources').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
 
  return NextResponse.json({ success: true })
}