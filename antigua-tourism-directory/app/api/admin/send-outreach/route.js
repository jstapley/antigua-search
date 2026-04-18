import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const MERGE_TAGS = {
  '{{business_name}}': (l) => l.business_name || '',
  '{{category}}': (l) => l.category?.name || '',
  '{{parish}}': (l) => l.parish?.name || '',
  '{{listing_url}}': (l) => `https://www.antiguasearch.com/listing/${l.slug}`,
  '{{contact_name}}': (l) => l.contact_name || '',
  '{{phone}}': (l) => l.phone || '',
  '{{website}}': (l) => l.website || '',
}

function mergeTags(text, listing) {
  let result = text
  for (const [tag, fn] of Object.entries(MERGE_TAGS)) {
    result = result.replaceAll(tag, fn(listing))
  }
  return result
}

export async function POST(req) {
  try {
    const {
      listing_id,
      template_id,
      campaign_type,
      sent_to,
      subject,
      html_body,
      notes
    } = await req.json()

    if (!listing_id || !sent_to || !subject || !html_body || !campaign_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch full listing for merge tags
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('listings')
      .select(`
        *,
        category:categories(name),
        parish:parishes(name)
      `)
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return Response.json({ error: 'Listing not found' }, { status: 404 })
    }

    // Merge tags into subject and body
    const mergedSubject = mergeTags(subject, listing)
    const mergedBody = mergeTags(html_body, listing)

    // Send via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AntiguaSearch <registrations@antiguasearch.com>',
        reply_to: 'jeff@stapleyinc.com',
        to: [sent_to],
        subject: mergedSubject,
        html: mergedBody,
        tags: [
          { name: 'campaign_type', value: campaign_type },
          { name: 'listing_id', value: listing_id }
        ]
      })
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      return Response.json({ error: 'Resend error', details: resendData }, { status: 500 })
    }

    // Log the contact record
    const { error: logError } = await supabaseAdmin
      .from('email_contacts')
      .insert({
        listing_id,
        template_id: null,
        campaign_type,
        sent_to,
        subject: mergedSubject,
        status: 'sent',
        notes: notes || null,
        resend_email_id: resendData.id || null
      })

    if (logError) {
      console.error('Log error:', logError)
    }

    return Response.json({ success: true, email_id: resendData.id })

  } catch (err) {
    console.error('send-outreach error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}