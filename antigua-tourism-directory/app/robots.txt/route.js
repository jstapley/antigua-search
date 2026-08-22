# AntiguaSearch.com Robots.txt
# Updated: August 2026

User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /dashboard/
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /api/
Disallow: /edit-listing/

# Disallow Next.js build artifacts (chunks regenerated each build)
Disallow: /_next/static/chunks/

# Allow static assets
Allow: /antigua-flag.png
Allow: /*.css

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