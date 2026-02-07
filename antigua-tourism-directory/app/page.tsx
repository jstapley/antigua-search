import { supabase } from '@/lib/supabase'
import HomeClient from '../components/HomeClient'

// Enhanced metadata with Open Graph and SEO
export const metadata = {
  title: 'Antigua & Barbuda Business Directory | AntiguaSearch.com',
  description: 'Find local businesses, hotels, restaurants, tours and services in Antigua & Barbuda. The complete tourism and business directory with 100+ verified listings across all parishes.',
  keywords: [
    'antigua business directory',
    'antigua tourism',
    'antigua hotels',
    'antigua restaurants',
    'businesses in antigua',
    'antigua services',
    'barbuda businesses',
    'antigua travel guide',
    'find businesses antigua',
    'antigua local businesses',
    'antigua tourism directory'
  ].join(', '),
  
  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://antiguasearch.com',
    siteName: 'AntiguaSearch.com',
    title: 'Antigua & Barbuda Business Directory',
    description: 'Find local businesses, hotels, restaurants, tours and services in Antigua & Barbuda. The complete tourism directory with 100+ verified listings.',
    images: [
      {
        url: '/og-image.jpg', // Create this 1200x630px image
        width: 1200,
        height: 630,
        alt: 'AntiguaSearch.com - Discover Antigua & Barbuda'
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Antigua & Barbuda Business Directory',
    description: 'Find local businesses, hotels, restaurants, tours and services in Antigua & Barbuda.',
    images: ['/og-image.jpg']
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    { count: totalListings },
    { data: parishes },
    { data: categories },
    { data: featuredListings },
    { count: monthlyVisitors }
  ] = await Promise.all([
    // Total listings count
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    
    // Parishes with listing counts
    supabase
      .from('parishes')
      .select(`
        *,
        listings!inner(id)
      `)
      .eq('listings.status', 'active'),
    
    // Categories with listing counts (include empty categories)
      supabase
        .from('categories')
        .select(`
          *,
          listings(id)
        `)
        .order('name'),
    
    // Featured listings (limit to 3 for homepage)
    supabase
      .from('listings')
      .select(`
        *,
        category:categories(name, icon_emoji),
        parish:parishes(name)
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .gt('featured_until', new Date().toISOString())
      .order('featured_position', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3),
    
    // Monthly visitors count (you can implement this later)
    Promise.resolve({ count: 1247 }) // Placeholder for now
  ])

  // Process parishes with counts
  const parishesWithCounts = parishes?.map(parish => ({
    id: parish.id,
    name: parish.name,
    slug: parish.slug,
    description: parish.description,
    listing_count: parish.listings?.length || 0
  })) || []

  // Process categories with counts
  const categoriesWithCounts = categories?.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon_emoji: category.icon_emoji,
    listing_count: category.listings?.length || 0
  })) || []

  const stats = {
    total_listings: totalListings || 0,
    total_parishes: parishesWithCounts.length,
    total_categories: categoriesWithCounts.length
  }

  // Organization Schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AntiguaSearch.com",
    "alternateName": "Antigua Search",
    "url": "https://antiguasearch.com",
    "logo": "https://antiguasearch.com/antigua-flag.png",
    "description": "The complete business and tourism directory for Antigua and Barbuda with over 100 verified business listings",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "St. John's",
      "addressRegion": "Antigua",
      "addressCountry": "AG"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@antiguasearch.com",
      "contactType": "Customer Service"
    }
  }

  // WebSite Schema with search functionality
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AntiguaSearch.com",
    "url": "https://antiguasearch.com",
    "description": "Antigua & Barbuda Business Directory",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://antiguasearch.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      {/* Organization Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* WebSite Schema with search action */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Main homepage component */}
      <HomeClient 
        stats={stats}
        parishes={parishesWithCounts}
        categories={categoriesWithCounts}
        featuredListings={featuredListings || []}
        monthlyVisitors={monthlyVisitors || 1247}
      />
    </>
  )
}
