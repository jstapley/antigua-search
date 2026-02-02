import { supabase } from '@/lib/supabase'
import ParishesPageClient from './ParishesPageClient'

export const revalidate = 3600

export const metadata = {
  title: 'Browse All Parishes - Antigua Search',
  description: 'Explore businesses and attractions across all parishes in Antigua & Barbuda',
}

async function getParishes() {
  const { data: parishes, error } = await supabase
    .from('parishes')
    .select('*')
    .order('listing_count', { ascending: false })
  
  console.log('Supabase parishes query result:', { parishes, error })
  console.log('Number of parishes:', parishes?.length)
  
  return parishes || []
}

export default async function ParishesPage() {
  const parishes = await getParishes()

  return <ParishesPageClient parishes={parishes} />
}