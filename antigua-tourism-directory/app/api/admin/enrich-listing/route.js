// app/api/admin/enrich-listing/route.js
// Calls Claude to generate short_description and description for a listing

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request) {
  try {
    const { listing_id, business_name, category, parish, existing_description } = await request.json()

    if (!business_name) {
      return Response.json({ error: 'business_name is required' }, { status: 400 })
    }

    const prompt = `You are a local business directory writer for AntiguaSearch.com, Antigua & Barbuda's premier business directory.

Research and write descriptions for this business listing:

Business Name: ${business_name}
Category: ${category || 'Unknown'}
Parish: ${parish || 'Antigua'}
${existing_description ? `Existing Description: ${existing_description}` : ''}

Your task: Write two descriptions based on what you know or can reasonably infer about this business in Antigua. If you know specific details about this business, use them. If not, write credible, accurate descriptions based on the business name, category, and location.

RULES:
- Do NOT invent specific details you are not confident about (hours, prices, phone numbers, addresses)
- Do NOT mention specific staff names unless widely known
- DO write warmly and specifically about what type of business this is and what customers can expect
- DO reference Antigua and the parish where relevant
- DO use an 8th-grade reading level, active voice, short sentences
- DO NOT use em dashes

Return ONLY a valid JSON object with exactly these two fields, nothing else:

{
  "short_description": "A single punchy sentence under 150 characters describing the business",
  "description": "Two to three paragraphs (150-250 words total) describing the business, what it offers, and why customers should visit. Reference Antigua and the local context naturally."
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ]
    })

    const responseText = message.content[0].text.trim()

    // Parse the JSON response
    let parsed
    try {
      // Strip markdown code blocks if present
      const clean = responseText.replace(/```json\n?|\n?```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch (e) {
      return Response.json({ error: 'Failed to parse AI response', raw: responseText }, { status: 500 })
    }

    if (!parsed.short_description || !parsed.description) {
      return Response.json({ error: 'AI response missing required fields', raw: responseText }, { status: 500 })
    }

    // Enforce short_description length
    if (parsed.short_description.length > 150) {
      parsed.short_description = parsed.short_description.substring(0, 147) + '...'
    }

    return Response.json({
      listing_id,
      short_description: parsed.short_description,
      description: parsed.description
    })

  } catch (error) {
    console.error('Enrich listing error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}