// lib/resend.js
// Email notification utility using Resend

export async function sendNewListingNotification(listingData) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not found in environment variables')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'registrations@antiguasearch.com',
        to: 'jeff@antiguasearch.com', // or your actual email
        subject: `🎉 New Business Added: ${listingData.business_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">New Business Registration</h1>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-top: 0;">📋 Business Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Business Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.business_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Category:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.category_name || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Parish:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.parish_name || 'Not specified'}</td>
                </tr>
                ${listingData.contact_name ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Contact Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.contact_name}</td>
                </tr>
                ` : ''}
                ${listingData.email ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="mailto:${listingData.email}" style="color: #4f46e5;">${listingData.email}</a></td>
                </tr>
                ` : ''}
                ${listingData.phone ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="tel:${listingData.phone}" style="color: #4f46e5;">${listingData.phone}</a></td>
                </tr>
                ` : ''}
                ${listingData.website ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Website:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><a href="${listingData.website}" target="_blank" style="color: #4f46e5;">${listingData.website}</a></td>
                </tr>
                ` : ''}
                ${listingData.address ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Address:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.address}</td>
                </tr>
                ` : ''}
                ${listingData.description ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563; vertical-align: top;">Description:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.description}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #4b5563;">Status:</td>
                  <td style="padding: 10px;">
                    <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 600;">
                      ${listingData.status || 'pending'}
                    </span>
                  </td>
                </tr>
              </table>

              ${listingData.slug ? `
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://antiguasearch.com/listing/${listingData.slug}" 
                   style="background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View Listing →
                </a>
              </div>
              ` : ''}

              <div style="margin-top: 30px; text-align: center;">
                <a href="https://antiguasearch.com/dashboard/admin" 
                   style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Review in Admin Dashboard →
                </a>
              </div>
            </div>

            <div style="background: #1f2937; padding: 20px; text-center; color: #9ca3af; font-size: 14px;">
              <p style="margin: 0;">AntiguaSearch.com - Business Directory</p>
              <p style="margin: 5px 0 0 0;">200+ Businesses • Antigua & Barbuda</p>
            </div>
          </div>
        `,
        // Plain text fallback
        text: `
New Business Added to AntiguaSearch.com

Business Name: ${listingData.business_name}
Category: ${listingData.category_name || 'Not specified'}
Parish: ${listingData.parish_name || 'Not specified'}
${listingData.contact_name ? `Contact: ${listingData.contact_name}` : ''}
${listingData.email ? `Email: ${listingData.email}` : ''}
${listingData.phone ? `Phone: ${listingData.phone}` : ''}
${listingData.website ? `Website: ${listingData.website}` : ''}
${listingData.address ? `Address: ${listingData.address}` : ''}
${listingData.description ? `Description: ${listingData.description}` : ''}
Status: ${listingData.status || 'pending'}

${listingData.slug ? `View Listing: https://antiguasearch.com/listing/${listingData.slug}` : ''}
Admin Dashboard: https://antiguasearch.com/dashboard/admin
        `
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      return { success: false, error: data.message || 'Failed to send email' }
    }

    console.log('✅ Email sent successfully:', data.id)
    return { success: true, emailId: data.id }

  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}