import { supabase } from '@/lib/supabase'
import FeaturedPageClient from './FeaturedPageClient'

export const metadata = {
  title: 'Featured Businesses - AntiguaSearch.com | Premium Listings',
  description: 'Discover top-rated featured businesses in Antigua & Barbuda. Premium verified listings offering exceptional service.',
}

export const revalidate = 300 // Revalidate every 5 minutes

export default async function FeaturedPage() {
  // Fetch all featured listings
  const { data: featuredListings } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(name, icon_emoji),
      parish:parishes(name)
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .gte('featured_until', new Date().toISOString())
    .order('featured_position', { ascending: true })
    .order('created_at', { ascending: false })

  return <FeaturedPageClient featuredListings={featuredListings || []} />
}