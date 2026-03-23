// app/api/notify-claim/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { business_name, category, parish, user_email, listing_slug } = await request.json()

    const response = await fetch('https://api.resend.com/emails', {
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
              <div style="margin-top: 30px; display: flex; gap: 12px;">
                <a href="https://www.antiguasearch.com/listing/${listing_slug}" 
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

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notify claim error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}