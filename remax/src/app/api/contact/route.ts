import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, message, property_slug } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store in Supabase (optional - create a leads table)
    // const supabase = getServiceSupabase()
    // await supabase.from('leads').insert({ name, email, phone, message, property_slug })

    // TODO: Send email notification via Resend, SendGrid, or Nodemailer
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({ from: '...', to: '...', subject: '...', html: '...' })

    console.log('Contact form submission:', { name, email, phone, message, property_slug })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
