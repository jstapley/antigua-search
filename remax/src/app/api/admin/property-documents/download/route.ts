import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
 
  const supabase = getServiceSupabase()
 
  const { data: doc, error: fetchError } = await supabase
    .from('property_documents')
    .select('file_path, name')
    .eq('id', id)
    .single()
 
  if (fetchError || !doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
 
  const { data, error } = await supabase.storage
    .from('property-documents')
    .createSignedUrl(doc.file_path, 60) // 60 second expiry
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ url: data.signedUrl })
}
 