import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'

export async function GET() {
  try {
    const admin = await isAdmin()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('Clients GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await isAdmin()
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await req.json()
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from('clients').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('Clients POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}