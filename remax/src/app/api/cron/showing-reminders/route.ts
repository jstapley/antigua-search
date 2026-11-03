import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'RE/MAX 365 Antigua <info@remax-365-antigua.com>'
const BASE_URL = 'https://www.remax-365-antigua.com'

const REMINDER_INTERVALS = [30, 60, 90]

const OUTCOME_LABELS: Record<string, string> = {
  interested: 'Interested',
  not_interested: 'Not Interested',
  pending: 'Undecided',
}

/** Returns a YYYY-MM-DD date string for N days ago (UTC). */
function dateMinusDays(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export async function GET(req: Request) {
  // Vercel automatically provides this header when invoking cron routes.
  // Set CRON_SECRET in your Vercel environment variables.
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceSupabase()
  const summary: { interval: number; checked: number; sent: number; errors: number }[] = []

  for (const days of REMINDER_INTERVALS) {
    const targetDate = dateMinusDays(days)
    let sent = 0
    let errors = 0

    // Find showings on the target date that have an assigned agent
    const { data: showings, error: showingsError } = await supabase
      .from('showings')
      .select('*')
      .eq('showing_date', targetDate)
      .not('agent_id', 'is', null)

    if (showingsError) {
      console.error(`[cron/showing-reminders] Error fetching showings for ${days}-day interval:`, showingsError)
      summary.push({ interval: days, checked: 0, sent: 0, errors: 1 })
      continue
    }

    if (!showings?.length) {
      summary.push({ interval: days, checked: 0, sent: 0, errors: 0 })
      continue
    }

    // Look up agent details for all relevant agent IDs in one query
    const agentIds = Array.from(new Set(showings.map(s => s.agent_id as string)))
    const { data: agents } = await supabase
      .from('agents')
      .select('id, name, email')
      .in('id', agentIds)

    const agentMap = new Map((agents ?? []).map(a => [a.id, a]))

    for (const showing of showings) {
      const agent = agentMap.get(showing.agent_id)
      if (!agent?.email) continue

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: agent.email,
          subject: `${days}-Day Follow-Up Reminder: ${showing.client_name} — ${showing.property_name}`,
          html: generateReminderEmail({
            agentName: agent.name,
            clientName: showing.client_name,
            propertyName: showing.property_name,
            propertySlug: showing.property_slug,
            showingDate: showing.showing_date,
            showingTime: showing.showing_time,
            outcome: showing.outcome,
            agentNotes: showing.agent_notes,
            daysAgo: days,
          }),
        })
        sent++
      } catch (e) {
        console.error(`[cron/showing-reminders] Failed to send ${days}-day reminder for showing ${showing.id}:`, e)
        errors++
      }
    }

    summary.push({ interval: days, checked: showings.length, sent, errors })
  }

  return NextResponse.json({ success: true, date: new Date().toISOString(), summary })
}

function generateReminderEmail(opts: {
  agentName: string
  clientName: string
  propertyName: string
  propertySlug: string | null
  showingDate: string
  showingTime: string
  outcome: string
  agentNotes: string | null
  daysAgo: number
}) {
  const {
    agentName, clientName, propertyName, propertySlug,
    showingDate, showingTime, outcome, agentNotes, daysAgo,
  } = opts

  const formattedDate = formatDate(showingDate)
  const outcomeLabel = OUTCOME_LABELS[outcome] || outcome
  const propertyUrl = propertySlug ? `${BASE_URL}/properties/${propertySlug}` : null

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #0c2749; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Follow-Up Reminder</h1>
        <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">RE/MAX 365 Antigua — ${daysAgo}-Day Check-In</p>
      </div>
      <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
        <p style="color: #0f172a; font-size: 15px; line-height: 1.6; margin-top: 0;">Hi ${agentName},</p>
        <p style="color: #0f172a; font-size: 15px; line-height: 1.6;">
          It has been <strong>${daysAgo} days</strong> since
          <strong>${clientName}</strong> viewed <strong>${propertyName}</strong>.
          This is your reminder to follow up if you haven&apos;t already.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px; color: #0c2749; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
            Showing Summary
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 130px;">Client</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Property</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">
                ${propertyUrl
                  ? `<a href="${propertyUrl}" style="color: #0c2749; font-weight: 600; text-decoration: none;">${propertyName}</a>`
                  : `<strong>${propertyName}</strong>`}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Showing Date</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${formattedDate} at ${showingTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Outcome</td>
              <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${outcomeLabel}</td>
            </tr>
          </table>
          ${agentNotes ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
              Client Feedback
            </p>
            <p style="margin: 0; color: #0f172a; font-size: 14px; line-height: 1.6;">${agentNotes}</p>
          </div>` : ''}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${BASE_URL}/admin/showings"
            style="display: inline-block; background: #0c2749; color: white; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none;">
            View Showing in Admin →
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
