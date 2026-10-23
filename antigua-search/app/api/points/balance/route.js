// app/api/points/balance/route.js
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { data: points } = await supabase
      .from('user_points')
      .select('total_points, lifetime_points, reward_claimed_at, updated_at')
      .eq('user_id', user_id)
      .single()

    const { data: transactions } = await supabase
      .from('point_transactions')
      .select('points, action, description, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      total_points: points?.total_points || 0,
      lifetime_points: points?.lifetime_points || 0,
      reward_claimed_at: points?.reward_claimed_at || null,
      recent_transactions: transactions || []
    })

  } catch (err) {
    console.error('Points balance error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
