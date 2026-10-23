import { sendListingApprovalEmail } from '@/lib/resend'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    console.log('notify-approval called with:', data)
    
    // Revalidate the listing page so it's live immediately
    revalidatePath(`/listing/${data.listing_slug}`)
    revalidatePath('/category/[slug]', 'page')
    revalidatePath('/')

    const result = await sendListingApprovalEmail(data)
    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error('Approval email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}