// lib/resend.js
// Email notification utility using Resend

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'registrations@antiguasearch.com'
const ADMIN_EMAIL = 'jeff@stapleyinc.com'
const SITE_URL = 'https://www.antiguasearch.com'

// ─── Shared email sender ───────────────────────────────────────────────────────

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not found')
    return { success: false, error: 'API key not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      return { success: false, error: data.message || 'Failed to send email' }
    }

    console.log('✅ Email sent:', data.id)
    return { success: true, emailId: data.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// ─── Shared HTML components ────────────────────────────────────────────────────

const emailHeader = (title, subtitle = '') => `
  <div style="background: #318DD0; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <img src="${SITE_URL}/antigua-flag.png" alt="Antigua Search" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 12px;" />
    <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
    ${subtitle ? `<p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">${subtitle}</p>` : ''}
  </div>
`

const emailFooter = () => `
  <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; text-align: center;">
    <p style="color: #9ca3af; font-size: 13px; margin: 0;">
      Questions? Contact us at <a href="mailto:${ADMIN_EMAIL}" style="color: #318DD0;">${ADMIN_EMAIL}</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin: 8px 0 0;">
      © 2026 AntiguaSearch.com · St. John's, Antigua & Barbuda
    </p>
  </div>
`

const featuredUpsell = (listingUrl) => `
  <div style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 8px; padding: 20px; margin-top: 24px;">
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
`

// ─── SCENARIO 1A: New listing submitted — notify Jeff ─────────────────────────

export async function sendNewListingNotification(listingData) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emailHeader('🎉 New Business Submission', 'A new listing is pending review')}
      <div style="padding: 30px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563; width: 140px;">Business:</td>
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
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Contact:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.contact_name}</td>
          </tr>` : ''}
          ${listingData.contact_email ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Contact Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${listingData.contact_email}" style="color: #318DD0;">${listingData.contact_email}</a></td>
          </tr>` : ''}
          ${listingData.phone ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.phone}</td>
          </tr>` : ''}
          ${listingData.website ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Website:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><a href="${listingData.website}" style="color: #318DD0;">${listingData.website}</a></td>
          </tr>` : ''}
          ${listingData.address ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Address:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${listingData.address}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #4b5563;">Status:</td>
            <td style="padding: 10px;">
              <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 600;">Pending Review</span>
            </td>
          </tr>
        </table>
        <div style="margin-top: 30px; display: flex; gap: 12px;">
          <a href="${SITE_URL}/dashboard/admin"
             style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Review in Admin →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🎉 New Listing Submitted: ${listingData.business_name}`,
    html
  })
}

// ─── SCENARIO 1B: New listing submitted — confirm to submitter ────────────────

