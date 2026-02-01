import { supabase } from '@/lib/supabase'
import HomeClient from './HomeClient'

export const revalidate = 3600 // Revalidate every hour

async function getStats() {
  const { data: stats } = await supabase
    .from('site_stats')
    .select('*')
    .single()
  
  return stats || { total_listings: 0, total_parishes: 0, total_categories: 0 }
}

async function getParishes() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('*')
    .order('listing_count', { ascending: false })
  
  return parishes || []
}

async function getCategories() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('listing_count', { ascending: false })
    .limit(8)
  
  return categories || []
}

export default async function Home() {
  const stats = await getStats()
  const parishes = await getParishes()
  const categories = await getCategories()

  // Mock visitor count - you can make this dynamic later
  const monthlyVisitors = '1,247'

  return (
    <HomeClient 
      stats={stats}
      parishes={parishes}
      categories={categories}
      monthlyVisitors={monthlyVisitors}
    />
  )
}
