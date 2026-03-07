import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ParishPageClient from './ParishPageClient'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('slug')
  
  return parishes?.map((parish) => ({
    slug: parish.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: parish } = await supabase
    .from('parishes')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!parish) {
    return {
      title: 'Parish Not Found'
    }
  }

  // Get listing count for this parish
  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('parish_id', parish.id)
    .eq('status', 'active')

  const listingCount = count || 0
  const description = `Browse ${listingCount} verified businesses in ${parish.name}, Antigua & Barbuda. Find hotels, restaurants, tours, and local services. Discover the best of ${parish.name} on AntiguaSearch.com.`

  return {
    title: `Businesses in ${parish.name}, Antigua (${listingCount} Listings) - AntiguaSearch.com`,
    description,
    alternates: {
      canonical: `https://www.antiguasearch.com/parish/${resolvedParams.slug}`,
    },
  }
}

async function getParish(slug) {
  const { data: parish } = await supabase
    .from('parishes')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return parish
}

async function getListings(parishId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(name, icon_emoji)
    `)
    .eq('parish_id', parishId)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  return listings || []
}

async function getCategories(parishId) {
  const { data: categories } = await supabase
    .from('listings')
    .select('category:categories(id, name, slug, icon_emoji)')
    .eq('parish_id', parishId)
    .eq('status', 'active')
  
  // Get unique categories
  const uniqueCategories = {}
  categories?.forEach(item => {
    if (item.category) {
      uniqueCategories[item.category.id] = item.category
    }
  })
  
  return Object.values(uniqueCategories)
}

export default async function ParishPage({ params }) {
  const resolvedParams = await params
  const parish = await getParish(resolvedParams.slug)
  
  if (!parish) {
    notFound()
  }
  
  const listings = await getListings(parish.id)
  const categories = await getCategories(parish.id)

  return (
    <ParishPageClient 
      parish={parish} 
      listings={listings} 
      categories={categories} 
    />
  )
}