export async function sendSubmissionConfirmation(listingData) {
  if (!listingData.contact_email) return { success: false, error: 'No contact email' }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emailHeader('We received your listing! 🎉', 'It\'s currently under review')}
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${listingData.contact_name || 'there'},</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for submitting <strong>${listingData.business_name}</strong> to AntiguaSearch.com.
          We've received your listing and will review it shortly. You'll get another email from us once it's approved and live on the site.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Your Submission Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Business:</td>
              <td style="padding: 8px 0; color: #1f2937;">${listingData.business_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0; color: #1f2937;">${listingData.category_name || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Parish:</td>
              <td style="padding: 8px 0; color: #1f2937;">${listingData.parish_name || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;">
                <span style="background: #fef3c7; color: #92400e; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">Pending Review</span>
              </td>
            </tr>
          </table>
        </div>

        <p style="color: #4b5563; line-height: 1.6;">
          We typically review new listings within 1-2 business days. Once approved, your listing will be visible to thousands of visitors exploring Antigua and Barbuda.
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          In the meantime, you can <a href="${SITE_URL}/login" style="color: #318DD0; font-weight: bold;">create a free account</a> so you're ready to claim and manage your listing once it goes live.
        </p>
      </div>
      ${emailFooter()}
    </div>
  `

  return sendEmail({
    to: listingData.contact_email,
    subject: `We received your listing — ${listingData.business_name}`,
    html
  })
}

// ─── SCENARIO 1C: Listing approved — notify submitter ────────────────────────

export async function sendListingApprovalEmail({ business_name, category, parish, contact_email, contact_name, listing_slug }) {
  if (!contact_email) return { success: false, error: 'No contact email' }

  const listingUrl = `${SITE_URL}/listing/${listing_slug}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emailHeader('Your listing is live! ✅', 'AntiguaSearch.com')}
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${contact_name || 'there'},</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Great news — <strong>${business_name}</strong> has been approved and is now live on AntiguaSearch.com.
          Visitors and locals searching across Antigua and Barbuda can now find your business.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Your Listing Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Business:</td>
              <td style="padding: 8px 0; color: #1f2937;">${business_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0; color: #1f2937;">${category || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Parish:</td>
              <td style="padding: 8px 0; color: #1f2937;">${parish || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Listing URL:</td>
              <td style="padding: 8px 0;"><a href="${listingUrl}" style="color: #318DD0;">${listingUrl}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;">
                <span style="background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">✓ Active</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${listingUrl}"
             style="background: #318DD0; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            View Your Listing →
          </a>
        </div>

        <h3 style="color: #1f2937;">What you can do now</h3>
        <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
          <li>
            <a href="${SITE_URL}/login" style="color: #318DD0; font-weight: bold;">Create a free account and claim your listing</a>
            to update photos, description, hours, and contact details
          </li>
          <li>Share your listing URL with customers</li>
          <li>Respond to reviews as they come in</li>
        </ul>

        ${featuredUpsell(listingUrl)}
      </div>
      ${emailFooter()}
    </div>
  `

  return sendEmail({
    to: contact_email,
    subject: `✅ Your listing is live — ${business_name} on AntiguaSearch.com`,
    html
  })
}

// ─── SCENARIO 2: Claim approved — notify owner ───────────────────────────────

export async function sendClaimApprovalEmail({ business_name, category, parish, user_email, listing_slug }) {
  if (!user_email) return { success: false, error: 'No user email' }

  const listingUrl = `${SITE_URL}/listing/${listing_slug}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emailHeader('You\'ve claimed your listing! ✅', 'AntiguaSearch.com')}
      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi there,</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your claim for <strong>${business_name}</strong> has been approved.
          You now have full control of your listing on AntiguaSearch.com.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Your Listing Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 120px;">Business:</td>
              <td style="padding: 8px 0; color: #1f2937;">${business_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0; color: #1f2937;">${category || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Parish:</td>
              <td style="padding: 8px 0; color: #1f2937;">${parish || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Listing URL:</td>
              <td style="padding: 8px 0;"><a href="${listingUrl}" style="color: #318DD0;">${listingUrl}</a></td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${listingUrl}"
             style="background: #318DD0; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; margin-right: 12px;">
            View Your Listing →
          </a>
          <a href="${SITE_URL}/dashboard"
             style="background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Go to Dashboard →
          </a>
        </div>

        <h3 style="color: #1f2937;">What you can do now</h3>
        <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
          <li>Update your description, photos, hours, and contact details from your dashboard</li>
          <li>Share your listing URL with customers</li>
          <li>Respond to reviews as they come in</li>
        </ul>

        ${featuredUpsell(listingUrl)}
      </div>
      ${emailFooter()}
    </div>
  `

  return sendEmail({
    to: user_email,
    subject: `✅ Your claim is approved — ${business_name} on AntiguaSearch.com`,
    html
  })
}

// ─── SCENARIO 2: Claim submitted — notify Jeff (existing) ────────────────────

export async function sendClaimNotification(claimData) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emailHeader('🏢 Business Claimed', 'A claim is pending review')}
      <div style="padding: 30px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Business:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${claimData.business_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Category:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${claimData.category || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #4b5563;">Parish:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${claimData.parish || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #4b5563;">Claimed by:</td>
            <td style="padding: 10px; color: #1f2937;">${claimData.user_email}</td>
          </tr>
        </table>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${SITE_URL}/listing/${claimData.listing_slug}"
             style="background: #318DD0; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 12px;">
            View Listing →
          </a>
          <a href="${SITE_URL}/dashboard/admin"
             style="background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Review in Admin →
          </a>
        </div>
      </div>
      ${emailFooter()}
    </div>
  `

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🏢 Business Claimed: ${claimData.business_name}`,
    html
  })
}