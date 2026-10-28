// app/api/notify-review/route.js
import { sendNewReviewNotification } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { business_name, listing_slug, reviewer_name, rating, title, comment } = body

    if (!business_name || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await sendNewReviewNotification({ business_name, listing_slug, reviewer_name, rating, title, comment })

    if (!result.success) {
      console.error('Review notification failed:', result.error)
    }

    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error('notify-review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
