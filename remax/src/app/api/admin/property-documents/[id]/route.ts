import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = getServiceSupabase()
 
  const { data: doc, error: fetchError } = await supabase
    .from('property_documents')
    .select('file_path')
    .eq('id', params.id)
    .single()
 
  if (fetchError || !doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
 
  if (doc.file_path) {
    await supabase.storage.from('property-documents').remove([doc.file_path])
  }
 
  const { error } = await supabase.from('property_documents').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
 
  return NextResponse.json({ success: true })
}
 