// app/api/admin/listings/route.js
// Server-side API route that bypasses Supabase's 1000 row limit
// Uses service role key to paginate through all listings

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function fetchAllPaginated(table, select, extraFilters = []) {
  let allData = []
  let from = 0

  while (true) {
    let query = supabaseAdmin
      .from(table)
      .select(select)
      .range(from, from + 999)

    for (const filter of extraFilters) {
      query = query[filter.method](...filter.args)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      break
    }

    allData = allData.concat(data || [])

    if (!data || data.length < 1000) break
    from += 1000
  }

  return allData
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'stats') {
      // Fetch all listings for stats (paginated)
      const allListings = await fetchAllPaginated('listings', 'status')
      const allReviews = await fetchAllPaginated('reviews', 'status')

      const { data: allUsers } = await supabaseAdmin
        .from('user_profiles')
        .select('id')

      const { data: allCategories } = await supabaseAdmin
        .from('categories')
        .select('id')

      const { data: pendingClaims } = await supabaseAdmin
        .from('claimed_listings')
        .select('id')
        .eq('verified', false)

      return NextResponse.json({
        totalListings: allListings.length,
        activeListings: allListings.filter(l => l.status === 'active').length,
        pendingListings: allListings.filter(l => l.status === 'pending').length,
        totalUsers: allUsers?.length || 0,
        totalCategories: allCategories?.length || 0,
        pendingClaims: pendingClaims?.length || 0,
        totalReviews: allReviews.length,
        pendingReviews: allReviews.filter(r => r.status === 'pending').length,
        approvedReviews: allReviews.filter(r => r.status === 'approved').length,
      })
    }

    if (type === 'listings') {
      // Fetch all listings with category and parish (paginated)
      const allListings = await fetchAllPaginated(
        'listings',
        '*, category:categories(name, icon_emoji), parish:parishes(name)',
        [{ method: 'order', args: ['created_at', { ascending: false }] }]
      )

      return NextResponse.json(allListings)
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })

  } catch (error) {
    console.error('Admin listings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}