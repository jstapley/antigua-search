// app/robots.txt/route.js
// Tells search engines what to crawl and what to ignore

export async function GET() {
  const robotsTxt = `# AntiguaSearch.com Robots.txt
# Updated: February 2026

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /dashboard/
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /api/
Disallow: /edit-listing/

# Allow static assets
Allow: /antigua-flag.png
Allow: /*.css
Allow: /*.js

# Sitemap location
Sitemap: https://www.antiguasearch.com/sitemap.xml

# Crawl-delay for politeness (optional)
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    }
  })
}