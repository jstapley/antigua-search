// app/api/cron/featured-reminders/route.js
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiguasearch.com'
  const siteName = siteUrl.includes('grenada') ? 'GrenadaSearch.com' : 'AntiguaSearch.com'

  const now = new Date()

  // Find listings expiring in 30 days
  const in30Days = new Date(now)
  in30Days.setDate(in30Days.getDate() + 30)
  const in29Days = new Date(now)
  in29Days.setDate(in29Days.getDate() + 29)

  // Find listings expiring in 7 days
  const in7Days = new Date(now)
  in7Days.setDate(in7Days.getDate() + 7)
  const in6Days = new Date(now)
  in6Days.setDate(in6Days.getDate() + 6)

  // Get 30-day expiring listings
  const { data: expiring30 } = await supabaseAdmin
    .from('listings')
    .select('id, business_name, slug, featured_until, email')
    .eq('featured', true)
    .gte('featured_until', in29Days.toISOString())
    .lte('featured_until', in30Days.toISOString())

  // Get 7-day expiring listings
  const { data: expiring7 } = await supabaseAdmin
    .from('listings')
    .select('id, business_name, slug, featured_until, email')
    .eq('featured', true)
    .gte('featured_until', in6Days.toISOString())
    .lte('featured_until', in7Days.toISOString())

  // Expire listings that have passed their featured_until date
  const { error: expireError } = await supabaseAdmin
    .from('listings')
    .update({ featured: false })
    .eq('featured', true)
    .lt('featured_until', now.toISOString())

  if (expireError) {
    console.error('Error expiring listings:', expireError)
  }

  let emailsSent = 0

  const sendReminderEmail = async (listing, daysLeft) => {
    if (!listing.email) return

    const renewUrl = `${siteUrl}/listing/${listing.slug}`
    const expiryDate = new Date(listing.featured_until).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

    try {
      await resend.emails.send({
        from: `${siteName} <noreply@${siteUrl.replace('https://www.', '')}>`,
        to: listing.email,
        subject: `⚠️ Your Featured Listing expires in ${daysLeft} days — ${listing.business_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f59e0b; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">⚠️ Featured Listing Expiring Soon</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
              <h2 style="color: #333;">Your featured listing expires in ${daysLeft} days</h2>
              <p style="color: #555; font-size: 16px;">
                <strong>${listing.business_name}</strong>'s featured status on ${siteName} expires on <strong>${expiryDate}</strong>.
              </p>
              <p style="color: #555;">Renew now to keep your premium placement:</p>
              <ul style="color: #555;">
                <li>⭐ Gold border & featured badge</li>
                <li>🔝 Top of category placement</li>
                <li>🏠 Homepage featured section</li>
              </ul>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${renewUrl}" style="background: #318DD0; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Renew Featured Listing — EC$350/year
                </a>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
                Visit your listing page to renew.
              </p>
            </div>
          </div>
        `
      })
      emailsSent++
    } catch (error) {
      console.error(`Email error for ${listing.business_name}:`, error)
    }
  }

  for (const listing of (expiring30 || [])) {
    await sendReminderEmail(listing, 30)
  }

  for (const listing of (expiring7 || [])) {
    await sendReminderEmail(listing, 7)
  }

  console.log(`✅ Cron: ${emailsSent} reminder emails sent, listings expired`)

  return NextResponse.json({
    success: true,
    remindersSent: emailsSent,
    expiring30: expiring30?.length || 0,
    expiring7: expiring7?.length || 0,
  })
}
