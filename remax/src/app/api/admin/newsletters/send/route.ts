import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'RE/MAX 365 Antigua <info@remax-365-antigua.com>'
const BASE_URL = 'https://www.remax-365-antigua.com'
const LOGO_URL = 'https://www.remax-365-antigua.com/logo-white.png'

function formatPrice(price: number, currency: string) {
  return `${currency} $${price.toLocaleString()}`
}

function generateEmailHtml(properties: any[], unsubscribeUrl: string) {
  const propertyCards = properties.map(p => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${p.images?.[0] ? `
            <td width="120" style="padding-right: 16px; vertical-align: top;">
              <a href="${BASE_URL}/properties/${p.slug}">
                <img src="${p.images[0]}" alt="${p.title}" width="120" height="80"
                  style="border-radius: 8px; object-fit: cover; display: block;" />
              </a>
            </td>` : ''}
            <td style="vertical-align: top;">
              <a href="${BASE_URL}/properties/${p.slug}"
                style="font-size: 15px; font-weight: 600; color: #0c2749; text-decoration: none;">
                ${p.title}
              </a>
              <p style="margin: 4px 0; color: #64748b; font-size: 13px;">${p.location}</p>
              <p style="margin: 4px 0; color: #2563eb; font-size: 15px; font-weight: 700;">${formatPrice(p.price, p.currency)}</p>
              ${p.bedrooms || p.bathrooms ? `
              <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">
                ${p.bedrooms ? `${p.bedrooms} bed` : ''}${p.bedrooms && p.bathrooms ? ' · ' : ''}${p.bathrooms ? `${p.bathrooms} bath` : ''}
                · ${p.property_type}
              </p>` : ''}
              ${p.short_description ? `<p style="margin: 6px 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">${p.short_description}</p>` : ''}
              <a href="${BASE_URL}/properties/${p.slug}"
                style="display: inline-block; margin-top: 8px; background: #0c2749; color: white; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">
                View Property →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #0c2749; padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <img src="${LOGO_URL}" alt="RE/MAX 365 Antigua" width="260"
          style="display: block; margin: 0 auto 16px; max-width: 200px;" />
        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">New on the Market</h1>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
        <p style="color: #0f172a; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          Here are the latest properties added to our listings. Click any property to view full details, photos, and contact our team.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${propertyCards}
        </table>
        <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <a href="${BASE_URL}/properties"
            style="display: inline-block; background: #0c2749; color: white; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none;">
            Browse All Properties →
          </a>
        </div>
        <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            RE/MAX 365 Antigua · St. John's, Antigua<br/>
            <a href="mailto:info@remax-365-antigua.com" style="color: #94a3b8;">info@remax-365-antigua.com</a>
            · +1 268-724-9308
          </p>
          <p style="margin: 8px 0 0;">
            <a href="${unsubscribeUrl}" style="color: #94a3b8; font-size: 11px;">Unsubscribe from this newsletter</a>
          </p>
        </div>
      </div>
    </div>
  `
}

export async function POST(req: Request) {
  try {
    const { subject, properties, testEmail } = await req.json()
    if (!subject || !properties?.length) {
      return NextResponse.json({ error: 'Subject and properties are required' }, { status: 400 })
    }

    // TEST SEND — just to one email, no DB record
    if (testEmail) {
      const testUnsubscribeUrl = `${BASE_URL}/unsubscribe?token=test`
      await resend.emails.send({
        from: FROM_EMAIL,
        to: testEmail,
        subject,
        html: generateEmailHtml(properties, testUnsubscribeUrl),
      })
      return NextResponse.json({ success: true, sent: 1, test: true })
    }

    // REAL SEND — to all eligible recipients
    const supabase = getServiceSupabase()
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, email, unsubscribe_token')
      .not('email', 'is', null)
      .eq('newsletter_unsubscribed', false)

    if (clientsError) throw new Error(clientsError.message)
    if (!clients?.length) return NextResponse.json({ error: 'No eligible recipients' }, { status: 400 })

    let successCount = 0
    for (const client of clients) {
      const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${client.unsubscribe_token}`
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: client.email,
          subject,
          html: generateEmailHtml(properties, unsubscribeUrl),
        })
        successCount++
      } catch (e) {
        console.error(`Failed to send to ${client.email}:`, e)
      }
    }

    // Record the send
    await supabase.from('newsletters').insert({
      subject,
      sent_at: new Date().toISOString(),
      property_count: properties.length,
      recipient_count: successCount,
      status: 'sent',
    })

    return NextResponse.json({ success: true, sent: successCount })
  } catch (error: unknown) {
    console.error('Newsletter send error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to send' }, { status: 500 })
  }
}