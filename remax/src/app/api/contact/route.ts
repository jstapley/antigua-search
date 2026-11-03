import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'RE/MAX 365 Antigua <info@remax-365-antigua.com>'
const TEAM_EMAIL = 'michelglass@remax-365-antigua.com'

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const data = await res.json()
  return data.success === true
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, message, property_slug, turnstileToken, elapsed } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Bot check: submitted too fast (under 3 seconds)
    if (typeof elapsed === 'number' && elapsed < 3000) {
      return NextResponse.json({ error: 'Submission too fast. Please try again.' }, { status: 400 })
    }

    // Honeypot: if the client sent a non-empty website field, silently succeed but don't save
    if (body.honeypot) {
      return NextResponse.json({ success: true })
    }

    // Verify Turnstile token
    if (!turnstileToken) {
      return NextResponse.json({ error: 'Security check required' }, { status: 400 })
    }
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Save to clients table
    await supabase.from('clients').insert({
      name,
      email: email || null,
      phone: phone || null,
      source: 'contact_form',
      status: 'new',
      interest: 'buying',
      notes: message,
      property_slug: property_slug || null,
    })

    // Notify team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `New Contact Form Submission — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua Website</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Name</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #0c2749;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${phone}</td></tr>` : ''}
              ${property_slug ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 14px;">Property</td><td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${property_slug}</td></tr>` : ''}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #0c2749;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message</p>
              <p style="margin: 8px 0 0; color: #0f172a; font-size: 14px; line-height: 1.6;">${message}</p>
            </div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
              <a href="https://www.remax-365-antigua.com/admin/clients" style="display: inline-block; background: #0c2749; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Admin CRM →</a>
            </div>
          </div>
        </div>
      `,
    })

    // Auto-reply to client
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Thank you for contacting RE/MAX 365 Antigua`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Thank You for Getting in Touch</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">Thank you for reaching out to RE/MAX 365 Antigua. We've received your message and one of our agents will be in touch with you shortly.</p>
            <div style="margin: 24px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #0c2749;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Your Message</p>
              <p style="margin: 8px 0 0; color: #0f172a; font-size: 14px; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">In the meantime, feel free to browse our latest property listings on our website.</p>
            <div style="margin-top: 24px;">
              <a href="https://www.remax-365-antigua.com/properties" style="display: inline-block; background: #0c2749; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Browse Properties →</a>
            </div>
            <p style="margin-top: 32px; color: #64748b; font-size: 13px; line-height: 1.6;">
              Best regards,<br/>
              <strong style="color: #0f172a;">The RE/MAX 365 Antigua Team</strong><br/>
              <a href="mailto:info@remax-365-antigua.com" style="color: #0c2749;">info@remax-365-antigua.com</a>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}