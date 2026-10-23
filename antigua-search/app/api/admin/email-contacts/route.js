import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const campaign_type = searchParams.get('campaign_type')
    const listing_id = searchParams.get('listing_id')

    let query = supabaseAdmin
      .from('email_contacts')
      .select(`
        *,
        listing:listings(id, business_name, slug)
      `)
      .order('sent_at', { ascending: false })
      .limit(200)

    if (campaign_type && campaign_type !== 'all') {
      query = query.eq('campaign_type', campaign_type)
    }

    if (listing_id) {
      query = query.eq('listing_id', listing_id)
    }

    const { data, error } = await query

    if (error) throw error

    return Response.json(data || [])

  } catch (err) {
    console.error('email-contacts GET error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, notes } = await req.json()

    if (!id) {
      return Response.json({ error: 'Missing contact id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('email_contacts')
      .update({ notes })
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })

  } catch (err) {
    console.error('email-contacts PATCH error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    if (!id) {
      return Response.json({ error: 'Missing contact id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('email_contacts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return Response.json({ success: true })

  } catch (err) {
    console.error('email-contacts DELETE error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}