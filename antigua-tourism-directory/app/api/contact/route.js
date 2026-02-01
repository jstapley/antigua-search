import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a Supabase client with service role (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔑 Supabase Config Check:')
console.log('- URL:', supabaseUrl ? '✅' : '❌')
console.log('- Service Role Key:', serviceRoleKey ? '✅ (length: ' + serviceRoleKey?.length + ')' : '❌ MISSING')
console.log('- Anon Key:', anonKey ? '✅' : '❌')

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

export async function POST(request) {
  try {
    const formData = await request.json()
    
    console.log('📝 Contact Form Submission:', { name: formData.name, email: formData.email })
    
    // 1. Save to Supabase (backup/record keeping)
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
      // Continue even if database fails - don't block submission
    }

    // 2. Send to GHL using their API
    const ghlApiKey = process.env.GHL_API_KEY
    const ghlLocationId = process.env.GHL_LOCATION_ID

    if (ghlApiKey && ghlLocationId) {
      try {
        // Create contact in GHL
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
                {
                  key: 'contact_subject',
                  value: formData.subject
                },
                {
                  key: 'contact_message',
                  value: formData.message
                },
                {
                  key: 'inquiry_type',
                  value: formData.businessInquiry ? 'Business' : 'General'
                }
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
        // Don't fail the whole request if GHL fails
      }
    }

    // 3. Send email notification (optional)
    // You can add email notification here using SendGrid, Resend, etc.

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