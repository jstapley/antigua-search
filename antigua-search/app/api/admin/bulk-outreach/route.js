import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const campaign_type = searchParams.get('campaign_type')

    // Fetch all active listings with claimed status and email
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select(`
        id, business_name, slug, contact_email, email, contact_name, phone, website,
        category:categories(name),
        parish:parishes(name),
        claimed:claimed_listings(id, verified)
      `)
      .eq('status', 'active')
      .order('business_name')

    if (error) return Response.json({ error: error.message }, { status: 500 })

    // Filter unclaimed (no verified claim) that have an email address
    const unclaimed = listings
      .filter(l =>
        !l.claimed?.some(c => c.verified) &&
        (l.contact_email?.trim() || l.email?.trim())
      )
      .map(({ claimed, ...l }) => ({
        ...l,
        effective_email: l.contact_email?.trim() || l.email?.trim()
      }))

    // If campaign_type given, flag listings already contacted with that campaign
    let contactedIds = new Set()
    if (campaign_type) {
      const { data: contacts } = await supabaseAdmin
        .from('email_contacts')
        .select('listing_id')
        .eq('campaign_type', campaign_type)
      contactedIds = new Set(contacts?.map(c => c.listing_id) || [])
    }

    return Response.json(
      unclaimed.map(l => ({ ...l, previously_contacted: contactedIds.has(l.id) }))
    )

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
