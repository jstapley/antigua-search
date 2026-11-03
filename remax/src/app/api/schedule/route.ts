import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TEAM_EMAIL = 'michelglass@remax-365-antigua.com'
const FROM_EMAIL = 'RE/MAX 365 Antigua <info@remax-365-antigua.com>'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, time, name, email, phone, notes } = body

    if (!date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Save to clients table
    await supabase.from('clients').insert({
      name,
      email: email || null,
      phone: phone || null,
      source: 'schedule_form',
      status: 'new',
      interest: 'buying',
      notes: notes
        ? `Viewing requested: ${date} at ${time}. ${notes}`
        : `Viewing requested: ${date} at ${time}`,
    })

    const formattedDate = formatDate(date)

    // Notify team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `New Viewing Request — ${name} on ${formattedDate}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Viewing Request</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua Website</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0; color: #166534; font-size: 15px; font-weight: 600;">📅 ${formattedDate} at ${time}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #0c2749;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone</td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${phone}</td>
              </tr>` : ''}
            </table>
            ${notes ? `
            <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #0c2749;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Additional Notes</p>
              <p style="margin: 8px 0 0; color: #0f172a; font-size: 14px; line-height: 1.6;">${notes}</p>
            </div>` : ''}
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
      subject: `Your Viewing Request — RE/MAX 365 Antigua`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Viewing Request Received</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">Thank you for requesting a property viewing with RE/MAX 365 Antigua. We've received your request and one of our agents will confirm your appointment shortly.</p>
            <div style="margin: 24px 0; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px;">
              <p style="margin: 0; color: #166534; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Your Requested Time</p>
              <p style="margin: 8px 0 0; color: #166534; font-size: 16px; font-weight: 700;">📅 ${formattedDate} at ${time}</p>
            </div>
            ${notes ? `
            <div style="margin: 16px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #0c2749;">
              <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Your Notes</p>
              <p style="margin: 8px 0 0; color: #0f172a; font-size: 14px; line-height: 1.6;">${notes}</p>
            </div>` : ''}
            <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">If you need to make any changes or have questions, please don't hesitate to reach out to us directly.</p>
            <p style="margin-top: 32px; color: #64748b; font-size: 13px; line-height: 1.6;">
              Best regards,<br/>
              <strong style="color: #0f172a;">The RE/MAX 365 Antigua Team</strong><br/>
              <a href="mailto:michelglass@remax-365-antigua.com" style="color: #0c2749;">michelglass@remax-365-antigua.com</a>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Schedule error:', error)
    return NextResponse.json({ error: 'Failed to book meeting' }, { status: 500 })
  }
}