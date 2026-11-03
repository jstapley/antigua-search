import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { property_id, property_slug, event_type } = body

    console.log('[TRACK] Received:', { property_id, property_slug, event_type })

    if (!property_slug || !event_type) {
      console.log('[TRACK] Missing fields')
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const referrer = req.headers.get('referer') || null
    const user_agent = req.headers.get('user-agent') || null

    const supabase = getServiceSupabase()

    // First check the table exists
    const { error: tableError } = await supabase
      .from('property_events')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('[TRACK] Table check failed:', tableError.message)
      return NextResponse.json({ error: 'Table error: ' + tableError.message }, { status: 500 })
    }

    const { data, error } = await supabase.from('property_events').insert({
      property_id: property_id || null,
      property_slug,
      event_type,
      referrer,
      user_agent,
    }).select()

    if (error) {
      console.error('[TRACK] Insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('[TRACK] Saved:', data)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[TRACK] Exception:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
