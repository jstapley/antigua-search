import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { category_name } = await request.json()

    console.log('Scraping for category:', category_name)

    // Call Anthropic API from server-side
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
        // No API key needed - handled by claude.ai infrastructure
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        tools: [{
          type: 'web_search_20250305',
          name: 'web_search'
        }],
        messages: [{
          role: 'user',
          content: `Find 10 real businesses in the "${category_name}" category in Antigua and Barbuda. 

Search for businesses like ${category_name.toLowerCase()} in Antigua. Look for established, real businesses with online presence.

For each business you find, extract:
- business_name (exact name)
- short_description (1 sentence, max 150 chars)
- description (2-3 sentences about the business)
- phone (with country code if available)
- email (if available)
- website (full URL if available)
- address (street address in Antigua)
- parish (which parish in Antigua: St. John's, St. George, St. Mary, St. Paul, St. Peter, or St. Philip)

Return ONLY a JSON array with no markdown, no explanation, just the array:
[
  {
    "business_name": "...",
    "short_description": "...",
    "description": "...",
    "phone": "...",
    "email": "...",
    "website": "...",
    "address": "...",
    "parish": "..."
  }
]`
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    // Check if response has expected structure
    if (!data.content || !Array.isArray(data.content)) {
      console.error('Unexpected response structure:', data)
      throw new Error('Unexpected API response structure')
    }

    // Extract text from response
    const textContent = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n')

    console.log('Extracted text:', textContent)

    if (!textContent) {
      throw new Error('No text content in API response')
    }

    // Parse JSON - remove markdown code blocks if present
    const jsonText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const businesses = JSON.parse(jsonText)

    console.log('Parsed businesses:', businesses)

    return NextResponse.json({ success: true, businesses })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}