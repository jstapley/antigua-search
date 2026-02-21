// app/api/notify-new-listing/route.js
// API endpoint to send email notification when new listing is created

import { sendNewListingNotification } from '@/lib/resend'
import { NextResponse } from 'next/server'

// Add GET handler for testing
export async function GET(request) {
  return NextResponse.json({
    status: 'ok',
    message: 'Email notification API is running',
    info: 'Use POST method to send notifications',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  try {
    const listingData = await request.json()

    // Validate required fields
    if (!listingData.business_name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    // Send the email
    const result = await sendNewListingNotification(listingData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email notification sent',
        emailId: result.emailId
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}