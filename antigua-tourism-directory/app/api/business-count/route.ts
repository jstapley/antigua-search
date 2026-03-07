import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { count, error } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  if (error) {
    return NextResponse.json({ count: 0, display: '200+' }, { status: 500 })
  }

  const num = count ?? 0
  const rounded = Math.floor(num / 10) * 10
  const display = `${rounded}+`

  return NextResponse.json({ count: num, display })
}
