import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function verifyTurnstile(token) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const data = await response.json()
  return data.success
}

export async function POST(request) {
  try {
    const formData = await request.json()

    // Verify Turnstile token
    const turnstileValid = await verifyTurnstile(formData.turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json(
        { success: false, error: 'Security check failed. Please try again.' },
        { status: 400 }
      )
    }

    console.log('📝 Contact Form Submission:', { name: formData.name, email: formData.email })

    // 1. Save to Supabase
    const { data: contact, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        business_inquiry: formData.businessInquiry,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // 2. Send email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AntiguaSearch <notifications@antiguasearch.com>',
            to: ['contact@antiguasearch.com'],
            subject: `New Contact Form: ${formData.subject}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1d4ed8; padding: 24px; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">AntiguaSearch.com</p>
                </div>
                <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Name:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${formData.email}" style="color: #1d4ed8;">${formData.email}</a></td>
                    </tr>
                    ${formData.phone ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.phone}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                      <td style="padding: 8px 0; color: #111827;">${formData.subject}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Type:</td>
                      <td style="padding: 8px 0;">
                        <span style="background: ${formData.businessInquiry ? '#dbeafe' : '#f3f4f6'}; color: ${formData.businessInquiry ? '#1d4ed8' : '#374151'}; padding: 2px 8px; border-radius: 9999px; font-size: 14px;">
                          ${formData.businessInquiry ? '💼 Business Inquiry' : '💬 General Inquiry'}
                        </span>
                      </td>
                    </tr>
                  </table>
                  <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p style="font-weight: bold; color: #374151; margin: 0 0 8px;">Message:</p>
                    <p style="color: #111827; margin: 0; white-space: pre-wrap;">${formData.message}</p>
                  </div>
                  <div style="margin-top: 16px; text-align: center;">
                    <a href="mailto:${formData.email}?subject=Re: ${formData.subject}" 
                       style="background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                      Reply to ${formData.name}
                    </a>
                  </div>
                </div>
              </div>
            `
          })
        })

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text()
          console.error('Resend error:', errorText)
        } else {
          console.log('✅ Contact email sent via Resend')
        }
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY not set — email not sent')
    }

    // 3. Send to GHL
    const ghlApiKey = process.env.GHL_API_KEY
    const ghlLocationId = process.env.GHL_LOCATION_ID

    if (ghlApiKey && ghlLocationId) {
      try {
        const ghlContactResponse = await fetch(
          `https://services.leadconnectorhq.com/contacts/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              firstName: formData.name.split(' ')[0],
              lastName: formData.name.split(' ').slice(1).join(' '),
              email: formData.email,
              phone: formData.phone || '',
              source: 'Antigua Search - Contact Form',
              tags: formData.businessInquiry ? ['Business Inquiry', 'Contact Form'] : ['Contact Form'],
              customFields: [
                { key: 'contact_subject', value: formData.subject },
                { key: 'contact_message', value: formData.message },
                { key: 'inquiry_type', value: formData.businessInquiry ? 'Business' : 'General' }
              ],
              locationId: ghlLocationId
            })
          }
        )

        if (!ghlContactResponse.ok) {
          console.error('GHL API error:', await ghlContactResponse.text())
        }
      } catch (ghlError) {
        console.error('GHL integration error:', ghlError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      id: contact?.id
    })

  } catch (error) {
    console.error('Contact form API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}