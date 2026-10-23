// app/api/notify-claim/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { business_name, category, parish, user_email, listing_slug } = await request.json()

    const listingUrl = `https://www.antiguasearch.com/listing/${listing_slug}`

    // Email 1 — Notify Jeff
    const adminEmail = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'registrations@antiguasearch.com',
        to: 'jeff@stapleyinc.com',
        subject: `🏢 Business Claimed: ${business_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #318DD0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">🏢 Business Claimed</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
              <h2 style="color: #333;">A business has been claimed on AntiguaSearch.com</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Business:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${business_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Category:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${category}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Parish:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${parish}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #4b5563;">Claimed by:</td>
                  <td style="padding: 10px;">${user_email}</td>
                </tr>
              </table>
              <div style="margin-top: 30px;">
                <a href="${listingUrl}" 
                   style="background: #318DD0; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 12px;">
                  View Listing →
                </a>
                <a href="https://www.antiguasearch.com/dashboard/admin" 
                   style="background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Review in Admin →
                </a>
              </div>
            </div>
          </div>
        `
      })
    })

    // Email 2 — Confirm to business owner
    const customerEmail = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'registrations@antiguasearch.com',
        to: user_email,
        subject: `✅ You've claimed ${business_name} on AntiguaSearch.com`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

            <!-- Header -->
            <div style="background: #318DD0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://www.antiguasearch.com/antigua-flag.png" alt="Antigua Search" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 12px;" />
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to AntiguaSearch.com</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Your business listing is live</p>
            </div>

            <!-- Body -->
            <div style="padding: 30px; background: #ffffff;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi there,</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Great news — you've successfully claimed <strong>${business_name}</strong> on AntiguaSearch.com.
                Your listing is now live and visible to visitors and locals searching across Antigua and Barbuda.
              </p>

              <!-- Listing Details -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Your Listing Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Business:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${business_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Category:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${category}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Parish:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${parish}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Listing URL:</td>
                    <td style="padding: 8px 0;">
                      <a href="${listingUrl}" style="color: #318DD0;">${listingUrl}</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- View Listing CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${listingUrl}"
                   style="background: #318DD0; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                  View Your Listing →
                </a>
              </div>

              <!-- What you can do -->
              <h3 style="color: #1f2937;">What you can do now</h3>
              <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
                <li>Log in to your dashboard to <strong>update your description, photos, hours, and contact details</strong></li>
                <li>Share your listing URL with customers</li>
                <li>Respond to reviews as they come in</li>
              </ul>

              <!-- Dashboard CTA -->
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://www.antiguasearch.com/dashboard"
                   style="background: #10b981; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Go to My Dashboard →
                </a>
              </div>

              <!-- Featured upsell -->
              <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <h3 style="color: #92400e; margin-top: 0;">⭐ Want more visibility?</h3>
                <p style="color: #78350f; line-height: 1.6; margin: 0 0 12px;">
                  Upgrade to a <strong>Featured Listing</strong> for just <strong>EC$350/year</strong> and get:
                </p>
                <ul style="color: #78350f; line-height: 1.8; padding-left: 20px; margin: 0 0 16px;">
                  <li>Top placement in your category</li>
                  <li>Gold featured badge on your listing</li>
                  <li>Visibility on the AntiguaSearch homepage</li>
                </ul>
                <a href="${listingUrl}"
                   style="background: #f59e0b; color: #1f2937; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Upgrade to Featured →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                Questions? Reply to this email or contact us at
                <a href="mailto:jeff@stapleyinc.com" style="color: #318DD0;">jeff@stapleyinc.com</a>
              </p>
              <p style="color: #9ca3af; font-size: 13px; margin: 8px 0 0;">
                © 2026 AntiguaSearch.com · St. John's, Antigua & Barbuda
              </p>
            </div>

          </div>
        `
      })
    })

    // Send both emails in parallel
    const [adminRes, customerRes] = await Promise.all([adminEmail, customerEmail])

    if (!adminRes.ok) {
      const error = await adminRes.json()
      console.error('Admin email error:', error)
    }

    if (!customerRes.ok) {
      const error = await customerRes.json()
      console.error('Customer email error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}