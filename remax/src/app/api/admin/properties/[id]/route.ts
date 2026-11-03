import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'RE/MAX 365 Antigua <info@remax-365-antigua.com>'
const BASE_URL = 'https://www.remax-365-antigua.com'

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  under_offer: 'Under Offer',
  under_contract: 'Under Contract',
  sold: 'Sold',
}

function formatPrice(price: number, currency: string) {
  return `${currency} $${price.toLocaleString()}`
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from('properties').update(body).eq('id', params.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Notify all agents (fire and forget — don't block the response)
    notifyAgentsOfUpdate(data).catch(e => console.error('Agent notification error:', e))

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

async function notifyAgentsOfUpdate(property: Record<string, unknown>) {
  const supabase = getServiceSupabase()
  const { data: agents } = await supabase.from('agents').select('id, name, email').order('name')
  if (!agents?.length) return

  const propertyUrl = `${BASE_URL}/properties/${property.slug}`
  const adminUrl = `${BASE_URL}/admin/properties/${property.id}`

  for (const agent of agents) {
    if (!agent.email) continue
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: agent.email,
        subject: `Listing Updated: ${property.title}`,
        html: generateUpdateEmail({ agent, property, propertyUrl, adminUrl }),
      })
    } catch (e) {
      console.error(`Failed to notify agent ${agent.email}:`, e)
    }
  }
}

function generateUpdateEmail(opts: {
  agent: { name: string; email: string }
  property: Record<string, unknown>
  propertyUrl: string
  adminUrl: string
}) {
  const { agent, property, propertyUrl, adminUrl } = opts
  const images = property.images as string[] | null
  const status = property.status as string
  const statusColor =
    status === 'active' ? '#16a34a' :
    status === 'sold' ? '#dc2626' : '#d97706'

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Listing Updated</h1>
        <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua Admin</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
        <p style="color: #0f172a; font-size: 15px; line-height: 1.6; margin-top: 0;">Hi ${agent.name},</p>
        <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">A property listing has been updated in the system.</p>

        ${images?.[0] ? `
        <div style="margin: 20px 0;">
          <a href="${propertyUrl}">
            <img src="${images[0]}" alt="${property.title}" width="100%"
              style="max-height: 200px; object-fit: cover; border-radius: 10px; display: block;" />
          </a>
        </div>` : ''}

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <a href="${propertyUrl}"
            style="font-size: 17px; font-weight: 700; color: #0c2749; text-decoration: none; display: block; margin-bottom: 12px;">
            ${property.title}
          </a>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 130px;">Location</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${property.location}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Price</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600;">
                ${formatPrice(property.price as number, property.currency as string)}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Status</td>
              <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: ${statusColor};">
                ${STATUS_LABELS[status] || status}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Type</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${property.property_type}</td>
            </tr>
            ${property.bedrooms || property.bathrooms ? `
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Details</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">
                ${[
                  property.bedrooms && `${property.bedrooms} bed`,
                  property.bathrooms && `${property.bathrooms} bath`,
                ].filter(Boolean).join(' · ')}
              </td>
            </tr>` : ''}
          </table>
        </div>

        <div style="margin-top: 20px;">
          <a href="${adminUrl}"
            style="display: inline-block; background: #0c2749; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; margin-right: 12px;">
            Edit in Admin →
          </a>
          <a href="${propertyUrl}"
            style="display: inline-block; background: white; color: #0c2749; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; border: 2px solid #0c2749;">
            View Listing →
          </a>
        </div>

        <p style="margin-top: 32px; color: #64748b; font-size: 13px; line-height: 1.6;">
          Best regards,<br/>
          <strong style="color: #0f172a;">RE/MAX 365 Antigua</strong><br/>
          <a href="mailto:info@remax-365-antigua.com" style="color: #0c2749;">info@remax-365-antigua.com</a>
        </p>
      </div>
    </div>
  `
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getServiceSupabase()
  const { error } = await supabase.from('properties').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
