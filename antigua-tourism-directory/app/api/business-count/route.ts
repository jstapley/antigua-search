import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ count: 0, display: '236' }, { status: 500 })
  }

  const num = count ?? 0

  return NextResponse.json({ count: num, display: String(num) })
}