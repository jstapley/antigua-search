import { sendClaimApprovalEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    const result = await sendClaimApprovalEmail(data)
    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error('Claim approval email error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}