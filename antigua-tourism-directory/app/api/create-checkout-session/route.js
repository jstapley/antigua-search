// app/api/create-checkout-session/route.js
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const { listingId, listingName, userEmail } = await request.json()

    if (!listingId || !listingName || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: listing, error: listingError } = await supabaseAdmin
      .from('listings')
      .select('id, business_name, slug, featured, featured_until, stripe_customer_id')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    let customerId = listing.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { listingId, listingName }
      })
      customerId = customer.id

      await supabaseAdmin
        .from('listings')
        .update({ stripe_customer_id: customerId })
        .eq('id', listingId)
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.antiguasearch.com'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_FEATURED_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&listing_id=${listingId}`,
      cancel_url: `${siteUrl}/listing/${listing.slug}`,
      metadata: {
        listingId,
        listingName,
        userEmail,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}