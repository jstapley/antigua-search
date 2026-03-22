// app/api/stripe-webhook/route.js
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

async function sendEmail(to, subject, html) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: 'registrations@antiguasearch.com', to, subject, html })
  })
  return response.ok
}

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature error:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    if (session.payment_status === 'paid') {
      const { listingId, listingName, userEmail } = session.metadata

      const featuredUntil = new Date()
      featuredUntil.setFullYear(featuredUntil.getFullYear() + 1)

      const { error } = await supabaseAdmin
        .from('listings')
        .update({
          featured: true,
          featured_until: featuredUntil.toISOString(),
          stripe_subscription_id: session.id,
        })
        .eq('id', listingId)

      if (error) {
        console.error('Error updating listing:', error)
        return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 })
      }

      console.log(`✅ Featured listing activated: ${listingName}`)

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiguasearch.com'
      const siteName = siteUrl.includes('grenada') ? 'GrenadaSearch.com' : 'AntiguaSearch.com'
      const expiryDate = featuredUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

      await sendEmail(
        userEmail,
        `⭐ Your Featured Listing is Live! - ${listingName}`,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #318DD0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">⭐ You're Featured!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333;">Congratulations!</h2>
            <p style="color: #555; font-size: 16px;"><strong>${listingName}</strong> is now a Featured Listing on ${siteName}.</p>
            <ul style="color: #555;">
              <li>⭐ Gold border & featured badge</li>
              <li>🔝 Top of category placement</li>
              <li>🏠 Homepage featured section</li>
            </ul>
            <p style="color: #555;">Your featured listing is active until <strong>${expiryDate}</strong>.</p>
            <p style="color: #555;">We'll send you a reminder 30 days before it expires.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${siteUrl}" style="background: #318DD0; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Visit ${siteName}</a>
            </div>
          </div>
        </div>
        `
      )
    }
  }

  return NextResponse.json({ received: true })
}