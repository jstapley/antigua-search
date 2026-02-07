import { supabase } from '@/lib/supabase'
import HomeClient from '../components/HomeClient'

export const metadata = {
  title: 'AntiguaSearch.com - Discover Antigua & Barbuda | Business Directory',
  description: 'Find the best restaurants, hotels, tours, and activities in Antigua & Barbuda. Your complete guide to discovering paradise with verified business listings.',
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

  return (
    <HomeClient 
      stats={stats}
      parishes={parishesWithCounts}
      categories={categoriesWithCounts}
      featuredListings={featuredListings || []}
      monthlyVisitors={monthlyVisitors || 1247}
    />
  )
}
