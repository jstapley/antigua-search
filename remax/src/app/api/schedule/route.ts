import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// NOTE: To use Google Calendar integration:
// 1. Create a Google Cloud project and enable the Calendar API
// 2. Create OAuth 2.0 credentials
// 3. Use the OAuth Playground to get a refresh token with Calendar scope
// 4. Add all values to .env.local

async function getGoogleCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, time, name, email, phone, notes } = body

    if (!date || !time || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number)
    const isPM = time.includes('PM')
    let [hours] = time.replace(' AM', '').replace(' PM', '').split(':').map(Number)
    if (isPM && hours !== 12) hours += 12
    if (!isPM && hours === 12) hours = 0

    const startDateTime = new Date(year, month - 1, day, hours, 0, 0)
    const endDateTime = new Date(year, month - 1, day, hours + 1, 0, 0) // 1 hour meeting

    if (!process.env.GOOGLE_CALENDAR_CLIENT_ID || !process.env.GOOGLE_CALENDAR_REFRESH_TOKEN) {
      // Calendar not configured — just log and return success
      console.log('Booking (no calendar configured):', { date, time, name, email, phone, notes })
      return NextResponse.json({ success: true, note: 'Calendar not configured, booking logged only' })
    }

    const calendar = await getGoogleCalendarClient()

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: {
        summary: `Property Consultation - ${name}`,
        description: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Notes: ${notes || 'None'}
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Antigua',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Antigua',
        },
        attendees: [
          { email },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 },
          ],
        },
      },
      sendUpdates: 'all', // Sends confirmation email to attendees
    })

    return NextResponse.json({ success: true, eventId: event.data.id })
  } catch (error) {
    console.error('Calendar booking error:', error)
    return NextResponse.json({ error: 'Failed to book meeting' }, { status: 500 })
  }
}
