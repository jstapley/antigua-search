// app/api/notify-new-listing/route.js
import { sendNewListingNotification, sendSubmissionConfirmation } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Email notification API is running',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request) {
  try {
    const listingData = await request.json()
    console.log('contact_email received:', listingData.contact_email)
    
    if (!listingData.business_name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }

    // Send both emails in parallel
    const [adminResult, submitterResult] = await Promise.all([
      sendNewListingNotification(listingData),
      sendSubmissionConfirmation(listingData)
    ])

    console.log('Admin result:', adminResult)       // ADD THIS
    console.log('Submitter result:', submitterResult)

    if (!adminResult.success) {
      console.error('Admin notification failed:', adminResult.error)
    }

    if (!submitterResult.success) {
      console.error('Submitter confirmation failed:', submitterResult.error)
    }

    return NextResponse.json({
      success: true,
      adminEmail: adminResult.success,
      submitterEmail: submitterResult.success
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}