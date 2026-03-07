import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ 
      error: 'Missing env vars', 
      hasUrl: !!url, 
      hasKey: !!key 
    }, { status: 500 })
  }

  const supabase = createClient(url, key)

  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  if (error) {
    return NextResponse.json({ 
      error: error.message, 
      code: error.code 
    }, { status: 500 })
  }

  const num = count ?? 0
  return NextResponse.json({ count: num, display: String(num) })
}
// force rebuild 03/07/2026 11:41:21
