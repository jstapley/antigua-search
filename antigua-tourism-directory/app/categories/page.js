import { supabase } from '@/lib/supabase'
import CategoriesPageClient from './CategoriesPageClient'

export const revalidate = 3600

export const metadata = {
  title: 'Browse All Categories - Antigua Search',
  description: 'Explore all business categories in Antigua & Barbuda - restaurants, hotels, tours, activities, and more',
}

async function getCategories() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('listing_count', { ascending: false })
  
  return categories || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesPageClient categories={categories} />
}