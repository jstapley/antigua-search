import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const payload = await req.json()

    const { type, data } = payload

    // Resend webhook event types we care about
    if (!['email.opened', 'email.clicked'].includes(type)) {
      return Response.json({ received: true })
    }

    const emailId = data?.email_id

    if (!emailId) {
      return Response.json({ received: true })
    }

    const updates = {}

    if (type === 'email.opened') {
      updates.status = 'opened'
      updates.opened_at = new Date().toISOString()
    }

    if (type === 'email.clicked') {
      updates.status = 'clicked'
      updates.clicked_at = new Date().toISOString()
      // Also set opened if not already set
      updates.opened_at = new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('email_contacts')
      .update(updates)
      .eq('resend_email_id', emailId)

    if (error) {
      console.error('Webhook update error:', error)
    }

    return Response.json({ received: true })

  } catch (err) {
    console.error('Resend webhook error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}