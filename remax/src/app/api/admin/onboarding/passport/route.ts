import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  if (!path) return NextResponse.json({ error: 'No path provided' }, { status: 400 })

  const supabase = getServiceSupabase()
  
  // Generate a signed URL valid for 1 hour
  const { data, error } = await supabase.storage
    .from('passports')
    .createSignedUrl(path, 3600)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ url: data.signedUrl })
}
