import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
 
export const maxDuration = 60
 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get('propertyId')
  if (!propertyId) return NextResponse.json({ error: 'Missing propertyId' }, { status: 400 })
 
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
 
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const propertyId = formData.get('propertyId') as string
    const category = formData.get('category') as string
    const name = formData.get('name') as string
 
    if (!file || !propertyId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
 
    const supabase = getServiceSupabase()
 
    const fileExt = file.name.split('.').pop()
    const filePath = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
 
    const { error: uploadError } = await supabase.storage
      .from('property-documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })
 
    if (uploadError) throw new Error(uploadError.message)
 
    const { data, error: dbError } = await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        name,
        category,
        file_path: filePath,
        file_url: filePath, // keep for backwards compat
        file_size: file.size,
      })
      .select()
      .single()
 
    if (dbError) throw new Error(dbError.message)
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed' }, { status: 500 })
  }
}
 
 